import math from "../../include/math";

// not permissive when it comes to mis-matching dimensions
const are_vertices_equivalent = function (a, b, epsilon = math.core.EPSILON) {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i += 1) {
    if (Math.abs(a[i] - b[i]) > epsilon) {
      return false;
    }
  }
  return true;
};

export const similar_vertices_coords = function (target, source) {
  const sourceMap = source.vertices_coords.map(() => undefined);
  for (let i = 0; i < target.vertices_coords.length; i += 1) {
    for (let j = 0; j < source.vertices_coords.length; j += 1) {
      if (are_vertices_equivalent(target.vertices_coords[i], source.vertices_coords[j])) {
        sourceMap[j] = i;
        // break out of the inner loop
        j = source.vertices_coords.length;
      }
    }
  }
  return sourceMap;
};
