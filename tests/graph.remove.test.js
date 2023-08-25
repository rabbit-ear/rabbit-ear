const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");

test("populated graph, order of remove", () => {
	const graph1 = ear.graph.fish();
	const graph2 = ear.graph.fish();
	const graph3 = ear.graph.fish();
	const graph4 = ear.graph.fish();
	const graph5 = ear.graph.fish();
	const graph6 = ear.graph.fish();
	const remove = {
		vertices: [0],
		edges: [0, 4, 7, 16, 20],
		faces: [0, 1, 2, 3],
	};
	ear.graph.remove(graph1, "vertices", remove.vertices);
	ear.graph.remove(graph1, "edges", remove.edges);
	ear.graph.remove(graph1, "faces", remove.faces);

	ear.graph.remove(graph2, "vertices", remove.vertices);
	ear.graph.remove(graph2, "faces", remove.faces);
	ear.graph.remove(graph2, "edges", remove.edges);

	ear.graph.remove(graph3, "edges", remove.edges);
	ear.graph.remove(graph3, "vertices", remove.vertices);
	ear.graph.remove(graph3, "faces", remove.faces);

	ear.graph.remove(graph4, "edges", remove.edges);
	ear.graph.remove(graph4, "faces", remove.faces);
	ear.graph.remove(graph4, "vertices", remove.vertices);

	ear.graph.remove(graph5, "faces", remove.faces);
	ear.graph.remove(graph5, "vertices", remove.vertices);
	ear.graph.remove(graph5, "edges", remove.edges);

	ear.graph.remove(graph6, "faces", remove.faces);
	ear.graph.remove(graph6, "edges", remove.edges);
	ear.graph.remove(graph6, "vertices", remove.vertices);

	expect(JSON.stringify(graph1)).toBe(JSON.stringify(graph2));
	expect(JSON.stringify(graph2)).toBe(JSON.stringify(graph3));
	expect(JSON.stringify(graph3)).toBe(JSON.stringify(graph4));
	expect(JSON.stringify(graph4)).toBe(JSON.stringify(graph5));
	expect(JSON.stringify(graph5)).toBe(JSON.stringify(graph6));
});

test("populated graph, order of remove, no zero indexed elements", () => {
	const graph1 = ear.graph.fish();
	const graph2 = ear.graph.fish();
	const graph3 = ear.graph.fish();
	const graph4 = ear.graph.fish();
	const graph5 = ear.graph.fish();
	const graph6 = ear.graph.fish();
	const remove = {
		vertices: [2],
		edges: [1, 8, 9, 11, 13],
		faces: [6, 7, 8, 9],
	};

	ear.graph.remove(graph1, "vertices", remove.vertices);
	ear.graph.remove(graph1, "edges", remove.edges);
	ear.graph.remove(graph1, "faces", remove.faces);

	ear.graph.remove(graph2, "vertices", remove.vertices);
	ear.graph.remove(graph2, "faces", remove.faces);
	ear.graph.remove(graph2, "edges", remove.edges);

	ear.graph.remove(graph3, "edges", remove.edges);
	ear.graph.remove(graph3, "vertices", remove.vertices);
	ear.graph.remove(graph3, "faces", remove.faces);

	ear.graph.remove(graph4, "edges", remove.edges);
	ear.graph.remove(graph4, "faces", remove.faces);
	ear.graph.remove(graph4, "vertices", remove.vertices);

	ear.graph.remove(graph5, "faces", remove.faces);
	ear.graph.remove(graph5, "vertices", remove.vertices);
	ear.graph.remove(graph5, "edges", remove.edges);

	ear.graph.remove(graph6, "faces", remove.faces);
	ear.graph.remove(graph6, "edges", remove.edges);
	ear.graph.remove(graph6, "vertices", remove.vertices);

	expect(JSON.stringify(graph1)).toBe(JSON.stringify(graph2));
	expect(JSON.stringify(graph2)).toBe(JSON.stringify(graph3));
	expect(JSON.stringify(graph3)).toBe(JSON.stringify(graph4));
	expect(JSON.stringify(graph4)).toBe(JSON.stringify(graph5));
	expect(JSON.stringify(graph5)).toBe(JSON.stringify(graph6));
});

