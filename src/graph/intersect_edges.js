/**
 * Rabbit Ear (c) Robby Kraft
 */
import math from "../math";
import { make_edges_vector } from "./make";
import { get_edges_edges_span } from "./span";
/**
 * this method compares every edge against every edge (n^2) to see if the
 * segments exclusively intersect each other (touching endpoints doesn't count)
 *
 * @param {object} FOLD graph. only requires { edges_vector, edges_origin }
 * if they don't exist this will build them from { vertices_coords, edges_vertices }
 *
 * @param {number} (optional) epsilon
 *
 * @returns {number[][][]} NxN matrix comparing indices, undefined in the case of
 * no intersection, a point object in array form if yes, and this array is stored
 * in 2 PLACES! both [i][j] and [j][i], however it is stored by reference,
 * it is the same js object.
 *
 *     0  1  2  3
 * 0 [  , x,  ,  ]
 * 1 [ x,  ,  , x]
 * 2 [  ,  ,  ,  ]
 * 3 [  , x,  ,  ]
 */
export const get_edges_edges_intersections = function ({
  vertices_coords, edges_vertices, edges_vector, edges_origin
}, epsilon = math.core.EPSILON) {
  if (!edges_vector) {
    edges_vector = make_edges_vector({ vertices_coords, edges_vertices });
  }
  if (!edges_origin) {
    edges_origin = edges_vertices.map(ev => vertices_coords[ev[0]]);
  }
  const edges_intersections = edges_vector.map(() => []);
  const span = get_edges_edges_span({ vertices_coords, edges_vertices }, epsilon);
  for (let i = 0; i < edges_vector.length - 1; i += 1) {
    for (let j = i + 1; j < edges_vector.length; j += 1) {
      if (span[i][j] !== true) { continue; }
      edges_intersections[i][j] = math.core.intersect_lines(
        edges_vector[i],
        edges_origin[i],
        edges_vector[j],
        edges_origin[j],
        math.core.exclude_s,
        math.core.exclude_s,
        epsilon
      );
      edges_intersections[j][i] = edges_intersections[i][j];
    }
  }
  return edges_intersections;
};
