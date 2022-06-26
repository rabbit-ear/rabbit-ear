/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description Given a list of integers (can contain duplicates),
 * this will return only the unique integers (removing duplicates).
 * @param {number[]} array an array of integers
 * @returns {number[]} set of unique integers
 */
export const uniqueIntegers = (array) => {
	const keys = {};
	array.forEach((int) => { keys[int] = true; });
	return Object.keys(keys).map(n => parseInt(n));
};
/**
 * @description Given a list of integers (can contain duplicates),
 * this will return a sorted set of unique integers (removing duplicates).
 * note: this sort appears to be unnecessary, as Object.keys() returns them
 * in sorted order *sometimes*, but this is not strictly defined.
 * @param {number[]} array an array of integers
 * @returns {number[]} set of sorted, unique integers
 */
export const uniqueSortedIntegers = (array) => uniqueIntegers(array)
	.sort((a, b) => a - b);
/**
 * @description A circular array (data wraps around) requires 2 indices if you intend to split it into two arrays. The "indices" parameter will be sorted, smaller index first.
 * @param {any[]} array an array that is meant to be thought of as circular
 * @param {number[]} indices two numbers, indices that divide the array into 2 parts
 * @returns {any[][]} the same array split into two arrays
 */
export const splitCircularArray = (array, indices) => {
	indices.sort((a, b) => a - b);
	return [
		array.slice(indices[1]).concat(array.slice(0, indices[0] + 1)),
		array.slice(indices[0], indices[1] + 1)
	];
};
/**
 * @description This will iterate over the array of arrays and returning
 * the first array in the list with the longest length.
 * @param {any[][]} arrays an array of arrays of any type
 * @return {any[]} one of the arrays from the set
 */
export const getLongestArray = (arrays) => {
	if (arrays.length === 1) { return arrays[0]; }
	const lengths = arrays.map(arr => arr.length);
	let max = 0;
	for (let i = 0; i < arrays.length; i++) {
		if (lengths[i] > lengths[max]) {
			max = i;
		}
	}
	return arrays[max];
};
/**
 * @description Given an array of any type, return the same array but filter
 * out any items which only appear once. The comparison uses conversion-to-string then
 * matching to compare, so this works for primitives (bool, number, string) not objects or arrays.
 * @param {any[]} array an array of any type.
 * @returns {any[]} the same input array but filtered to remove elements which appear only once.
 */
export const removeSingleInstances = (array) => {
	const count = {};
	array.forEach(n => {
		if (count[n] === undefined) { count[n] = 0; }
		count[n]++;
	});
	return array.filter(n => count[n] > 1);
};
/**
 * @description Convert a sparse or dense matrix containing true/false/undefined
 * into arrays containing the indices `[i,j]` of all true values.
 * @param {Array<Array<boolean|undefined>>} matrix a 2D matrix containing boolean or undefined
 * @returns {number[][]} array of arrays of numbers
 */
export const booleanMatrixToIndexedArray = matrix => matrix
	.map(row => row
		.map((value, i) => value === true ? i : undefined)
		.filter(a => a !== undefined));
/**
 * @description consult the upper right half triangle of the matrix,
 * find all truthy values, gather the row/column index pairs,
 * return them as pairs of indices in a single array.
 * Triangle number, only visit half the indices. make unique pairs
 * @param {any[][]} matrix a matrix containing any type
 * @returns {number[][]} array of pairs of numbers, the pairs of indices
 * which are truthy in the matrix.
 */
export const booleanMatrixToUniqueIndexPairs = matrix => {
	const pairs = [];
	for (let i = 0; i < matrix.length - 1; i++) {
		for (let j = i + 1; j < matrix.length; j++) {
			if (matrix[i][j]) {
				pairs.push([i, j]);
			}
		}
	}
	return pairs;
}
/**
 * @description given a self-relational array of arrays, for example,
 * vertices_vertices, edges_edges, faces_faces, where the values in the
 * inner arrays relate to the indices of the outer array, create collection groups
 * where each item is included in a group if it points to another member
 * in that group.
 * @param {number[][]} matrix an array of arrays of numbers
 * @returns {number[][]} groups of the indices where each index appears only once
 */
