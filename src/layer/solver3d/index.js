/**
 * Rabbit Ear (c) Kraft
 */
import propagate from "./propagate.js";
import {
	reformatSolution,
} from "./general.js";
import getDisjointSets from "./getDisjointSets.js";
import prepare from "./prepare.js";
import LayerPrototype from "./prototype.js";
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
 * @linkcode Origami ./src/layer/solver3d/index.js 31
 */
const solveNonBranchingNode = (
	constraints,
	constraintsLookup,
	unsolvedKeys,
	solvedOrders,
	...orders
) => {
	if (!unsolvedKeys.length) { return {}; }
	const guessKey = unsolvedKeys[0];
	const completedSolutions = [];
	const unfinishedSolutions = [];
	// given the same guessKey with both 1 and 2 as the guess, run propagate.
	[1, 2].forEach(b => {
		const result = propagate(
			constraints,
			constraintsLookup,
			[guessKey],
			...solvedOrders,
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
		const array = Object.keys(result).length === unsolvedKeys.length
			? completedSolutions
			: unfinishedSolutions;
		array.push(result);
	});
	// solution contains leaves and (recursive) nodes, only if non-empty.
	const solution = {
		leaves: completedSolutions,
		node: unfinishedSolutions.map(order => solveNode(
			constraints,
			constraintsLookup,
			unsolvedKeys.filter(key => !(key in order)),
			[...solvedOrders, ...orders],
			order,
		)),
	};
	if (solution.leaves.length === 0) { delete solution.leaves; }
	if (solution.node.length === 0) { delete solution.node; }
	return solution;
};
/**
 * @description Before we solve each node, check to see if there are
 * any disjoint sets, if so, create a branch where each individual
 * disjoint set gets solved and the branch structure is preserved.
 * If no disjoint sets, solve and return the node.
 */
const solveNode = (
	constraints,
	constraintsLookup,
	remainingKeys,
	solvedOrders,
	...orders
) => {
	if (!remainingKeys.length) { return { orders }; }
	const disjointSets = getDisjointSets(
		remainingKeys,
		constraints,
		constraintsLookup,
		// tortillaSets,
		// tortillaSetsLookup,
	);
	// console.log("disjointSets", disjointSets);
	if (disjointSets.length > 1) {
		// console.log("FOUND disjointSets", disjointSets);
		return {
			orders,
			partitions: disjointSets
				.map(branchKeys => solveNonBranchingNode(
					constraints,
					constraintsLookup,
					branchKeys,
					solvedOrders,
					...orders,
				)),
		};
	}
	return {
		orders,
		...solveNonBranchingNode(
			constraints,
			constraintsLookup,
			disjointSets[0],
			solvedOrders,
			...orders,
		),
	};
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
 * Results are stored in "root" and "partitions", to compile a complete solution,
 * append the "root" to one selection from each array in "partitions".
 * @linkcode Origami ./src/layer/solver3d/index.js 133
 */
const groupLayerSolver = (
	constraints,
	constraintsLookup,
	facePairs,
	edgeAdjacentOrders,
	faces_winding,
) => {
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
	const solution = solveNode(
		constraints,
		constraintsLookup,
		remainingKeys,
		[],
		edgeAdjacentOrders,
		initialResult,
	);
	return reformatSolution(solution, faces_winding);
};
/**
 * @name solver
 * @memberof layer
 * @description Recursively calculate all layer order solutions between
 * co-planar faces in a 2D or 3D FOLD graph.
 * @param {FOLD} graph a flat-folded FOLD graph, where the vertices
 * have already been folded.
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {object} a set of solutions where keys are face pairs
 * and values are +1 or -1 describing the relationship of the two faces.
 * Results are stored in "root" and "partitions", to compile a complete solution,
 * append the "root" to one selection from each array in "partitions".
 * @linkcode Origami ./src/layer/solver3d/index.js 179
 */
// const globalLayerSolver = (graph, epsilon = 1e-6) => {
// 	const {
// 		groups_constraints,
// 		groups_constraintsLookup,
// 		groups_facePairs,
// 		groups_edgeAdjacentOrders,
// 		faces_winding,
// 	} = prepare(graph, epsilon);
// 	// console.log("groups_constraints", groups_constraints);
// 	// console.log("groups_constraintsLookup", groups_constraintsLookup);
// 	// console.log("groups_facePairs", groups_facePairs);
// 	// console.log("groups_edgeAdjacentOrders", groups_edgeAdjacentOrders);
// 	// console.log("faces_winding", faces_winding);
// 	const solutions = groups_constraints.map((constraints, i) => groupLayerSolver(
// 		constraints,
// 		groups_constraintsLookup[i],
// 		groups_facePairs[i],
// 		groups_edgeAdjacentOrders[i],
// 		faces_winding,
// 	)).filter(solution => solution && solution.orders.length);
// 	return Object.assign(
// 		Object.create(LayerPrototype),
// 		{ groups: solutions },
// 	);
// };

const globalLayerSolver = (graph, epsilon = 1e-6) => {
	const {
		constraints,
		constraintsLookup,
		facePairs,
		edgeAdjacentOrders,
		faces_winding,
	} = prepare(graph, epsilon);
	const solution = groupLayerSolver(
		constraints,
		constraintsLookup,
		facePairs,
		edgeAdjacentOrders,
		faces_winding,
	);
	return Object.assign(
		Object.create(LayerPrototype),
		solution,
	);
};

export default globalLayerSolver;
