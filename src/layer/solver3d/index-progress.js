/**
 * Rabbit Ear (c) Kraft
 */
import propagate from "./propagate";
import {
	keysToFaceOrders,
} from "./general";
import getDisjointSets from "./getDisjointSets";
import prepare from "./prepare";
import LayerPrototype from "./prototype";
/**
 *
 */
const solveRemaining = (
	constraints,
	constraintsLookup,
	remainingKeys,
	...orders
) => {
	if (!remainingKeys.length) { return undefined; }
	const disjointSets = getDisjointSets(remainingKeys, constraints, constraintsLookup);
	if (disjointSets.length > 1) {
		// console.log("FOUND disjointSets", disjointSets);
		return {
			partitions: disjointSets
				.map(branchKeys => solveNode(
					constraints,
					constraintsLookup,
					branchKeys,
					...orders,
				)),
		};
	}
	return solveNode(
		constraints,
		constraintsLookup,
		disjointSets[0],
		...orders,
	);
};
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
 * @linkcode Origami ./src/layer/solver3d/index.js 29
 */
const solveNode = (
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
			// completedSolutions.push(result);
			completedSolutions.push([...orders, result]);
		} else {
			unfinishedSolutions.push(result);
		}
	});

	const result = {
		leaf: completedSolutions,
		node: unfinishedSolutions.map(order => solveRemaining(
			constraints,
			constraintsLookup,
			unsolvedKeys.filter(key => !(key in order)),
			...orders,
			order,
		)),
	};
	if (result.leaf.length === 0) { delete result.leaf; }
	if (result.node.length === 0) { delete result.node; }
	return result;
	// const res = {};
	// if (completedSolutions.length) { res.finished = completedSolutions; }
	// if (unfinishedSolutions.length) {
	// 	res.unfinished = unfinishedSolutions.map(order => solveNode(
	// 		constraints,
	// 		constraintsLookup,
	// 		unsolvedKeys.filter(key => !(key in order)),
	// 		...orders,
	// 		order,
	// 	));
	// }

	// old code

	// recursively call this method with any unsolved solutions and filter
	// any keys that were found in that solution out of the unsolved keys
	// const recursed = unfinishedSolutions
	// 	.map(order => solveNode(
	// 		constraints,
	// 		constraintsLookup,
	// 		unsolvedKeys.filter(key => !(key in order)),
	// 		...orders,
	// 		order,
	// 	));
	// return completedSolutions
	// 	.map(order => ([...orders, order]))
	// 	.concat(...recursed);
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
 * @linkcode Origami ./src/layer/solver3d/index.js 89
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
	console.log("START remainingKeys", remainingKeys);
	// console.log("first partitions", getDisjointSets(remainingKeys, constraints, constraintsLookup));
	// group the remaining keys into groups that are isolated from one another.
	// recursively solve each branch, each branch could have more than one solution.
	const results = solveRemaining(
		constraints,
		constraintsLookup,
		remainingKeys,
		edgeAdjacentOrders,
		initialResult,
	);
	// const branchResults = getDisjointSets(remainingKeys, constraints, constraintsLookup)
	// 	.map(unsolvedKeys => solveNode(
	// 		constraints,
	// 		constraintsLookup,
	// 		unsolvedKeys,
	// 		edgeAdjacentOrders,
	// 		initialResult,
	// 	));
	console.log("3D solver results", results);
	// solver is finished. each branch result is spread across multiple objects
	// containing a solution for a subset of the entire set of faces, one for
	// each recursion depth. for each branch solution, merge its objects into one.
	// const partitionsUnsigned = branchResults
	// 	.map(branch => branch
	// 		.map(solution => Object.assign({}, ...solution)));
	// the set of face-pair solutions which are true for all partitions
	const root = { ...edgeAdjacentOrders, ...initialResult };

	// console.log("3D partitions", JSON.parse(JSON.stringify(partitionsUnsigned)));
	// console.log("3D solver root", JSON.parse(JSON.stringify(root)));

	// old approach
	// convert solutions from (1,2) to (+1,-1), both the root and each branch.
	// unsignedToSignedOrders(root);
	// partitions
	// 	.forEach(branch => branch
	// 		.forEach(solutions => unsignedToSignedOrders(solutions)));

	// group_plane.normal;
	// faces_winding;

	// new approach
	// const faces_normal = graph.faces_normal
	// 	? graph.faces_normal
	// 	: makeFacesNormal(graph);
	// this is hardcoded to flat foldings along the +Z. wait this is not needed
	// const z_vector = [0, 0, 1];
	const rootSigned = keysToFaceOrders(root, faces_winding);
	const rootSignedObj = {};
	rootSigned.forEach(tri => { rootSignedObj[`${tri[0]} ${tri[1]}`] = tri[2]; });
	// const partitionsSigned = partitionsUnsigned
	// 	.map(branch => branch
	// 		.map(solutions => keysToFaceOrders(solutions)));

	console.log("rootSigned", rootSignedObj);

	// const recurse = (node) => {
	// 	if (node.faceOrders) {
	// 		node.faceOrders = keysToFaceOrders(node.faceOrders, faces_winding, group_plane.normal);
	// 	}
	// 	if (node.finished) { node.finished.forEach(child => recurse(child)); }
	// 	if (node.unfinished) { node.unfinished.forEach(child => recurse(child)); }
	// };
	// recurse(solution);

	// console.log("partitions", partitions);
	// console.log("branchResults", branchResults);
	return Object.assign(
		Object.create(LayerPrototype),
		// { root: rootSignedObj, partitions: partitionsSigned },
	);
};

const globalLayerSolver = (graph, epsilon = 1e-6) => {
	const {
		groups_constraints,
		groups_constraintsLookup,
		groups_facePairs,
		groups_edgeAdjacentOrders,
		faces_winding,
	} = prepare(graph, epsilon);
	const result = groups_constraints.map((constraints, i) => groupLayerSolver(
		constraints,
		groups_constraintsLookup[i],
		groups_facePairs[i],
		groups_edgeAdjacentOrders[i],
		faces_winding,
	));
	return result;
};

export default globalLayerSolver;
