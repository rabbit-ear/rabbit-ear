const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");

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
