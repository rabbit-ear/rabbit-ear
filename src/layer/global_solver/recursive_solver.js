/**
 * Rabbit Ear (c) Kraft
 */
import table from "./table";
import complete_suggestions_loop from "./complete_suggestions_loop";
import hashCode from "../../general/hashCode";
import { unsigned_to_signed_conditions } from "./general";

const taco_types = Object.freeze(Object.keys(table));

const duplicate_unsolved_layers = (layers) => {
	const duplicate = {};
	taco_types.forEach(type => { duplicate[type] = []; });
	taco_types.forEach(type => layers[type]
		.forEach((layer, i) => {
			if (layer.indexOf(0) !== -1) {
				duplicate[type][i] = [...layer];
			}
		}));
	return duplicate;
};

// on second thought, precheck will always succeed, because we tried
// both iterations last loop.
const precheck = (layers, maps, face_pair_key, new_dir) => {
	try {
		taco_types.forEach(taco_type => layers.forEach((layer, i) => {
			const map = maps[taco_type][i];
			for (let m = 0; m < map.face_keys.length; m++) {
				if (map.face_keys[m] === face_pair_key) {
					const dir = map.keys_ordered[m] ? new_dir : flip[new_dir];
					const new_layer = [...layer];
					new_layer[m] = dir;
					const new_layer_key = new_layer.join("");
					if (table[taco_type][new_layer_key] === false) {
						console.log("precheck found a fail case", face_pair_key, taco_type, new_layer_key, table[type][new_layer_key]);
						throw "precheck";
					}
				}
			}
		}));
	} catch (error) {
		return false;
	}
	return true;
};

// take all the conditions which HAVE been solved (filter out the zeros),
// make a hash of this, store it, with the intention that in the future
// you will be running all possible above/below on all unknowns.
// this way,
// if you ever encounter this hash again (the same set of solved and unknowns),
// we can revert this branch entirely.
// and this hash table can be stored "globally" for each run.
/**
 * @description recursively find all solutions to a folded graph.
 * @param {object} graph a FOLD graph
 * @param {object[]} maps the result of calling make_taco_maps
 * @param {object} conditions space-separated face-pairs as keys, values are initially all 0, the result of calling make_conditions
 * @returns {object[]} array of solutions where keys are space-separated face pairs and values are +1 or -1 describing if the second face is above or below the first.
 */
