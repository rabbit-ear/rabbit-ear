const ear = require("../rabbit-ear");

test("duplicate edge", () => {
  const graph = ear.graph({
    vertices_coords: [[0, 0], [1, 0], [1, 1], [0, 1]],
    edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 0], [2, 1]],
    edges_assignment: ["B", "B", "B", "B", "B"]
  });
  expect(graph.edges_vertices.length).toBe(5);
  graph.clean();
  expect(graph.edges_vertices.length).toBe(4);
});

test("circular edge", () => {
  const graph = ear.graph({
    vertices_coords: [[0, 0], [1, 0], [1, 1], [0, 1]],
    edges_vertices: [[0, 1], [1, 2], [3, 3], [2, 3], [3, 0]],
    edges_assignment: ["B", "B", "B", "B", "B"]
  });
  expect(graph.edges_vertices.length).toBe(5);
  graph.clean();
  expect(graph.edges_vertices.length).toBe(4);
});
