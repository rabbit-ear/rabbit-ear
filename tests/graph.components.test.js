const ear = require("../rabbit-ear");

test("components", () => {
  const graph = ear.graph({
    vertices_coords: [[0,0], [1,0], [2,0], [3,0], [4,0], [4,1], [3,1], [2,1], [1,1], [0,1]],
    edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 0], [1, 8], [2, 7], [3, 6]],
    edges_foldAngle: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 90, 90, 90],
    edges_assignment: ["B", "B", "B", "B", "B", "B", "B", "B", "B", "B", "V", "V", "V", "V"]
  });
  graph.populate();
  expect(graph.vertices[5].coords[0]).toBe(4);
  expect(graph.vertices[5].coords[1]).toBe(1);
  expect(graph.vertices[5].vertices).not.toBe(undefined);
  expect(graph.vertices[5].edges).not.toBe(undefined);
  // expect(graph.vertices[5].sectors).not.toBe(undefined);
});

test("components with isolated vertex", () => {
  const graph = ear.graph({
    vertices_coords: [[0,0], [1,0], [2,0], [3,0]],
    edges_vertices: [[0, 1], [1, 2]],
    edges_foldAngle: [0, 0],
    edges_assignment: ["U", "U"],
  });
  graph.populate();

  expect(graph.vertices[3].coords).not.toBe(undefined);
  expect(graph.vertices[3].edges).toBe(undefined);
  expect(graph.vertices[3].vertices).toBe(undefined);
  // expect(graph.vertices[3].sectors).toBe(undefined);
  expect(graph.vertices[3].degree).toBe(null);

  expect(graph.edges.length).toBe(2);
  expect(graph.edges[0].assignment).toBe("U");
  expect(graph.edges[1].coords[1][0]).toBe(2);
  expect(graph.edges[1].coords[1][1]).toBe(0);
  expect(graph.edges[0].foldAngle).toBe(0);
  // expect(graph.edges[0].vector[0]).toBe(1);
  // expect(graph.edges[0].vector[1]).toBe(0);
  expect(graph.edges[0].vertices[0]).toBe(0);
  expect(graph.edges[0].vertices[1]).toBe(1);
});

test("component edges with no vertex data", () => {
  const graph = ear.graph({
    edges_faces: [[0, 1], [3, 0]],
    edges_foldAngle: [0, 0],
  });
  expect(graph.edges.length).toBe(2);
  expect(graph.edges[0].coords).toBe(undefined);
});


test("face components", () => {
  const graph = ear.graph({
    vertices_coords: [[0,0], [1,0], [1,1]],
    edges_vertices: [[0, 1], [1, 2], [2, 0]],
    edges_foldAngle: [0, 0, 0],
    edges_assignment: ["U", "U", "U"],
  });
  graph.populate();
  expect(graph.faces.length).toBe(1);
  expect(graph.faces[0].coords.length).toBe(3);
  expect(graph.faces[0].coords[2][0]).toBe(1);
  expect(graph.faces[0].coords[2][1]).toBe(1);
  expect(graph.faces[0].simple).toBe(true);
});

test("face components with no faces, building faces", () => {
  const graph = ear.graph({
    vertices_coords: [[0,0], [1,0], [1,1]],
    edges_vertices: [[0, 1], [1, 2], [2, 0]],
    edges_assignment: ["U", "U", "U"],
  });
  expect(graph.faces.length).toBe(1);
});

test("face component with no vertices coords", () => {
  const graph = ear.graph({
    edges_vertices: [[0, 1], [1, 2], [2, 0]],
    edges_assignment: ["U", "U", "U"],
    faces_vertices: [[0, 1, 2]],
    faces_edges: [[0, 1, 2]]
  });
  expect(graph.faces.length).toBe(1);
  expect(graph.faces[0].coords).toBe(undefined);
  expect(graph.faces[0].vertices.length).toBe(3);
  expect(graph.faces[0].simple).toBe(true);
});

test("face component with no vertices", () => {
  const graph = ear.graph({
    edges_vertices: [[0, 1], [1, 2], [2, 0]],
    faces_edges: [[0, 1, 2]]
  });
  expect(graph.faces.length).toBe(1);
  expect(graph.faces[0].simple).toBe(true);
});

test("face simple property", () => {
  const graph = ear.graph({
    vertices_coords: [[0,0], [1,0], [1,1], [0,1]],
    edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2]],
    faces_vertices: [[0, 1, 2], [2, 3, 0]],
    faces_edges: [[0, 1, 4], [2, 3, 4]],
  });
  expect(graph.faces.length).toBe(2);
  expect(graph.faces[0].simple).toBe(true);
  expect(graph.faces[1].simple).toBe(true);
});

test("nearest", () => {
  const graph = ear.graph({
    vertices_coords: [[0,0], [1,0], [2,0], [3,0], [4,0], [4,1], [3,1], [2,1], [1,1], [0,1]],
    edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 0], [1, 8], [2, 7], [3, 6]],
    edges_foldAngle: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 90, 90, 90],
    edges_assignment: ["B", "B", "B", "B", "B", "B", "B", "B", "B", "B", "V", "V", "V", "V"]
  });
  expect(graph.nearest(2.6, 0.6).vertex).toBe(6);
})
