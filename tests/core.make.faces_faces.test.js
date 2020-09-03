const ear = require("../rabbit-ear.js");

test("make faces_faces, square", () => {
  const result = ear.core.make_faces_faces({
    faces_vertices: [[0, 1, 3], [2, 3, 1]]
  });
  expect(result.length).toBe(2);
  expect(result[0]).toEqual(expect.arrayContaining([1]));
  expect(result[1]).toEqual(expect.arrayContaining([0]));
});

test("make faces_faces, invalid faces", () => {
  const res1 = ear.core.make_faces_faces({
    faces_vertices: [[undefined], [undefined]]
  });
  expect(res1[0]).toEqual(expect.arrayContaining([1]));
  expect(res1[1]).toEqual(expect.arrayContaining([0]));
  // lol. look, it will match anything including strings
  const res2 = ear.core.make_faces_faces({ faces_vertices: [["hi"], ["hi"]] });
  expect(res2[0]).toEqual(expect.arrayContaining([1]));
  expect(res2[1]).toEqual(expect.arrayContaining([0]));
  const res3 = ear.core.make_faces_faces({ faces_vertices: [["hi"], ["bye"]] });
  expect(res3[0].length).toBe(0);
  expect(res3[1].length).toBe(0);
});

test("make faces_faces, degenerate", () => {
  // technically these edges are invalid
  const res0 = ear.core.make_faces_faces({
    faces_vertices: [[0, 0]]
  });
  expect(res0.length).toBe(1);
  expect(res0[0]).toEqual(expect.arrayContaining([0, 0]));
});

test("make faces_faces 4", (done) => {
  try {
    const result = ear.core.make_faces_faces({
      faces_vertices: [[0], [1], undefined, [2]] 
    });
  } catch (error) {
    expect(error).not.toBe(undefined);
    done();
  }
});

test("make faces_faces 5", (done) => {
  try {
    const result = ear.core.make_faces_faces();
  } catch (error) {
    expect(error).not.toBe(undefined);
    done();
  }
});

test("make faces_faces 6", (done) => {
  try {
    const result = ear.core.make_faces_faces({});
  } catch (error) {
    expect(error).not.toBe(undefined);
    done();
  }
});

test("make faces_faces 7", () => {
  const result = ear.core.make_faces_faces({ faces_vertices:[] });
  expect(result.length).toBe(0);
});
