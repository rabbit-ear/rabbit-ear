/**
 * Rabbit Ear (c) Kraft
 */
import table from "./table";
import completeSuggestionsLoop from "./completeSuggestionsLoop";
import {
	unsignedToSignedConditions,
	duplicateUnsolvedLayers,
} from "./general";
import { makeBranchingSets } from "./branching";
import prepare from "./prepare";

const taco_types = Object.freeze(Object.keys(table));

// take all the conditions which HAVE been solved (filter out the zeros),
// make a hash of this, store it, with the intention that in the future
// you will be running all possible above/below on all unknowns.
// this way,
// if you ever encounter this hash again (the same set of solved and unknowns),
// we can revert this branch entirely.
// and this hash table can be stored "globally" for each run.
/**
 * @description recursively calculate all solutions to layer order
 * @param {object} graph a FOLD graph
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {object} a set of solutions where keys are face pairs
 * and values are +1 or -1, the relationship of the two faces.
 */
const globalLayerSolver = (graph, epsilon = 1e-6) => {
	const data = prepare(graph, epsilon);

	const { maps, overlap } = data;
	const conditions_start = data.conditions;

	const startDate = new Date();
	let recurse_count = 0;
	let inner_loop_count = 0;
	let avoidcount = 0;
	let failguesscount = 0;
	// time
	let clone_time = 0;
	let solve_time = 0;

	// pair_layer_map[taco_type][face_pair] = [] array of indices in map
	const pair_layer_map = {};
	taco_types.forEach(taco_type => { pair_layer_map[taco_type] = {}; });
	taco_types.forEach(taco_type => Object.keys(conditions_start)
		.forEach(pair => { pair_layer_map[taco_type][pair] = []; }));
	taco_types
		.forEach(taco_type => maps[taco_type]
			.forEach((el, i) => el.face_keys
				.forEach(pair => {
					pair_layer_map[taco_type][pair].push(i);
				})));
	// console.log("pair_layer_map", pair_layer_map);
	const layers_start = {
		taco_taco: maps.taco_taco.map(() => Array(6).fill(0)),
		taco_tortilla: maps.taco_tortilla.map(() => Array(3).fill(0)),
		tortilla_tortilla: maps.tortilla_tortilla.map(() => Array(2).fill(0)),
		transitivity: maps.transitivity.map(() => Array(3).fill(0)),
	};
	// "conditions_start" is now filled with results only for those face-pairs
	// which are consistent across all layer permutations. If there is only one
	// layer order, all conditions will be solved by this step.
	if (!completeSuggestionsLoop(layers_start, maps, conditions_start, pair_layer_map)) {
		// failure. do not proceed.
		// console.log("failure. do not proceed");
		return [];
	}
	/**
	 * the input parameters will not be modified. they will be copied,
	 * their copies modified, then passed along to the next recurse.
	 */
	const recurse = (layers, conditions) => {
		// const this_recurse_count = recurse_count;
		// console.time(`recurse ${this_recurse_count}`);
		recurse_count += 1;
		const zero_keys = Object.keys(conditions)
			.map(key => (conditions[key] === 0 ? key : undefined))
			.filter(a => a !== undefined);
		// solution found. exit.
		if (zero_keys.length === 0) { return [conditions]; }
		// console.log("recurse. # zero keys", zero_keys.length);
		// for every unknown face-pair relationship (zero_keys), try setting both
		// above/below cases, test it out, and if it's a success the inner loop
		// will either encounter a fail state, in which case reject it, or it
		// reaches a stable state where all suggestions have been satisfied.
		// "avoid":
		// within this one recursive round, we can be sure that all of our guesses
		// only need to happen once, since the source data is the same. so, if inside
		// one guess, more face relationships are uncovered, store those newly found
		// relationships inside "avoid". later as we continue our guessing, we can
		// avoid any guesses which are stored inside "avoid", as the outcome
		// has already been determined.
		const avoid = {};
		return zero_keys
			.map(key => [1, 2]
				.map(dir => {
					if (avoid[key] && avoid[key][dir]) { avoidcount += 1; return undefined; }
					const clone_start = new Date();
					const clone_conditions = JSON.parse(JSON.stringify(conditions));
					clone_time += (Date.now() - clone_start);
					const clone_layers = duplicateUnsolvedLayers(layers);
					clone_conditions[key] = dir;
					inner_loop_count += 1;
					const solve_start = new Date();
					if (!completeSuggestionsLoop(clone_layers, maps, clone_conditions, pair_layer_map)) {
						failguesscount += 1;
						solve_time += (Date.now() - solve_start);
						return undefined;
					}
					solve_time += (Date.now() - solve_start);
					Object.keys(clone_conditions)
						.filter(k => conditions[k] === 0)
						.forEach(k => {
							if (!avoid[k]) { avoid[k] = {}; }
							avoid[k][dir] = true;
						});
					return { conditions: clone_conditions, layers: clone_layers };
				})
				.filter(a => a !== undefined))
			.flat()
			.map(success => recurse(success.layers, success.conditions))
			.flat();
	};
	//
	const branches = makeBranchingSets(conditions_start, overlap);
	const branchesSolutions = branches
		.map(pairs => pairs
			.map(conditions => recurse(layers_start, conditions)));
	// for each branch solution, filter out all the known starting conditions
	// so that each solution only contains those which are unique to it
	const branchSolutions = branchesSolutions
		.map(pairs => pairs
			.map(solutions => solutions
				.map(conditions => {
					const filtered = {};
					Object.keys(conditions)
						.filter(key => conditions_start[key] === 0)
						.forEach(key => { filtered[key] = conditions[key]; });
					return filtered;
				})));
	const solutions = branchSolutions.flat();

	// algorithm is done!
	// convert solutions from (1,2) to (+1,-1)
	for (let i = 0; i < solutions.length; i += 1) {
		for (let j = 0; j < solutions[i].length; j += 1) {
			unsignedToSignedConditions(solutions[i][j]);
		}
	}
	solutions.certain = unsignedToSignedConditions(conditions_start);
	// unsignedToSignedConditions(solutions.certain);
	// console.log("solutions", solutions);
	// console.log("successes_hash", successes_hash);
	// console.log("avoid", avoid);
	console.log("branches", branches);
	console.log("branchesSolutions", branchesSolutions);
	console.log("branchSolutions", branchSolutions);
	console.log("solutions", solutions);
	const duration = Date.now() - startDate;
	if (duration > 50) {
		console.log(`${duration}ms recurses`, recurse_count, "inner loops", inner_loop_count, "avoided", avoidcount, "bad guesses", failguesscount, `solutions ${solutions.length}`, "durations: clone, solve", clone_time, solve_time);
	}
	return solutions;
};

export default globalLayerSolver;
