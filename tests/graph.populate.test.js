const ear = require("../rabbit-ear");

test("populate with isolated vertex", () => {
  const graph = ear.graph({
    vertices_coords: [[0,0], [1,0], [2,0], [3,0]],
    edges_vertices: [[0, 1], [1, 2]],
    edges_foldAngle: [0, 0],
    edges_assignment: ["U", "U"],
  });
  graph.populate();
  expect(graph.vertices_coords.length).toBe(4);
  expect(graph.vertices_edges.length).toBe(3);
  expect(graph.vertices_vertices.length).toBe(3);
  expect(graph.vertices_sectors.length).toBe(3);

  expect(graph.edges_vertices.length).toBe(2);
  expect(graph.edges_vector.length).toBe(2);
  expect(graph.edges_assignment.length).toBe(2);
  expect(graph.edges_foldAngle.length).toBe(2);

  expect(graph.faces_vertices.length).toBe(0);
  expect(graph.faces_edges.length).toBe(0);
  expect(graph.faces_faces.length).toBe(0);
  expect(graph.faces_angles.length).toBe(0);
  expect(graph.faces_matrix.length).toBe(0);
});

test("populate with assignment and fold angle", () => {
  const graph1 = ear.graph({
    vertices_coords: [[0, 0], [1, 0]],
    edges_vertices: [[0, 1]],
    edges_assignment: ["M", "V", "U", "F", "B", "X"],
  });
  graph1.populate();
  expect(graph1.edges_foldAngle.length).toBe(6);
  expect(graph1.edges_foldAngle[0]).toBe(-180);
  expect(graph1.edges_foldAngle[1]).toBe(180);
  expect(graph1.edges_foldAngle[5]).toBe(0);

  const graph2 = ear.graph({
    vertices_coords: [[0, 0], [1, 0]],
    edges_vertices: [[0, 1]],
    edges_foldAngle: [-180, 180, 0, 0, 0, 0],
  });
  graph2.populate();
  expect(graph2.edges_assignment.length).toBe(6);
  expect(graph2.edges_assignment[0]).toBe("M");
  expect(graph2.edges_assignment[1]).toBe("V");
  expect(graph2.edges_assignment[5]).toBe("U");
});

test("component edges with no vertex data", () => {
  const graph = ear.graph({
    edges_faces: [[0, 1], [3, 0]],
    edges_foldAngle: [0, 0],
  });

  try {
    graph.populate();
  } catch (error) {
    expect(error).not.toBe(undefined);
  }

});