/**
 * Rabbit Ear (c) Kraft
 */
import propagate from "./propagate";
import { unsignedToSignedOrders } from "./general";
import getBranches from "./getBranches";
import prepare from "./prepare";
import LayerPrototype from "./prototype";
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
 * @linkcode Origami ./src/layer/globalSolver/index.js 29
 */
const solveBranch = (
	constraints,
	constraintsLookup,
	unsolvedKeys,
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
	const recursed = unfinishedSolutions
		.map(order => solveBranch(
			constraints,
			constraintsLookup,
			unsolvedKeys.filter(key => !(key in order)),
			...orders,
			order,
		));
	return completedSolutions
		.map(order => ([...orders, order]))
		.concat(...recursed);
};
/**
 * @name solver
 * @memberof layer
 * @description Recursively calculate all layer order solutions between faces
 * in a flat-folded FOLD graph.
 * @param {FOLD} graph a flat-folded FOLD graph, where the vertices
 * have already been folded.
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {object} a set of solutions where keys are face pairs
 * and values are +1 or -1 describing the relationship of the two faces.
 * Results are stored in "root" and "branches", to compile a complete solution,
 * append the "root" to one selection from each array in "branches".
 * @linkcode Origami ./src/layer/globalSolver/index.js 89
 */
const globalLayerSolver = (graph, epsilon = 1e-6) => {
	const prepareStartDate = new Date();
	const {
		constraints,
		constraintsLookup,
		facePairs,
		edgeAdjacentOrders,
	} = prepare(graph, epsilon);
	// algorithm running time info
	const prepareDuration = Date.now() - prepareStartDate;
	const startDate = new Date();
	// propagate layer order starting with only the edge-adjacent face orders
	const initialResult = propagate(
		constraints,
		constraintsLookup,
		Object.keys(edgeAdjacentOrders),
		edgeAdjacentOrders,
	);
	// graph does not have a valid layer order. no solution
	if (!initialResult) { return undefined; }
	// get all keys unsolved after the first round of propagate
	const remainingKeys = facePairs
		.filter(key => !(key in edgeAdjacentOrders))
		.filter(key => !(key in initialResult));
	// group the remaining keys into groups that are isolated from one another.
	// recursively solve each branch, each branch could have more than one solution.
	const branchResults = getBranches(remainingKeys, constraints, constraintsLookup)
		.map(unsolvedKeys => solveBranch(
			constraints,
			constraintsLookup,
			unsolvedKeys,
			edgeAdjacentOrders,
			initialResult,
		));
	// solver is finished. each branch result is spread across multiple objects
	// containing a solution for a subset of the entire set of faces, one for
	// each recursion depth. for each branch solution, merge its objects into one.
	const branches = branchResults
		.map(branch => branch
			.map(solution => Object.assign({}, ...solution)));
	// the set of face-pair solutions which are true for all branches
	const root = { ...edgeAdjacentOrders, ...initialResult };
	// convert solutions from (1,2) to (+1,-1), both the root and each branch.
	unsignedToSignedOrders(root);
	branches
		.forEach(branch => branch
			.forEach(solutions => unsignedToSignedOrders(solutions)));
	const duration = Date.now() - startDate;
	// console.log(`variables (${facePairs.length} total): ${Object.keys(edgeAdjacentOrders).length} neighbor faces, ${Object.keys(initialResult).length} propagate, ${remainingKeys.length} in branches`);
	if (duration > 50) {
		console.log(`prep ${prepareDuration}ms solver ${duration}ms`);
	}
	// console.log("branches", branches);
	// console.log("branchResults", branchResults);
	return Object.assign(
		Object.create(LayerPrototype),
		{ root, branches },
	);
};

export default globalLayerSolver;
