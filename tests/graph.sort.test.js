const ear = require("../rabbit-ear");

const arraysMatch = (a, b) => a.forEach((_, i) => expect(a[i]).toBe(b[i]));

test("sort_vertices_counter_clockwise", () => {
  arraysMatch([0, 1, 2], ear.graph.sort_vertices_counter_clockwise(
    { vertices_coords: [[1, 0], [1, 0.1], [1, -0.1], [0,0]] },
    [0, 2, 1],
    3));
  arraysMatch([0, 1, 2], ear.graph.sort_vertices_counter_clockwise(
    { vertices_coords: [[1, 0], [1, 0.1], [1, -0.1], [0,0]] },
    [0, 1, 2],
    3));
  arraysMatch([0, 2, 1], ear.graph.sort_vertices_counter_clockwise(
    { vertices_coords: [[1, 0], [1, -0.1], [1, 0.1], [0,0]] },
    [0, 1, 2],
    3));
});

test("sort_vertices_along_vector", () => {
  arraysMatch([2, 1, 0], ear.graph.sort_vertices_along_vector(
    { vertices_coords:[[3, 100], [2, -90], [1, 0.01]]},
    [0,1,2],
    [1,0]));
  arraysMatch([1, 2, 0], ear.graph.sort_vertices_along_vector(
    { vertices_coords:[[3, 100], [-2, 1000000], [2, -90]]},
    [0,1,2],
    [1,0]));
  arraysMatch([0, 2, 1], ear.graph.sort_vertices_along_vector(
    { vertices_coords:[[3, 100], [-2, 1000000], [2, -90]]},
    [0,1,2],
    [-1,0]));
  arraysMatch([2, 0, 1], ear.graph.sort_vertices_along_vector(
    { vertices_coords:[[3, 100], [-2, 1000000], [2, -90]]},
    [0,1,2],
    [0, 1]));
});
