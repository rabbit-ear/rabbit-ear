/**
 * Rabbit Ear (c) Robby Kraft
 */
import math from "../math";
import { filter_keys_with_suffix } from "./fold_spec";

const apply_matrix_to_graph = function (graph, matrix) {
  // apply to anything with a coordinate value
  filter_keys_with_suffix(graph, "coords").forEach((key) => {
    graph[key] = graph[key]
      .map(v => math.core.resize(3, v))
      .map(v => math.core.multiply_matrix3_vector3(matrix, v));
  });
  // update all matrix types
  // todo, are these being multiplied in the right order?
  filter_keys_with_suffix(graph, "matrix").forEach((key) => {
    graph[key] = graph[key]
      .map(m => math.core.multiply_matrices3(m, matrix));
  });
  return graph;
};

const transform_scale = (graph, scale, ...args) => {
  const vector = math.core.get_vector(...args);
  const vector3 = math.core.resize(3, vector);
  const matrix = math.core.make_matrix3_scale(scale, vector3);
  return apply_matrix_to_graph(graph, matrix);
};

const transform_translate = (graph, ...args) => {
  const vector = math.core.get_vector(...args);
  const vector3 = math.core.resize(3, vector);
  const matrix = math.core.make_matrix3_translate(...vector3);
  return apply_matrix_to_graph(graph, matrix);
};

const transform_rotateZ = (graph, angle, ...args) => {
  const vector = math.core.get_vector(...args);
  const vector3 = math.core.resize(3, vector);
  const matrix = math.core.make_matrix3_rotateZ(angle, ...vector3);
  return apply_matrix_to_graph(graph, matrix);
};
// make_matrix3_rotate
// make_matrix3_rotateX
// make_matrix3_rotateY
// make_matrix3_reflectZ

export default {
  scale: transform_scale,
  translate: transform_translate,
  rotateZ: transform_rotateZ,
  transform: apply_matrix_to_graph,
};
