/* Math (c) Kraft, MIT License */
import { EPSILON } from '../general/constant.js';

/**
 * Math (c) Kraft
 */
/**
 * algebra operations on vectors (mostly).
 *
 * vectors are assumed to be Javascript Arrays objects /
 * contain the Javascript Array prototype, as these methods depend
 * on the use of "map", "reduce" and other Array functions.
 *
 * ({x: y:} vectors as Javascript Objects will not work)
 *
 * many of these operations can handle vectors of arbitrary dimension
 * in which case there are two vectors as input, it will be noted that
 * "dimensions match first parameter", you should verify that the second
 * parameter is at least as long as the first (okay if it is longer)
 *
 * when a function name ends with a number (magnitude2) the input vector's
 * dimension is assumed to be this number.
 */
/**
 * @description many methods here are operations on two arrays where
 * the first array determines the number of loops. it's possible the
 * array sizes mismatch, in which case, fill in any empty data with 0.
 */
const safeAdd = (a, b) => a + (b || 0);
/**
 * @description compute the magnitude an n-dimensional vector
 * @param {number[]} v one vector, n-dimensions
 * @returns {number} one scalar
 * @linkcode Math ./src/algebra/vectors.js 32
 */
const magnitude = v => Math.sqrt(v
	.map(n => n * n)
	.reduce(safeAdd, 0));
/**
 * @description compute the magnitude a 2D vector
 * @param {number[]} v one 2D vector
 * @returns {number} one scalar
 * @linkcode Math ./src/algebra/vectors.js 41
 */
const magnitude2 = v => Math.sqrt(v[0] * v[0] + v[1] * v[1]);
/**
 * @description compute the magnitude a 3D vector
 * @param {number[]} v one 3D vector
 * @returns {number} one scalar
 * @linkcode Math ./src/algebra/vectors.js 48
 */
const magnitude3 = v => Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
/**
 * @description compute the square-magnitude an n-dimensional vector
 * @param {number[]} v one vector, n-dimensions
 * @returns {number} one scalar
 * @linkcode Math ./src/algebra/vectors.js 55
 */
const magSquared = v => v
	.map(n => n * n)
	.reduce(safeAdd, 0);
/**
 * @description normalize the input vector and return a new vector as a copy
 * @param {number[]} v one vector, n-dimensions
 * @returns {number[]} one vector, dimension matching the input vector
 * @linkcode Math ./src/algebra/vectors.js 64
 */
const normalize = (v) => {
	const m = magnitude(v);
	return m === 0 ? v : v.map(c => c / m);
};
/**
 * @description normalize the input vector and return a new vector as a copy
 * @param {number[]} v one 2D vector
 * @returns {number[]} one 2D vector
 * @linkcode Math ./src/algebra/vectors.js 74
 */
const normalize2 = (v) => {
	const m = magnitude2(v);
	return m === 0 ? v : [v[0] / m, v[1] / m];
};
/**
 * @description normalize the input vector and return a new vector as a copy
 * @param {number[]} v one 3D vector
 * @returns {number[]} one 3D vector
 * @linkcode Math ./src/algebra/vectors.js 84
 */
const normalize3 = (v) => {
	const m = magnitude3(v);
	return m === 0 ? v : [v[0] / m, v[1] / m, v[2] / m];
};
/**
 * @description scale an input vector by one number, return a copy.
 * @param {number[]} v one vector, n-dimensions
 * @param {number} s one scalar
 * @returns {number[]} one vector
 * @linkcode Math ./src/algebra/vectors.js 95
 */
const scale = (v, s) => v.map(n => n * s);
/**
 * @description scale an input vector by one number, return a copy.
 * @param {number[]} v one 2D vector
 * @param {number} s one scalar
 * @returns {number[]} one 2D vector
 * @linkcode Math ./src/algebra/vectors.js 103
 */
const scale2 = (v, s) => [v[0] * s, v[1] * s];
/**
 * @description scale an input vector by one number, return a copy.
 * @param {number[]} v one 3D vector
 * @param {number} s one scalar
 * @returns {number[]} one 3D vector
 * @linkcode Math ./src/algebra/vectors.js 111
 */
const scale3 = (v, s) => [v[0] * s, v[1] * s, v[2] * s];
/**
 * @description add two vectors and return the sum as another vector,
 * do not modify the input vectors.
 * @param {number[]} v one vector, n-dimensions
 * @param {number[]} u one vector, n-dimensions
 * @returns {number[]} one vector, dimension matching first parameter
 * @linkcode Math ./src/algebra/vectors.js 120
 */
