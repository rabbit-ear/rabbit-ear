const ear = require("../rabbit-ear");

test("implied count, empty, invalid", (done) => {
  try {
    ear.graph.implied.vertices()
  } catch (error) {
    expect(error).not.toBe(undefined);
    done();
  }
});

test("implied count, empty", () => {
  expect(ear.graph.implied.vertices({})).toBe(0);
  expect(ear.graph.implied.edges({})).toBe(0);
  expect(ear.graph.implied.faces({})).toBe(0);
});

test("irrelevant arrays", () => {
  expect(ear.graph.implied.edges({
    faces_vertices: [[4, 6, 7], [11, 9, 6], [14, 12, 5], [11, 6, 9]],
  })).toBe(0);
  expect(ear.graph.implied.faces({
    faces_vertices: [[4, 6, 7], [11, 9, 6], [14, 12, 5], [11, 6, 9]],
  })).toBe(0);
  expect(ear.graph.implied.vertices({
    vertices_edges: [[4, 6, 7], [11, 9, 6], [14, 12, 5], [11, 6, 9]],
  })).toBe(0);
});

test("implied vertices", () => {
  expect(ear.graph.implied.vertices({
    faces_vertices: [[4, 6, 7], [11, 9, 6], [14, 12, 5], [11, 6, 9]],
  })).toBe(15);
});

test("implied edgeOrders", () => {
  expect(ear.graph.implied.edges({
    edgeOrders: [[4, 6, 0], [11, 9, -1], [14, 12, 0], [11, 6, 1]],
  })).toBe(15);
});