export const makeSelfRelationalArrayClusters = (matrix) => {
	const groups = [];
	const recurse = (index, current_group) => {
		if (groups[index] !== undefined) { return 0; }
		groups[index] = current_group;
		matrix[index].forEach(i => recurse(i, current_group));
		return 1; // increment group # for next round
	}
	for (let row = 0, group = 0; row < matrix.length; row++) {
		if (!(row in matrix)) { continue; }
		group += recurse(row, group);
	}
	return groups;
};
/**
 * @description convert a list of items {any} into a list of pairs
 * where each item is uniqely matched with another item (non-ordered)
 * the length is a triangle number, ie: 6 + 5 + 4 + 3 + 2 + 1
 * (length * (length-1)) / 2
 */
// export const makeTrianglePairs = (array) => {
// 	const pairs = Array((array.length * (array.length - 1)) / 2);
// 	let index = 0;
// 	for (let i = 0; i < array.length - 1; i++) {
// 		for (let j = i + 1; j < array.length; j++, index++) {
// 			pairs[index] = [array[i], array[j]];
// 		}
// 	}
// 	return pairs;
// };
/**
 * @description given an array containing undefineds, gather all contiguous
 * series of valid entries, and return the list of their indices in the form
 * of [start_index, final_index].
 * @param {any[]} array the array which is allowed to contain holes
 * @returns {number[][]} array containing pairs of numbers
 * @example
 * circularArrayValidRanges([0, 1, undefined, 2, 3, 4, undefined, undefined, 5])
 * // will return
 * [ [8, 1], [3, 5] ]
 */
export const circularArrayValidRanges = (array) => {
	// if the array contains no undefineds, return the default state.
	const not_undefineds = array.map(el => el !== undefined);
	if (not_undefineds.reduce((a, b) => a && b, true)) {
		return [[0, array.length - 1]];
	}
	// mark the location of the first-in-a-list of valid entries.
	const first_not_undefined = not_undefineds
		.map((el, i, arr) => el && !arr[(i - 1 + arr.length) % arr.length]);
	// this is the number of sets we have. will be >= 1
	const total = first_not_undefined.reduce((a, b) => a + (b ? 1 : 0), 0);
	// the location of the starting index of each contiguous set
	const starts = Array(total);
	// the length of contiguous each set.
	const counts = Array(total).fill(0);
	// we want the set that includes index 0 to be listed first,
	// if that doesn't exist, the next lowest index should be first.
	let index = not_undefineds[0] && not_undefineds[array.length-1]
		? 0
		: (total - 1);
	not_undefineds.forEach((el, i) => {
		index = (index + (first_not_undefined[i] ? 1 : 0)) % counts.length;
		counts[index] += not_undefineds[i] ? 1 : 0;
		if (first_not_undefined[i]) { starts[index] = i; }
	});
	return starts.map((s, i) => [s, (s + counts[i] - 1) % array.length]);
};
/**
 * @description given an array containing undefineds, starting at index 0,
 * walk backwards (circularly around) to find the first index that isn't
 * undefined. similarly, from 0 increment to the final index that isn't
 * undefined. no undefineds results in [0, length].
 * @param {any[]} the array, which possibly contains holes
 * @param {number} the length of the array. this is required because
 * it's possible that the holes exist at the end of the array,
 * causing it to misreport the (intended) length.
 */
// const circularArrayValidRange = (array, array_length) => {
//   let start, end;
//   for (start = array_length - 1;
//     start >= 0 && array[start] !== undefined;
//     start--);
//   start = (start + 1) % array_length;
//   for (end = 0;
//     end < array_length && array[end] !== undefined;
//     end++);
//   return [start, end];
// };

// this is now "invertSimpleMap" in maps.js
// export const invert_array = (a) => {
// 	const b = [];
// 	a.forEach((n, i) => { b[n] = i; });
// 	return b;
// };

//export const invert_array = (a) => {
//  const b = [];
//  a.forEach((x, i) => {
//		if (typeof x === "number") { b[x] = i; }
//	});
//  return b;
//};

