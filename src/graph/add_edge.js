import math from "../../include/math";
import { vertices_count, edges_count } from "./query";

// used to be called CreaseSegment

const copy_properties = function (graph, geometry_prefix, index) {
  const prefix = `${geometry_prefix}_`;
  // get all keys like vertices_coords
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
const add_edge = function (graph, a, b, c, d) {
  // the input parameter
  // console.log(graph, a, b, c, d);
  const edge = math.edge(a, b);
  // const edge = math.edge(a, b, c, d);

  // these both change when parts are removed / added
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
        let dup = copy_properties(graph, "edges", endpoints_edge_collinear[i]);
        const new_edges_vertices = [
          { edges_vertices: [graph.edges_vertices[endpoints_edge_collinear[i]][0], vertices_length - 1] },
          { edges_vertices: [graph.edges_vertices[endpoints_edge_collinear[i]][1], vertices_length - 1] }
        ];
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
  return result;
};


/**
 * this modifies vertices_coords, edges_vertices, with no regard to
 * the other arrays - re-build all other edges_, faces_, vertices_
 */
const add_edge_first = function (graph, a, b, c, d) {
  // the input parameter
  // console.log(graph, a, b, c, d);
  const edge = math.edge(a, b);
  // const edge = math.edge(a, b, c, d);

  const vertices_length = vertices_count(graph);
  const edges_length = edges_count(graph);

  const edges = graph.edges_vertices
    .map(ev => ev.map(v => graph.vertices_coords[v]));

  const edge_collinear_a = edges
    .map(e => math.core.point_on_edge(e[0], e[1], edge[0]))
    .map((on_edge, i) => (on_edge ? i : undefined))
    .filter(e => e !== undefined)
    .shift();
  const edge_collinear_b = edges
    .map(e => math.core.point_on_edge(e[0], e[1], edge[1]))
    .map((on_edge, i) => (on_edge ? i : undefined))
    .filter(e => e !== undefined)
    .shift();
  const vertex_equivalent_a = graph.vertices_coords
    .map(v => Math.sqrt(((edge[0][0] - v[0]) ** 2)
                      + ((edge[0][1] - v[1]) ** 2)))
    .map((dist, i) => (dist < math.core.EPSILON ? i : undefined))
    .filter(el => el !== undefined)
    .shift();
  const vertex_equivalent_b = graph.vertices_coords
    .map(v => Math.sqrt(((edge[1][0] - v[0]) ** 2)
                      + ((edge[1][1] - v[1]) ** 2)))
    .map((dist, i) => (dist < math.core.EPSILON ? i : undefined))
    .filter(el => el !== undefined)
    .shift();

  console.log("report", edge_collinear_a,
    edge_collinear_b,
    vertex_equivalent_a,
    vertex_equivalent_b);

  // the new edge
  const edge_vertices = [];
  // don't remove things until very end, make sure indices match
  const edges_to_remove = [];
  // at each new index, which edge did this edge come from
  const edges_index_map = [];

  // if (vertex_equivalent_a !== undefined && vertex_equivalent_b !== undefined) {
  //  let edge_already_exists = graph.edges_vertices.filter(ev =>
  //    (ev[0] === vertex_equivalent_a && ev[1] === vertex_equivalent_b) ||
  //    (ev[0] === vertex_equivalent_b && ev[1] === vertex_equivalent_a)
  //  );
  // if(edge_already_exists.length > 0) {
  //   console.log("found already edge", edge_already_exists);
  //   return;
  // }
  // }

  if (vertex_equivalent_a !== undefined) {
    // easy, assign point
    edge_vertices[0] = vertex_equivalent_a;
  } else {
    // create new vertex
    graph.vertices_coords.push([edge[0][0], edge[0][1]]);
    const vertex_new_index = graph.vertices_coords.length - 1;
    edge_vertices[0] = vertex_new_index;
    if (edge_collinear_a !== undefined) {
      // rebuild old edge with two edges, new vertex inbetween
      edges_to_remove.push(edge_collinear_a);
      const edge_vertices_old = graph.edges_vertices[edge_collinear_a];
      graph.edges_vertices.push([edge_vertices_old[0], vertex_new_index]);
      graph.edges_vertices.push([vertex_new_index, edge_vertices_old[1]]);
      // these new edges came from this old edge
      edges_index_map[graph.edges_vertices.length - 2] = edge_collinear_a;
      edges_index_map[graph.edges_vertices.length - 1] = edge_collinear_a;
    }
  }

  if (vertex_equivalent_b !== undefined) {
    // easy, assign point
    edge_vertices[1] = vertex_equivalent_b;
  } else {
    // create new vertex
    graph.vertices_coords.push([edge[1][0], edge[1][1]]);
    const vertex_new_index = graph.vertices_coords.length - 1;
    edge_vertices[1] = vertex_new_index;
    if (edge_collinear_b !== undefined) {
      // rebuild old edge with two edges, new vertex inbetween
      edges_to_remove.push(edge_collinear_b);
      const edge_vertices_old = graph.edges_vertices[edge_collinear_b];
      graph.edges_vertices.push([edge_vertices_old[0], vertex_new_index]);
      graph.edges_vertices.push([vertex_new_index, edge_vertices_old[1]]);
      // these new edges came from this old edge
      edges_index_map[graph.edges_vertices.length - 2] = edge_collinear_b;
      edges_index_map[graph.edges_vertices.length - 1] = edge_collinear_b;
    }
  }

  // edges_to_remove.sort((a,b) => a-b);
  // for(var i = edges_to_remove.length-1; i >= 0; i--) {
  //  graph.edges_vertices.splice(i, 1);
  // }

  graph.edges_vertices.push(edge_vertices);
  graph.edges_assignment[graph.edges_vertices.length - 1] = "F";

  const diff = {
    edges_new: [graph.edges_vertices.length - 1],
    edges_to_remove,
    edges_index_map
  };
  return diff;

  // return {
  //   new: { vertices: [], edges: [], faces: [] },
  //   remove: { vertices: [], edges: [4], faces: [] },
  //   update: [ // dimension of array matches graph
  //     // empty x 5
  //     { edges_vertices: [5, 6], vertices_vertices: [4, 1] },
  //     // empty x 2
  //     { vertices_vertices: [0, 4] }
  //   ]
  // };

};

// export function crease_folded(graph, point, vector, face_index) {
//  // if face isn't set, it will be determined by whichever face
//  // is directly underneath point. or if none, index 0.
//  if (face_index == null) {
//    face_index = Queries.face_containing_point(graph, point);
//    if(face_index === undefined) { face_index = 0; }
//  }
//  let primaryLine = math.Line(point, vector);
//  let coloring = Graph.faces_coloring(graph, face_index);
//  Makers.make_faces_matrix_inv(graph, face_index)
//    .map(m => primaryLine.transform(m))
//    .reverse()
//    .forEach((line, reverse_i, arr) => {
//      let i = arr.length - 1 - reverse_i;
//      let diff = split_convex_polygon(graph, i, line.point, line.vector, coloring[i] ? "M" : "V");
//    });
// }

export default add_edge;
