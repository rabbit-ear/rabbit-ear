/**
 * Rabbit Ear (c) Robby Kraft
 */
import math from "../math";
import { fn_add } from "../symbols/functions";
/**
 * @description given a list of numbers this method will sort them by
 *  even and odd indices and sum the two categories, returning two sums.
 * @param {number[]} one list of numbers
 * @returns {number[]} one array of two sums, even and odd indices
 */
export const alternating_sum = (numbers) => [0, 1]
  .map(even_odd => numbers
    .filter((_, i) => i % 2 === even_odd)
    .reduce(fn_add, 0));
/**
 * @description alternating_sum, filter odd and even into two categories, then
 *  then set them to be the deviation from the average of the sum.
 * @param {number[]} one list of numbers
 * @returns {number[]} one array of two numbers. if both alternating sets sum
 *  to the same, the result will be [0, 0]. if the first set is 2 more than the
 *  second, the result will be [1, -1]. (not [2, 0] or something with a 2 in it)
 */
export const alternating_sum_difference = (sectors) => {
  const halfsum = sectors.reduce(fn_add, 0) / 2;
  return alternating_sum(sectors).map(s => s - halfsum);
};

// export const kawasaki_from_even_vectors = function (...vectors) {
//   return alternating_deviation(...interior_angles(...vectors));
// };
/**
 * @param {number[]} the angle of the edges in radians, like vectors around a vertex
 * @returns {number[]} for every sector,
 * this is hard coded to work for flat-plane, where sectors sum to 360deg
 */
export const kawasaki_solutions_radians = (radians) => radians
  // counter clockwise angle between this index and the next
  .map((v, i, arr) => [v, arr[(i + 1) % arr.length]])
  .map(pair => math.core.counter_clockwise_angle_radians(...pair))
  // for every sector, make an array of all the OTHER sectors
  .map((_, i, arr) => arr.slice(i + 1, arr.length).concat(arr.slice(0, i)))
  // for every sector, use the sector score from the OTHERS two to split it
  .map(opposite_sectors => alternating_sum(opposite_sectors).map(s => Math.PI - s))
  // add the deviation to the edge to get the absolute position
  .map((kawasakis, i) => radians[i] + kawasakis[0])
  // sometimes this results in a solution OUTSIDE the sector. ignore these
  .map((angle, i) => (math.core.is_counter_clockwise_between(angle,
    radians[i], radians[(i + 1) % radians.length])
    ? angle
    : undefined));
// or should we remove the indices so the array reports [ empty x2, ...]

export const kawasaki_solutions = (vectors) => {
  const vectors_radians = vectors.map(v => Math.atan2(v[1], v[0]));
  return kawasaki_solutions_radians(vectors_radians)
    .map(a => (a === undefined
      ? undefined
      : [Math.cos(a), Math.sin(a)]));
};