const add = (v, u) => v.map((n, i) => n + (u[i] || 0));
/**
 * @description add two vectors and return the sum as another vector,
 * do not modify the input vectors.
 * @param {number[]} v one 2D vector
 * @param {number[]} u one 2D vector
 * @returns {number[]} one 2D vector
 * @linkcode Math ./src/algebra/vectors.js 129
 */
const add2 = (v, u) => [v[0] + u[0], v[1] + u[1]];
/**
 * @description add two vectors and return the sum as another vector,
 * do not modify the input vectors.
 * @param {number[]} v one 3D vector
 * @param {number[]} u one 3D vector
 * @returns {number[]} one 3D vector
 * @linkcode Math ./src/algebra/vectors.js 138
 */
const add3 = (v, u) => [v[0] + u[0], v[1] + u[1], v[2] + u[2]];
/**
 * @description subtract the second vector from the first, return the result as a copy.
 * @param {number[]} v one vector, n-dimensions
 * @param {number[]} u one vector, n-dimensions
 * @returns {number[]} one vector, dimension matching first parameter
 * @linkcode Math ./src/algebra/vectors.js 146
 */
const subtract = (v, u) => v.map((n, i) => n - (u[i] || 0));
/**
 * @description subtract the second vector from the first, return the result as a copy.
 * @param {number[]} v one 2D vector
 * @param {number[]} u one 2D vector
 * @returns {number[]} one 2D vector
 * @linkcode Math ./src/algebra/vectors.js 154
 */
const subtract2 = (v, u) => [v[0] - u[0], v[1] - u[1]];
/**
 * @description subtract the second vector from the first, return the result as a copy.
 * @param {number[]} v one 3D vector
 * @param {number[]} u one 3D vector
 * @returns {number[]} one 3D vector
 * @linkcode Math ./src/algebra/vectors.js 162
 */
const subtract3 = (v, u) => [v[0] - u[0], v[1] - u[1], v[2] - u[2]];
/**
 * @description compute the dot product of two vectors.
 * @param {number[]} v one vector, n-dimensions
 * @param {number[]} u one vector, n-dimensions
 * @returns {number} one scalar
 * @linkcode Math ./src/algebra/vectors.js 170
 */
const dot = (v, u) => v
	.map((_, i) => v[i] * u[i])
	.reduce(safeAdd, 0);
/**
 * @description compute the dot product of two 2D vectors.
 * @param {number[]} v one 2D vector
 * @param {number[]} u one 2D vector
 * @returns {number} one scalar
 * @linkcode Math ./src/algebra/vectors.js 180
 */
const dot2 = (v, u) => v[0] * u[0] + v[1] * u[1];
/**
 * @description compute the dot product of two 3D vectors.
 * @param {number[]} v one 3D vector
 * @param {number[]} u one 3D vector
 * @returns {number} one scalar
 * @linkcode Math ./src/algebra/vectors.js 188
 */
const dot3 = (v, u) => v[0] * u[0] + v[1] * u[1] + v[2] * u[2];
/**
 * @description compute the midpoint of two vectors.
 * @param {number[]} v one vector, n-dimensions
 * @param {number[]} u one vector, n-dimensions
 * @returns {number} one vector, dimension matching first parameter
 * @linkcode Math ./src/algebra/vectors.js 196
 */
const midpoint = (v, u) => v.map((n, i) => (n + u[i]) / 2);
/**
 * @description compute the midpoint of two 2D vectors.
 * @param {number[]} v one 2D vector
 * @param {number[]} u one 2D vector
 * @returns {number} one 2D vector
 * @linkcode Math ./src/algebra/vectors.js 204
 */
const midpoint2 = (v, u) => scale2(add2(v, u), 0.5);
/**
 * @description compute the midpoint of two 2D vectors.
 * @param {number[]} v one 2D vector
 * @param {number[]} u one 2D vector
 * @returns {number} one 2D vector
 * @linkcode Math ./src/algebra/vectors.js 212
 */
const midpoint3 = (v, u) => scale3(add3(v, u), 0.5);
/**
 * @description the average of N number of vectors (not numbers),
 * similar to midpoint but this can accept more than 2 inputs.
 * @param {number[]} ...args any number of input vectors
 * @returns {number[]} one vector, dimension matching first parameter
 * @linkcode Math ./src/algebra/vectors.js 220
 */
