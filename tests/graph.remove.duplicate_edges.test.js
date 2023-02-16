const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");

test("duplicate edges", () => {
	const graph = {
		vertices_coords: [[0, 0], [1, 0], [1, 1], [0, 1], [0.5, 0.5]],
		edges_vertices: [[0, 1], [1, 2], [2, 4], [4, 2], [2, 3], [3, 0]],
		edges_assignment: ["B", "B", "B", "B", "B", "B"],
		faces_vertices: [[0, 1, 2, 4, 2, 3]],
		faces_edges: [[0, 1, 2, 3, 4, 5]],
	};
	ear.graph.populate(graph);
	ear.graph.removeDuplicateEdges(graph);

	// removeDuplicateEdges now automatically fixes the vertices
	// we don't need to run populate
	// expect(graph.vertices_vertices[2].length).toBe(4);
	// expect(graph.vertices_edges[2].length).toBe(4);
	// ear.graph.populate(graph);

	expect(graph.vertices_vertices[2].length).toBe(3);
	expect(graph.vertices_edges[2].length).toBe(3);
});
