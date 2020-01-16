const RabbitEar = require("../rabbit-ear");

const graph = {
  file_spec: 1.1,
  file_creator: "Rabbit Ear",
  file_classes: ["singleModel"],
  frame_attributes: ["2D"],
  frame_classes: ["creasePattern"],
  vertices_coords: [[0,1],[1,0],[0.2928932188134524,0.2928932188134526],[0,0],[0.7071067811865475,0.7071067811865476],[1,1]],
  edges_vertices: [[1,3],[0,3],[1,5],[0,5]],
  edges_assignment: ["B","B","B","B"],
  edges_foldAngle: [0,0,0,0],
  edges_length: [1,1,1,1],
  vertices_vertices: [[3,5],[5,3],[],[1,0],[],[1,0]],
  faces_vertices: [[5,0,3,1]],
  faces_edges: [[3,1,0,2]],
  edges_faces: [[0],[0],[0],[0]],
  vertices_faces: [[0],[0],[],[0],[],[0]],
  faces_faces: [[]],
  vertices_edges: [[1,3],[0,2],null,[0,1],null,[2,3]]
};

// todo: edge-isolated and face-isolated

test("isolated vertices", () => {
  const isolated = RabbitEar.core.find_isolated_vertices(graph);
  expect(isolated.length).toBe(2);
  expect(isolated[0]).toBe(2);
  expect(isolated[1]).toBe(4);
});
