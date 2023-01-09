/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description Convert an array of faces which are involved in one
 * taco/tortilla/transitivity condition into an array of arrays where
 * each face is paired with the others in the precise combination that
 * the solver is expecting for this particular condition.
 * @param {number[]} an array of the faces involved in this particular condition.
 * @linkcode Origami ./src/layer/solver3d/general.js 11
 */
export const constraintToFacePairs = ({
	// taco_taco (A,C) (B,D) (B,C) (A,D) (A,B) (C,D)
	taco_taco: f => [
		[f[0], f[2]],
		[f[1], f[3]],
		[f[1], f[2]],
		[f[0], f[3]],
		[f[0], f[1]],
		[f[2], f[3]],
	],
	// taco_tortilla (A,C) (A,B) (B,C)
	taco_tortilla: f => [[f[0], f[2]], [f[0], f[1]], [f[1], f[2]]],
	// tortilla_tortilla (A,C) (B,D)
	tortilla_tortilla: f => [[f[0], f[2]], [f[1], f[3]]],
	// transitivity (A,B) (B,C) (C,A)
	transitivity: f => [[f[0], f[1]], [f[1], f[2]], [f[2], f[0]]],
});
/**
 * @description Given an array of a pair of integers, sort the smallest
 * to be first, and format them into a space-separated string.
 * @linkcode Origami ./src/layer/solver3d/general.js 33
 */
export const pairArrayToSortedPairString = pair => (pair[0] < pair[1]
	? `${pair[0]} ${pair[1]}`
	: `${pair[1]} ${pair[0]}`);
/**
 * @description Convert an array of faces which are involved in one
 * taco/tortilla/transitivity condition into an array of arrays where
 * each face is paired with the others in the precise combination that
 * the solver is expecting for this particular condition.
 * @param {number[]} an array of the faces involved in this particular condition.
 * @linkcode Origami ./src/layer/solver3d/general.js 44
 */
export const constraintToFacePairsStrings = ({
	// taco_taco (A,C) (B,D) (B,C) (A,D) (A,B) (C,D)
	taco_taco: f => [
		pairArrayToSortedPairString([f[0], f[2]]),
		pairArrayToSortedPairString([f[1], f[3]]),
		pairArrayToSortedPairString([f[1], f[2]]),
		pairArrayToSortedPairString([f[0], f[3]]),
		pairArrayToSortedPairString([f[0], f[1]]),
		pairArrayToSortedPairString([f[2], f[3]]),
	],
	// taco_tortilla (A,C) (A,B) (B,C)
	taco_tortilla: f => [
		pairArrayToSortedPairString([f[0], f[2]]),
		pairArrayToSortedPairString([f[0], f[1]]),
		pairArrayToSortedPairString([f[1], f[2]]),
	],
	// tortilla_tortilla (A,C) (B,D)
	tortilla_tortilla: f => [
		pairArrayToSortedPairString([f[0], f[2]]),
		pairArrayToSortedPairString([f[1], f[3]]),
	],
	// transitivity (A,B) (B,C) (C,A)
	transitivity: f => [
		pairArrayToSortedPairString([f[0], f[1]]),
		pairArrayToSortedPairString([f[1], f[2]]),
		pairArrayToSortedPairString([f[2], f[0]]),
	],
});

const to_signed_layer_convert = { 0: 0, 1: 1, 2: -1 };
/**
 * face pairs: "# #" space separated integer indices. values: 1 or 2.
 */
const keysToFaceOrders = (facePairs, faces_aligned) => {
	const keys = Object.keys(facePairs);
	const faceOrders = keys.map(string => string
		.split(" ")
		.map(n => parseInt(n, 10)));
	faceOrders.forEach((faces, i) => {
		const value = to_signed_layer_convert[facePairs[keys[i]]];
		// equivalent to: side = (!faces_aligned[faces[1]]) ? -value : value
		const side = (((value === 1) ^ (faces_aligned[faces[1]])) * -2) + 1;
		faces.push(side);
	});
	return faceOrders;
};
/**
 * @description traverse the solution tree, convert any orders
 * from { string: number } where string is a face pair, like "3 29",
 * and the number is one of either (1,2) into the FOLD spec facesOrder
 * format, like [3, 29, -1].
 * The string becomes .split(" ") and the (1,2) order becomes (1,-1).
 * Modifies the solution parameter object in place.
 * @param {object} solution the result of calling src/layer/solver/index.js
 * @param {boolean[]} faces_winding for every face true or false,
 * specifically, the property on the result of getOverlappingFacesGroups.
 * @returns {object} the solution parameter, modified in place.
 */
export const reformatSolution = (solution, faces_winding) => {
	if (solution.orders) {
		solution.orders = solution.orders
			.flatMap(order => keysToFaceOrders(order, faces_winding));
	}
	if (solution.leaves) {
		solution.leaves = solution.leaves
			.map(order => keysToFaceOrders(order, faces_winding));
	}
	if (solution.partitions) {
		solution.partitions
			.forEach(child => reformatSolution(child, faces_winding));
	}
	if (solution.node) {
		solution.node
			.forEach(child => reformatSolution(child, faces_winding));
	}
	return solution;
};
