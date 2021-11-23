import math from "../math";
import { invert_map } from "./maps";
import make_layer_matrix from "../layer/make_layer_matrix";
import make_folded_groups_edges from "./make_folded_groups_edges";
import get_common_rules from "../layer/get_common_rules";
import fold_edge_solver from "../layer/fold_edge_solver";
import make_layers_face from "../layer/layers_face";
import make_layers_face_solver from "../layer/layers_face_solver";
import flat_layer_order_symmetry_line from "../layer/flat_layer_symmetry_line";

const multiply_square_matrices = (a, b) => {
  const len = a.length;
  const res = Array.from(Array(len)).map(() => []);
  for (let i = 0; i < len; i++) {
    for (let j = 0; j < len; j++) {
      let dot = 0;
      for (let v = 0; v < len; v++) {
        const val1 = a[i][v];
        const val2 = b[v][j];
        dot += (val1 === undefined ? 0 : val1) * (val2 === undefined ? 0 : val2);
      }
      res[i][j] = dot;
    }
  }
  return res;
};

const matrix_count = (matrix) => {
  let count = 0;
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      if (matrix[i][j] !== undefined) { count++; }
    }
  }
  return count;
};

/**
 * @description 
 * 
 */
const make_faces_layer = (graph, face = 0, epsilon = math.core.EPSILON) => {
  const matrix = make_layer_matrix(graph, face, epsilon);
  const groups_edges = make_folded_groups_edges(graph, epsilon);

  // // experimental section:
  // flat_layer_order_symmetry_line(graph, matrix, {
  //   origin: [0,1],
  //   vector: [Math.SQRT1_2, -Math.SQRT1_2],
  // });

  // const permutations = groups_edges
  //   .map(edges => fold_edge_solver(graph, edges, matrix));
  // console.log("perms", permutations);

  // console.log("before", matrix_count(matrix));
  for (let i = 0; i < groups_edges.length; i++) {
    // console.log("solved edge group", i);
    const rules = fold_edge_solver(graph, groups_edges[i], matrix)
      .map(invert_map);
    get_common_rules(rules).forEach(rule => {
      matrix[rule[0]][rule[1]] = rule[2];
    });
  }
  // console.log("after", matrix_count(matrix));
  // at this point, our matrix is complete, get a layer order
  // single solution
  const layers_face = make_layers_face(matrix);
  // // multiple solutions
  // const solutions = make_layers_face_solver(matrix, initial_face_order);
  const faces_layer = invert_map(layers_face);
  faces_layer.matrix = matrix;
  return faces_layer;
};

export default make_faces_layer;
