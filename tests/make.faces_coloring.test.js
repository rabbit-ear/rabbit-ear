const ear = require("../rabbit-ear");
const fs = require("fs");

test("faces_coloring", () => {
  const craneJSON = fs.readFileSync("./tests/files/crane.fold");
  const crane = JSON.parse(craneJSON);
  const tree = ear.graph.make_face_spanning_tree(crane);
  const winding = ear.graph.make_faces_winding(crane);
  crane.faces_matrix = ear.graph.make_faces_matrix(crane);
  const coloring2 = ear.graph.make_faces_winding_from_matrix(crane.faces_matrix);
  expect(winding.length).toBe(coloring2.length);
  winding.forEach((color, i) => expect(color).toBe(coloring2[i]));
});
