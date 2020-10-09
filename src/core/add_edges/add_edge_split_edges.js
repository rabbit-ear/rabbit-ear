import diff from "../diff";
import add_vertices_unique_split_edges from "../add_vertices/add_vertices_unique_split_edges";

const default_edge_options = Object.freeze({
  edges_assignment: "U",
  edges_foldAngle: 0,
});

// when you supply options, include both assignment and foldAngle
// edge is an array of arrays. [ [x1, y1], [x2, y2] ]. can include z components
const add_edge_split_edges = function (graph, edge, options = default_edge_options) {
  const edges_vertices = add_vertices_unique_split_edges(graph, {
    vertices_coords: [[...edge[0]], [...edge[1]]]
  });
  const new_edge = Object.assign({}, options, { edges_vertices })
  return diff.apply(graph, { new: { edges: [ new_edge ] } });
};

export default add_edge_split_edges;

/**
 * this function pairs with fragment and rebuild.
 * it doesn't carefully rebuild the graph with respect to faces or relational
 * geometry, it only cares about vertices_coords and edges_vertices
 */

/**
 * slice across all relevant arrays and return entries at index as one object
 * example: "edges", will grab edges_vertices, edges_assignment, etc...
 * but only at spot "index".
 */
// const copy_properties = (graph, geometry_prefix, index) => {
//   const prefixKeys = get_graph_keys_with_prefix(graph, geometry_prefix);
//   const result = {};
//   prefixKeys.forEach((key) => { result[key] = graph[key][index]; });
//   return result;
// };

/**
 * this modifies vertices_coords, edges_vertices, with no regard to
 * the other arrays - re-build all other edges_, faces_, vertices_
 *
 * runtime is O(n) where n is number of existing vertices
 *
 * this is counting on you to have already verified:
 * - graph.vertices_coords is an array
 * - graph.edges_vertices is an array
 */

/**
 * add_edge will return a { remove, update, new } diff
 *   adding an edge will sometimes create 2-4 new edges
 *   in the case the edge endpoint was edge-collinear
 * when this happens, the new edge will always be index [0]
 *   under the { new } key of the diff
 */

// todo, paramters like: (graph, {options})
// where options contains keys {
//   segment:
// or other ways of constructing. like between vertex indices
