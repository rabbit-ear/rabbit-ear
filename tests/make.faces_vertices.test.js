const ear = require("../rabbit-ear");
const fs = require("fs");

test("faces_vertices", () => {
  const craneJSON = fs.readFileSync("./tests/files/crane.fold");
  const crane = JSON.parse(craneJSON);
  delete crane.faces_vertices;
  // crane.vertices_vertices = ear.core.make_vertices_vertices(crane);
  crane.faces_vertices = ear.core.make_faces_vertices(crane);
  console.log(crane.faces_vertices);
  fs.writeFileSync("./tests/files/crane-faces-rebuilt.fold", JSON.stringify(crane), "utf8");

  // console.log(ear.core.make_vertices_vertices_vector(crane));
  // console.log(ear.core.make_vertex_pair_to_edge_map_directional(crane));
  // console.log(crane.vertices_sectors);
});
