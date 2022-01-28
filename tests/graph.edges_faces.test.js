const ear = require("rabbit-ear");

// because there are no faces to build edges_faces, the question is:
// should edges_faces be empty, or contain empty arrays one for each edge
test("no face graph", () => {

  const origami = ear.origami({
    "vertices_coords": [[0,0], [0.5,0.5], [1,0]],
    "edges_vertices": [[0,1], [1,2]],
    "edges_assignment": ["B","B"]
  }).populate()

  expect(origami.edges_faces.length).toBe(2);
});
