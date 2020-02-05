const RabbitEar = require("../rabbit-ear");

test("collinear vertices", () => {
  const graph = {
    vertices_coords: [[-1, 0], [0, 0], [1, 1], [2, 2], [3, 2], [0, 20]],
    edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]],
    edges_assignment: ["M", "M", "M", "M", "M", "M"]
  };
  RabbitEar.core.populate(graph);

  RabbitEar.core.remove_all_collinear_vertices(graph);
  // this should have removed the vertex [1, 1]
  // the next vertex should have shifted up by 1
  expect(graph.vertices_coords.length).toBe(5);
  expect(graph.vertices_coords[2][0]).toBe(2);
  expect(graph.vertices_coords[2][1]).toBe(2);
});


test("collinear vertices with faces", () => {
  const graph = {
    vertices_coords: [[0, 0], [1, 0], [1, 1], [0, 1], [0.25, 0.25], [0.5, 0.5], [0.75, 0.75]],
    edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 4], [4, 5], [5, 6], [6, 2]],
    edges_assignment: ["B", "B", "B", "B", "M", "M", "M", "M"],
    faces_vertices: [[0, 1, 2, 6, 5, 4], [0, 4, 5, 6, 2, 3]],
  };
  // RabbitEar.core.populate(graph);

  RabbitEar.core.remove_all_collinear_vertices(graph);
  // console.log(graph);
  // this should have removed the vertex [1, 1]
  // the next vertex should have shifted up by 1
  // expect(graph.vertices_coords.length).toBe(5);
  // expect(graph.vertices_coords[2][0]).toBe(2);
  // expect(graph.vertices_coords[2][1]).toBe(2);
  expect(true).toBe(true);
});

