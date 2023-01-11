/**
 * Rabbit Ear (c) Kraft
 */
import math from "../../math";
/**
 * @description Convert an array of faces which are involved in one
 * taco/tortilla/transitivity condition into an array of arrays where
 * each face is paired with the others in the precise combination that
 * the solver is expecting for this particular condition.
 * @param {number[]} an array of the faces involved in this particular condition.
 * @linkcode Origami ./src/layer/solver2d/general.js 11
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
 * @linkcode Origami ./src/layer/solver2d/general.js 33
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
 * @linkcode Origami ./src/layer/solver2d/general.js 44
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
const to_unsigned_layer_convert = { 0: 0, 1: 1, "-1": 2 };
/**
 * @description convert a layer-encoding 1,2 into 1,-1. modified in place!
 * @param {object} facePairOrders object with face-pair keys and values either 0, 1, 2.
 * @returns {object} the same object with values either 0, 1, -1.
 * @linkcode Origami ./src/layer/solver2d/general.js 81
 */
export const unsignedToSignedOrders = (orders) => {
	Object.keys(orders).forEach(key => {
		orders[key] = to_signed_layer_convert[orders[key]];
	});
	return orders;
};
/**
 * @description convert a layer-encoding 1,-1 into 1,2. modified in place!
 * @param {object} facePairOrders object with face-pair keys and values either 0, 1, -1.
 * @returns {object} the same object with values either 0, 1, 2.
 * @linkcode Origami ./src/layer/solver2d/general.js 93
 */
export const signedToUnsignedOrders = (orders) => {
	Object.keys(orders).forEach(key => {
		orders[key] = to_unsigned_layer_convert[orders[key]];
	});
	return orders;
};
/**
 * @description Convert a set of face-pair layer orders (+1,-1,0)
 * into a face-face relationship matrix.
 * @param {object} facePairOrders object one set of face-pair layer orders (+1,-1,0)
 * @returns {number[][]} NxN matrix, number of faces, containing +1,-1,0
 * as values showing the relationship between i to j in face[i][j].
 * @linkcode Origami ./src/layer/solver2d/general.js 107
 */
export const ordersToMatrix = (orders) => {
	const condition_keys = Object.keys(orders);
	const face_pairs = condition_keys
		.map(key => key.split(" ").map(n => parseInt(n, 10)));
	const faces = [];
	face_pairs
		.reduce((a, b) => a.concat(b), [])
		.forEach(f => { faces[f] = undefined; });
	const matrix = faces.map(() => []);
	face_pairs
		// .filter((_, i) => orders[condition_keys[i]] !== 0)
		.forEach(([a, b]) => {
			matrix[a][b] = orders[`${a} ${b}`];
			matrix[b][a] = -orders[`${a} ${b}`];
		});
	return matrix;
};
/**
 * face pairs: "# #" space separated integer indices. values: 1 or 2.
 */
export const keysToFaceOrders = (facePairs, faces_normal, vector) => {
	const faces_normal_match = faces_normal
		.map(normal => math.core.dot(normal, vector) > 0);
	const keys = Object.keys(facePairs);
	const faceOrders = keys.map(string => string.split(" ").map(n => parseInt(n, 10)));
	faceOrders.forEach((faces, i) => {
		const value = to_signed_layer_convert[facePairs[keys[i]]];
		// const side = (value === -1) ^ (!faces_normal_match[faces[1]])
		const side = (!faces_normal_match[faces[1]])
			? -value
			: value;
		faces.push(side);
	});
	return faceOrders;
};
