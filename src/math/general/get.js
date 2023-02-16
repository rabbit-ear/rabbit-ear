/* Math (c) Kraft, MIT License */
import { flattenArrays, semiFlattenArrays } from './arrays.js';

/**
 * Math (c) Kraft
 */
/**
 * @description Coerce the function arguments into a vector.
 * This will object notation {x:, y:}, or array [number, number, ...]
 * and work for n-dimensions.
 * @returns {number[]} vector in array form, or empty array for bad inputs
*/
const getVector = function () {
	let list = flattenArrays(arguments);
	// if the arguments's first element is an object with an "x" property
	const a = list[0];
	if (typeof a === "object" && a !== null && !Number.isNaN(a.x)) {
		list = ["x", "y", "z"].map(c => a[c]).filter(a => a !== undefined);
	}
	return list.filter(n => typeof n === "number");
};
/**
 * @description Coerce the function arguments into an array of vectors.
 * @returns {number[][]} vectors in array form, or empty array.
*/
const getArrayOfVectors = function () {
	return semiFlattenArrays(arguments).map(el => getVector(el));
};
/**
 * @description Coerce the function arguments into a segment (a pair of points)
 * @returns {number[]} segment in array form [[a1, a2], [b1, b2]]
*/
const getSegment = function () {
	const args = semiFlattenArrays(arguments);
	return args.length === 4
		? [[0, 1], [2, 3]].map(s => s.map(i => args[i]))
		: args.map(el => getVector(el));
};
// store two parameters in an object under the keys "vector" and "object"
const vectorOriginForm = (vector = [], origin = []) => ({ vector, origin });
// 	{ vector: vector || [], origin: origin || [] });
/**
 * @description Coerce the function arguments into a line.
 * @returns {object} a line in "vector" "origin" form.
 */
const getLine = function () {
	const args = semiFlattenArrays(arguments);
	if (args.length === 0) { return vectorOriginForm([], []); }
	if (args[0].constructor === Object && args[0].vector !== undefined) {
		return vectorOriginForm(args[0].vector || [], args[0].origin || []);
	}
	return typeof args[0] === "number"
		? vectorOriginForm(getVector(args))
		: vectorOriginForm(...args.map(a => getVector(a)));
};
// const maps3x4 = [
// 	[0, 1, 3, 4, 9, 10],
// 	[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
// 	[0, 1, 2, undefined, 3, 4, 5, undefined, 6, 7, 8, undefined, 9, 10, 11],
// ];
// [11, 7, 3].forEach(i => delete maps3x4[2][i]);
// // eslint-disable-next-line no-nested-ternary
// const matrixMap3x4 = len => (len < 8
// 	? maps3x4[0]
// 	: (len < 13 ? maps3x4[1] : maps3x4[2]));
// /**
//  * @description Get a 3x4 matrix
//  *
//  * @returns {number[]} array of 12 numbers, or undefined if bad inputs
// */
// export const getMatrix3x4 = function () {
// 	const mat = flattenArrays(arguments);
// 	const matrix = [...identity3x4];
// 	matrixMap3x4(mat.length)
// 		// .filter((_, i) => mat[i] != null)
// 		.forEach((n, i) => { if (mat[i] != null) { matrix[n] = mat[i]; } });
// 	return matrix;
// };

export { getArrayOfVectors, getLine, getSegment, getVector };
