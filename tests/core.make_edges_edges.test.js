const ear = require("../rabbit-ear");

test("edges_edges square", () => {
  const graph = { edges_vertices: [[0, 1], [1,2], [2,3], [3,0]] };
  graph.vertices_edges = ear.core.make_vertices_edges(graph);
  const result = ear.core.make_edges_edges(graph);
  expect(result[0]).toEqual(expect.arrayContaining([3, 1]));
  expect(result[1]).toEqual(expect.arrayContaining([0, 2]));
  expect(result[2]).toEqual(expect.arrayContaining([1, 3]));
  expect(result[3]).toEqual(expect.arrayContaining([2, 0]));
});

test("edges_edges line", () => {
  const graph = { edges_vertices: [[0, 1], [1,2], [2,3], [3,4], [4, 5], [5, 6], [6, 7]] };
  graph.vertices_edges = ear.core.make_vertices_edges(graph);
  const result = ear.core.make_edges_edges(graph);
  expect(result[0]).toEqual(expect.arrayContaining([1]));
  expect(result[1]).toEqual(expect.arrayContaining([0, 2]));
  expect(result[2]).toEqual(expect.arrayContaining([1, 3]));
  expect(result[3]).toEqual(expect.arrayContaining([2, 4]));
  expect(result[4]).toEqual(expect.arrayContaining([3, 5]));
  expect(result[5]).toEqual(expect.arrayContaining([4, 6]));
  expect(result[6]).toEqual(expect.arrayContaining([5]));
});

test("edges_edges, no edge adjacency", () => {
  const graph = { edges_vertices: [[0, 1], [2,3], [4, 5], [6, 7]] };
  graph.vertices_edges = ear.core.make_vertices_edges(graph);
  const result = ear.core.make_edges_edges(graph);
  expect(result[0].length).toBe(0);
  expect(result[1].length).toBe(0);
  expect(result[2].length).toBe(0);
  expect(result[3].length).toBe(0);
});

test("edges_edges, bad edge construction", () => {
  const graph = { edges_vertices: [[0, 1, 2], [2, 3, 4], [4, 5, 6]] };
  graph.vertices_edges = ear.core.make_vertices_edges(graph);
  const result = ear.core.make_edges_edges(graph);
  expect(result[0].length).toBe(0);
  expect(result[1]).toEqual(expect.arrayContaining([0]));
  expect(result[2]).toEqual(expect.arrayContaining([1]));
});