const average = function () {
	if (arguments.length === 0) { return []; }
	const dimension = (arguments[0].length > 0) ? arguments[0].length : 0;
	const sum = Array(dimension).fill(0);
	Array.from(arguments)
		.forEach(vec => sum
			.forEach((_, i) => { sum[i] += vec[i] || 0; }));
	return sum.map(n => n / arguments.length);
};
/**
 * @description the average of N number of vectors (not numbers),
 * similar to midpoint but this can accept more than 2 inputs.
 * @param {number[]} ...args any number of input vectors
 * @returns {number[]} one vector, dimension matching first parameter
 * @linkcode Math ./src/algebra/vectors.js 220
 */
const average2 = (...vectors) => {
	if (!vectors.length) { return undefined; }
	const inverseLength = 1 / vectors.length;
	return vectors
		.reduce((a, b) => add2(a, b), [0, 0])
		.map(c => c * inverseLength);
};
/**
 * @description linear interpolate between two vectors
 * @param {number[]} v one vector, n-dimensions
 * @param {number[]} u one vector, n-dimensions
 * @param {number} t one scalar between 0 and 1 (not clamped)
 * @returns {number[]} one vector, dimensions matching first parameter
 * @linkcode Math ./src/algebra/vectors.js 237
 */
const lerp = (v, u, t) => {
	const inv = 1.0 - t;
	return v.map((n, i) => n * inv + (u[i] || 0) * t);
};
/**
 * @description the determinant of the matrix of the 2 vectors
 * (possible bad name, 2D cross product is undefined)
 * @param {number[]} v one 2D vector
 * @param {number[]} u one 2D vector
 * @returns {number} one scalar; the determinant; the magnitude of the vector
 * @linkcode Math ./src/algebra/vectors.js 249
 */
const cross2 = (v, u) => v[0] * u[1] - v[1] * u[0];
/**
 * @description the 3D cross product of two 3D vectors
 * @param {number[]} v one 3D vector
 * @param {number[]} u one 3D vector
 * @returns {number[]} one 3D vector
 * @linkcode Math ./src/algebra/vectors.js 257
 */
const cross3 = (v, u) => [
	v[1] * u[2] - v[2] * u[1],
	v[2] * u[0] - v[0] * u[2],
	v[0] * u[1] - v[1] * u[0],
];
/**
 * @description compute the distance between two vectors
 * @param {number[]} v one vector, n-dimensions
 * @param {number[]} u one vector, n-dimensions
 * @returns {number} one scalar
 * @linkcode Math ./src/algebra/vectors.js 269
 */
const distance = (v, u) => Math.sqrt(v
	.map((_, i) => (v[i] - u[i]) ** 2)
	.reduce(safeAdd, 0));
/**
 * @description compute the distance between two 2D vectors
 * @param {number[]} v one 2D vector
 * @param {number[]} u one 2D vector
 * @returns {number} one scalar
 * @linkcode Math ./src/algebra/vectors.js 279
 */
const distance2 = (v, u) => {
	const p = v[0] - u[0];
	const q = v[1] - u[1];
	return Math.sqrt((p * p) + (q * q));
};
/**
 * @description compute the distance between two 3D vectors
 * @param {number[]} v one 3D vector
 * @param {number[]} u one 3D vector
 * @returns {number} one scalar
 * @linkcode Math ./src/algebra/vectors.js 291
 */
const distance3 = (v, u) => {
	const a = v[0] - u[0];
	const b = v[1] - u[1];
	const c = v[2] - u[2];
	return Math.sqrt((a * a) + (b * b) + (c * c));
};
/**
 * @description return a copy of the input vector where each element's sign flipped
 * @param {number[]} v one vector, n-dimensions
 * @returns {number[]} one vector, dimensions matching input parameter
 * @linkcode Math ./src/algebra/vectors.js 303
 */
const flip = v => v.map(n => -n);
/**
 * @description return a copy of the input vector rotated 90 degrees counter-clockwise
 * @param {number[]} v one 2D vector
 * @returns {number[]} one 2D vector
 * @linkcode Math ./src/algebra/vectors.js 310
 */
const rotate90 = v => [-v[1], v[0]];
/**
 * @description return a copy of the input vector rotated 270 degrees counter-clockwise
 * @param {number[]} v one 2D vector
 * @returns {number[]} one 2D vector
 * @linkcode Math ./src/algebra/vectors.js 317
 */
