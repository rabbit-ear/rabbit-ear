const ear = require("rabbit-ear");

// because there are no faces to build edges_faces, the question is:
// should edges_faces be empty, or contain empty arrays one for each edge
test("no face graph", () => {

  const origami = ear.origami({
    "vertices_coords": [[0,0], [0.5,0.5], [1,0]],
    "edges_vertices": [[0,1], [1,2]],
    "edges_assignment": ["B","B"]
  });

  expect(origami.edges_faces.length).toBe(0);
});


test("edges faces direction", () => {
  const graph = {
    vertices_coords: [[0,0], [1,0], [1,1], [0,1]],
    edges_vertices: [[0,1], [1,2], [2,3], [3,0], [2,0]],
    edges_assignment: ["B", "B", "B", "B", "M"],
  };
  // prepare
  const planar_faces = ear.graph.make_planar_faces(graph);
  graph.faces_vertices = planar_faces
    .map(face => face.vertices);
  graph.faces_edges = planar_faces
    .map(face => face.edges);

  const edges_faces1 = ear.graph.make_edges_faces(graph);
  expect(edges_faces1[4][0]).toBe(0);
  expect(edges_faces1[4][1]).toBe(1);

  graph.edges_vertices = [[0,1], [1,2], [2,3], [3,0], [0,2]];

  const edges_faces2 = ear.graph.make_edges_faces(graph);
  expect(edges_faces2[4][0]).toBe(1);
  expect(edges_faces2[4][1]).toBe(0);
})
