const ear = require("rabbit-ear");

test("duplicate edges", () => {
  const testGraph = {
    edges_vertices: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [0, 3],
      [0, 2],
      [1, 3],
      [0, 2],
      [0, 4],
      [1, 4],
      [2, 4],
      [3, 4],
      [4, 0],
    ]
  };
  const result = ear.core.get_duplicate_edges(testGraph);
  expect(result[0]).toBe(4);
  expect(result[1]).toBe(7);
  expect(result[2]).toBe(12);
});
