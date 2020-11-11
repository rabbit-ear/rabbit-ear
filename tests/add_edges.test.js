const ear = require("../rabbit-ear");

test("add edges", () => {
  const graph = {};

  ear.core.add_edges(graph, {
    edges_vertices: [
      ear.core.add_vertices(graph, { vertices_coords: [[0, 0], [1, 1]] })
    ]
  });

  ear.core.add_edges(graph, {
    edges_vertices: [
      ear.core.add_vertices(graph, { vertices_coords: [[2, 2], [3, 3]] })
    ]
  });

  ear.core.add_edges(graph, {
    edges_vertices: [
      ear.core.add_vertices(graph, { vertices_coords: [[1, 1], [2, 2]] })
    ]
  });

  expect(JSON.stringify(graph.edges_vertices))
    .toBe(JSON.stringify([ [0, 1], [2, 3], [1, 2] ]));

  expect(JSON.stringify(graph.vertices_coords))
    .toBe(JSON.stringify([ [0, 0], [1, 1], [2, 2], [3, 3] ]));
});
