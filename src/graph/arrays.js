/**
 * Rabbit Ear (c) Robby Kraft
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

