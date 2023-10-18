const fs = require("fs");
const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");

test("topological sort", () => {
	const ordering = ear.graph.topologicalSort([[5, 2], [2, 1], [5, 1], [1, 0], [1, 3]]);
	expect(JSON.stringify(ordering)).toBe(JSON.stringify([5, 2, 1, 0, 3]));
});

test("topological sort with cycle", () => {
	// note: this is an invalid ordering. the graph is a cycle.
	// but the method still returns an ordering.
	const ordering = ear.graph.topologicalSort([[5, 2], [2, 1], [1, 5]]);
	expect(JSON.stringify(ordering)).toBe(JSON.stringify([5, 2, 1]));
});

test("topological sort crane", () => {
	const testfile = fs.readFileSync("./tests/files/fold/crane.fold", "utf-8");
	const graph = JSON.parse(testfile);
	graph.faces_normal = ear.graph.makeFacesNormal(graph);
	const ordering = ear.graph.linearizeFaceOrders(graph);
	const expected = [
		37, 46, 36, 30, 2, 39, 43, 35, 29, 3, 0, 4, 28, 15, 9, 27, 22, 16, 12, 20,
		11, 19, 10, 13, 8, 14, 26, 55, 54, 51, 58, 57, 52, 53, 56, 18, 21, 17, 23,
		25, 5, 24, 31, 34, 42, 45, 40, 32, 33, 41, 44, 38, 47, 50, 7, 48, 49, 6, 1,
	];
	expect(JSON.stringify(ordering)).toBe(JSON.stringify(expected));
});

test("topological sort subset of crane faces", () => {
	// only contain orderings for a subset of the faces involved.
	const testfile = fs.readFileSync("./tests/files/fold/crane.fold", "utf-8");
	const crane = JSON.parse(testfile);
	const graph = {
		vertices_coords: crane.vertices_coords,
		faces_vertices: crane.faces_vertices,
		faceOrders: [
			[14, 12, -1],
			[14, 15, -1],
			[14, 11, 1],
			[14, 13, 1],
			[12, 15, -1],
			[11, 15, -1],
			[11, 12, -1],
			[20, 16, 1],
			[19, 20, -1],
			[19, 16, 1],
			[17, 18, -1],
			[18, 16, 1],
			[18, 19, 1],
			[18, 20, -1],
			[17, 16, 1],
			[17, 19, 1],
			[17, 20, -1],
			[13, 12, -1],
			[13, 15, -1],
			[13, 11, 1],
		],
	};
	graph.faces_normal = ear.graph.makeFacesNormal(graph);
	const ordering = ear.graph.linearizeFaceOrders(graph);
	const expected = [15, 12, 11, 13, 14, 16, 20, 19, 18, 17];
	expect(JSON.stringify(ordering)).toBe(JSON.stringify(expected));
});

test("topological sort subset of crane faces. again", () => {
	// only contain orderings for a subset of the faces involved.
	const testfile = fs.readFileSync("./tests/files/fold/crane.fold", "utf-8");
	const crane = JSON.parse(testfile);
	const graph = {
		vertices_coords: crane.vertices_coords,
		faces_vertices: crane.faces_vertices,
		faceOrders: [
			[32, 30, 1],
			[31, 35, -1],
			[32, 36, -1],
			[31, 39, -1],
			[32, 37, -1],
			[35, 39, -1],
			[36, 37, -1],
			[38, 30, 1],
			[33, 30, 1],
			[33, 36, -1],
			[38, 36, -1],
			[33, 37, -1],
			[38, 37, -1],
			[30, 36, -1],
			[30, 37, -1],
			[34, 35, -1],
			[34, 39, -1],
			[34, 31, 1],
			[33, 32, 1],
			[38, 32, 1],
			[38, 33, -1],
		],
	};
	graph.faces_normal = ear.graph.makeFacesNormal(graph);
	const ordering = ear.graph.linearizeFaceOrders(graph);
	const expected = [37, 36, 30, 39, 35, 31, 32, 33, 34, 38];
	expect(JSON.stringify(ordering)).toBe(JSON.stringify(expected));
});
