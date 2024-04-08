/**
 * Math (c) Kraft
 */
// import { distance2 } from "../algebra/vector.js";
// import { identity2x3 } from "../algebra/matrix2.js";
// import { identity3x4 } from "../algebra/matrix3.js";

const isIterable = (obj) => obj != null
	&& typeof obj[Symbol.iterator] === "function";

/**
 * @description flatten only until the point of comma separated entities.
 * This will preserve vectors (number[]) in an array of array of vectors.
 * @param {any[][]} args any array, intended to contain arrays of arrays.
 * @returns {array[]} a flattened copy, flattened up until the point before
 * combining arrays of elements.
 */
const semiFlattenArrays = function () {
	switch (arguments.length) {
	case 0: return Array.from(arguments);
	// only if its an array (is iterable) and NOT a string
	case 1: return isIterable(arguments[0]) && typeof arguments[0] !== "string"
		? semiFlattenArrays(...arguments[0])
		: [arguments[0]];
	default:
		return Array.from(arguments).map(a => (isIterable(a)
			? [...semiFlattenArrays(a)]
			: a));
	}
};

/**
 * @description Totally flatten, recursive
 * @param {array[][]} args any array, intended to contain arrays of arrays.
 * @returns {array[]} fully, recursively flattened array
 */
const flattenArrays = function () {
	switch (arguments.length) {
	case 0: return Array.from(arguments);
	// only if its an array (is iterable) and NOT a string
	case 1: return isIterable(arguments[0]) && typeof arguments[0] !== "string"
		? flattenArrays(...arguments[0])
		: [arguments[0]];
	default:
		return Array.from(arguments).map(a => (isIterable(a)
			? [...flattenArrays(a)]
			: a)).flat();
	}
};

/**
 * @description Coerce the function arguments into a vector.
 * This will object notation {x:, y:}, or array [number, number, ...]
 * and work for n-dimensions.
 * @param {any[]} ...args an argument list that contains at least one
 * object with {x: y:} or a list of numbers to become the vector.
 * @returns {number[]} vector in array form, or empty array for bad inputs
*/
export const getVector = function () {
	let list = flattenArrays(arguments);
	// if the arguments's first element is an object with an "x" property
	const a = list[0];
	if (typeof a === "object" && a !== null && !Number.isNaN(a.x)) {
		list = ["x", "y", "z"].map(c => a[c]).filter(b => b !== undefined);
	}
	return list.filter(n => typeof n === "number");
};

/**
 * @description Coerce the function arguments into an array of vectors.
 * @param {any[][]} ...args an argument list that contains any number of
 * objects with {x: y:} or a list of list of numbers to become vectors.
 * @returns {number[][]} vectors in array form, or empty array.
*/
export const getArrayOfVectors = function () {
	return semiFlattenArrays(arguments).map(el => getVector(el));
};

/**
 * @description Coerce the function arguments into a segment (a pair of points)
 * @param {any[]} ...args an argument list that contains a pair of
 * objects with {x: y:} or a list of list of numbers to become endpoints.
 * @returns {number[][]} segment in array form [[a1, a2], [b1, b2]]
*/
export const getSegment = function () {
	const args = semiFlattenArrays(arguments);
	return args.length === 4
		? [[0, 1], [2, 3]].map(s => s.map(i => args[i]))
		: args.map(el => getVector(el));
};

// store two parameters in an object under the keys "vector" and "object"
const vectorOriginForm = (vector, origin = []) => ({ vector, origin });
// 	{ vector: vector || [], origin: origin || [] });

/**
 * @description Coerce the function arguments into a line.
 * @param {any[]} ...args an argument list that contains an object with
 * {vector: origin:} or a list of list of numbers.
 * @returns {VecLine} a line in "vector" "origin" form.
 */
export const getLine = function () {
	const args = semiFlattenArrays(arguments);
	if (args.length === 0 || args[0] == null) { return vectorOriginForm([], []); }
	if (args[0].constructor === Object && args[0].vector !== undefined) {
		return vectorOriginForm(args[0].vector, args[0].origin || []);
	}
	return typeof args[0] === "number"
		? vectorOriginForm(getVector(args))
		: vectorOriginForm(...args.map(a => getVector(a)));
};

// /**
//  * a matrix2 is a 2x3 matrix, 2x2 with a column to represent translation
//  *
//  * @returns {number[]} array of 6 numbers, or undefined if bad inputs
// */
// export const getMatrix2 = function () {
// 	const m = getVector(arguments);
// 	if (m.length === 6) { return m; }
// 	if (m.length > 6) { return [m[0], m[1], m[2], m[3], m[4], m[5]]; }
// 	if (m.length < 6) {
// 		return identity2x3.map((n, i) => m[i] || n);
// 	}
// 	return [...identity2x3];
// };
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

// export const get_rect_params = (x = 0, y = 0, width = 0, height = 0) => ({
// 	x, y, width, height,
// });

// export const getRect = function () {
// 	const list = flattenArrays(arguments);
// 	if (list.length > 0
// 		&& typeof list[0] === "object"
// 		&& list[0] !== null
// 		&& !Number.isNaN(list[0].width)) {
// 		return get_rect_params(...["x", "y", "width", "height"]
// 			.map(c => list[0][c])
// 			.filter(a => a !== undefined));
// 	}
// 	const numbers = list.filter(n => typeof n === "number");
// 	const rect_params = numbers.length < 4
// 		? [, , ...numbers]
// 		: numbers;
// 	return get_rect_params(...rect_params);
// };

// /**
//  * radius is the first parameter so that the origin can be N-dimensional
//  * ...args is a list of numbers that become the origin.
//  */
// const get_circle_params = (radius = 1, ...args) => ({
// 	radius,
// 	origin: [...args],
// });

// export const getCircle = function () {
// 	const vectors = getArrayOfVectors(arguments);
// 	const numbers = flattenArrays(arguments).filter(a => typeof a === "number");
// 	if (arguments.length === 2) {
// 		if (vectors[1].length === 1) {
// 			return get_circle_params(vectors[1][0], ...vectors[0]);
// 		}
// 		if (vectors[0].length === 1) {
// 			return get_circle_params(vectors[0][0], ...vectors[1]);
// 		}
// 		if (vectors[0].length > 1 && vectors[1].length > 1) {
// 			return get_circle_params(distance2(...vectors), ...vectors[0]);
// 		}
// 	} else {
// 		switch (numbers.length) {
// 		case 0: return get_circle_params(1, 0, 0, 0);
// 		case 1: return get_circle_params(numbers[0], 0, 0, 0);
// 		default: return get_circle_params(numbers.pop(), ...numbers);
// 		}
// 	}
// 	return get_circle_params(1, 0, 0, 0);
// };
