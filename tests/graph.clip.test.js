const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");

test("clip line", () => {
	const graph = {
		vertices_coords: [[0, 0], [1, 0], [1, 1], [0, 1]],
		edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 0], [1, 3]],
		edges_foldAngle: [0, 0, 0, 0, 90],
		edges_assignment: ["B", "B", "B", "B", "V"],
		faces_vertices: [[0, 1, 3], [2, 3, 1]],
	};
	const line0 = { vector: [1, 2], origin: [0.5, 0.5] };
	const segment0 = ear.graph.clip(graph, line0);
	expect(segment0[0][0]).toBe(0.25);
	expect(segment0[0][1]).toBe(0);
	expect(segment0[1][0]).toBe(0.75);
	expect(segment0[1][1]).toBe(1);

	const line1 = { vector: [1, 1], origin: [0.5, 0.5] };
	const segment1 = ear.graph.clip(graph, line1);
	expect(segment1[0][0]).toBe(0);
	expect(segment1[0][1]).toBe(0);
	expect(segment1[1][0]).toBe(1);
	expect(segment1[1][1]).toBe(1);
});

test("clip line exclusive, edges collinear", () => {
	// expect(ear.graph.clip(graph, ear.line([1, 0], [0, 1]))).toBe(undefined);
	const cp = ear.graph.square();
	// const boundary = ear
	// 	.polygon(cp.boundary.vertices.map(v => cp.vertices_coords[v]));
	// boundary.exclusive();
	// expect(boundary.clip({ vector: [1, 0], origin: [0, 1] })).toBe(undefined);
	// expect(boundary.clip({ vector: [1, 0], origin: [0, 0] })).toBe(undefined);
	// expect(boundary.clip({ vector: [-1, 0], origin: [0, 0] })).toBe(undefined);
	// expect(boundary.clip({ vector: [0, 1], origin: [0, 0] })).toBe(undefined);
	// expect(boundary.clip({ vector: [0, -1], origin: [0, 0] })).toBe(undefined);
	// expect(boundary.clip({ vector: [1, 0], origin: [0, 0] })).toBe(undefined);
	const boundary = cp.boundary.vertices.map(v => cp.vertices_coords[v]);

	expect(ear.math.clipLineConvexPolygon(
		boundary,
		{ vector: [1, 0], origin: [0, 1] },
		ear.math.exclude,
	)).toBe(undefined);
	expect(ear.math.clipLineConvexPolygon(
		boundary,
		{ vector: [1, 0], origin: [0, 0] },
		ear.math.exclude,
	)).toBe(undefined);
	expect(ear.math.clipLineConvexPolygon(
		boundary,
		{ vector: [-1, 0], origin: [0, 0] },
		ear.math.exclude,
	)).toBe(undefined);
	expect(ear.math.clipLineConvexPolygon(
		boundary,
		{ vector: [0, 1], origin: [0, 0] },
		ear.math.exclude,
	)).toBe(undefined);
	expect(ear.math.clipLineConvexPolygon(
		boundary,
		{ vector: [0, -1], origin: [0, 0] },
		ear.math.exclude,
	)).toBe(undefined);
	expect(ear.math.clipLineConvexPolygon(
		boundary,
		{ vector: [1, 0], origin: [0, 0] },
		ear.math.exclude,
	)).toBe(undefined);
});

test("clip ray", () => {
	const square = ear.graph.square();
	const ray0 = { vector: [0.1, -0.5], origin: [0.5, 0.5] };
	ray0.domain = ear.math.includeR;
	const seg = ear.graph.clip(square, ray0);
	expect(seg[0][0]).toBe(0.5);
	expect(seg[0][1]).toBe(0.5);
	expect(seg[1][0]).toBe(0.6);
	expect(seg[1][1]).toBe(0);
});
