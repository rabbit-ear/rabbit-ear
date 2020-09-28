import math from "../../math";
import {
  VERTICES,
  VERTICES_COORDS,
  get_graph_keys_with_suffix,
  get_graph_keys_with_prefix,
} from "../keys";
import clusters_vertices from "./clusters_vertices";

const merge_duplicate_vertices = (graph, epsilon = math.core.EPSILON) => {
  const clusters = clusters_vertices(graph, epsilon);
  // map points each vertex to a cluster.
  // map[10] = 5  vertex 10 is in clusters[5]
  // (vertex 10 will become vertex 5)
  const map = [];
  for (let i = 0; i < clusters.length; i += 1) {
    for (let j = 0; j < clusters[i].length; j += 1) {
      map[clusters[i][j]] = i;
    }
  }
  // average all points together for each new vertex
  const new_vertices_coords = clusters
    .map(arr => arr.map(i => graph.vertices_coords[i]))
    .map(arr => math.core.average(...arr));
  // set new vertices_coords
  graph.vertices_coords = new_vertices_coords;
  // update all arrays that end with "..._vertices" with each vertex's
  // new index
  get_graph_keys_with_suffix(graph, VERTICES).forEach((key) => {
    const arr_vertices = graph[key];
    for (let i = 0; i < arr_vertices.length; i += 1) {
      for (let j = 0; j < arr_vertices[i].length; j += 1) {
        arr_vertices[i][j] = map[arr_vertices[i][j]];
      }
    }
  });
  // for keys like "vertices_edges" or "vertices_vertices", we simply
  // cannot carry them over, for example vertices_vertices are intended
  // to be sorted clockwise. it's possible to write this out one day
  // for all the special cases, but for now playing it safe.
  get_graph_keys_with_prefix(graph, VERTICES)
    .filter(a => a !== VERTICES_COORDS)
    .forEach(key => delete graph[key]);
};

export default merge_duplicate_vertices;
