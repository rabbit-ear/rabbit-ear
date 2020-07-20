import math from "../../include/math";
import { get_graph_keys_with_suffix } from "./keys";
import remove from "./remove";

// permissively ignores anything above 2D
const are_vertices_equivalent = function (a, b, epsilon = math.core.EPSILON) {
  const degree = a.length;
  for (let i = 0; i < degree; i += 1) {
    if (Math.abs(a[i] - b[i]) > epsilon) {
      return false;
    }
  }
  return true;
};

// vertices_equivalent is an NxN matrix. only top triangle is used
//     0  1  2  3
// 0 [ x,  ,  ,  ]
// 1 [ x, x,  ,  ]
// 2 [ x, x, x,  ]
// 3 [ x, x, x, x]
// showing crossings between 0 and 1, and 1 and 3.
// because the lower triangle is duplicate info, only store one half

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
  const vertices_to_remove = [];
  for (let i = 0; i < g.vertices_coords.length - 1; i += 1) {
    for (let j = i + 1; j < g.vertices_coords.length; j += 1) {
      if (vertices_equivalent[i][j]) {
        vertices_map[j] = vertices_map[i] === undefined
          ? i
          : vertices_map[i];
        vertices_to_remove.push(j);
      }
    }
  }
  // vertices_equivalent
  //   .forEach((row, i) => row
  //     .forEach((eq, j) => {
  //       if (eq) {
  //         // j is getting removed
  //         vertices_map[j] = vertices_map[i] === undefined
  //           ? i
  //           : vertices_map[i];
  //         console.log("true", vertices_map[i] === undefined);
  //         vertices_to_remove.push(j);
  //       }
  //     }));

  const vertices_remove = vertices_map
    .map((m, i) => (m !== undefined ? i : undefined))
    .filter(a => a !== undefined);

  vertices_map.forEach((map, i) => {
    if (map === undefined) { vertices_map[i] = i; }
  });
  const keys = get_graph_keys_with_suffix(g, "vertices");
  for (let key = 0; key < keys.length; key += 1) {
    // "arr_vertices" will be edges_vertices or faces_vertices ...
    const arr_vertices = g[keys[key]];
    for (let i = 0; i < arr_vertices.length; i += 1) {
      for (let j = 0; j < arr_vertices[i].length; j += 1) {
        arr_vertices[i][j] = vertices_map[arr_vertices[i][j]];
      }
    }
  }
  // functional. idk if for loop version is faster.
  // get_graph_keys_with_suffix(g, "vertices")
  //   .forEach(key => g[key].forEach((_, i) => g[key][i]
  //     .forEach((vert, j) => {
  //       g[key][i][j] = vertices_map[vert];
  //     })));

  remove(g, "vertices", vertices_remove);

  // edges_vertices
  //   .forEach((edge, i) => edge
  //     .forEach((v, j) => {
  //       edges_vertices[i][j] = vertices_map[v];
  //     }));
};

export default remove_duplicate_vertices;
