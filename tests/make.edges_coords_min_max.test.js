const ear = require("../rabbit-ear");

test("edges coords min max", () => {
  const graph = ear.graph.square();
  for (let i = 0; i < 4; i += 1) {
    ear.graph.add_edges(
      graph,
      ear.graph.add_vertices(graph, [[Math.random(), 0], [Math.random(), 1]])
    );
    ear.graph.add_edges(
      graph,
      ear.graph.add_vertices(graph, [[0, Math.random()], [1, Math.random()]])
    );
  }
  ear.graph.make_edges_coords_min_max(graph);
  expect(true).toBe(true);
});

