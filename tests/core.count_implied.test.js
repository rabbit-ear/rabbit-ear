const ear = require("../rabbit-ear");

test("implied count, empty, invalid", (done) => {
  try {
    ear.core.implied.vertices()
  } catch (error) {
    expect(error).not.toBe(undefined);
    done();
  }
})

test("implied count, empty", () => {
  expect(ear.core.implied.vertices({})).toBe(0);
  expect(ear.core.implied.edges({})).toBe(0);
  expect(ear.core.implied.faces({})).toBe(0);
});

test("irrelevant arrays", () => {
  expect(ear.core.implied.edges({
    faces_vertices: [[4, 6, 7], [11, 9, 6], [14, 12, 5], [11, 6, 9]],
  })).toBe(0);
  expect(ear.core.implied.faces({
    faces_vertices: [[4, 6, 7], [11, 9, 6], [14, 12, 5], [11, 6, 9]],
  })).toBe(0);
  expect(ear.core.implied.vertices({
    vertices_edges: [[4, 6, 7], [11, 9, 6], [14, 12, 5], [11, 6, 9]],
  })).toBe(0);
})

test("implied vertices", () => {
  expect(ear.core.implied.vertices({
    faces_vertices: [[4, 6, 7], [11, 9, 6], [14, 12, 5], [11, 6, 9]],
  })).toBe(15);
});
