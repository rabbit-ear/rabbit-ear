const RabbitEar = require("../rabbit-ear");


test("one-fold populate", () => {
  const graph = RabbitEar.graph({
    vertices_coords: [[0, 0], [1, 0], [1, 1], [0, 1]],
    edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 0], [1, 3]]
  });
  graph.populate();
  expect(graph.vertices_coords.length).toBe(4);
  expect(graph.vertices_vertices.length).toBe(4);
  expect(graph.vertices_faces.length).toBe(4);
  expect(graph.vertices_edges.length).toBe(4);
  expect(graph.edges_vertices.length).toBe(5);
  expect(graph.edges_edges.length).toBe(5);
  expect(graph.edges_faces.length).toBe(5);
  expect(graph.edges_length.length).toBe(5);
  expect(graph.edges_assignment).toBe(undefined);
  expect(graph.edges_foldAngle).toBe(undefined);
  expect(graph.faces_faces.length).toBe(2);
  expect(graph.faces_vertices.length).toBe(2);
  expect(graph.faces_edges.length).toBe(2);
});


test("one-fold populate", () => {
  const graph = RabbitEar.graph({
    vertices_coords: [[0, 0], [1, 0], [1, 1], [0, 1]],
    edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 0], [1, 3]],
    edges_assignment: ["B", "B", "B", "B", "V"]
  });
  graph.populate();
  expect(graph.vertices_coords.length).toBe(4);
  expect(graph.vertices_vertices.length).toBe(4);
  expect(graph.vertices_faces.length).toBe(4);
  expect(graph.vertices_edges.length).toBe(4);
  expect(graph.edges_vertices.length).toBe(5);
  expect(graph.edges_edges.length).toBe(5);
  expect(graph.edges_faces.length).toBe(5);
  expect(graph.edges_length.length).toBe(5);
  expect(graph.edges_assignment.length).toBe(5);
  expect(graph.edges_foldAngle.length).toBe(5);
  expect(graph.faces_faces.length).toBe(2);
  expect(graph.faces_vertices.length).toBe(2);
  expect(graph.faces_edges.length).toBe(2);
});


test("populate kite base", () => {
  const kite = {
    file_spec: 1.1,
    vertices_coords: [[0, 0], [0.414, 0], [1, 0], [1, 0.586], [1, 1], [0, 1]],
    edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [5, 1], [3, 5], [5, 2]],
    faces_vertices: [[0, 1, 5], [1, 2, 5], [2, 3, 5], [3, 4, 5]]
  };

  const graph = RabbitEar.graph(kite);
  graph.populate();
  expect(graph.vertices_coords.length).toBe(6);
  expect(graph.vertices_vertices.length).toBe(6);
  expect(graph.vertices_edges.length).toBe(6);
  expect(graph.vertices_faces.length).toBe(6);
  expect(graph.edges_vertices.length).toBe(9);
  expect(graph.edges_faces.length).toBe(9);
  expect(graph.edges_length.length).toBe(9);
  expect(graph.edges_edges.length).toBe(9);
  expect(graph.faces_vertices.length).toBe(4);
  expect(graph.faces_edges.length).toBe(4);
  expect(graph.faces_faces.length).toBe(4);
});

test("FOLD core populate, no assignments", () => {
  const blintz = {
    vertices_coords: [[0, 0], [0.5, 0], [1, 0], [1, 0.5], [1, 1], [0.5, 1], [0, 1], [0, 0.5]],
    edges_vertices: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6],
      [6, 7], [7, 0], [1, 3], [3, 5], [5, 7], [7, 1]
    ],
  };
  RabbitEar.core.populate(blintz);

  expect(blintz.edges_faces !== undefined).toBe(true);
  expect(blintz.edges_length !== undefined).toBe(true);
  expect(blintz.edges_vertices !== undefined).toBe(true);
  expect(blintz.faces_edges !== undefined).toBe(true);
  expect(blintz.faces_faces !== undefined).toBe(true);
  expect(blintz.faces_vertices !== undefined).toBe(true);
  expect(blintz.vertices_coords !== undefined).toBe(true);
  expect(blintz.vertices_edges !== undefined).toBe(true);
  expect(blintz.vertices_faces !== undefined).toBe(true);
  expect(blintz.vertices_vertices !== undefined).toBe(true);

  expect(blintz.edges_assignment === undefined).toBe(true);
  expect(blintz.edges_foldAngle === undefined).toBe(true);
});


test("FOLD core populate", () => {
  const blintz = {
    vertices_coords: [[0, 0], [0.5, 0], [1, 0], [1, 0.5], [1, 1], [0.5, 1], [0, 1], [0, 0.5]],
    edges_vertices: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6],
      [6, 7], [7, 0], [1, 3], [3, 5], [5, 7], [7, 1]
    ],
    edges_assignment: ["B", "B", "B", "B", "B", "B", "B", "B", "V", "V", "V", "V"],
  };
  RabbitEar.core.populate(blintz);

  expect(blintz.edges_faces !== undefined).toBe(true);
  expect(blintz.edges_length !== undefined).toBe(true);
  expect(blintz.edges_vertices !== undefined).toBe(true);
  expect(blintz.faces_edges !== undefined).toBe(true);
  expect(blintz.faces_faces !== undefined).toBe(true);
  expect(blintz.faces_vertices !== undefined).toBe(true);
  expect(blintz.vertices_coords !== undefined).toBe(true);
  expect(blintz.vertices_edges !== undefined).toBe(true);
  expect(blintz.vertices_faces !== undefined).toBe(true);
  expect(blintz.vertices_vertices !== undefined).toBe(true);

  expect(blintz.edges_assignment !== undefined).toBe(true);
  expect(blintz.edges_foldAngle !== undefined).toBe(true);
});
