
// /////////////////////
// big untested change below: key => key !== "i"
// /////////////////////

// /**
//  * these should trigger a re-build on the other arrays
//  */
// export const new_vertex = function (graph, x, y) {
//   if (graph.vertices_coords === undefined) { return undefined; }
//   const vertices_count = graph.vertices_coords.length;
//   graph.vertices_coords[vertices_count] = [x, y];
//   return vertices_count;
//   // // mark unclean data
//   // unclean.vertices_vertices[new_index] = true;
//   // unclean.vertices_faces[new_index] = true;
// };

// export const new_edge = function (graph, node1, node2) {
//   if (graph.edges_vertices === undefined) { return undefined; }
//   const edges_count = graph.edges_vertices.length;
//   graph.edges_vertices[edges_count] = [node1, node2];
//   return edges_count;
//   // // mark unclean data
//   // unclean.edges_vertices[new_index] = true;
//   // unclean.edges_faces[new_index] = true;
//   // unclean.edges_assignment[new_index] = true;
//   // unclean.edges_foldAngle[new_index] = true;
//   // unclean.edges_length[new_index] = true;
// };
