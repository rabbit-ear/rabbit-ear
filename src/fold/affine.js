import math from "../../include/math";
import { get_keys_with_ending } from "./keys";

const apply_matrix_to_fold = function (fold, matrix) {
  // update all vector types
  get_keys_with_ending("coords").forEach((key) => {
    fold[key] = fold[key]
      .map(v => math.core.multiply_vector2_matrix2(v, matrix));
  });
  // update all matrix types
  // todo, are these being multiplied in the right order?
  get_keys_with_ending("matrix").forEach((key) => {
    fold[key] = fold[key]
      .map(m => math.core.multiply_matrices2(m, matrix));
  });
};

export const scale = function (fold, ratio, homothetic_center) {
  const matrix = math.core.make_matrix2_scale(ratio, homothetic_center);
  apply_matrix_to_fold(fold, matrix);
};

export const translate = function (fold, dx, dy) {
  const matrix = math.core.make_matrix2_translation(dx, dy);
  apply_matrix_to_fold(fold, matrix);
};
