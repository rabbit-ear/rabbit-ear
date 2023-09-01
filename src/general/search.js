/**
 * Math (c) Kraft
 */
import { EPSILON } from "../math/constant.js";
import { epsilonCompare } from "./compare.js";
import { minimumCluster } from "./cluster.js";
/**
 *
 */
// export const smallestPoint = (points, point) => (
// 	minimumElement(points, p => distance(p, point))
// );
/**
 * @description Find the indices from an array of vectors which all have
 * the smallest value within an epsilon.
 * @param {number[][]} vectors array of vectors
 * @returns {number[]} array of indices which all have the lowest X value.
 * @linkcode Math ./src/general/search.js 36
 */
// const smallestVectorSearch = (vectors, axis = 0, compFn = epsilonCompare, epsilon = EPSILON) => {
// const smallestVectorSearch = (vectors, axis, compFn, epsilon) => {
// 	// find the set of all vectors that share the smallest X value within an epsilon
// 	let smallSet = [0];
// 	for (let i = 1; i < vectors.length; i += 1) {
// 		switch (compFn(vectors[smallSet[0]][axis], vectors[i][axis], epsilon)) {
// 		case 0: smallSet.push(i); break;
// 		case 1: smallSet = [i]; break;
// 		default: break;
// 		}
// 	}
// 	return smallSet;
// };
// /**
//  * @description Get the index of the point in an array
//  * considered the absolute minimum. First check the X values,
//  * and in the case of multiple minimums, check the Y values.
//  * If there are more than two points that share both X and Y,
//  * return the first one found.
//  * @param {number[][]} points array of points
//  * @param {number} [epsilon=1e-6] an optional epsilon
//  * @returns {number|undefined} the index of the point in the array with
//  * the smallest component values, or undefined if points is empty.
//  * @linkcode Math ./src/general/search.js 60
//  */
// export const smallestVector2 = (points, epsilon = EPSILON) => {
// // export const minimumPointIndex = (points, epsilon = EPSILON) => {
// 	if (!points || !points.length) { return undefined; }
// 	// find the set of all points that share the smallest X value
// 	// const smallSet = smallestVectorSearch(points, 0, epsilonCompare, epsilon);
// 	// compare each point's x axis only
// 	const comparison = (a, b) => epsilonCompare(a[0], b[0], epsilon);
// 	const smallSet = minimumCluster(points, comparison);
// 	// from this set, find the point with the smallest Y value
// 	let sm = 0;
// 	for (let i = 1; i < smallSet.length; i += 1) {
// 		if (points[smallSet[i]][1] < points[smallSet[sm]][1]) { sm = i; }
// 	}
// 	return smallSet[sm];
// export const minimum2DPointIndex = (points, epsilon = EPSILON) => {
// // export const minimumPointIndex = (points, epsilon = EPSILON) => {
// 	if (!points || !points.length) { return undefined; }
// 	// find the set of all points that share the smallest X value
// 	// const smallSet = smallestVectorSearch(points, 0, epsilonCompare, epsilon);
// 	const smallSet = smallestVectorSearch(points, 0, epsilonCompare, epsilon);
// 	// from this set, find the point with the smallest Y value
// 	let sm = 0;
// 	for (let i = 1; i < smallSet.length; i += 1) {
// 		if (points[smallSet[i]][1] < points[smallSet[sm]][1]) { sm = i; }
// 	}
// 	return smallSet[sm];
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
// };
