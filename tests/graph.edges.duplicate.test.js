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

test("duplicate edges", () => {
	const graph = {
		edges_vertices: [
			[0, 1],
			[1, 2],
			[2, 3],
			[3, 0],
			[0, 3],
			[0, 2],
			[1, 3],
			[0, 2],
			[0, 4],
			[1, 4],
			[2, 4],
			[3, 4],
			[4, 0],
		],
	};
	const result = ear.graph.duplicateEdges(graph);
	expect(result[4]).toBe(3);
	expect(result[7]).toBe(5);
	expect(result[12]).toBe(8);
});

test("invalid edges", () => {
	const graph1 = {
		edges_vertices: [
			[0, 1, 2],
			[3, 4, 5],
			[2, 1, 0],
		],
	};
	const result1 = ear.graph.duplicateEdges(graph1);
	expect(result1.length).toBe(0);

	const graph2 = {
		edges_vertices: [
			[0, 1, 2],
			[3, 4, 5],
			[0, 1, 2],
		],
	};
	const result2 = ear.graph.duplicateEdges(graph2);
	expect(result2[0]).toBe(undefined);
	expect(result2[1]).toBe(undefined);
	expect(result2[2]).toBe(0);
});

test("duplicate edges, invalid input 1", (done) => {
	try {
		ear.graph.duplicateEdges();
	} catch (error) {
		expect(error).not.toBe(undefined);
		done();
	}
});

test("duplicate edges, invalid input 2", () => {
	const result = ear.graph.duplicateEdges({});
	expect(result.length).toBe(0);
});

test("duplicate edges, with undefined", (done) => {
	try {
		ear.graph.duplicateEdges({
			edges_vertices: [
				[0, 1],
				undefined,
				[1, 0],
			],
		});
	} catch (error) {
		expect(error).not.toBe(undefined);
		done();
	}
});

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
