const ear = require("../rabbit-ear");

test("count, empty, invalid", (done) => {
  try {
    ear.core.count.vertices()
  } catch (error) {
    expect(error).not.toBe(undefined);
    done();
  }
});

test("count, empty", () => {
  expect(ear.core.count.vertices({})).toBe(0);
  expect(ear.core.count.edges({})).toBe(0);
  expect(ear.core.count.faces({})).toBe(0);
});

test("irrelevant arrays", () => {
  expect(ear.core.count.vertices({
    faces_edges: [[4, 6, 7], [11, 9, 6], [14, 12, 5], [11, 6, 9]],
    edges_vertices: [[4, 6], [11, 9], [14, 12], [11, 6]],
  })).toBe(0);
  expect(ear.core.count.edges({
    vertices_coords: [[1, 0], [1, 1], [0, 1], [0.5, 0.5], [0, 0]],
    faces_vertices: [[4, 6, 7], [11, 9, 6], [14, 12, 5], [11, 6, 9]],
  })).toBe(0);
  expect(ear.core.count.faces({
    vertices_coords: [[1, 0], [1, 1], [0, 1], [0.5, 0.5], [0, 0]],
    edges_vertices: [[4, 6], [11, 9], [14, 12], [11, 6]],
  })).toBe(0);
});

test("relevant arrays", () => {
  expect(ear.core.count.vertices({
    vertices_coords: [[1, 0], [1, 1], [0, 1], [0.5, 0.5], [0, 0]],
    faces_vertices: [[4, 6, 7], [11, 9, 6], [14, 12, 5], [11, 6, 9]],
  })).toBe(5);
  expect(ear.core.count.edges({
    vertices_coords: [[1, 0], [1, 1], [0, 1], [0.5, 0.5], [0, 0]],
    edges_vertices: [[4, 6], [11, 9], [14, 12], [11, 6]],
  })).toBe(4);
  expect(ear.core.count.faces({
    faces_edges: [[4, 6, 7], [11, 9, 6], [14, 12, 5], [11, 6, 9]],
    edges_vertices: [[4, 6], [11, 9], [14, 12], [11, 6]],
  })).toBe(4);
});

test("vertices count", () => {
  expect(ear.core.count.vertices({
    vertices_coords: [[1, 0], [1, 1], [0, 1], [0.5, 0.5], [0, 0]],
  })).toBe(5);
  expect(ear.core.count.vertices({
    vertices_faces: [[1, 0], [1, 1], [0, 1], [0.5, 0.5], [0, 0]],
  })).toBe(5);
});

test("non standard geometry", () => {
  expect(ear.core.count.vertices({
    vertices_fakeGeometry: [[1, 0], [1, 1], [0, 1], [0.5, 0.5], [0, 0]],
  })).toBe(0);
});

test("edges count", () => {
  expect(ear.core.count.edges({
    edges_vertices: [[4, 6], [11, 9], [14, 12], [11, 6]],
  })).toBe(4);
});

test("edges count edgeOrders", () => {
  expect(ear.core.count.edges({
    edgeOrders: [[4, 6, 0], [11, 9, -1], [14, 12, 0], [11, 6, 1]],
  })).toBe(0);
});
