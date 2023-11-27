/**
 * Rabbit Ear (c) Kraft
 */
import { EPSILON } from "../math/constant.js";
import { epsilonEqual } from "../math/compare.js";
/**
 * @description mirror an array and join it at the end, except
 * do not duplicate the final element, it should only appear once.
 */
export const mirrorArray = (arr) => arr.concat(arr.slice(0, -1).reverse());
/**
 * @description Given a list of arrays which contain holes, this method
 * will splice all arrays together into one, maintaining indices,
 * filling holes where indices exist. This is intended for the specific
 * case where all arrays originally came from a single array, such as
 * in the subgraph() method, this method will re-join these arrays.
 * In the case where some arrays double up on indices, the index will be
 * overwritten, with no checks to prevent this.
 * @param {...any[]} ...arrays arrays containing any type.
 * @returns {any[]} one array
 */
export const mergeArraysWithHoles = (...arrays) => {
	const flattened = [];
	arrays.forEach(array => array.forEach((value, i) => {
		flattened[i] = value;
	}));
	return flattened;
};
/**
 * @description A circular array (data wraps around) requires 2 indices
 * if you intend to split it into two arrays. The pair of indices can be
 * provided in any order, they will be sorted, smaller index first.
 * @param {any[]} array an array that is meant to be thought of as circular
 * @param {number[]} indices two numbers, indices that divide the array into 2 parts
 * @returns {any[][]} the same array split into two arrays
 * @linkcode Origami ./src/general/arrays.js 49
 */
export const splitCircularArray = (array, indices) => {
	indices.sort((a, b) => a - b);
	return [
		array.slice(indices[1]).concat(array.slice(0, indices[0] + 1)),
		array.slice(indices[0], indices[1] + 1),
	];
};
/**
 * @description Given a list of any type, return a copy of the array
 * with all duplicates removed.
 * @param {number[]} array an array of integers
 * @returns {number[]} set of unique integers
 * @example [1,2,3,2,1] will result in [1,2,3]
 * @linkcode Origami ./src/general/arrays.js 10
 */
export const uniqueElements = (array) => Array.from(new Set(array));
/**
 * @description Given an array of any type, return a copy of
 * the same array but filter out any items which only appear once.
 * The comparison uses conversion-to-string,
 * then matching to compare, so this works for primitives
 * (bool, number, string), not objects or arrays.
 * @param {any[]} array an array of any type.
 * @returns {any[]} the same input array but filtered to
 * remove elements which appear only once.
 * @example [1,2,3,2,1] will result in [1,2,2,1]
 * @linkcode Origami ./src/general/arrays.js 22
 */
export const nonUniqueElements = (array) => {
	const count = {};
	array.forEach(n => {
		if (count[n] === undefined) { count[n] = 0; }
		count[n] += 1;
	});
	return array.filter(n => count[n] > 1);
};
/**
 * @description Given a list of integers (can contain duplicates),
 * this will return a sorted set of unique integers (removing duplicates).
 * @param {number[]} array an array of integers
 * @returns {number[]} set of sorted, unique integers
 * @example [3, 2, 1.5, 2, 3] will result in [1.5, 2, 3]
 * @linkcode Origami ./src/general/arrays.js 38
 */
// export const uniqueSortedNumbers = (array) => uniqueElements(array)
//   .sort((a, b) => a - b);
export const uniqueSortedNumbers = (array) => {
	const hash = {};
	array.forEach(n => { hash[n] = true; });
	return Object.keys(hash).map(parseFloat);
};
/**
 * @description Given an array of numbers, sort the list and
 * filter out any two numbers which are close to each other within
 * an epsilon. The result list may be smaller than the input list.
 * @param {number[]} array an array of numbers.
 * @param {number} [epsilon=1e-6] an optional epsilon.
 * @returns {number[]} a sorted and filtered array of the input array.
 */
export const epsilonUniqueSortedNumbers = (array, epsilon = EPSILON) => {
	const numbers = array.slice().sort((a, b) => a - b);
	if (numbers.length < 2) { return numbers; }
	const keep = [true];
	for (let i = 1; i < numbers.length; i += 1) {
		keep[i] = !epsilonEqual(numbers[i], numbers[i - 1], epsilon);
	}
	return numbers.filter((_, i) => keep[i]);
};
/**
 * @description Return a modified copy of set "a" that filters
 * out any number that exists in set "b". This method assumes that
 * both input arrays are sorted, so this method will run in O(n) time.
 * Numbers are compared within an epsilon range of each other.
 * If arrays are not sorted, sort them before using this method.
 * @param {number[]} a an array of numbers, in sorted order
 * @param {number[]} b an array of numbers, in sorted order
 * @returns {number[]} a copy of "a" with no values found in "b".
 */
export const setDifferenceSortedIntegers = (a, b) => {
	const result = [];
	let ai = 0;
	let bi = 0;
	while (ai < a.length && bi < b.length) {
		if (a[ai] === b[bi]) {
			ai += 1;
			continue;
		}
		if (a[ai] > b[bi]) {
			bi += 1;
			continue;
		}
		if (b[bi] > a[ai]) {
			result.push(a[ai]);
			ai += 1;
			continue;
		}
	}
	return result;
};
/**
 * @description Return a modified copy of set "a" that filters
 * out any number that exists in set "b". This method assumes that
 * both input arrays are sorted, so this method will run in O(n) time.
 * Numbers are compared within an epsilon range of each other.
 * If arrays are not sorted, sort them before using this method.
 * @param {number[]} a an array of numbers, in sorted order
 * @param {number[]} b an array of numbers, in sorted order
 * @returns {number[]} a copy of "a" with no values found in "b".
 */
