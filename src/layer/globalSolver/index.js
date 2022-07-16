/**
 * Rabbit Ear (c) Kraft
 */
import completeSuggestionsLoop from "./completeSuggestionsLoop";
import {
	unsignedToSignedConditions,
	duplicateUnsolvedConstraints,
} from "./general";
import { makeBranchingSets } from "./branching";
import prepare from "./prepare";

// take all the facePairsOrder which HAVE been solved (filter out the zeros),
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

	const { constraintsInfo, pairConstraintLookup, overlap } = data;
	const startingFacePairsOrder = data.facePairsOrder;

	const startDate = new Date();
	let recurse_count = 0;
	let inner_loop_count = 0;
	let avoidcount = 0;
	let failguesscount = 0;
	// algorithm running time
	let clone_time = 0;
	let solve_time = 0;

	const startingConstraints = {
		taco_taco: constraintsInfo.taco_taco.map(() => Array(6).fill(0)),
		taco_tortilla: constraintsInfo.taco_tortilla.map(() => Array(3).fill(0)),
		tortilla_tortilla: constraintsInfo.tortilla_tortilla.map(() => Array(2).fill(0)),
		transitivity: constraintsInfo.transitivity.map(() => Array(3).fill(0)),
	};
	// "startingFacePairsOrder" is now filled with results only for those face-pairs
	// which are consistent across all layer permutations. If there is only one
	// layer order, all facePairsOrder will be solved by this step.
	if (!completeSuggestionsLoop(
		startingFacePairsOrder,
		startingConstraints,
		constraintsInfo,
		pairConstraintLookup,
	)) {
		// failure. do not proceed.
		// console.log("failure. do not proceed");
		return [];
	}
	/**
	 * the input parameters will not be modified. they will be copied,
	 * their copies modified, then passed along to the next recurse.
	 */
	const recurse = (constraints, facePairsOrder) => {
		// const this_recurse_count = recurse_count;
		// console.time(`recurse ${this_recurse_count}`);
		recurse_count += 1;
		const zero_keys = Object.keys(facePairsOrder)
			.map(key => (facePairsOrder[key] === 0 ? key : undefined))
			.filter(a => a !== undefined);
		// solution found. exit.
		if (zero_keys.length === 0) { return [facePairsOrder]; }
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
					const clone_facePairsOrder = JSON.parse(JSON.stringify(facePairsOrder));
					clone_time += (Date.now() - clone_start);
					const clone_constraints = duplicateUnsolvedConstraints(constraints);
					clone_facePairsOrder[key] = dir;
					inner_loop_count += 1;
					const solve_start = new Date();
					if (!completeSuggestionsLoop(
						clone_facePairsOrder,
						clone_constraints,
						constraintsInfo,
						pairConstraintLookup,
					)) {
						failguesscount += 1;
						solve_time += (Date.now() - solve_start);
						return undefined;
					}
					solve_time += (Date.now() - solve_start);
					Object.keys(clone_facePairsOrder)
						.filter(k => facePairsOrder[k] === 0)
						.forEach(k => {
							if (!avoid[k]) { avoid[k] = {}; }
							avoid[k][dir] = true;
						});
					return { facePairsOrder: clone_facePairsOrder, constraints: clone_constraints };
				})
				.filter(a => a !== undefined))
			.flat()
			.map(success => recurse(success.constraints, success.facePairsOrder))
			.flat();
	};
	//
	const branches = makeBranchingSets(startingFacePairsOrder, overlap);
	const branchesSolutions = branches
		.map(pairs => pairs
			.map(facePairsOrder => recurse(startingConstraints, facePairsOrder)));
	// for each branch solution, filter out all the known starting facePairsOrder
	// so that each solution only contains those which are unique to it
	const branchSolutions = branchesSolutions
		.map(pairs => pairs
			.map(solutions => solutions
				.map(facePairsOrder => {
					const filtered = {};
					Object.keys(facePairsOrder)
						.filter(key => startingFacePairsOrder[key] === 0)
						.forEach(key => { filtered[key] = facePairsOrder[key]; });
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
	solutions.certain = unsignedToSignedConditions(startingFacePairsOrder);
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
