import math from "../../include/math";
import { vertices_count } from "./query";
import { apply_run_diff } from "../fold-through-all/run_frame";
import { get_graph_keys_with_prefix } from "./keys";
import { clone } from "./object";

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
const copy_properties = function (graph, geometry_prefix, index) {
  const prefixKeys = get_graph_keys_with_prefix(graph, geometry_prefix);
  const result = {};
  prefixKeys.forEach((key) => { result[key] = graph[key][index]; });
  return result;
};

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

const add_edge_options = () => ({
  edges_assignment: "U",
  edges_foldAngle: 0,
});

// when you supply options, include both assignment and foldAngle
const add_edge = function (graph, a, b, c, d, options = add_edge_options()) {
  const edge = math.segment(a, b, c, d);

  // find a matching (epsilon) pre-existing vertex, if it exists.
  const endpoints_vertex_equivalent = [0, 1].map(ei => graph.vertices_coords
    .map(v => Math.sqrt(((edge[ei][0] - v[0]) ** 2)
                      + ((edge[ei][1] - v[1]) ** 2)))
    .map((dist, i) => (dist < math.core.EPSILON ? i : undefined))
    .filter(el => el !== undefined)
    .shift());

  // determine if either of the two points lies on a pre-existing edge
  // create line segments from edges
  const edges = graph.edges_vertices
    .map(ev => ev.map(v => graph.vertices_coords[v]));
  const endpoints_edge_collinear = [0, 1].map(ei => edges
    .map(e => math.core.point_on_segment(e[0], e[1], edge[ei]))
    .map((on_edge, i) => (on_edge ? i : undefined))
    .filter(e => e !== undefined)
    .shift());

  // 1. if endpoint matches a vertex, use the vertex
  // 2. only then, if an endpoint lies on an edge, split the edge. this is
  //   because edges register collinear in the case of 1.
  // 3. if none of the cases above, the endpoint is a new vertex
  const vertices_origin = [0, 1].map((i) => {
    if (endpoints_vertex_equivalent[i] !== undefined) { return "vertex"; }
    if (endpoints_edge_collinear[i] !== undefined) { return "edge"; }
    return "new";
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

  let vertices_length = vertices_count(graph);

  const append_vertex = function (i) {
    result.new.vertices.push({
      vertices_coords: [edge[i][0], edge[i][1]]
    });
    vertices_length += 1;
    result.new.edges[0].edges_vertices[i] = vertices_length - 1;
  };

  [0, 1].forEach((i) => {
    switch (vertices_origin[i]) {
      case "vertex":
        result.new.edges[0].edges_vertices[i] = endpoints_vertex_equivalent[i];
        break;
      case "edge": {
        append_vertex(i);
        // add 2 new edges. from the new vertex to each old endpoint
        const e = copy_properties(graph, "edges", endpoints_edge_collinear[i]);
        [clone(e), clone(e)].forEach((o, j) => {
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
      // "new"
      default: append_vertex(i); break;
    }
  });
  // set all new edges to unassigned
  const option_keys = Object.keys(options);
  result.new.edges
    .forEach(e => option_keys
      .filter(key => e[key] === undefined)
      .forEach((key) => { e[key] = options[key]; }));

  return apply_run_diff(graph, result);
  // result.apply = () => apply_run_diff(graph, result);
  // return result;
};

export default add_edge;
