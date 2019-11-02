import math from "./math";
import { make_vertex_pair_to_edge_map } from "./graph";

const boundary_vertex_walk = function ({ vertices_vertices }, startIndex, neighbor_index) {
  const walk = [startIndex, neighbor_index];
  while (walk[0] !== walk[walk.length - 1]
    && walk[walk.length - 1] !== walk[walk.length - 2]
  ) { // not good enough we need to
    // check if it starts on a cycle point, but eventually leads to an available branch
    const next_v_v = vertices_vertices[walk[walk.length - 1]];
    const next_i_v_v = next_v_v.indexOf(walk[walk.length - 2]);
    const next_v = next_v_v[(next_i_v_v + 1) % next_v_v.length];
    walk.push(next_v);
  }
  walk.pop(); // the first index is duplicated.  todo: more elegant solution
  return walk;
};

/**
 * will always return an array. empty if no boundary found
 */
const search_boundary = function (graph) {
  if (graph.vertices_coords == null || graph.vertices_coords.length < 1) {
    return [];
  }
  // setup
  // 1. find a point along the boundary (smallest Y value)
  // 2. radially-sort its adjacent vertices, begin walking in the +X direction
  let startIndex = 0;
  for (let i = 1; i < graph.vertices_coords.length; i += 1) {
    if (graph.vertices_coords[i][1] < graph.vertices_coords[startIndex][1]) {
      startIndex = i;
    }
  }
  if (startIndex === -1) { return []; }
  const adjacent = graph.vertices_vertices[startIndex];
  const adjacent_vectors = adjacent.map(a => [
    graph.vertices_coords[a][0] - graph.vertices_coords[startIndex][0],
    graph.vertices_coords[a][1] - graph.vertices_coords[startIndex][1]
  ]);
  // get the highest value X value (dot product with [1 0])
  const adjacent_dot_products = adjacent_vectors
    .map(v => math.core.normalize(v))
    .map(v => v[0]);
  let neighbor_index = -1;
  let counter_max = -Infinity;
  for (let i = 0; i < adjacent_dot_products.length; i += 1) {
    if (adjacent_dot_products[i] > counter_max) {
      neighbor_index = i;
      counter_max = adjacent_dot_products[i];
    }
  }

  const vertices = boundary_vertex_walk(graph, startIndex, adjacent[neighbor_index]);
  const edgeMap = make_vertex_pair_to_edge_map(graph);
  const vertices_pairs = vertices
    .map((_, i, arr) => [arr[i], arr[(i + 1) % arr.length]]
      .sort((a, b) => a - b)
      .join(" "));
  const edges = vertices_pairs.map(p => edgeMap[p]);
  return edges;
};

export default search_boundary;
