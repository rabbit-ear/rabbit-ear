const RabbitEar = require("../rabbit-ear");

test("fragment, one edges crossing boundary", () => {
  const graph = RabbitEar.bases.square;
  graph.vertices_coords.push([-0.1, 0.3], [1.1, 0.9]);
  graph.edges_vertices.push([4, 5]);
  graph.edges_assignment.push("V");

  RabbitEar.core.fragment(graph);

  expect(graph.vertices_coords.length).toBe(8);
  expect(graph.edges_vertices.length).toBe(9);
  expect(graph.edges_assignment.filter(a => a === "B" || a === "b").length).toBe(6);
  expect(graph.edges_assignment.filter(a => a === "V" || a === "v").length).toBe(3);
  expect(graph.edges_foldAngle.filter(a => a === 0).length).toBe(6);
  expect(graph.edges_foldAngle.filter(a => a === 180).length).toBe(3);
});

test("fragment, two crossing edges", () => {
  const graph = RabbitEar.bases.square;
  graph.vertices_coords.push([-0.1, 0.3], [1.1, 0.9]);
  graph.vertices_coords.push([0.2, -0.1], [0.8, 1.1]);
  graph.edges_vertices.push([4, 5]);
  graph.edges_vertices.push([6, 7]);
  graph.edges_assignment.push("V");
  graph.edges_assignment.push("M");

  RabbitEar.core.fragment(graph);

  expect(graph.vertices_coords.length).toBe(13);
  expect(graph.edges_vertices.length).toBe(16);
  expect(graph.edges_assignment.filter(a => a === "B" || a === "b").length).toBe(8);
  expect(graph.edges_assignment.filter(a => a === "V" || a === "v").length).toBe(4);
  expect(graph.edges_assignment.filter(a => a === "M" || a === "m").length).toBe(4);
  expect(graph.edges_foldAngle.filter(a => a === 0).length).toBe(8);
  expect(graph.edges_foldAngle.filter(a => a === 180).length).toBe(4);
  expect(graph.edges_foldAngle.filter(a => a === -180).length).toBe(4);
});
