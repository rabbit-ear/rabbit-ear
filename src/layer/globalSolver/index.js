/**
 * Rabbit Ear (c) Kraft
 */
import propagate from "./propagate";
import { unsignedToSignedConditions } from "./general";
import getBranches from "./getBranches";
import prepare from "./prepare";
/**
 * @param constraints
 * @param facePairConstraints
 * @param {string[]} unsolvedKeys array of facePair keys to be solved
 * @param orders
 */
let propagateCount = 0;
const solveBranch = (
	constraints,
	facePairConstraints,
	unsolvedKeys,
	...orders
) => {
	const unsolvedCount = unsolvedKeys.length;
	if (!unsolvedCount) { return []; }
	// if (orders.length > 6) { return []; }
	// console.log("solveBranch depth", orders.length, "unsolved", unsolvedCount);
	const allDoneBranchKeysArray = [];
	for (let i = 2; i < orders.length; i += 1) {
		allDoneBranchKeysArray.push(Object.keys(orders[i]).join(", "));
	}
	const allDoneBranchKeys = allDoneBranchKeysArray.join(", ");
	// console.log(orders.length, allDoneBranchKeys);

	const completedSolutions = [];
	const unfinishedSolutions = [];

	const seen = {};

	// update notes:
	// it should be possible to, instead of guessing each of these keys and
	// recursively branching from each guess, (which is one way the duplicate
	// problem is caused), it should be possible to only guess on one key here.
	// (guessing both 1 and 2). then recursively calling based on any or all results.
	// that way, each recursive branch only every splits into 2 (at most). which
	// almost makes it maybe we should just do iterative.
	// for (let g = 0; g < unsolvedCount; g += 1) {
	// 	const seenCount = Object.keys(seen).length;
	// 	if (seenCount === unsolvedCount) { break; }
	// 	const guessKey = unsolvedKeys[g];
	// for (let g = 0; g < unsolvedCount; g += 1) {
	// 	const seenCount = Object.keys(seen).length;
	// 	if (seenCount === unsolvedCount) { break; }
	const guessKey = unsolvedKeys[0];

		// array of 0, 1, or 2 objects with only one key/value.
		// the key is the facePair and the value is either 1 or 2.
		// this array will be 0-length if these combinations have already
		// by other iterations, as stored in the "seen" object.
		const guesses = [1, 2]
			.filter(b => !(seen[guessKey] && seen[guessKey][b]))
			.map(b => ({ [guessKey]: b }));
		// if (orders.length < 5) {
		// 	console.log("depth", orders.length, "loop", g, guessKey, seenCount, seen[guessKey]);
		// } else if (g % 100 === 0) {
		// 	console.log("depth", orders.length, "loop", g, guessKey, seenCount, seen[guessKey]);
		// }
		// console.log("guesses", guesses.length, guesses);
		// given the same guessKey with both 1 and 2 as the guess, run propagate.
		const results = guesses.map(guess => {
			// console.log("propagate", orders.length, guessKey, guess);
			propagateCount += 1;
			return propagate(
				constraints,
				facePairConstraints,
				[guessKey],
				seen,
				...orders,
				guess,
			);
		});
		// const results = guesses.map(guess => propagate(
		// 	constraints,
		// 	facePairConstraints,
		// 	[guessKey],
		// 	seen,
		// 	...orders,
		// 	guess,
		// ));
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
				if (seen[key] && seen[key][result[key]]) {
					// console.log("duplicate uncovered. skipping.");
					return;
				}
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
	// update: remove loop
	// }
	// console.log("recurse finished", unfinishedSolutions.length, completedSolutions.length);
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
};
// const logInformation = (remainingKeys, facePairConstraints) => {
// 	const remainingConditions = {};
// 	Object.keys(facePairConstraints).forEach(type => {
// 		const containsDuplicates = remainingKeys
// 			.filter(key => facePairConstraints[type][key])
// 			.map(key => facePairConstraints[type][key])
// 			.flat();
// 		remainingConditions[type] = uniqueIntegers(containsDuplicates);
// 	});
// 	console.log("remaining", remainingKeys.length, "to solve", remainingKeys);
// 	console.log("remaining conditions", remainingConditions);
// };
/**
 * @description recursively calculate all solutions to layer order
 * @param {object} graph a FOLD graph
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {object} a set of solutions where keys are face pairs
 * and values are +1 or -1, the relationship of the two faces.
 */
const globalLayerSolver = (graph, epsilon = 1e-6) => {
	propagateCount = 0;
	const prepareStartDate = new Date();
	const {
		constraints,
		facePairConstraints,
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
		undefined, // skip keys
		// facePairsOrder,
		edgeAdjacentOrders,
	);
	// graph does not have a valid layer order. no solution
	if (!initialResult) { return undefined; }
	// const allKeys = Object.keys(facePairsOrder);

	const remainingKeys = Object.keys(facePairsOrder)
		.filter(key => !(key in edgeAdjacentOrders))
		.filter(key => !(key in initialResult));

	// group the remaining keys into groups that are isolated from one another
	const branches = getBranches(remainingKeys, constraints, facePairConstraints);
	const branchResults = branches
		.map(unsolvedKeys => solveBranch(
			constraints,
			facePairConstraints,
			unsolvedKeys,
			edgeAdjacentOrders,
			initialResult,
		));
	const branchResultsMerged = branchResults
		.map(branch => branch
			.map(solution => Object.assign({}, ...solution)));

	const solution = { ...edgeAdjacentOrders, ...initialResult };
	// convert solutions from (1,2) to (+1,-1)
	unsignedToSignedConditions(solution);
	branchResultsMerged
		.forEach(branch => branch
			.forEach(solutions => unsignedToSignedConditions(solutions)));
	solution.branches = branchResultsMerged;

	console.log("propagateCount", propagateCount);

	// console.log("edgeAdjacentOrders", edgeAdjacentOrders);
	// console.log("initialResult", initialResult);
	// console.log("remainingKeys", remainingKeys);
	console.log("branches", branches);
	console.log("branchResults", branchResults);
	console.log("branchResultsMerged", branchResultsMerged);
	const duration = Date.now() - startDate;
	// if (duration > 50) {}
	console.log(`preparation ${prepareDuration}ms solver ${duration}ms`);
	return solution;
};

export default globalLayerSolver;
