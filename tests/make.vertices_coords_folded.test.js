const ear = require("../rabbit-ear");

const arraysTest = (a, b) => a
  .forEach((_, i) => expect(a[i]).toBeCloseTo(b[i]));

const fourPanel = {
  vertices_coords: [[0,0], [1,0], [2,0], [3,0], [4,0], [4,1], [3,1], [2,1], [1,1], [0,1]],
  edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 0], [1, 8], [2, 7], [3, 6]],
  edges_foldAngle: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 90, 90, 90],
  faces_vertices: [[0, 1, 8, 9], [1, 2, 7, 8], [2, 3, 6, 7], [3, 4, 5, 6]],
};

test("folded vertices_coords", () => {
  const result = ear.graph.make_vertices_coords_folded(fourPanel);
  [ [0, 0, 0],
    [1, 0, 0],
    [1, 0, 1],
    [0, 0, 1],
    [0, 0, 0],
    [0, 1, 0],
    [0, 1, 1],
    [1, 1, 1],
    [1, 1, 0],
    [0, 1, 0],
  ].forEach((point, i) => arraysTest(point, result[i]));
});

test("folded vertices_coords. starting face 1", () => {
  const result = ear.graph.make_vertices_coords_folded(fourPanel, 1);
  [
    [1, 0, 1],
    [1, 0, 0],
    [2, 0, 0],
    [2, 0, 1],
    [1, 0, 1],
    [1, 1, 1],
    [2, 1, 1],
    [2, 1, 0],
    [1, 1, 0],
    [1, 1, 1],
  ].forEach((point, i) => arraysTest(point, result[i]));
});

test("folded vertices_coords. starting face 3", () => {
  const result = ear.graph.make_vertices_coords_folded(fourPanel, 3);
  [
    [4, 0, 0],
    [4, 0, 1],
    [3, 0, 1],
    [3, 0, 0],
    [4, 0, 0],
    [4, 1, 0],
    [3, 1, 0],
    [3, 1, 1],
    [4, 1, 1],
    [4, 1, 0],
  ].forEach((point, i) => arraysTest(point, result[i]));
});
