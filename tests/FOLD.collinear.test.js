const RabbitEar = require("../rabbit-ear");

const graph = RabbitEar.core.clean({
  vertices_coords: [[-1, 0], [0, 0], [1, 1], [2, 2], [3, 2], [0, 20]],
  edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]],
  edges_assignment: ["M", "M", "M", "M", "M", "M"]
});

test("collinear vertices", () => {
  RabbitEar.core.remove_all_collinear_vertices(graph);
  // this should have removed the vertex [1, 1]
  // the next vertex should have shifted up by 1
  expect(graph.vertices_coords.length).toBe(5);
  expect(graph.vertices_coords[2][0]).toBe(2);
  expect(graph.vertices_coords[2][1]).toBe(2);
});
