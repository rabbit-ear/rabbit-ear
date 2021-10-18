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

