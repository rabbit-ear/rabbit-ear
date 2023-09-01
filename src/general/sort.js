/**
 * Math (c) Kraft
 */
import {
	normalize2,
	dot,
	subtract,
	basisVectors3,
} from "../math/vector.js";
import { projectPointOnPlane } from "../math/plane.js";
/**
 * @description Provide a comparison function and use it to sort an array
 * of any type of object against a single item. The returned array will be
 * the indices of the original array in sorted order.
 * @param {any[]} array an array of elements to be sorted
 * @param {any} item the item which to compare against all array elements
 * @param {function} compareFn the comparison function to be run against
 * every element in the array with the input item parameter, placing
 * the array element first, the input item second: fn(arrayElem, paramItem)
 * @returns {number[]} the indices of the original array, in sorted order
 * @linkcode Math ./src/general/sort.js 24
 */
export const sortAgainstItem = (array, item, compareFn) => array
	.map((el, i) => ({ i, n: compareFn(el, item) }))
	.sort((a, b) => a.n - b.n)
	.map(a => a.i);
/**
 * @description Sort an array of n-dimensional points along an
 * n-dimensional vector, get the indices in sorted order.
 * @param {number[][]} points array of points (which are arrays of numbers)
 * @param {number[]} vector one vector
 * @returns {number[]} a list of sorted indices to the points array.
 * @linkcode Math ./src/general/sort.js 36
 */
export const sortPointsAlongVector = (points, vector) => (
	sortAgainstItem(points, vector, dot)
);
/**
 *       (+y)
 *        |
 *  -d +c |  +d +c
 *        |
 * -------|------- (+x, [1, 0])
 *        |
 *  -d -c |  +d -c
 *        |
 *
 * 1 | 0
 * -----
 * 2 | 3
 */
export const radialSortUnitVectors2 = (vectors) => {
	const quadrantConditions = [
		v => v[0] >= 0 && v[1] >= 0,
		v => v[0] < 0 && v[1] >= 0,
		v => v[0] < 0 && v[1] < 0,
		v => v[0] >= 0 && v[1] < 0,
	];
	const quadrantSorts = [
		(a, b) => vectors[b][0] - vectors[a][0],
		(a, b) => vectors[b][0] - vectors[a][0],
		(a, b) => vectors[a][0] - vectors[b][0],
		(a, b) => vectors[a][0] - vectors[b][0],
	];
	const vectorsQuadrant = vectors
		.map(vec => quadrantConditions
			.map((fn, i) => (fn(vec) ? i : undefined))
			.filter(a => a !== undefined)
			.shift());
	const quadrantsVectors = [[], [], [], []];
	vectorsQuadrant.forEach((q, v) => { quadrantsVectors[q].push(v); });
	// sort by: decreasing, decreasing, increasing, increasing x values
	return quadrantsVectors
		.flatMap((indices, i) => indices.sort(quadrantSorts[i]));
};
/**
 *
 */
export const radialSortPointIndices3 = (
	points,
	vector = [1, 0, 0],
	origin = [0, 0, 0],
) => {
	// using the plane's normal, generate three orthogonal vectors
	const threeVectors = basisVectors3(vector);
	// set the plane's normal to the final axis (z-axis)
	const basis = [threeVectors[1], threeVectors[2], threeVectors[0]];
	const projectedPoints = points
		.map(point => projectPointOnPlane(point, vector, origin));
	const projectedVectors = projectedPoints
		.map(point => subtract(point, origin));
	const pointsUV = projectedVectors
		.map(vec => [dot(vec, basis[0]), dot(vec, basis[1])]);
	const vectorsUV = pointsUV.map(normalize2);
	return radialSortUnitVectors2(vectorsUV);
};
