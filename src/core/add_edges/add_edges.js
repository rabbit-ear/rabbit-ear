import {
  transpose_graph_arrays,
} from "../keys";
/**
 * this modifies vertices_coords, edges_vertices, with no regard to
 * the other arrays - re-build all other edges_, faces_, vertices_
 *
 * this is counting on you to have already verified:
 * - graph.vertices_coords is an array
 * - graph.edges_vertices is an array
 */

/**
 * @param {object} a FOLD format object
 * @param {number[][]} edge is an array of arrays.
 *   [ [x1, y1], [x2, y2] ]. can include z components
 */
const add_edges = function (destination, source) {
  // transpose_graph_arrays(source, "edges");
  if (!destination.edges_vertices) { destination.edges_vertices = []; }
  const original_length = destination.edges_vertices.length;
  destination.edges_vertices.push(...source.edges_vertices);
  return source.edges_vertices.map((_, i) => original_length + i);
};

export default add_edges;
