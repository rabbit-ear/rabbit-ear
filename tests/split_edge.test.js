const ear = require("../rabbit-ear");

test("split edge similar endpoint", () => {
	const graph = ear.graph.kite();
	// split an edge but provide the edge's endpoint
	// this should not split the edge but just return the existing vertex
  const res = ear.graph.splitEdge(graph, 3, [1, 0.5857864376]);
  expect(res.vertex).toBe(3);
});
