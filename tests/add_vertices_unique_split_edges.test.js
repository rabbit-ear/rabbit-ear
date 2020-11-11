const ear = require("../rabbit-ear");

test("add_vertices_unique_split_edges", () => {
  const graph = {
    vertices_coords: [[0, 0], [1, 0]],
    edges_vertices: [[0, 1]],
    edges_foldAngle: [90],
    edges_assignment: ["V"],
  };
  ear.core.add_vertices_unique_split_edges(graph, { vertices_coords: [ [0.5, 0] ] });
  expect(graph.edges_vertices.length).toBe(2);
  expect(graph.edges_assignment.length).toBe(2);
  expect(graph.edges_foldAngle.length).toBe(2);
  expect(graph.edges_vertices[0]).toEqual(expect.arrayContaining([0, 2]));
  expect(graph.edges_vertices[1]).toEqual(expect.arrayContaining([1, 2]));
  expect(graph.edges_assignment).toEqual(expect.arrayContaining(["V", "V"]));
  expect(graph.vertices_coords.length).toBe(3);
  expect(graph.vertices_coords[2]).toEqual(expect.arrayContaining([0.5, 0]));
});

test("add_vertices_unique_split_edges", () => {
  const graph = {
    vertices_coords: [[0, 0], [1, 0]],
    edges_vertices: [[0, 1]],
    edges_foldAngle: [90],
    edges_assignment: ["V"],
  };
  const result = ear.core.add_vertices_unique_split_edges(graph, {
    vertices_coords: [
      [3, 3],
      [1, 0],
      [0.5, 0],
    ]
  });
  expect(graph.edges_vertices.length).toBe(2);
  expect(graph.edges_assignment.length).toBe(2);
  expect(graph.edges_foldAngle.length).toBe(2);
  expect(graph.edges_vertices[0]).toEqual(expect.arrayContaining([0, 3]));
  expect(graph.edges_vertices[1]).toEqual(expect.arrayContaining([1, 3]));
  expect(graph.edges_assignment).toEqual(expect.arrayContaining(["V", "V"]));
  expect(graph.vertices_coords.length).toBe(4);
  expect(graph.vertices_coords[2]).toEqual(expect.arrayContaining([3, 3]));
  expect(graph.vertices_coords[3]).toEqual(expect.arrayContaining([0.5, 0]));
  expect(result).toEqual(expect.arrayContaining([2, 1, 3]));
});

// test("add_vertices_unique_split_edges", () => {
//   const graph = {
//     vertices_coords: [[0, 0], [1, 0], [1, 1], [0, 1]],
//     edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 0], [1, 3]],
//     edges_foldAngle: [0, 0, 0, 0, 90],
//     edges_assignment: ["B", "B", "B", "B", "V"],
//     faces_vertices: [[0, 1, 3], [2, 3, 1]],
//     faces_edges: [[0, 4, 3], [1, 4, 2]],
//   };
//   ear.core.add_vertices_unique_split_edges(graph, );
// });
