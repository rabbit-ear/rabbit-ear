const RabbitEar = require("../rabbit-ear");

test("FOLD validate types", () => {
  const graph = RabbitEar.bases.bird;

  const a = RabbitEar.core.arrayOfType(graph.edges_assignment, "string");
  const aa = RabbitEar.core.arrayOfArrayOfType(graph.vertices_coords, "number");

  expect(a).toBe(true);
  expect(aa).toBe(true);
});


test("FOLD validate graph geometry", () => {
  const graph = RabbitEar.bases.blintz;

  expect(RabbitEar.core.validate.vertices_coords(graph)).toBe(true);
  expect(RabbitEar.core.validate.vertices_vertices(graph)).toBe(true);
  // expect(RabbitEar.core.validate.vertices_edges(graph)).toBe(true);
  expect(RabbitEar.core.validate.vertices_faces(graph)).toBe(true);
  expect(RabbitEar.core.validate.edges_vertices(graph)).toBe(true);
  // expect(RabbitEar.core.validate.edges_faces(graph)).toBe(true);
  expect(RabbitEar.core.validate.faces_vertices(graph)).toBe(true);
  // expect(RabbitEar.core.validate.faces_edges(graph)).toBe(true);
  // expect(RabbitEar.core.validate.faces_faces(graph)).toBe(true);
});
