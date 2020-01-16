const RabbitEar = require("../rabbit-ear");

test("FOLD clean, no assignments", () => {
  const blintz = RabbitEar.core.clean({
    vertices_coords: [[0, 0], [0.5, 0], [1, 0], [1, 0.5], [1, 1], [0.5, 1], [0, 1], [0, 0.5]],
    edges_vertices: [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6],
      [6, 7], [7, 0], [1, 3], [3, 5], [5, 7], [7, 1]
    ],
  });

  expect(true).toBe(true);
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

  expect(true).toBe(true);
});
