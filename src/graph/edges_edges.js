import math from "../math";
import { make_edges_vector } from "./make";

export const make_edges_edges_parallel = ({ vertices_coords, edges_vertices, edges_vector }, epsilon) => { // = math.core.EPSILON) => {
  if (!edges_vector) {
    edges_vector = make_edges_vector({ vertices_coords, edges_vertices });
  }
  const edge_count = edges_vector.length;
  const edges_edges_parallel = Array
    .from(Array(edge_count))
    .map(() => Array.from(Array(edge_count)));
  for (let i = 0; i < edge_count; i++) {
    edges_edges_parallel[i][i] = true;
  }
  for (let i = 0; i < edge_count - 1; i++) {
    for (let j = i + 1; j < edge_count; j++) {
      const p = math.core.parallel(edges_vector[i], edges_vector[j], epsilon);
      edges_edges_parallel[i][j] = p;
      edges_edges_parallel[j][i] = p;
    }
  }
  return edges_edges_parallel;
};

// const edges_radians = edges_vector
//   .map(v => Math.atan2(v[1], v[0]));
// const sorted = edges_radians
//   .map(rad => rad > 0 ? rad : rad + Math.PI)
//   .map((radians, i) => ({ radians, i }))
//   .sort((a, b) => a.radians - b.radians);

// const similar_num = (a, b, epsilon = 0.001) => Math
//   .abs(a - b) < epsilon;

// const parallel_groups = [
//   []
// ];
// let group_i = 0;

// const edges_parallel = Array
//   .from(Array(edge_count))
//   .map(() => []);
// let walk = 0;
// for (let i = 1; i < edge_count; i++) {
//   while (!similar_num(sorted[walk].radians, sorted[i].radians) && walk < i) {
//     walk++;
//   }
//   for (let j = walk; j < i; j++) {
//     edges_parallel[j].push(i);
//   }
// }

export const make_edges_edges_overlap = ({ vertices_coords, edges_vertices, edges_vector }, epsilon) => {
  if (!edges_vector) {
    edges_vector = make_edges_vector({ vertices_coords, edges_vertices });
  }
  // use graph vertices_coords for edges vertices
  const edges_origins = edges_vertices.map(verts => vertices_coords[verts[0]]);

  // convert parallel into NOT parallel.
  const edges_edges_overlap = make_edges_edges_parallel({
    vertices_coords, edges_vertices, edges_vector
  }, epsilon)
    .map(row => row.map(b => !b));

  for (let i = 0; i < edges_edges_overlap.length - 1; i++) {
    for (let j = i + 1; j < edges_edges_overlap.length; j++) {
      // if edges are parallel (not this value), skip.
      if (!edges_edges_overlap[i][j]) { continue; }
      edges_edges_overlap[i][j] = math.core.overlap_line_line(
        edges_vector[i], edges_origins[i],
        edges_vector[j], edges_origins[j],
        math.core.exclude_s, math.core.exclude_s,
        epsilon);
      edges_edges_overlap[j][i] = edges_edges_overlap[i][j];
    }
  }
  return edges_edges_overlap;
};
