/* Math (c) Kraft, MIT License */
import { EPSILON } from './constants.js';
import { epsilonCompare } from './functions.js';

/**
 * Math (c) Kraft
 */
/**
 * @description Given a single object against which to compare,
 * iterate through an array of the same type and run a custom
 * comparison function which abides by this format:
 * (a:any, b:any) => number. The element in the array which returns
 * the smallest value, its index will be returned.
 * @param {any} obj the single item to test against the set
 * @param {any[]} array the set of items to test against
 * @param {function} compare_func a function which takes two items (which match
 * the type of the first parameter), execution of this function should return a scalar.
 * @returns {number[]} the index from the set which minimizes the compare function
 * @linkcode Math ./src/algebra/nearest.js 29
 */
const smallestComparisonSearch = (array, obj, compare_func) => {
	const objs = array.map((o, i) => ({ i, d: compare_func(obj, o) }));
	let index;
	let smallest_value = Infinity;
	for (let i = 0; i < objs.length; i += 1) {
		if (objs[i].d < smallest_value) {
			index = i;
			smallest_value = objs[i].d;
		}
	}
	return index;
};
/**
 * @description Find the indices from an array of vectors which all have
 * the smallest value within an epsilon.
 * @param {number[][]} vectors array of vectors
 * @returns {number[]} array of indices which all have the lowest X value.
 * @linkcode Math ./src/algebra/nearest.js 48
 */
const smallestVectorSearch = (vectors, axis = 0, compFn = epsilonCompare, epsilon = EPSILON) => {
	// find the set of all vectors that share the smallest X value within an epsilon
	let smallSet = [0];
	for (let i = 1; i < vectors.length; i += 1) {
		switch (compFn(vectors[i][axis], vectors[smallSet[0]][axis], epsilon)) {
		case 0: smallSet.push(i); break;
		case 1: smallSet = [i]; break;
		}
	}
	return smallSet;
};
/**
 * @description Get the index of the point in an array
 * considered the absolute minimum. First check the X values,
 * and in the case of multiple minimums, check the Y values.
 * If there are more than two points that share both X and Y,
 * return the first one found.
 * @param {number[][]} points array of points
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number|undefined} the index of the point in the array with
 * the smallest component values, or undefined if points is empty.
 * @linkcode Math ./src/algebra/nearest.js 68
 */
const minimum2DPointIndex = (points, epsilon = EPSILON) => {
// export const minimumPointIndex = (points, epsilon = EPSILON) => {
	if (!points.length) { return undefined; }
	// find the set of all points that share the smallest X value
	// const smallSet = minimumXIndices(points, epsilonCompare, epsilon);
	const smallSet = smallestVectorSearch(points, 0, epsilonCompare, epsilon);
	// from this set, find the point with the smallest Y value
	let sm = 0;
	for (let i = 1; i < smallSet.length; i += 1) {
		if (points[smallSet[i]][1] < points[smallSet[sm]][1]) { sm = i; }
	}
	return smallSet[sm];
	// idea to make this N-dimensional. requires back-mapping indices
	// through all the subsets returned by smallestVectorSearch
	// const dimensions = points[0].length;
	// let set = points.map((_, i) => i);
	// const levelMap = [];
	// for (let d = 0; d < dimensions; d += 1) {
	// 	const indices = levelMap[0].map((_, i) => i);
	// 	levelMap.forEach(map => indices.forEach((s, i) => { indices[i] = map[s]; }));
	// 	set = smallestVectorSearch(indices.map(i => points[i]), d, epsilonCompare, epsilon);
	// 	levelMap.push(set);
	// }
	// console.log("levelMap", levelMap);
	// oh no. the indices don't carry over each round
	// we have to back map the indices from levelMap.
};

export { minimum2DPointIndex, smallestComparisonSearch };
