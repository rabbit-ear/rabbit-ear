/**
 * Rabbit Ear (c) Kraft
 */
import Messages from "../../environment/messages.js";
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
 * @param {object} lookup a map which contains, for every
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
 * @linkcode Origami ./src/layer/globalSolver/index.js 89
 */
const solver2d = ({ constraints, lookup, facePairs, orders }) => {
	// algorithm running time info
	// const startDate = new Date();
	// propagate layer order starting with only the edge-adjacent face orders
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
	// const duration = Date.now() - startDate;
	// if (duration > 50) { console.log(`solver ${duration}ms`); }
	return { root, branches };
};

export default solver2d;
