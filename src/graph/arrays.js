/**
 * Rabbit Ear (c) Robby Kraft
 */
/**
 * @description given a list of integers (can contain duplicates),
 * this will return a sorted list of unique integers (set).
 * in the case of duplicates, the input and return arrays will differ in length
 * @param {number[]} array of integers
 * @returns {number[]} set of sorted, unique integers
 */
export const unique_sorted_integers = (array) => {
  const keys = {};
  array.forEach((int) => { keys[int] = true; });
  return Object.keys(keys).map(n => parseInt(n)).sort((a, b) => a - b);
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

