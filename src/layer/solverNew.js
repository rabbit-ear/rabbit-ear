/**
 * Rabbit Ear (c) Kraft
 */
import propagate from "./propagate.js";
import getBranches from "./getBranches.js";
/**
 * @description Given an array of unsolved facePair keys, attempt to solve
 * the entire set by guessing both states (1, 2) for one key, propagate any
 * implications, repeat another guess (1, 2) on another key, propagate, repeat...
 * This method is recursive but will only branch a maximum of two times each
 * recursion (one for each guess 1, 2). For each recursion, all solutions are
 * gathered into a single object, and that round's solved facePairs are added
 * to the "...orders" parameter. When all unsolvedKeys are solved, the result
 * is an array of solutions, each solving represeting the set of solutions from
 * each depth. Combine these solutions using Object.assign({}, ...orders)
 * @param {Constraints} constraints an object containing all four cases, inside
 * of each is an (very large, typically) array of all constraints as a list of faces.
 * @param {object} constraintsLookup a map which contains, for every
 * taco/tortilla/transitivity case (top level keys), inside each is an object
 * which relates each facePair (key) to an array of indices (value),
 * where each index is an index in the "constraints" array
 * in which **both** of these faces appear.
 * @param {string[]} unsolvedKeys array of facePair keys to be solved
 * @param {...object} ...orders any number of facePairsOrder solutions
 * which relate facePairs (key) like "3 5" to an order, either 0, 1, or 2.
 * @linkcode Origami ./src/layer/solver2d/index.js 32
 */
const solveBranch = (
	constraints,
	constraintsLookup,
	constraintsNeighborsMemo,
	unsolvedKeys,
	solutionNode,
	...orders
) => {
	if (!unsolvedKeys.length) { return []; }
	const guessKey = unsolvedKeys[0];
	const completedSolutions = [];
	const unfinishedSolutions = [];
	// given the same guessKey with both 1 and 2 as the guess, run propagate.
	[1, 2].forEach(b => {
		const result = propagate(
			constraints,
			constraintsLookup,
			[guessKey],
			...orders,
			{ [guessKey]: b },
		);
		// bad results will be false. skip these. if the result is valid,
		// check if all variables are solved or more work is required.
		if (result === false) { return; }
		// currently, the one guess itself is left out of the result object.
		// we could either combine the objects, or add this guess directly in.
		result[guessKey] = b;
		// store the result as either completed or unfinished
		if (Object.keys(result).length === unsolvedKeys.length) {
			completedSolutions.push(result);
		} else {
			unfinishedSolutions.push(result);
		}
	});
	// recursively call this method with any unsolved solutions and filter
	// any keys that were found in that solution out of the unsolved keys
	// solutionNode.branches = unfinishedSolutions.map(order => ({ faceOrders: order }));
	const childNodes = unfinishedSolutions.map(order => ({ faceOrders: order }));
	const recursed = unfinishedSolutions
		.map((order, i) => {
			const remainingKeys = unsolvedKeys.filter(key => !(key in order));
			return getBranches(remainingKeys, constraints, constraintsLookup, constraintsNeighborsMemo)
				.map(branchUnsolvedKeys => solveBranch(
					constraints,
					constraintsLookup,
					constraintsNeighborsMemo,
					branchUnsolvedKeys,
					childNodes[i],
					...orders,
					order,
				));
		});
	// const recursed = unfinishedSolutions
	// 	.map(order => solveBranch(
	// 		constraints,
	// 		constraintsLookup,
	// 		unsolvedKeys.filter(key => !(key in order)),
	// 		solutionNode,
	// 		...orders,
	// 		order,
	// 	));

	// if (childNodes.length === 1) {
	// 	Object.assign(solutionNode, childNodes[0]);
	// } else if (childNodes.length > 1) {
	// 	solutionNode.choose = childNodes;
	// }

	// we will either have:
	// - one or more completed solutions and AT MOST ONE unfinished solution
	// - no completed solutions and TWO unfinished solutions
	if (completedSolutions.length) {
		solutionNode.finished = completedSolutions.map(order => ({ faceOrders: order }));
	}
	if (childNodes.length) {
		solutionNode.unfinished = childNodes;
	}

	// const nextLevel = []
	// 	.concat(childNodes)
	// 	.concat(completedSolutions.map(order => ({ faceOrders: order })));
	// if (nextLevel.length === 1) {
	// 	Object.assign(solutionNode, nextLevel[0]);
	// } else if (childNodes.length > 1) {
	// 	solutionNode.and = nextLevel;
	// } else {
	// 	solutionNode.or = nextLevel;
	// }
	if (childNodes.length > 1 && completedSolutions.length) { console.log("HAPPENED"); }

	return completedSolutions
		.map(order => ([...orders, order]))
		.concat(...recursed);
};
/**
 * @description Recursively calculate all layer order solutions between faces
 * in a flat-folded FOLD graph.
 * @param {object} solverParams the parameters for the solver which include:
 * - {object} constraints for each taco/tortilla type, an array of each
 *   condition, each condition being an array of all faces involved.
 * - {object} lookup for each taco/tortilla type, a reverse lookup table
 *   where each face-pair contains an array of all constraints its involved in
 * - {string[]} facePairs an array of space-separated face pair strings
 * - {object} orders a prelimiary solution to some of the facePairs
 *   with solutions in 1,2 value encoding. Useful for any pre-calculations,
 *   for example, pre-calculating edge-adjacent face pairs with known assignments.
 * @returns {object} a set of solutions where keys are face pairs
 * and values are +1 or -1 describing the relationship of the two faces.
 * Results are stored in "root" and "branches", to compile a complete solution,
 * append the "root" to one selection from each array in "branches".
 * @linkcode Origami ./src/layer/solver2d/index.js 140
 */