const rotate270 = v => [v[1], -v[0]];
/**
 * @description check if a vector is degenerate, meaning its magnitude is below an epsilon limit.
 * @param {number[]} v one vector, n-dimensions
 * @param {number} [epsilon=1e-6] an optional epsilon with a default value of 1e-6
 * @returns {boolean} is the magnitude of the vector smaller than the epsilon?
 * @linkcode Math ./src/algebra/vectors.js 325
 */
const degenerate = (v, epsilon = EPSILON) => v
	.map(n => Math.abs(n))
	.reduce(safeAdd, 0) < epsilon;
/**
 * @description check if two already normalized vectors are parallel
 * to each other, within an epsilon. Parallel includes the case where
 * the vectors are exactly 180 degrees flipped from one another.
 * @param {number[]} v one vector, n-dimensions
 * @param {number[]} u one vector, n-dimensions
 * @param {number} [epsilon=1e-6] an optional epsilon with a default value of 1e-6
 * @returns {boolean} are the two vectors parallel within an epsilon?
 * @linkcode Math ./src/algebra/vectors.js 338
 */
const parallelNormalized = (v, u, epsilon = EPSILON) => 1 - Math
	.abs(dot(v, u)) < epsilon;
/**
 * @description check if two vectors are parallel to each other,
 * within an epsilon. Parallel includes the case where the
 * vectors are exactly 180 degrees flipped from one another.
 * @param {number[]} v one vector, n-dimensions
 * @param {number[]} u one vector, n-dimensions
 * @param {number} [epsilon=1e-6] an optional epsilon with a default value of 1e-6
 * @returns {boolean} are the two vectors parallel within an epsilon?
 * @linkcode Math ./src/algebra/vectors.js 350
 */
const parallel = (v, u, epsilon = EPSILON) => parallelNormalized(
	normalize(v),
	normalize(u),
	epsilon,
);
/**
 * @description check if two 2D vectors are parallel to each other within an epsilon
 * @param {number[]} v one 2D vector
 * @param {number[]} u one 2D vector
 * @param {number} [epsilon=1e-6] an optional epsilon with a default value of 1e-6
 * @returns {boolean} are the two vectors parallel within an epsilon?
 * @linkcode Math ./src/algebra/vectors.js 363
 */
const parallel2 = (v, u, epsilon = EPSILON) => Math
	.abs(cross2(v, u)) < epsilon;
/**
 * @description Resize a vector to a particular length (duplicating it
 * in memory in the process) by either lengthening or shortening it.
 * In the case of lengthening, fill 0.
 * @param {number} dimension the desired length
 * @param {number[]} vector the vector to resize
 * @returns {number[]} a copy of the vector resized to the desired length.
 * @linkcode Math ./src/algebra/vectors.js 374
 */
const resize = (dimension, vector) => (vector.length === dimension
	? vector
	: Array(dimension).fill(0).map((z, i) => (vector[i] ? vector[i] : z)));
/**
 * @description Make the two vectors match in dimension by appending the
 * smaller vector with 0s to match the dimension of the larger vector.
 * @param {number[]} a a vector
 * @param {number[]} b a vector
 * @param {number[][]} an array containing two vectors, a copy of
 * each of the input parameters.
 * @linkcode Math ./src/algebra/vectors.js 386
 */
const resizeUp = (a, b) => [a, b]
	.map(v => resize(Math.max(a.length, b.length), v));
/**
 * @description Make the two vectors match in dimension by clamping the
 * larger vector to match the dimension of the smaller vector.
 * @param {number[]} a a vector
 * @param {number[]} b a vector
 * @param {number[][]} an array containing two vectors, a copy of
 * each of the input parameters.
 * @linkcode Math ./src/algebra/vectors.js 397
 */
// export const resizeDown = (a, b) => [a, b]
//   .map(v => resize(Math.min(a.length, b.length), v));

export { add, add2, add3, average, average2, cross2, cross3, degenerate, distance, distance2, distance3, dot, dot2, dot3, flip, lerp, magSquared, magnitude, magnitude2, magnitude3, midpoint, midpoint2, midpoint3, normalize, normalize2, normalize3, parallel, parallel2, parallelNormalized, resize, resizeUp, rotate270, rotate90, scale, scale2, scale3, subtract, subtract2, subtract3 };
