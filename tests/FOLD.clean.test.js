const RabbitEar = require("../rabbit-ear");

test("FOLD clean, no assignments", () => {
  const blintz = RabbitEar.core.clean({
    vertices_coords: [[0, 0], [0.5, 0], [1, 0], [1, 0.5], [1, 1], [0.5, 1], [0, 1], [0, 0.5]],
    edges_vertices: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6],
      [6, 7], [7, 0], [1, 3], [3, 5], [5, 7], [7, 1]
    ],
  });

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


test("FOLD clean", () => {
  const blintz = RabbitEar.core.clean({
    vertices_coords: [[0, 0], [0.5, 0], [1, 0], [1, 0.5], [1, 1], [0.5, 1], [0, 1], [0, 0.5]],
    edges_vertices: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6],
      [6, 7], [7, 0], [1, 3], [3, 5], [5, 7], [7, 1]
    ],
    edges_assignment: ["B", "B", "B", "B", "B", "B", "B", "B", "V", "V", "V", "V"],
  });

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
