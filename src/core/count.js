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

export default {
  vertices: ({ vertices_coords, vertices_faces, vertices_vertices }) =>
    max_arrays_length(vertices_coords, vertices_faces, vertices_vertices),
  edges: ({ edges_vertices, edges_edges, edges_faces }) =>
    max_arrays_length(edges_vertices, edges_edges, edges_faces),
  faces: ({ faces_vertices, faces_edges, faces_faces }) =>
    max_arrays_length(faces_vertices, faces_edges, faces_faces),
};
