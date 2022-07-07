const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear");

test("isolated vertex", () => {
	const graph = {
		vertices_coords: [[0, 0], [0.5, 0.5], [1, 0], [1, 1], [0, 1]],
		edges_vertices: [[0, 2], [2, 3], [3, 4], [4, 0]],
		edges_assignment: ["B", "B", "B", "B"],
		faces_vertices: [[0, 2, 3, 4]],
	};
	ear.graph.populate(graph);
	expect(graph.vertices_coords.length).toBe(5);
	expect(graph.vertices_edges.length).toBe(5);
	expect(graph.vertices_faces.length).toBe(5);
	expect(graph.vertices_vertices.length).toBe(5);
	expect(JSON.stringify(graph.faces_vertices[0]))
		.toBe(JSON.stringify([0, 2, 3, 4]));

	const res = ear.graph.removeIsolatedVertices(graph);

	expect(graph.vertices_coords.length).toBe(4);
	expect(graph.vertices_edges.length).toBe(4);
	expect(graph.vertices_faces.length).toBe(4);
	expect(graph.vertices_vertices.length).toBe(4);
	expect(JSON.stringify(graph.faces_vertices[0]))
		.toBe(JSON.stringify([0, 1, 2, 3]));

	expect(res.remove[0]).toBe(1);
	expect(JSON.stringify(res.map))
		.toBe(JSON.stringify([0, undefined, 1, 2, 3]));
});
