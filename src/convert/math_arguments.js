/**
 * this searches user-provided inputs for a valid n-dimensional vector
 * which includes objects {x:, y:}, arrays [x,y], or sequences of numbers
 *
 * @returns (number[]) array of number components
 *   invalid/no input returns an emptry array
*/

import math from "../../include/math";

export const {
  get_array_of_vec,
  get_array_of_vec2,
  get_edge,
  get_line,
  get_matrix2,
  get_ray,
  get_two_vec2,
  get_vector,

  is_number,
  is_vector,
  clean_number,
} = math.core;

export const get_two_lines = function () {
  let params = Array.from(arguments);
  if (params[0].point) {
    if (params[0].point.constructor === Array) {
      return [
        [[params[0].point[0], params[0].point[1]],
          [params[0].vector[0], params[0].vector[1]]],
        [[params[1].point[0], params[1].point[1]],
          [params[1].vector[0], params[1].vector[1]]],
      ];
    }
    return [
      [[params[0].point.x, params[0].point.y],
        [params[0].vector.x, params[0].vector.y]],
      [[params[1].point.x, params[1].point.y],
        [params[1].vector.x, params[1].vector.y]],
    ];
  }
};
