const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear");

test("duplicate edges", () => {
	const graph = {
		vertices_coords: [[0, 0], [1, 0], [1, 1], [0, 1], [0.5, 0.5]],
		edges_vertices: [[0, 1], [1, 2], [2, 4], [4, 2], [2, 3], [3, 0]],
		edges_assignment: ["B", "B", "B", "B", "B", "B"],
		faces_vertices: [[0, 1, 2, 4, 2, 3]],
		faces_edges: [[0, 1, 2, 3, 4, 5]],
	};
	ear.graph.populate(graph);
	expect(graph.faces_faces[0].length).toBe(0);
});
