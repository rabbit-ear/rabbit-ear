import math from "../../include/math";
import { vertices_count } from "./query";
import { apply_run_diff } from "../fold-through-all/run_frame";

// used to be called CreaseSegment

/**
 * this function pairs well with fragment and rebuild.
 * it doesn't carefully rebuild the graph with respect to faces or relational
 * geometry, it only cares about vertices_coords and edges_vertices
 */

/**
 * slice across all relevant arrays and return entries at index as one object
 * example: "edges", will grab edges_vertices, edges_assignment, etc...
 * but only at spot "index".
 */
const copy_properties = function (graph, geometry_prefix, index) {
  const prefix = `${geometry_prefix}_`;
  const prefixKeys = Object.keys(graph)
    .map(str => (str.substring(0, prefix.length) === prefix ? str : undefined))
    .filter(str => str !== undefined);
  const result = {};
  prefixKeys.forEach((key) => { result[key] = graph[key][index]; });
  return result;
};

/**
 * this modifies vertices_coords, edges_vertices, with no regard to
 * the other arrays - re-build all other edges_, faces_, vertices_
 */
const add_edge = function (graph, a, b, c, d, assignment = "U") {
  const edge = math.segment(a, b, c, d);

  // this changes when parts are removed / added
  let vertices_length = vertices_count(graph);

  const edges = graph.edges_vertices
    .map(ev => ev.map(v => graph.vertices_coords[v]));

  const endpoints_vertex_equivalent = [0, 1].map(ei => graph.vertices_coords
    .map(v => Math.sqrt(((edge[ei][0] - v[0]) ** 2)
                      + ((edge[ei][1] - v[1]) ** 2)))
    .map((dist, i) => (dist < math.core.EPSILON ? i : undefined))
    .filter(el => el !== undefined)
    .shift());

  const endpoints_edge_collinear = [0, 1].map(ei => edges
    .map(e => math.core.point_on_edge(e[0], e[1], edge[ei]))
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

  const result = {
    new: { vertices: [], edges: [{ edges_vertices: [] }] }, // edge index 0 is our new main edge
    remove: { edges: [] }
  };

  [0, 1].forEach((i) => {
    switch (vertices_origin[i]) {
      case "vertex":
        result.new.edges[0].edges_vertices[i] = endpoints_vertex_equivalent[i];
        break;
      case "edge":
        // add new vertex
        result.new.vertices.push({
          vertices_coords: [edge[i][0], edge[i][1]]
        });
        vertices_length += 1;
        result.new.edges[0].edges_vertices[i] = vertices_length - 1;
        // add 2 new edges. from the new vertex to each old endpoint
        const dup = copy_properties(graph, "edges", endpoints_edge_collinear[i]);
        const new_edges_vertices = [{
          edges_vertices: [
            graph.edges_vertices[endpoints_edge_collinear[i]][0],
            vertices_length - 1]
        }, {
          edges_vertices: [
            graph.edges_vertices[endpoints_edge_collinear[i]][1],
            vertices_length - 1]
        }];
        result.new.edges.push(
          Object.assign(Object.assign({}, dup), new_edges_vertices[0]),
          Object.assign(Object.assign({}, dup), new_edges_vertices[1])
        );
        // remove edge
        result.remove.edges.push(endpoints_edge_collinear[i]);
        break;
      default: // new
        // add new vertex
        result.new.vertices.push({
          vertices_coords: [edge[i][0], edge[i][1]]
        });
        vertices_length += 1;
        result.new.edges[0].edges_vertices[i] = vertices_length - 1;
        break;
    }
  });
  // set all new edges to unassigned.
  result.new.edges
    .filter(e => e.edges_assignment === undefined)
    .forEach((e) => { e.edges_assignment = assignment; });
  result.apply = () => apply_run_diff(graph, result);
  return result;
};

export default add_edge;