const recursive_solver = (graph, maps, conditions_start) => {
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

	// todo: it appears this never happens, remove after testing.
	// successful conditions will often be duplicates of one another.
	// filter only a set of unique conditions. use a hash table to compare.
	// not only do we store hashes of the final solutions, but,
	// each round of the recurse involves guessing, and, after we complete
	// the conditions as much as possible after each guess, store these
	// partially-completed conditions here too. this dramatically reduces the
	// number of recursive branches.
	// const successes_hash = {};
	/**
	 * the input parameters will not be modified. they will be copied,
	 * their copies modified, then passed along to the next recurse.
	 */
	const recurse = (layers, conditions) => {
		const this_recurse_count = recurse_count;
		// console.time(`recurse ${this_recurse_count}`);
		recurse_count++;
		const zero_keys = Object.keys(conditions)
			.map(key => conditions[key] === 0 ? key : undefined)
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
		const successes = zero_keys
			.map((key, i) => [1, 2]
				.map(dir => {
					if (avoid[key] && avoid[key][dir]) { avoidcount++; return; }
					// console.log("recursing with", key, dir);
					// todo: it appears that this never happens. remove after testing.
					// if (precheck(layers, maps, key, dir)) {
					//   console.log("precheck caught!"); return;
					// }
					const clone_start = new Date();
					const clone_conditions = JSON.parse(JSON.stringify(conditions));
					clone_time += (Date.now() - clone_start);

					// todo: it appears that this never happens. remove after testing.
					// if (successes_hash[JSON.stringify(clone_conditions)]) {
					//   console.log("early hash caught!"); return;
					// }
					const clone_layers = duplicate_unsolved_layers(layers);
					clone_conditions[key] = dir;
					inner_loop_count++;
					const solve_start = new Date();
					if (!complete_suggestions_loop(clone_layers, maps, clone_conditions, pair_layer_map)) {
						failguesscount++;
						solve_time += (Date.now() - solve_start);
						return;
					}
					solve_time += (Date.now() - solve_start);
					Object.keys(clone_conditions)
						.filter(key => conditions[key] === 0)
						.forEach(key => {
							if (!avoid[key]) { avoid[key] = {}; }
							avoid[key][dir] = true;
						});
					return { conditions: clone_conditions, layers: clone_layers };
				})
				.filter(a => a !== undefined))
			.reduce((a, b) => a.concat(b), []);

		// todo: it appears that this never happens. remove after testing.
		// const unique_successes = successes
		//   .map(success => JSON.stringify(success.conditions))
		//   .map(string => hashCode(string))
		//   .map((hash, i) => {
		//     if (successes_hash[hash]) { return; }
		//     successes_hash[hash] = successes[i];
		//     return successes[i];
		//   })
		//   .filter(a => a !== undefined);

		// console.log("recurse", unique_successes.length, successes.length);

		// console.log("successes", successes);
		// console.log("successes_hash", successes_hash);
		// console.log("unique_successes", unique_successes);
		// console.log("unique_successes", unique_successes.length);

		// console.timeEnd(`recurse ${this_recurse_count}`);
		return successes
		// return unique_successes
			.map(success => recurse(success.layers, success.conditions))
			.reduce((a, b) => a.concat(b), []);
	};

	const layers_start = {
		taco_taco: maps.taco_taco.map(el => Array(6).fill(0)),
		taco_tortilla: maps.taco_tortilla.map(el => Array(3).fill(0)),
		tortilla_tortilla: maps.tortilla_tortilla.map(el => Array(2).fill(0)),
		transitivity: maps.transitivity.map(el => Array(3).fill(0)),
	};

	// this could be left out and simply starting the recursion. however,
	// we want to capture the "certain" relationships, the ones decided
	// after consulting the table before any guessing or recursion is done.
	if (!complete_suggestions_loop(layers_start, maps, conditions_start, pair_layer_map)) {
		// failure. do not proceed.
		// console.log("failure. do not proceed");
		return [];
	}
	// // the face orders that must be for every case.
	// const certain = conditions_start;
	// console.log("HERE 2", conditions_start);
	// the set of solutions as an array, with the certain values
	// under the key "certain".
	const solutions_before = recurse(layers_start, conditions_start);


	// todo: it appears that this never happens. remove after testing.
	const successes_hash = {};
	const solutions = solutions_before
		.map(conditions => JSON.stringify(conditions))
		.map(string => hashCode(string))
		.map((hash, i) => {
			if (successes_hash[hash]) { return; }
			successes_hash[hash] = solutions_before[i];
			return solutions_before[i];
		})
		.filter(a => a !== undefined);

	// solutions.certain = JSON.parse(JSON.stringify(certain));
	// algorithm is done!
	// convert solutions from (1,2) to (+1,-1)
	for (let i = 0; i < solutions.length; i++) {
		unsigned_to_signed_conditions(solutions[i]);
	}
	// unsigned_to_signed_conditions(solutions.certain);
	// console.log("solutions", solutions);
	// console.log("successes_hash", successes_hash);
	// console.log("avoid", avoid);
	const duration = Date.now() - startDate;
	if (duration > 50) {
		console.log(`${duration}ms recurses`, recurse_count, "inner loops", inner_loop_count, "avoided", avoidcount, "bad guesses", failguesscount, `solutions ${solutions_before.length}/${solutions.length}`, "durations: clone, solve", clone_time, solve_time);
	}
	return solutions;
};

export default recursive_solver;
