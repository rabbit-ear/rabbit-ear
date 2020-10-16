import math from "../math";
/**
 * @param {object} FOLD graph
 * @param {number[]} an array of vertex indices to be sorted
 * @param {number} the origin vertex, around which the vertices will be sorted
 */
export const sort_vertices_counter_clockwise = ({ vertices_coords }, vertices, vertex) => vertices
  .map(v => vertices_coords[v])
  .map(coord => math.core.subtract(coord, vertices_coords[vertex]))
  .map(vec => Math.atan2(vec[1], vec[0]))
  // optional line, this makes the cycle loop start/end along the +X axis
  .map(angle => angle > -math.core.EPSILON ? angle : angle + Math.PI * 2)
  .map((a, i) => ({a, i}))
  .sort((a, b) => a.a - b.a)
  .map(el => el.i)
  .map(i => vertices[i]);
