/**
 * Rabbit Ear (c) Kraft
 */
import Messages from "../environment/messages.js";
import {
	propagate,
} from "./propagate.js";
import {
	getBranches,
} from "./getBranches.js";

/**
 * @description Given a FOLD graph, already folded, find the layer arrangement
 * between neighboring faces (using edges_faces), and assign this facePair
 * a 1 or 2, checking whether faces have been flipped or not.
 * @param {FOLD} graph a FOLD object
 * @param {string[]} facePairs an array of space-separated face-pair strings
 * @param {boolean[]} faces_winding for every face, true if the face's
 * winding is counter-clockwise, false if clockwise.
 * @returns {{[key: string]: number}} an object describing all the
 * solved facePairs (keys) and their layer order 1 or 2 (value),
 * the object only includes those facePairs
 * which are solved, so, no 0-value entries will exist.
 * @linkcode
 */
export const solveEdgeAdjacent = (
	{ edges_faces, edges_assignment },
	facePairs,
	faces_winding,
) => {
	// flip 1 and 2 to be the other, leaving 0 to be 0.
	const flipCondition = { 0: 0, 1: 2, 2: 1 };

	// neighbor faces determined by crease between them
	const assignmentOrder = { M: 1, m: 1, V: 2, v: 2 };

	// quick lookup for face-pairs
	const facePairsHash = {};
	facePairs.forEach(key => { facePairsHash[key] = true; });

	// "solution" contains solved orders (1, 2) for face-pair keys.
	/** @type {{ [key: string]: number }} */
	const solution = {};
	edges_faces.forEach((faces, edge) => {
		// the crease assignment determines the order between pairs of faces.
		const assignment = edges_assignment[edge];
		const localOrder = assignmentOrder[assignment];

		// skip boundary edges or edges with confusing assignments.
		if (faces.length < 2 || localOrder === undefined) { return; }

		// face[0] is the origin face.
		// the direction of "m" or "v" will be inverted if face[0] is flipped.
		const upright = faces_winding[faces[0]];

		// now we know from a global perspective the order between the face pair.
		const globalOrder = upright
			? localOrder
			: flipCondition[localOrder];

		// todo: are all face order pairs sorted? do we need to check 2 like this?
		const key1 = `${faces[0]} ${faces[1]}`;
		const key2 = `${faces[1]} ${faces[0]}`;
		if (key1 in facePairsHash) { solution[key1] = globalOrder; }
		if (key2 in facePairsHash) {
			solution[key2] = flipCondition[globalOrder];
		}
	});
	return solution;
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
 * @param {TacoTortillaTransitivityConstraints} constraints an object
 * containing all four cases, inside of each is an (very large, typically)
 * array of all constraints as a list of faces.
 * @param {TacoTortillaTransitivityLookup} lookup a map which contains,
 * for every taco/tortilla/transitivity case (top level keys), inside each
 * is an object which relates each facePair (key) to an array of
 * indices (value), where each index is an index in the "constraints" array
 * in which **both** of these faces appear.
 * @param {string[]} unsolvedKeys array of facePair keys to be solved
 * @param {...object} ...orders any number of facePairsOrder solutions
 * which relate facePairs (key) like "3 5" to an order, either 0, 1, or 2.
 * @linkcode Origami ./src/layer/globalSolver/index.js 29
 */
const solveBranch = (
	constraints,
	lookup,
	unsolvedKeys,
	...orders
) => {
	if (!unsolvedKeys.length) { return []; }
	const guessKey = unsolvedKeys[0];
	const completedSolutions = [];
	const unfinishedSolutions = [];
	// given the same guessKey with both 1 and 2 as the guess, run propagate.
	[1, 2].forEach(b => {
		let result;
		try {
			result = propagate(
				constraints,
				lookup,
				[guessKey],
				...orders,
				{ [guessKey]: b },
			);
		} catch (error) {
			// propagate made a guess and it turned out to cause a conflict.
			// throw away this guess.
			return;
		}
		// for valid results:
		// check if all variables are solved or more work is required.
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
			lookup,
			unsolvedKeys.filter(key => !(key in order)),
			...orders,
			order,
		));
	return completedSolutions
		.map(order => ([...orders, order]))
		.concat(...recursed);
};

/**
 * @description Recursively calculate all layer order solutions between faces
 * in a flat-folded FOLD graph.
 * @param {{
 *   constraints: {
 *     taco_taco: TacoTacoConstraint[],
 *     taco_tortilla: TacoTortillaConstraint[],
 *     tortilla_tortilla: TortillaTortillaConstraint[],
 *     transitivity: TransitivityConstraint[],
 *   },
 *   lookup: {
 *     taco_taco: number[][],
 *     taco_tortilla: number[][],
 *     tortilla_tortilla: number[][],
 *     transitivity: number[][],
 *   },
 *   facePairs: string[],
 *   orders: { [key: string]: number },
 * }} solverParams the parameters for the solver which include:
 * - constraints for each taco/tortilla type, an array of each
 *   condition, each condition being an array of all faces involved.
 * - lookup for each taco/tortilla type, a reverse lookup table
 *   where each face-pair contains an array of all constraints its involved in
 * - facePairs an array of space-separated face pair strings
 * - orders a prelimiary solution to some of the facePairs
 *   with solutions in 1,2 value encoding. Useful for any pre-calculations,
 *   for example, pre-calculating edge-adjacent face pairs with known assignments.
 * @returns {{
 *   root: {[key:string]: number},
 *   branches: {[key:string]: number}[],
 * }} a set of solutions where keys are space-separated face pair strings,
 * and values are +1 or -1 describing the relationship of the two faces.
 * Results are stored in "root" and "branches", to compile a complete solution,
 * append the "root" to one selection from each array in "branches".
 * @linkcode
 */
export const solver2D = ({ constraints, lookup, facePairs, orders }) => {
	// propagate layer order starting with only the edge-adjacent face orders
	/** @type { [key: string]: number } */
	let initialResult;
	try {
		initialResult = propagate(constraints, lookup, Object.keys(orders), orders);
	} catch (error) {
		throw new Error(Messages.noLayerSolution, { cause: error });
	}
	// get all keys unsolved after the first round of propagate
	const remainingKeys = facePairs
		.filter(key => !(key in orders))
		.filter(key => !(key in initialResult));
	// group the remaining keys into groups that are isolated from one another.
	// recursively solve each branch, each branch could have more than one solution.
	let branchResults;
	try {
		branchResults = getBranches(remainingKeys, constraints, lookup)
			.map(unsolvedKeys => solveBranch(
				constraints,
				lookup,
				unsolvedKeys,
				orders,
				initialResult,
			));
	} catch (error) {
		throw new Error(Messages.noLayerSolution, { cause: error });
	}
	// solver is finished.
	// the set of face-pair solutions which are true for all branches
	const root = { ...orders, ...initialResult };
	// each branch result is spread across multiple objects
	// containing a solution for a subset of the entire set of faces, one for
	// each recursion depth. for each branch solution, merge its objects into one.
	const branches = branchResults
		.map(branch => branch
			.map(solution => Object.assign({}, ...solution)));
	return { root, branches };
};
