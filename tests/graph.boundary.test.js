const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");

test("boundary clip", () => {
	const graph = ear.graph({
		vertices_coords: [[0, 0], [1, 0], [1, 1], [0, 1]],
		edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 0]],
		edges_assignment: ["B", "B", "B", "B"],
	});
	const clip0 = ear.graph.clip(graph, { vector: [1, 1], origin: [0, 0] });
	expect(clip0[0][0]).toBe(0);
	expect(clip0[0][1]).toBe(0);
	expect(clip0[1][0]).toBe(1);
	expect(clip0[1][1]).toBe(1);

	const clip1 = ear.graph.clip(graph, { vector: [1, -1], origin: [1, 0] });
	expect(clip1[0][0]).toBe(0);
	expect(clip1[0][1]).toBe(1);
	expect(clip1[1][0]).toBe(1);
	expect(clip1[1][1]).toBe(0);

	const clip2 = ear.graph.clip(graph, { vector: [0, 1], origin: [0.5, 0.5] });
	expect(clip2[0][0]).toBe(0.5);
	expect(clip2[0][1]).toBe(0);
	expect(clip2[1][0]).toBe(0.5);
	expect(clip2[1][1]).toBe(1);
});
