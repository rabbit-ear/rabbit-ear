const ear = require("../rabbit-ear");

test("duplicate edges", () => {
  const graph = {
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
  const result = ear.graph.get_duplicate_edges(graph);
  expect(result[0]).toBe(4);
  expect(result[1]).toBe(7);
  expect(result[2]).toBe(12);
});

test("invalid edges", () => {
  const graph1 = {
    edges_vertices: [
      [0, 1, 2],
      [3, 4, 5],
      [2, 1, 0],
    ]
  };
  const result1 = ear.graph.get_duplicate_edges(graph1);
  expect(result1.length).toBe(0);

  const graph2 = {
    edges_vertices: [
      [0, 1, 2],
      [3, 4, 5],
      [0, 1, 2],
    ]
  };
  const result2 = ear.graph.get_duplicate_edges(graph2);
  expect(result2.length).toBe(1);
  expect(result2[0]).toBe(2);
});

test("duplicate edges, invalid input 1", (done) => {
  try {
    ear.graph.get_duplicate_edges();
  } catch (error) {
    expect(error).not.toBe(undefined);
    done();
  }
});

test("duplicate edges, invalid input 2", () => {
  const result = ear.graph.get_duplicate_edges({});
  expect(result.length).toBe(0);
});

test("duplicate edges, with undefined", (done) => {
  try {
    ear.graph.get_duplicate_edges({ edges_vertices: [
      [0, 1],
      undefined,
      [1, 0],
    ]});
  } catch (error) {
    expect(error).not.toBe(undefined);
    done();
  }
});
