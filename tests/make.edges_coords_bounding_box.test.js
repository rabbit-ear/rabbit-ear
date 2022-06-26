const ear = require("../rabbit-ear");

test("edges coords bounding box", () => {
  const graph = ear.graph.square();
  for (let i = 0; i < 4; i += 1) {
    ear.graph.addEdges(
      graph,
      ear.graph.addVertices(graph, [[Math.random(), 0], [Math.random(), 1]])
    );
    ear.graph.addEdges(
      graph,
      ear.graph.addVertices(graph, [[0, Math.random()], [1, Math.random()]])
    );
  }
  ear.graph.makeEdgesBoundingBox(graph);
  expect(true).toBe(true);
});

