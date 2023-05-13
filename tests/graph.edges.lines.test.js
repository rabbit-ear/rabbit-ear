const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");

test("parallel same distance 3d", () => {
	const graph = {
		vertices_coords: [
			[-1, 5, 5], [1, 5, 5],
			[-1, -5, 5], [1, -5, 5],
			[-1, -5, -5], [1, -5, -5],
			[-1, 5, -5], [1, 5, -5],
		],
		edges_vertices: [[0, 1], [2, 3], [4, 5], [6, 7]],
	};
	const result = ear.graph.getEdgesLine(graph);
	const lines_edges = ear.graph.invertMap(result.edges_line);
	lines_edges.forEach(el => expect(typeof el).toBe("number"));
	expect(result.lines.length).toBe(4);
});

// test("parallel same distance 3d", () => {
// 	const graph = {
// 		vertices_coords: Array.from(Array(16))
// 			.map((_, i) => (i / 16) * (Math.PI * 2))
// 			.flatMap(a => [
// 				[-1, Math.cos(a), Math.sin(a)], [1, Math.cos(a), Math.sin(a)],
// 			]),
// 		edges_vertices: Array.from(Array(16))
// 			.map((_, i) => [i * 2, i * 2 + 1]),
// 	};
// 	const result = ear.graph.getEdgesLine(graph);
// 	const lines_edges = ear.graph.invertMap(result.edges_line);
// 	lines_edges.forEach(el => expect(typeof el).toBe("number"));
// 	expect(result.lines.length).toBe(16);
// });
