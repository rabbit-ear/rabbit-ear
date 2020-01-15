const RabbitEar = require("../rabbit-ear");

test("fold, and multiple fold protection", () => {
  const singleVertex = {
    vertices_coords: [[0,0],[1,0],[1,1],[0,1],[0.25,0.5],[1,0.76470588235294]],
    edges_vertices: [[0,1],[2,3],[3,0],[0,4],[1,4],[3,4],[1,5],[5,2],[4,5]],
  };
  const origami = RabbitEar.origami(singleVertex);
  origami.fold();
  // fold() on a graph without any faces has triggered a build on the other arrays
  expect(origami.faces_edges).not.toBe(undefined);
  expect(origami.frame_classes).toMatchObject(["foldedForm"]);
  expect(origami["vertices_re:unfoldedCoords"]).toMatchObject(singleVertex.vertices_coords);
  expect(origami.vertices_coords).not.toMatchObject(singleVertex.vertices_coords);

  // multiple fold protection
  const origami2 = RabbitEar.origami(singleVertex);
  origami2.fold();
  origami2.fold();
  origami2.fold();
  origami2.fold();
  expect(origami.vertices_coords).toMatchObject(origami2.vertices_coords);
});

test("fold and unfold graph, and multiple unfold protection", () => {
  const singleVertex = {
    vertices_coords: [[0,0],[1,0],[1,1],[0,1],[0.25,0.5],[1,0.76470588235294]],
    edges_vertices: [[0,1],[2,3],[3,0],[0,4],[1,4],[3,4],[1,5],[5,2],[4,5]],
  };

  const origami = RabbitEar.origami(singleVertex);
  origami.fold();
  expect(origami.frame_classes).toMatchObject(["foldedForm"]);
  origami.unfold();
  origami.unfold();
  origami.unfold();
  origami.unfold();
  expect(origami.vertices_coords).toMatchObject(singleVertex.vertices_coords);
});


test("fold test with faces already present", () => {
  const singleVertex = {
    frame_classes: ["creasePattern"],
    vertices_coords: [[0,0],[1,0],[1,1],[0,1],[0.25,0.5],[1,0.76470588235294]],
    edges_vertices: [[0,1],[2,3],[3,0],[0,4],[1,4],[3,4],[1,5],[5,2],[4,5]],
    edges_assignment: ["B","B","B","V","M","V","B","B","V"],
    faces_vertices: [[0,1,4],[3,0,4],[4,1,5],[5,2,3,4]]
  };

  const expectedFoldedSingleVertex = {
    frame_classes:["foldedForm"],
    vertices_coords:[
      [0,0],[1,0],[0.52,-0.36],[0.8,0.6],[0.25,0.5],[0.2941176470588246,-0.29411764705882315]
    ],
    edges_vertices: [[0,1],[2,3],[0,3],[0,4],[1,4],[3,4],[1,5],[2,5],[4,5]],
    edges_assignment: ["B","B","B","V","M","V","B","B","V"],
    faces_vertices: [[0,1,4],[3,0,4],[4,1,5],[5,2,3,4]],
    // there is also a faces matrix, but contains too many epsilon rounding vagaries
    // "faces_re:matrix": [ ... ],
    "vertices_re:unfoldedCoords": [[0,0],[1,0],[1,1],[0,1],[0.25,0.5],[1,0.76470588235294]]
  };

  const origami = RabbitEar.origami(singleVertex);
  origami.fold();
  // this should have not triggered a call to populate()
  expect(origami.faces_edges).toBe(undefined);
  expect(origami).toMatchObject(expectedFoldedSingleVertex);
});
