import math from "../math";
/**
 * two varieties: vectors, radians, with a very important difference!:
 *
 * 1. the vectors describe the direction of the segment (length doesn't matter)
 * 2. the angles in radians are the INTERIOR ANGLES between the segments, not
 * the radians form of the vectors in case 1.
 *
 * case 2. is generally the faster way, vectors have to be turned into interior
 * angles.
 */

/**
 * sums is 2 arrays, array filtered into even and odd, summed
 *
 */
export const kawasaki_sector_score = (angles) => math.core.alternating_sum(angles)
  .map(a => (a < 0 ? a + Math.PI * 2 : a))
  .map(s => Math.PI - s);

// export const kawasaki_from_even_vectors = function (...vectors) {
//   return kawasaki_sector_score(...interior_angles(...vectors));
// };

/**
 * @param {number[]} the angle of the edges in radians, like vectors around a vertex
 * @returns {number[]} for every sector, 
 */
export const kawasaki_solutions_radians = (radians) => radians
  // counter clockwise angle between this index and the next
  .map((v, i, arr) => [v, arr[(i + 1) % arr.length]])
  .map(pair => math.core.counter_clockwise_angle_radians(...pair))
  // for every sector, make an array of all the OTHER sectors
  .map((_, i, arr) => arr.slice(i + 1, arr.length).concat(arr.slice(0, i)))
  // for every sector, use the sector score from the OTHERS two to split it
  .map(opposite_sectors => kawasaki_sector_score(opposite_sectors))
  .map((kawasakis, i) => radians[i] + kawasakis[0])
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
