
export const make_vertices_sectors_vertices = function ({ vertices_vertices }) {
  return vertices_vertices
    .map((vertices, i) => vertices
      .map((adj, j, arr) => [adj, i, arr[(j + 1) % arr.length]]));
};

export const make_vertices_sectors_angles = function ({ vertices_vertices }) {
  return vertices_vertices
    .map((vertices, i) => vertices
      .map((adj, j, arr) => [adj, i, arr[(j + 1) % arr.length]]));
};
