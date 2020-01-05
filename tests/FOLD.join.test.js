const RabbitEar = require("../rabbit-ear");

test("FOLD join", () => {
  const oneFold = RabbitEar.graph({
    vertices_coords: [[0, 0], [1, 0], [1, 1], [0, 1]],
    edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 0], [1, 3]],
    edges_assignment: ["B", "B", "B", "B", "V"]
  });
  oneFold.populate();

  const returned = RabbitEar.core.join(oneFold, RabbitEar.bases.kite);

  expect(oneFold.vertices_coords.length).toBe(6);
  expect(oneFold.edges_vertices.length).toBe(9);
  expect(oneFold.faces_vertices.length).toBe(4);

  expect(returned.vertices_coords.length).toBe(6);
});
