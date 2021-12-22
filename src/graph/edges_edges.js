import math from "../math";
import { make_edges_vector } from "./make";

/**
 * @returns {boolean[][]} a boolean matrix containing true/false for all,
 * except the diagonal [i][i] which contains undefined.
 */
export const make_edges_edges_parallel = ({ vertices_coords, edges_vertices, edges_vector }, epsilon) => { // = math.core.EPSILON) => {
  if (!edges_vector) {
    edges_vector = make_edges_vector({ vertices_coords, edges_vertices });
  }
  const edge_count = edges_vector.length;
  const edges_edges_parallel = Array
    .from(Array(edge_count))
    .map(() => Array.from(Array(edge_count)));
  for (let i = 0; i < edge_count - 1; i++) {
    for (let j = i + 1; j < edge_count; j++) {
      const p = math.core.parallel(edges_vector[i], edges_vector[j], epsilon);
      edges_edges_parallel[i][j] = p;
      edges_edges_parallel[j][i] = p;
    }
  }
  // for (let i = 0; i < edge_count; i++) {
  //   edges_edges_parallel[i][i] = undefined;
  // }
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

/**
 * @description a subroutine for the two methods below.
 * given a matrix which was already worked on, consider only the true values,
 * compute the overlap_line_line method for each edge-pairs.
 * provide a comparison function (func) to specify inclusive/exclusivity.
 */
const overwrite_edges_overlaps = (matrix, vectors, origins, func, epsilon) => {
  // relationship between i and j is non-directional.
  for (let i = 0; i < matrix.length - 1; i++) {
    for (let j = i + 1; j < matrix.length; j++) {
      // if value is are already false, skip.
      if (!matrix[i][j]) { continue; }
      matrix[i][j] = math.core.overlap_line_line(
        vectors[i], origins[i],
        vectors[j], origins[j],
        func, func,
        epsilon);
      matrix[j][i] = matrix[i][j];
    }
  }
};
/**
 * @desecription find all edges which cross other edges. "cross" meaning
 * the segment overlaps the other segment and they are NOT parallel.
 */
export const make_edges_edges_crossing = ({ vertices_coords, edges_vertices, edges_vector }, epsilon) => {
  if (!edges_vector) {
    edges_vector = make_edges_vector({ vertices_coords, edges_vertices });
  }
  // use graph vertices_coords for edges vertices
  const edges_origin = edges_vertices.map(verts => vertices_coords[verts[0]]);
  // convert parallel into NOT parallel.
  const matrix = make_edges_edges_parallel({
    vertices_coords, edges_vertices, edges_vector
  }, epsilon)
    .map(row => row.map(b => !b));
  for (let i = 0; i < matrix.length; i++) {
    matrix[i][i] = undefined;
  }
  // if edges are parallel (not this value), skip.
  overwrite_edges_overlaps(matrix, edges_vector, edges_origin, math.core.exclude_s, epsilon);
  return matrix;
};
/**
 * @desecription find all edges which overlap one another, meaning
 * the segment overlaps the other segment and they ARE parallel.
 */
// todo, improvement suggestion:
// first grouping edges into categories with edges which share parallel-ness.
// then, express every edge's endpoints in terms of the length along
// the vector. converting it into 2 numbers, and now all you have to do is
// test if these two numbers overlap other edges' two numbers.
export const make_edges_edges_parallel_overlap = ({ vertices_coords, edges_vertices, edges_vector }, epsilon) => {
  if (!edges_vector) {
    edges_vector = make_edges_vector({ vertices_coords, edges_vertices });
  }
  const edges_origin = edges_vertices.map(verts => vertices_coords[verts[0]]);
  // start with edges-edges parallel matrix
  const matrix = make_edges_edges_parallel({
    vertices_coords, edges_vertices, edges_vector
  }, epsilon);
  // only if lines are parallel, then run the more expensive overlap method
  overwrite_edges_overlaps(matrix, edges_vector, edges_origin, math.core.exclude_s, epsilon);
  return matrix;
};