test("populated graph", () => {
	const expectedOld = {
		vertices_coords: [
			[0, 0], [1, 0], [0, 1], [0.5, 0.5], [0.2928932188134524, 0.7071067811865476],
			[0.7071067811865476, 0.2928932188134524], [1, 0.2928932188134524],
			[0.2928932188134524, 1], [0.7071067811865476, 0], [0, 0.7071067811865476],
		],
		vertices_vertices: [
			[8, 5, 3, 4, 9], [6, 5, 8], [7, 9, 4], [null, 4, 0, 5], [null, 7, 2, 9, 0, 3],
			[6, null, 3, 0, 8, 1], [null, 5, 1], [null, 2, 4], [1, 5, 0], [4, 2, 0],
		],
		vertices_edges: [
			[11, 6, 0, 3, 15], [7, 4, 12], [9, 14, 2], [null, 1, 0, 5],
			[null, 10, 2, 16, 3, 1], [8, null, 5, 6, 13, 4], [null, 8, 7],
			[null, 9, 10], [12, 13, 11], [16, 14, 15],
		],
		vertices_faces: [
			[0, 1, 2, 3, null], [4, 5, null], [null, 6, 7], [null, 2, 1, null],
			[null, 7, 6, 3, 2, null], [null, null, 1, 0, 5, 4], [null, 4, null],
			[null, 7, null], [5, 0, null], [6, null, 3],
		],
		edges_vertices: [
			[0, 3], [3, 4], [4, 2], [0, 4], [1, 5], [5, 3], [0, 5], [1, 6], [5, 6],
			[7, 2], [4, 7], [0, 8], [8, 1], [5, 8], [2, 9], [9, 0], [4, 9],
		],
		edges_faces: [
			[1, 2], [2, null], [6, 7], [2, 3], [4, 5], [1, null], [0, 1], [4],
			[4, null], [7], [null, 7], [0], [5], [0, 5], [6], [3], [3, 6],
		],
		edges_assignment: [
			"F", "F", "V", "V", "V", "F", "V", "B", "F", "B", "F", "B", "B", "M", "B", "B", "M",
		],
		edges_foldAngle: [
			0, 0, 180, 180, 180, 0, 180, 0, 0, 0, 0, 0, 0, -180, 0, 0, -180,
		],
		faces_vertices: [
			[0, 8, 5], [0, 5, 3], [0, 3, 4], [0, 4, 9], [1, 6, 5],
			[1, 5, 8], [2, 9, 4], [2, 4, 7],
		],
		faces_edges: [
			[13, 6, 11], [5, 0, 6], [1, 3, 0], [16, 15, 3], [8, 4, 7],
			[13, 12, 4], [16, 2, 14], [10, 9, 2],
		],
		faces_faces: [
			[5, 1], [0, null, 2], [1, null, 3], [2, 6], [null, 5],
			[0, 4], [3, 7], [null, 6],
		],
	};
	const expected = {
		vertices_coords: [
			[0, 0], [1, 0], [0, 1], [0.5, 0.5], [0.2928932188134524, 0.7071067811865476],
			[0.7071067811865476, 0.2928932188134524], [1, 0.2928932188134524],
			[0.2928932188134524, 1], [0.7071067811865476, 0], [0, 0.7071067811865476],
		],
		edges_vertices: [
			[0, 3], [3, 4], [4, 2], [0, 4], [1, 5], [5, 3], [0, 5], [1, 6], [5, 6],
			[7, 2], [4, 7], [0, 8], [8, 1], [5, 8], [2, 9], [9, 0], [4, 9],
		],
		edges_assignment: [
			"F", "F", "V", "V", "V", "F", "V", "B", "F", "B", "F", "B", "B", "M", "B", "B", "M",
		],
		vertices_edges: [
			[11, 6, 0, 3, 15], [7, 4, 12], [9, 14, 2], [1, 0, 5], [10, 2, 16, 3, 1],
			[8, 5, 6, 13, 4], [8, 7], [9, 10], [12, 13, 11], [16, 14, 15],
		],
		vertices_vertices: [
			[8, 5, 3, 4, 9], [6, 5, 8], [7, 9, 4], [4, 0, 5], [7, 2, 9, 0, 3],
			[6, 3, 0, 8, 1], [5, 1], [2, 4], [1, 5, 0], [4, 2, 0],
		],
		edges_foldAngle: [
			0, 0, 180, 180, 180, 0, 180, 0, 0, 0, 0, 0, 0, -180, 0, 0, -180,
		],
		faces_vertices: [
			[0, 8, 5], [0, 5, 3], [0, 3, 4], [0, 4, 9], [1, 6, 5], [1, 5, 8], [2, 9, 4], [2, 4, 7],
		],
		faces_edges: [
			[13, 6, 11], [5, 0, 6], [1, 3, 0], [16, 15, 3], [8, 4, 7],
			[13, 12, 4], [16, 2, 14], [10, 9, 2],
		],
		vertices_faces: [
			[0, 1, 2, 3], [4, 5], [6, 7], [2, 1], [7, 6, 3, 2], [1, 0, 5, 4], [4], [7], [5, 0], [6, 3],
		],
		edges_faces: [
			[1, 2], [2], [6, 7], [2, 3], [4, 5], [1], [0, 1], [4], [4],
			[7], [7], [0], [5], [0, 5], [6], [3], [3, 6],
		],
		faces_faces: [
			[5, 1], [0, 2], [1, 3], [2, 6], [5], [0, 4], [3, 7], [6],
		],
	};
	const graph = ear.graph.fish();
	const remove = {
		vertices: [2],
		edges: [1, 8, 9, 11, 13],
		faces: [6, 7, 8, 9],
	};
	ear.graph.remove(graph, "vertices", remove.vertices);
	ear.graph.remove(graph, "edges", remove.edges);
	ear.graph.remove(graph, "faces", remove.faces);
	Object.keys(expected).forEach(key => {
		expect(JSON.stringify(graph[key])).toBe(JSON.stringify(expected[key]));
	});
});

const testGraph = () => Object.assign({}, {
	vertices_coords: [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7]],
	edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0]],
	edges_string: ["a", "b", "c", "d", "e", "f", "g"],
	faces_vertices: [[0, 1, 2, 3, 4, 5, 6]],
});

test("remove graph", () => {
	const graph = testGraph();
	const res = ear.graph.remove(graph, "vertices", [2, 3]);
	[0, 1, undefined, undefined, 2, 3, 4].forEach((el, i) => expect(el).toBe(res[i]));
});

test("few params", () => {
	const res1 = ear.graph.remove({ abc_def: [[1, 2, 3]] }, "abc", [0]);
	expect(res1.length).toBe(1);
	expect(res1[0]).toBe(undefined);

	const res2 = ear.graph.remove({ abc_def: [[1, 2, 3], [4, 5, 6]] }, "abc", [0]);
	expect(res2.length).toBe(2);
	expect(res2[0]).toBe(undefined);
	expect(res2[1]).toBe(0);
});
