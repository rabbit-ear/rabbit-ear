import math from "../../include/math";

// permissively ignores anything above 2D
const are_vertices_equivalent = function (a, b, epsilon = math.core.EPSILON) {
  const max = a.length < 2 ? a.length : 2;
  for (let i = 0; i < max; i += 1) {
    if (Math.abs(a[i] - b[i]) > epsilon) {
      return false;
    }
  }
  return true;
};

const remove_duplicate_vertices = (g, epsilon = math.core.EPSILON) => {
  const vertices_equivalent = Array
    .from(Array(g.vertices_coords.length)).map(() => []);
  for (let i = 0; i < g.vertices_coords.length - 1; i += 1) {
    for (let j = i + 1; j < g.vertices_coords.length; j += 1) {
      vertices_equivalent[i][j] = are_vertices_equivalent(
        g.vertices_coords[i],
        g.vertices_coords[j],
        epsilon
      );
    }
  }
  const vertices_map = g.vertices_coords.map(() => undefined);
  vertices_equivalent
    .forEach((row, i) => row
      .forEach((eq, j) => {
        if (eq) {
          vertices_map[j] = vertices_map[i] === undefined
            ? i
            : vertices_map[i];
        }
      }));
  // const vertices_remove = vertices_map.map(m => m !== undefined);
  vertices_map.forEach((map, i) => {
    if (map === undefined) { vertices_map[i] = i; }
  });
  console.log("vertices_equivalent", vertices_equivalent);
  console.log("vertices_map", vertices_map);
  // edges_vertices
  //   .forEach((edge, i) => edge
  //     .forEach((v, j) => {
  //       edges_vertices[i][j] = vertices_map[v];
  //     }));
};

export default remove_duplicate_vertices;
