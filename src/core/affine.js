import math from "../math";
import { filter_keys_with_suffix } from "./keys";

const apply_matrix_to_graph = function (graph, matrix) {
  // apply to anything with a coordinate value
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

const transform_scale = (graph, sx, sy) => {
  if (typeof sx === "number" && sy === undefined) { sy = sx; }
  const matrix = math.core.make_matrix2_scale(sx, sy);
  apply_matrix_to_graph(graph, matrix);
};

const transform_translate = (graph, dx, dy) => {
  const matrix = math.core.make_matrix2_translate(dx, dy);
  apply_matrix_to_graph(graph, matrix);
};

const transform_matrix = (graph, matrix) => {
  apply_matrix_to_graph(graph, matrix);
};

export default {
  scale: transform_scale,
  translate: transform_translate,
  matrix: transform_matrix,
};
