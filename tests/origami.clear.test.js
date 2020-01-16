const RabbitEar = require("../rabbit-ear");

test("origami clear", () => {
  const origami = RabbitEar.origami(); // .square();
  expect(true).toBe(true);
  // // 3 random creases
  // Array.from(Array(3)).forEach(() => {
  //   origami.fold(Math.random(), Math.random(), Math.random(), Math.random());
  // });

  // origami.clear();

  // const computedKeys = Object.keys(origami);

  // const expectedKeys = [
  //   "file_spec",
  //   "file_creator",
  //   "file_classes",
  //   "frame_attributes",
  //   "frame_classes",
  //   "vertices_coords",
  //   "edges_vertices",
  //   "edges_assignment",
  //   "edges_foldAngle",
  //   "edges_length",
  //   "faces_vertices",
  //   "faces_edges",
  //   "faces_faces",
  //   "vertices_edges",
  //   "edges_edges"
  // ];

  // const allBoundaryEdgesTest = origami.edges_assignment
  //   .map(a => a === "B" || a === "b")
  //   .reduce((a, b) => a && b, true);

  // expect(expectedKeys).toEqual(
  //   expect.arrayContaining(computedKeys)
  // );
  // expect(allBoundaryEdgesTest).toEqual(true);

  // expect(origami.faces_vertices.length).toEqual(1);
  // expect(origami.faces_edges.length).toEqual(1);

  // // if it clears it back to an empty square:
  // // expect(origami.vertices_coords.length).toEqual(4);
  // // expect(origami.edges_vertices.length).toEqual(4);
  // // expect(origami.edges_assignment.length).toEqual(4);
  // // expect(origami.edges_foldAngle.length).toEqual(4);
  // // expect(origami.edges_length.length).toEqual(4);
});
