import math from "../../include/math";
import { get_keys_with_ending } from "./keys";

const apply_matrix_to_graph = function (graph, matrix) {
  // update all vector types
  get_keys_with_ending(graph, "coords").forEach((key) => {
    graph[key] = graph[key]
      .map(v => math.core.multiply_matrix2_vector2(matrix, v));
  });
  // update all matrix types
  // todo, are these being multiplied in the right order?
  get_keys_with_ending(graph, "matrix").forEach((key) => {
    graph[key] = graph[key]
      .map(m => math.core.multiply_matrices2(m, matrix));
  });
};

export const transform_scale = function (graph, ratio) {
  const matrix = math.core.make_matrix2_scale(ratio);
  apply_matrix_to_graph(graph, matrix);
};

export const transform_translate = function (graph, dx, dy) {
  const matrix = math.core.make_matrix2_translate(dx, dy);
  apply_matrix_to_graph(graph, matrix);
};

export const transform_matrix = function (graph, matrix) {
  apply_matrix_to_graph(graph, matrix);
};
