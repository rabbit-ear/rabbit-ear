// boundary detection, removal, cleanup

import { get_isolated_vertices } from "./query";
import { make_vertices_edges } from "./make";
import remove from "./remove";

export const bounding_rect = function ({ vertices_coords }) {
  if (vertices_coords == null
    || vertices_coords.length <= 0) {
    return [0, 0, 0, 0];
  }
  const dimension = vertices_coords[0].length;
  const min = Array(dimension).fill(Infinity);
  const max = Array(dimension).fill(-Infinity);
  vertices_coords.forEach(v => v.forEach((n, i) => {
    if (n < min[i]) { min[i] = n; }
    if (n > max[i]) { max[i] = n; }
  }));
  return (isNaN(min[0]) || isNaN(min[1]) || isNaN(max[0]) || isNaN(max[1])
    ? [0, 0, 0, 0]
    : [min[0], min[1], max[0] - min[0], max[1] - min[1]]);
};

/**
 * get the boundary face defined in vertices and edges by walking boundary
 * edges, defined by edges_assignment. no planar calculations
 */
export const get_boundary = function (graph) {
  if (graph.edges_assignment == null) { return { vertices: [], edges: [] }; }
  const edges_vertices_b = graph.edges_assignment
    .map(a => a === "B" || a === "b");
  const vertices_edges = make_vertices_edges(graph);
  const edge_walk = [];
  const vertex_walk = [];
  let edgeIndex = -1;
  for (let i = 0; i < edges_vertices_b.length; i += 1) {
    if (edges_vertices_b[i]) { edgeIndex = i; break; }
  }
  if (edgeIndex === -1) {
    return { vertices: [], edges: [] };
  }
  edges_vertices_b[edgeIndex] = false;
  edge_walk.push(edgeIndex);
  vertex_walk.push(graph.edges_vertices[edgeIndex][0]);
  let nextVertex = graph.edges_vertices[edgeIndex][1];
  while (vertex_walk[0] !== nextVertex) {
    vertex_walk.push(nextVertex);
    edgeIndex = vertices_edges[nextVertex]
      .filter(v => edges_vertices_b[v])
      .shift();
    if (edgeIndex === undefined) { return { vertices: [], edges: [] }; }
    if (graph.edges_vertices[edgeIndex][0] === nextVertex) {
      [, nextVertex] = graph.edges_vertices[edgeIndex];
    } else {
      [nextVertex] = graph.edges_vertices[edgeIndex];
    }
    edges_vertices_b[edgeIndex] = false;
    edge_walk.push(edgeIndex);
  }
  return {
    vertices: vertex_walk,
    edges: edge_walk,
  };
};

/**
 * this removes all edges except for "B", boundary creases.
 * rebuilds the face, and
 * todo: removes a collinear vertex and merges the 2 boundary edges
 */
export const remove_non_boundary_edges = function (graph) {
  const remove_indices = graph.edges_assignment
    .map(a => !(a === "b" || a === "B"))
    .map((a, i) => (a ? i : undefined))
    .filter(a => a !== undefined);
  const edge_map = remove(graph, "edges", remove_indices);
  const face = get_boundary(graph);
  graph.faces_edges = [face.edges];
  graph.faces_vertices = [face.vertices];
  remove(graph, "vertices", get_isolated_vertices(graph));
};