export const setDifferenceSortedNumbers = (a, b, epsilon = EPSILON) => {
	const result = [];
	let ai = 0;
	let bi = 0;
	while (ai < a.length && bi < b.length) {
		if (epsilonEqual(a[ai], b[bi], epsilon)) {
			ai += 1;
			continue;
		}
		if (a[ai] > b[bi]) {
			bi += 1;
			continue;
		}
		if (b[bi] > a[ai]) {
			result.push(a[ai]);
			ai += 1;
			continue;
		}
	}
	return result;
};
/**
 * @description This will iterate over the array of arrays and returning
 * the first array in the list with the longest length.
 * @param {any[][]} arrays an array of arrays of any type
 * @return {any[]} one of the arrays from the set
 * @linkcode Origami ./src/general/arrays.js 63
 */
// this was used by some faces_layer method not included anymore
// export const getLongestArray = (arrays) => {
// 	if (arrays.length === 1) { return arrays[0]; }
// 	const lengths = arrays.map(arr => arr.length);
// 	let max = 0;
// 	for (let i = 0; i < arrays.length; i += 1) {
// 		if (lengths[i] > lengths[max]) {
// 			max = i;
// 		}
// 	}
// 	return arrays[max];
// };
/**
 * @description convert a list of items {any} into a list of pairs
 * where each item is uniqely matched with another item (non-ordered)
 * the number of pairs is (length * (length-1)) / 2
 * @param {any[]} array an array containing any values
 * @returns {any[][]} an array of arrays, the inner arrays are all length 2
 */
export const chooseTwoPairs = (array) => {
	const pairs = Array((array.length * (array.length - 1)) / 2);
	let index = 0;
	for (let i = 0; i < array.length - 1; i += 1) {
		for (let j = i + 1; j < array.length; j += 1, index += 1) {
			pairs[index] = [array[i], array[j]];
		}
	}
	return pairs;
};
/**
 * @description Return the index of the smallest value in the array.
 * An optional conversion function paramter, if provided, will be run
 * on all elements in the array, then, the minimum-search will be run
 * on the results of this conversion function. If no function is provided,
 * the minimum comparison will be done on the values of the array.
 * @param {any[]} array an array of any type
 * @param {function?} conversion an optional conversion function which
 * converts an element into a scalar value.
 * @returns {number|undefined} an index from the input array, or undefined
 * if the array has no length.
 * @linkcode Math ./src/general/search.js 17
 */
export const arrayMinimum = (array, conversion) => {
	const objs = conversion === undefined
		? array.map((value, i) => ({ i, value }))
		: array.map((value, i) => ({ i, value: conversion(value) }));
	let index;
	let smallest_value = Infinity;
	for (let i = 0; i < objs.length; i += 1) {
		if (objs[i].value < smallest_value) {
			index = i;
			smallest_value = objs[i].value;
		}
	}
	return index;
};
/**
 * @description Given an array, find the index of the minimum value
 * when values are compared using the "<" operator.
 * @param {any[]} array an array of any type which can be compared
 * using the "<" operator, generally this is numbers, or characters.
 * @returns {number} the index of the minimum index.
 */
export const arrayMinIndex = (array) => {
	let index = 0;
	for (let i = 1; i < array.length; i += 1) {
		if (array[i] < array[index]) { index = i; }
	}
	return index;
};
/**
 * @description Given an array, find the index of the maximum value
 * when values are compared using the ">" operator.
 * @param {any[]} array an array of any type which can be compared
 * using the ">" operator, generally this is numbers, or characters.
 * @returns {number} the index of the maximum index.
 */
export const arrayMaxIndex = (array) => {
	let index = 0;
	for (let i = 1; i < array.length; i += 1) {
		if (array[i] > array[index]) { index = i; }
	}
	return index;
};
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
 * @linkcode Origami ./src/general/arrays.js 197
 */
// export const circularArrayValidRanges = (array) => {
// 	// if the array contains no undefineds, return the default state.
// 	const not_undefineds = array.map(el => el !== undefined);
// 	if (not_undefineds.reduce((a, b) => a && b, true)) {
// 		return [[0, array.length - 1]];
// 	}
// 	// mark the location of the first-in-a-list of valid entries.
// 	const first_not_undefined = not_undefineds
// 		.map((el, i, arr) => el && !arr[(i - 1 + arr.length) % arr.length]);
// 	// this is the number of sets we have. will be >= 1
// 	const total = first_not_undefined.reduce((a, b) => a + (b ? 1 : 0), 0);
// 	// the location of the starting index of each contiguous set
// 	const starts = Array(total);
// 	// the length of contiguous each set.
// 	const counts = Array(total).fill(0);
// 	// we want the set that includes index 0 to be listed first,
// 	// if that doesn't exist, the next lowest index should be first.
// 	let index = not_undefineds[0] && not_undefineds[array.length - 1]
// 		? 0
// 		: (total - 1);
// 	not_undefineds.forEach((el, i) => {
// 		index = (index + (first_not_undefined[i] ? 1 : 0)) % counts.length;
// 		counts[index] += not_undefineds[i] ? 1 : 0;
// 		if (first_not_undefined[i]) { starts[index] = i; }
// 	});
// 	return starts.map((s, i) => [s, (s + counts[i] - 1) % array.length]);
// };
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

// export const invert_array = (a) => {
//  const b = [];
//  a.forEach((x, i) => {
//		if (typeof x === "number") { b[x] = i; }
//	});
//  return b;
// };
