/**
 * Rabbit Ear (c) Kraft
 */
import { EPSILON } from "../math/constant.js";
import { parallel } from "../math/vector.js";
/**
 * @description Sort and cluster a list of elements and return the first
 * cluster only. Because we are only getting the first, no other clusters
 * are constructed during the operation of this method. The sorting uses
 * a comparison function which returns -1,0,+1 for comparisons, and the first
 * cluster is the first group which among each other return 0, but compared
 * to every other item returns -1. The input array can be unsorted.
 * @param {any[]} elements an array of any objects
 * @param {function} comparison a function which accepts two paramters, type
 * matching the any[] parameter, which returns -1, 0, or +1.
 * @returns {array[]} an array of indices, indices of the "elements" array
 */
export const minimumCluster = (elements, comparison) => {
	// find the set of all vectors that share the smallest X value within an epsilon
	let smallSet = [0];
	for (let i = 1; i < elements.length; i += 1) {
		switch (comparison(elements[smallSet[0]], elements[i])) {
		case 0: smallSet.push(i); break;
		case 1: smallSet = [i]; break;
		default: break;
		}
	}
	return smallSet;
};
/**
 * @description Given a list of sorted generic type elements, cluster
 * similar values where similarity is determined by a comparison function,
 * and comparisons only need to happen to neighbors due to the array
 * already being sorted.
 * For example, if the elements are 3D points all along a line, they should
 * be pre-sorted, then the comparison function should take two point
 * parameters and compares them and returns true if they are similar. This
 * will cluster the point indices into groups of points with similar locations.
 */
export const clusterSortedGeneric = (elements, comparison) => {
	if (!elements.length) { return []; }
	const indices = elements.map((_, i) => i);
	const groups = [[indices[0]]];
	for (let i = 1; i < indices.length; i += 1) {
		const index = indices[i];
		if (index === undefined) { continue; }
		const g = groups.length - 1;
		const prev = groups[g][groups[g].length - 1];
		if (comparison(elements[prev], elements[index])) {
			groups[g].push(index);
		} else {
			groups.push([index]);
		}
	}
	return groups;
};
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
// export const clusterIndicesOfSortedNumbers = (numbers, epsilon = EPSILON) => {
// 	const clusters = [[0]];
// 	let clusterIndex = 0;
// 	for (let i = 1; i < numbers.length; i += 1) {
// 		// if this scalar fits inside the current cluster
// 		if (epsilonEqual(numbers[i], numbers[i - 1], epsilon)) {
// 			clusters[clusterIndex].push(i);
// 		} else {
// 			clusterIndex = clusters.length;
// 			clusters.push([i]);
// 		}
// 	}
// 	return clusters;
// };
/**
 * @description Given an array of floats, make a sorted copy of the array,
 * then walk through the array and group similar values into clusters.
 * Cluster epsilon is relative to the nearest neighbor, not the start
 * of the group or some other metric, so for example, the values
 * [1, 2, 3, 4, 5] will all be in one cluster if the epsilon is 1.5.
 * @param {number[]} floats an array of numbers
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][]} array of array of indices to the input array.
 */
export const clusterScalars = (numbers, epsilon = EPSILON) => {
	const indices = numbers
		.map((v, i) => ({ v, i }))
		.sort((a, b) => a.v - b.v)
		.map(el => el.i);
	const sortedNumbers = indices.map(i => numbers[i]);
	const compFn = (a, b) => Math.abs(a - b) < epsilon;
	return clusterSortedGeneric(sortedNumbers, compFn)
		.map(arr => arr.map(i => indices[i]));
};
// export const clusterScalars = (floats, epsilon = EPSILON) => {
// 	const indices = floats
// 		.map((v, i) => ({ v, i }))
// 		.sort((a, b) => a.v - b.v)
// 		.map(el => el.i);
// 	const groups = [[indices[0]]];
// 	for (let i = 1; i < indices.length; i += 1) {
// 		const index = indices[i];
// 		const g = groups.length - 1;
// 		const prev = groups[g][groups[g].length - 1];
// 		if (Math.abs(floats[prev] - floats[index]) < epsilon) {
// 			groups[g].push(index);
// 		} else {
// 			groups.push([index]);
// 		}
// 	}
// 	return groups;
// };
/**
 * @description Given an array of vectors, group the vectors into clusters
 * that all contain vectors which are parallel to one another.
 * This works for any N-dimensional vectors (including 3D or 2D).
 * Note, this is an n^2 algorithm. Currently it's used by the method
 * getEdgesLine to find all unique lines in a graph, which initially clusters
 * lines by distance-to-origin, then INSIDE each cluster this method is called,
 * reducing the total number of comparisons to below n^2.
 * Similar optimization should be performed when using this, if possible.
 */
export const clusterParallelVectors = (vectors, epsilon = EPSILON) => {
	const groups = [[0]];
	for (let i = 1; i < vectors.length; i += 1) {
		let found = false;
		for (let g = 0; g < groups.length; g += 1) {
			const groupFirstIndex = groups[g][0];
			if (parallel(vectors[i], vectors[groupFirstIndex], epsilon)) {
				groups[g].push(i);
				found = true;
				break;
			}
		}
		// make a new group, with this vector inside
		if (!found) {
			groups.push([i]);
		}
	}
	return groups;
};