const solver2d = ({ constraints, lookup, facePairs, orders }) => {
	// algorithm running time info
	// const startDate = new Date();
	// propagate layer order starting with only the edge-adjacent face orders
	const initialResult = propagate(
		constraints,
		lookup,
		Object.keys(orders),
		orders,
	);
	// graph does not have a valid layer order. no solution
	if (!initialResult) { return undefined; }
	// console.log("2D initialResult", JSON.parse(JSON.stringify(initialResult)));
	const solution = {};
	// get all keys unsolved after the first round of propagate
	const remainingKeys = facePairs
		.filter(key => !(key in orders))
		.filter(key => !(key in initialResult));
	// group the remaining keys into groups that are isolated from one another.
	// recursively solve each branch, each branch could have more than one solution.
	const constraintsNeighborsMemo = {};
	const branches = getBranches(
		remainingKeys,
		constraints,
		lookup,
		constraintsNeighborsMemo,
	);
	// console.log("branches", branches);
	const nextLevel = branches.map(() => ({}));
	const branchResults = branches.map((unsolvedKeys, i) => solveBranch(
		constraints,
		lookup,
		constraintsNeighborsMemo,
		unsolvedKeys,
		nextLevel[i],
		orders,
		initialResult,
	));

	if (nextLevel.length) {
		solution.unfinished = nextLevel;
	}
	solution.faceOrders = { ...orders, ...initialResult };

	// solver is finished. each branch result is spread across multiple objects
	// containing a solution for a subset of the entire set of faces, one for
	// each recursion depth. for each branch solution, merge its objects into one.
	// const topLevelBranches = branchResults;
	// const branches = branchResults
	// 	.map(branch => branch
	// 		.map(solution => Object.assign({}, ...solution)));
	// the set of face-pair solutions which are true for all branches
	// const root = { ...edgeAdjacentOrders, ...initialResult };
	// solution.branches[0].faceOrders = { ...edgeAdjacentOrders, ...initialResult };

	// console.log("2D solution", JSON.parse(JSON.stringify(solution.faceOrders)));
	// console.log("2D solution final", JSON.parse(JSON.stringify(solution.faceOrders)));

	// convert solutions from (1,2) to (+1,-1), both the root and each branch.
	// unsignedToSignedOrders(root);
	// branches
	// 	.forEach(branch => branch
	// 		.forEach(solutions => unsignedToSignedOrders(solutions)));
	// const duration = Date.now() - startDate;
	// console.log(`variables (${facePairs.length} total): ${Object.keys(edgeAdjacentOrders).length} neighbor faces, ${Object.keys(initialResult).length} propagate, ${remainingKeys.length} in branches`);
	// if (duration > 50) {
	//	console.log(`prep ${setupDuration}ms solver ${duration}ms`);
	// }
	console.log("solution", solution);
	console.log("branches", branchResults);
	console.log("branchResults", branchResults);
	return solution;
};

export default solver2d;
