const ear = require("../rabbit-ear.js");
const fs = require("fs");

test("fold in 3d", () => {
  const json = fs.readFileSync("./tests/files/bird-base-3d.fold");
  // const json = fs.readFileSync("./tests/files/panels.fold");
  const cp = JSON.parse(json);
  // make edge-adjacent faces for every face
  // cp.faces_faces = ear.core.make_faces_faces(cp);
  // pick a starting face, breadth-first walk to every face
  // each of these results will relate a face to:
  // 1. each parent face in the walk
  // 2. which edge it crossed to move from the parent to this face
  // const walk = ear.core.make_face_walk_tree(cp);
  // console.log(walk);
  const faces_matrix = ear.core.make_faces_matrix(cp);
  // console.log("faces_matrix", faces_matrix);
  const vertices_faces = ear.core.make_vertices_faces(cp);
  const new_vertices_coords = cp.vertices_coords.map((coords, i) => {
    const face = vertices_faces[i][0];
    const matrix = faces_matrix[face];
    return ear.math.multiply_matrix3_vector3(matrix, ear.math.resize(3, coords));
  });
  // console.log("verts", new_vertices_coords);
  cp.vertices_coords = new_vertices_coords;
  fs.writeFileSync("./tests/files/bird-base-3d-modified.fold", JSON.stringify(cp));
  // fs.writeFileSync("./tests/files/panels-modified.fold", JSON.stringify(cp));
});
