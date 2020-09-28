import math from "../math";
import count from "./count";
import diff from "./diff";
import {
  get_graph_keys_with_prefix,
  transpose_graph_array_at_index,
} from "./keys";
import { clone } from "./javascript";

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

const default_edge_options = Object.freeze({
  edges_assignment: "U",
  edges_foldAngle: 0,
});

// when you supply options, include both assignment and foldAngle
// edge is an array of arrays. [ [x1, y1], [x2, y2] ]. can include z components
const add_edge_split_edges = function (graph, edge, options = default_edge_options) {
  // const edge = math.segment(a, b, c, d);

  // compare these two new vertices against every existing vertex,
  // find a matching (epsilon) pre-existing vertex, if it exists.
  // match with the first instance, not necessarily the closest.
  const endpoints_vertex_equivalent = [0, 1].map(ei => graph.vertices_coords
    .map(v => math.core.distance(v, edge[ei]) < math.core.EPSILON)
    .map((on_vertex, i) => on_vertex ? i : undefined)
    .filter(a => a !== undefined)
    .shift());

  // determine if either of the two points lies on a pre-existing edge
  // create line segments from edges
  const edges = graph.edges_vertices
    .map(ev => ev.map(v => graph.vertices_coords[v]));
  const endpoints_edge_collinear = [0, 1].map(ei => edges
    .map(e => math.core.point_on_segment_exclusive(edge[ei], e[0], e[1]))
    .map((on_edge, i) => (on_edge ? i : undefined))
    .filter(a => a !== undefined)
    .shift());

  // classify the edge's endpoints:
  // 1. existing vertex in the graph
  // 2. collinear to an edge (needs to split the edge, new vertex)
  // 3. isolated. a new vertex, not touching any existing part of the graph.
  const vertices_origin = [0, 1].map((i) => {
    if (endpoints_vertex_equivalent[i] !== undefined) { return "vertex"; }
    if (endpoints_edge_collinear[i] !== undefined) { return "edge"; }
    return "isolated";
  });

  // possible number of new vertices can be 0, 1, 2
  // possible number of new edges can be 1, 2, 3, 4, 5
  // possible number of removed edges can be 0, 1, 2
  const result = {
    new: {
      vertices: [],
      edges: [
        { edges_vertices: [] } // edge index 0 is the new main edge
      ]
    },
    remove: { edges: [] }
  };

  let vertices_length = count.vertices(graph);

  const append_vertex = (i) => {
    // add a new vertex to the graph, set our new edge's
    // edges_vertices vertex to this new vertex's index.
    result.new.vertices.push({ vertices_coords: [...edge[i]] });
    result.new.edges[0].edges_vertices[i] = vertices_length;
    vertices_length += 1;
  };

  [0, 1].forEach((i) => {
    switch (vertices_origin[i]) {
      case "vertex":
        // vertex already exists. just point our edge's endpoint to its index.
        result.new.edges[0].edges_vertices[i] = endpoints_vertex_equivalent[i];
        break;
      case "isolated":
        // add the new vertex, point the edge's edges_vertices to the new index
        append_vertex(i);
        break;
      case "edge": {
        // add the new vertex, point the edge's edges_vertices to the new index
        append_vertex(i);
        // add 2 new edges. from the new vertex to each old endpoint
        // before we remove an edge, copy over its attributes
        // (foldAngle, assignment...)
        const e = transpose_graph_array_at_index(graph, "edges", endpoints_edge_collinear[i]);
        // const e = copy_properties(graph, "edges", endpoints_edge_collinear[i]);
        [e, clone(e)].forEach((o, j) => {
          o.edges_vertices = [
            graph.edges_vertices[endpoints_edge_collinear[i]][j],
            vertices_length - 1
          ];
          result.new.edges.push(o);
        });
        // remove edge
        result.remove.edges.push(endpoints_edge_collinear[i]);
      }
        break;
      default: break;
    }
  });
  // set all new edges to unassigned
  const option_keys = Object.keys(options);
  result.new.edges
    .forEach(e => option_keys
      .filter(key => e[key] === undefined)
      .forEach((key) => { e[key] = options[key]; }));

  return diff.apply(graph, result);
  // result.apply = () => diff.apply(graph, result);
  // return result;
};

export default add_edge_split_edges;
