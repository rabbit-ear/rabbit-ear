const ear = require("../rabbit-ear.js");

const testGraph = () => Object.assign({}, {
  vertices_coords: [[1,1], [2,2], [3,3], [4,4], [5,5], [6,6], [7,7]],
  edges_vertices: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6], [6,0]],
  edges_string: ["a", "b", "c", "d", "e", "f", "g"],
  faces_vertices: [[0, 1, 2, 3, 4, 5, 6]],
});

test("remove graph", () => {
  const graph = testGraph();
  const res = ear.graph.remove(graph, "vertices", [2, 3]);
  [ 0, 1, undefined, undefined, 2, 3, 4 ].forEach((el, i) => expect(el).toBe(res[i]));
});
