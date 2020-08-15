import math from "../../include/math";
import { filter_keys_with_suffix } from "./keys";

const apply_matrix_to_graph = function (graph, matrix) {
  // update all vector types
  filter_keys_with_suffix(graph, "coords").forEach((key) => {
    graph[key] = graph[key]
      .map(v => math.core.multiply_matrix2_vector2(matrix, v));
  });
  // update all matrix types
  // todo, are these being multiplied in the right order?
  filter_keys_with_suffix(graph, "matrix").forEach((key) => {
    graph[key] = graph[key]
      .map(m => math.core.multiply_matrices2(m, matrix));
  });
};

export const transform_scale = function (graph, sx, sy) {
  if (typeof sx === "number" && sy === undefined) { sy = sx; }
  const matrix = math.core.make_matrix2_scale(sx, sy);
  apply_matrix_to_graph(graph, matrix);
};

export const transform_translate = function (graph, dx, dy) {
  const matrix = math.core.make_matrix2_translate(dx, dy);
  apply_matrix_to_graph(graph, matrix);
};

export const transform_matrix = function (graph, matrix) {
  apply_matrix_to_graph(graph, matrix);
};
