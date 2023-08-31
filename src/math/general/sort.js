/**
 * Math (c) Kraft
 */
import { EPSILON } from "./constant.js";
import { epsilonEqual } from "./function.js";
import {
	normalize2,
	distance2,
	dot,
	dot2,
	subtract,
	subtract2,
	basisVectors3,
} from "../algebra/vector.js";
import { projectPointOnPlane } from "../geometry/plane.js";
import { minimum2DPointIndex } from "./search.js";
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
 * @description given an array of already-sorted values (so that
 * comparisons only need to happen between neighboring items),
 * cluster the numbers which are similar within an epsilon.
 * Isolated values still get put in length-1 arrays. (all values returned)
 * and the clusters contain the indices from the param array, not the values.
 * @param {number[]} numbers an array of sorted numbers
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][]} an array of arrays, each inner array containin indices.
 * each inner array represents clusters of values which lie within an epsilon.
 * @linkcode Math ./src/general/sort.js 51
 */
export const clusterIndicesOfSortedNumbers = (numbers, epsilon = EPSILON) => {
	const clusters = [[0]];
	let clusterIndex = 0;
	for (let i = 1; i < numbers.length; i += 1) {
		// if this scalar fits inside the current cluster
		if (epsilonEqual(numbers[i], numbers[i - 1], epsilon)) {
			clusters[clusterIndex].push(i);
		} else {
			clusterIndex = clusters.length;
			clusters.push([i]);
		}
	}
	return clusters;
};
/**
 * @description radially sort 2D point indices around the lowest-
 * value point, clustering similarly-angled points within an epsilon.
 * Within these clusters, the points are sorted by distance so the
 * nearest point is listed first.
 * @param {number[][]} points an array of points
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][]} this returns indices in clusters.
 * @todo there is a wrap-around point where the cycle will not cluster
 * values which otherwise should be clustered.
 * @linkcode Math ./src/general/sort.js 75
 */
export const radialSortPointIndices2 = (points, epsilon = EPSILON) => {
	const first = minimum2DPointIndex(points, epsilon);
	if (first === undefined) { return []; }
	const angles = points
		.map(p => subtract2(p, points[first]))
		.map(v => normalize2(v))
		.map(vec => dot2([0, 1], vec));
		// .map((p, i) => Math.atan2(unitVecs[i][1], unitVecs[i][0]));
	const rawOrder = angles
		.map((a, i) => ({ a, i }))
		.sort((a, b) => a.a - b.a)
		.map(el => el.i)
		.filter(i => i !== first);
	return [[first]]
		.concat(clusterIndicesOfSortedNumbers(rawOrder.map(i => angles[i]), epsilon)
			.map(arr => arr.map(i => rawOrder[i]))
			.map(cluster => (cluster.length === 1 ? cluster : cluster
				.map(i => ({ i, len: distance2(points[i], points[first]) }))
				.sort((a, b) => a.len - b.len)
				.map(el => el.i))));
};
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
