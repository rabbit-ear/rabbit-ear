const ear = require("../rabbit-ear");

test("clusters", () => {
  const clusters = ear.graph.clusters_vertices({ vertices_coords: [
    [0, 0],
    [1, 1],
    [0.00000000001, 0],
    [0.2, 0.2],
    [0.20000000001, 0.2000000001],
    [0.20000000001, 0.4],
  ] });
  expect(clusters[0][0]).toBe(0);
  expect(clusters[0][1]).toBe(2);
  expect(clusters[1][0]).toBe(1);
  expect(clusters[2][0]).toBe(3);
  expect(clusters[2][1]).toBe(4);
  expect(clusters[3][0]).toBe(5);
});

test("clusters, inside epsilon", () => {
  const epsilon = ear.math.EPSILON * 0.9;
  const clusters = ear.graph.clusters_vertices({ vertices_coords: [
    [0.5, 0.5],
    [0.5, 0.5 + epsilon],
    [0.5, 0.5 + epsilon * 2],
    [0.5, 0.5 + epsilon * 3],
    [0.5, 0.5 + epsilon * 4],
    [0.5, 0.5 + epsilon * 5],
    [0.5, 0.5 + epsilon * 6],
  ] });
  expect(clusters.length).toBe(1);
  expect(clusters[0].length).toBe(7);
});

test("clusters, outside epsilon", () => {
  const epsilon = ear.math.EPSILON * 1.1;
  const clusters = ear.graph.clusters_vertices({ vertices_coords: [
    [0.5, 0.5],
    [0.5, 0.5 + epsilon],
    [0.5, 0.5 + epsilon * 2],
    [0.5, 0.5 + epsilon * 3],
    [0.5, 0.5 + epsilon * 4],
    [0.5, 0.5 + epsilon * 5],
    [0.5, 0.5 + epsilon * 6],
  ] });
  expect(clusters.length).toBe(7);
});

test("merge duplicate vertices", () => {
  const graph = { vertices_coords: [
    [0, 0],
    [1, 1],
    [0.00000000001, 0],
    [0.2, 0.2],
    [0.20000000001, 0.2000000001],
    [0.20000000001, 0.4],
  ] };
  ear.graph.merge_duplicate_vertices(graph);
  expect(graph.vertices_coords.length).toBe(4);
});

test("merge duplicate vertices, inside epsilon, point averaging", () => {
  const epsilon = ear.math.EPSILON * 0.9;
  const graph = { vertices_coords: [
    [0.5, 0.5],
    [0.5, 0.5 + epsilon],
    [0.5, 0.5 + epsilon * 2],
    [0.5, 0.5 + epsilon * 3],
    [0.5, 0.5 + epsilon * 4],
    [0.5, 0.5 + epsilon * 5],
    [0.5, 0.5 + epsilon * 6],
  ] };
  ear.graph.merge_duplicate_vertices(graph);
  expect(graph.vertices_coords.length).toBe(1);
  // vertices should be averaged together, the y value should be halfway
  // between 0 and 6 epsilons
  expect(graph.vertices_coords[0][1] > 0.5 + epsilon * 2).toBe(true);
  expect(graph.vertices_coords[0][1] < 0.5 + epsilon * 4).toBe(true);
});

test("merge duplicate vertices, outside epsilon", () => {
  const epsilon = ear.math.EPSILON * 1.1;
  const graph = { vertices_coords: [
    [0.5, 0.5],
    [0.5, 0.5 + epsilon],
    [0.5, 0.5 + epsilon * 2],
    [0.5, 0.5 + epsilon * 3],
    [0.5, 0.5 + epsilon * 4],
    [0.5, 0.5 + epsilon * 5],
    [0.5, 0.5 + epsilon * 6],
  ] };
  ear.graph.merge_duplicate_vertices(graph);
  expect(graph.vertices_coords.length).toBe(7);
});
