/**
 * Rabbit Ear (c) Robby Kraft
 */
import { get_graph_keys_with_prefix } from "./fold_spec";
/*
 * Get the number of vertices, edges, or faces in the graph.
 *
 * This will fail in the case of abstract graphs, for example where no vertices
 * are defined in any vertex_ array but only exist as mentions in faces_vertices.
 * In that case, use the implied count method.
 * "count_implied.js"
 *
 * @returns {number} number of geometry elements
 */
const max_arrays_length = (...arrays) => Math.max(0, ...(arrays
  .filter(el => el !== undefined)
  .map(el => el.length)));
/**
 * the default export
 * a general count method, will count anything key that begins a "_" key name.
 *
 * @param {object} a FOLD graph
 * @param {string} the prefix for a key, eg "vertices" for "vertices_coords"
 */
const count = (graph, key) => max_arrays_length(...get_graph_keys_with_prefix(graph, key).map(key => graph[key]));
// standard graph components
count.vertices = ({ vertices_coords, vertices_faces, vertices_vertices }) =>
  max_arrays_length(vertices_coords, vertices_faces, vertices_vertices);
count.edges = ({ edges_vertices, edges_edges, edges_faces }) =>
  max_arrays_length(edges_vertices, edges_edges, edges_faces);
count.faces = ({ faces_vertices, faces_edges, faces_faces }) =>
  max_arrays_length(faces_vertices, faces_edges, faces_faces);

export default count;
