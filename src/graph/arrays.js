/**
 * Rabbit Ear (c) Robby Kraft
 */
/**
 * @description given a list of integers (can contain duplicates),
 * this will return a sorted set of unique integers (removing duplicates).
 * @param {number[]} array of integers
 * @returns {number[]} set of sorted, unique integers
 */
export const unique_sorted_integers = (array) => {
  const keys = {};
  array.forEach((int) => { keys[int] = true; });
  return Object.keys(keys).map(n => parseInt(n)).sort((a, b) => a - b);
};
/**
 * @description a circular array (data wraps around) needs 2 indices to be split.
 * "indices" will be sorted, smaller index first.
 * @param {any[]} an array that is meant to be thought of as circular
 * @param {number[]} two numbers, indices that divide the array into 2 parts.
 * @returns {any[][]} the same array split into two portions, inside an array.
 */
export const split_circular_array = (array, indices) => {
  indices.sort((a, b) => a - b);
  return [
    array.slice(indices[1]).concat(array.slice(0, indices[0] + 1)),
    array.slice(indices[0], indices[1] + 1)
  ];
};
/**
 * @description given an array containing undefineds, gather all contiguous
 * series of valid entries, and return the list of their indices in the form
 * of [start_index, final_index].
 * For example [0, 1, undefined, 2, 3, 4, undefined, undefined, 5]
 * will return two entries: [ [8, 1], [3, 5] ]
 * @param {any[]} the array, which possibly contains holes
 */
export const circular_array_valid_ranges = (array) => {
  // if the array contains no undefineds, return the default state.
  const not_undefineds = array.map(el => el !== undefined);
  if (not_undefineds.reduce((a, b) => a && b, true)) {
    return [[0, array.length]];
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
// const circular_array_valid_range = (array, array_length) => {
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

// this is now "invert_simple_map" in maps.js
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

