const ear = require("../rabbit-ear");
const fs = require("fs");

test("faces_coloring", () => {
  const craneJSON = fs.readFileSync("./tests/files/crane.fold");
  const crane = JSON.parse(craneJSON);
  const tree = ear.core.make_face_walk_tree(crane);
  const coloring = ear.core.make_faces_coloring(crane);
  crane.faces_matrix = ear.core.make_faces_matrix(crane);
  const coloring2 = ear.core.make_faces_coloring_from_matrix(crane);
  expect(coloring.length).toBe(coloring2.length);
  coloring.forEach((color, i) => expect(color).toBe(coloring2[i]));
});
