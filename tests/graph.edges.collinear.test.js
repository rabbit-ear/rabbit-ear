const ear = require("../rabbit-ear");

test("collinear vertices along edge", () => {
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
  const res = ear.graph.get_collinear_vertices(graph);
  expect(res[0].length).toBe(4);
  expect(res[1].length).toBe(4);
  expect(res[2].length).toBe(4);
  expect(res[3].length).toBe(4);
  for (var i = 4; i < res.length; i += 1) {
    expect(res[i].length).toBeLessThan(4);
  }
})