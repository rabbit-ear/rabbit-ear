/**
 * Rabbit Ear (c) Kraft
 */
import propagate from "./propagate";
import {
	unsignedToSignedConditions,
	// joinConditions,
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
 * @param constraints
 * @param facePairConstraints
 * @param {string[]} unsolvedKeys array of facePair keys to be solved
 * @param orders
 */
const solveBranch = (
	constraints,
	facePairConstraints,
	unsolvedKeys,
	...orders
) => {
	const unsolvedCount = unsolvedKeys.length;
	if (!unsolvedCount) { return []; }
	// console.log("solveBranch depth", orders.length, "unsolved", unsolvedCount, unsolvedKeys);
	const seen = {};

	const completedSolutions = [];
	const unfinishedSolutions = [];

	for (let g = 0; g < unsolvedKeys.length; g += 1) {
		const guessKey = unsolvedKeys[g];
		// array of 0, 1, or 2 objects with only one key/value.
		// the key is the facePair and the value is either 1 or 2.
		// this array will be 0-length if these combinations have already
		// by other iterations, as stored in the "seen" object.
		const guesses = [1, 2]
			.filter(b => !(seen[guessKey] && seen[guessKey][b]))
			.map(b => ({ [guessKey]: b }));
		// console.log("guesses", guesses.length, guesses);
		// given the same guessKey with both 1 and 2 as the guess, run propagate.
		const results = guesses.map(guess => propagate(
			constraints,
			facePairConstraints,
			[guessKey],
			...orders,
			guess,
		));
		// bad results will be false. skip these. if the result is valid,
		// add the new keys to the "seen" variable and check if all variables
		// have been solved, or there is more guess work still to do.
		results.forEach((result, i) => {
			if (result === false) { return; }
			// currently, the 1 guess itself is left out of the result object.
			// we could either combine the objects, or add this guess directly in.
			result[guessKey] = guesses[i][guessKey];
			const keys = Object.keys(result);
			// even though we are skipping "seen" keys at the beginning of this loop,
			// check every key against the seen object, reject if we see a match.
			for (let k = 0; k < keys.length; k += 1) {
				const key = keys[k];
				if (seen[key] && seen[key][result[key]]) { return; }
			}
			// set the seen object:
			// example: { "3 5": { 1: true, 2: true}, "3 6": { 2: true }}
			keys.filter(key => !seen[key]).forEach(key => { seen[key] = {}; });
			keys.forEach(key => { seen[key][result[key]] = true; });
			// store the result
			if (Object.keys(result).length === unsolvedCount) {
				completedSolutions.push(result);
			} else {
				unfinishedSolutions.push(result);
			}
		});
		// for now, this works because all the keys in "result"
		// are only 1 or 2, not 0. if it contained 0 we would have to filter
	}
	// console.log("branch end", completedSolutions.length, "unfinished", unfinishedSolutions.length);
	const recursed = unfinishedSolutions
		.map(order => solveBranch(
			constraints,
			facePairConstraints,
			unsolvedKeys.filter(key => !(key in order)),
			...orders,
			order,
		));
	return completedSolutions
		.map(order => ([...orders, order]))
		.concat(...recursed);
	// console.log("recursed", recursed);
	// return completedSolutions.concat(recursed);
};
/**
 * @description recursively calculate all solutions to layer order
 * @param {object} graph a FOLD graph
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {object} a set of solutions where keys are face pairs
 * and values are +1 or -1, the relationship of the two faces.
 */
const globalLayerSolver = (graph, epsilon = 1e-6) => {
	const prepareStartDate = new Date();
	const {
		constraints,
		facePairConstraints,
		overlap,
		facePairsOrder,
		edgeAdjacentOrders,
	} = prepare(graph, epsilon);
	// algorithm running time info
	const prepareDuration = Date.now() - prepareStartDate;
	const startDate = new Date();
	// propagate layer order starting with only the edge-adjacent face orders
	const initialResult = propagate(
		constraints,
		facePairConstraints,
		Object.keys(edgeAdjacentOrders),
		// facePairsOrder,
		edgeAdjacentOrders,
	);
	// graph does not have a valid layer order. no solution
	if (!initialResult) { return undefined; }
	// "initialResult" now contains the layer solutions which are true for all cases
	// combine edgeAdjacentOrders into initialResult. from now on,
	// we can forget about edgeAdjacentOrders as it is already included.
	// update: skipping this and including edgeAdjacentOrders in solveBranch now.
	// Object.keys(edgeAdjacentOrders)
	// 	.forEach(key => { initialResult[key] = edgeAdjacentOrders[key]; });
	// find any independent branch sets of faces
	const branches = makeBranchingSets(overlap, facePairsOrder, edgeAdjacentOrders, initialResult);
	console.log("branches", branches);

	const branchResults = branches
		.map(cluster => cluster
			.map(side => solveBranch(
				constraints,
				facePairConstraints,
				Object.keys(side),
				// facePairsOrder,
				edgeAdjacentOrders,
				initialResult,
			)));

	if (!branches.length) {
		const remainingKeys = Object.keys(facePairsOrder)
			.filter(key => !(key in edgeAdjacentOrders))
			.filter(key => !(key in initialResult));
		console.log("remaining", remainingKeys.length, "to solve");
		const remainingResult = solveBranch(
			constraints,
			facePairConstraints,
			remainingKeys,
			// facePairsOrder,
			edgeAdjacentOrders,
			initialResult,
		);
		console.log("remaining result", remainingResult);
	}

	console.log("branchResults", branchResults);
	// algorithm is done!
	const results = branchResults
		.map(branch => branch
			.map(side => side
				.map(solutions => solutions.slice().splice(2))));
	const joined = results
		.map(branch => branch
			.map(side => side
				.map(solutions => Object.assign({}, ...solutions))));

	console.log("results", results);
	console.log("joined", joined);
	const certain = { ...edgeAdjacentOrders, ...initialResult };

	// convert solutions from (1,2) to (+1,-1)
	unsignedToSignedConditions(certain);
	joined
		.forEach(branch => branch
			.forEach(side => side
				.forEach(solutions => unsignedToSignedConditions(solutions))));
	certain.branches = joined;

	// const resultsCombined = results.map(res => {
	// 	const combined = {};
	// 	res.solution.forEach(solution => Object.keys(solution)
	// 		.forEach(key => { combined[key] = solution[key]; }));
	// 	return combined;
	// }).map(solution => unsignedToSignedConditions(solution));

	// console.log("branch results merged", resultsCombined);

	// const solutions = branchSolutions.flat();
	// for (let i = 0; i < solutions.length; i += 1) {
	// 	for (let j = 0; j < solutions[i].length; j += 1) {
	// 		unsignedToSignedConditions(solutions[i][j]);
	// 	}
	// }
	const duration = Date.now() - startDate;
	// if (duration > 50) { console.log(`${duration}ms`); }
	console.log(`preparation ${prepareDuration}ms solver ${duration}ms`);
	// return solutions;
	return certain;
};

export default globalLayerSolver;
