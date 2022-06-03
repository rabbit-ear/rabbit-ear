const ear = require("../rabbit-ear");

test("clip line", () => {
	const graph = {
		vertices_coords: [[0, 0], [1, 0], [1, 1], [0, 1]],
		edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 0], [1, 3]],
		edges_foldAngle: [0, 0, 0, 0, 90],
		edges_assignment: ["B", "B", "B", "B", "V"],
		faces_vertices: [[0, 1, 3], [2, 3, 1]],
	};
	const segment0 = ear.graph.clip(graph, ear.line([1, 2], [0.5, 0.5]));
	expect(segment0[0][0]).toBe(0.25);
	expect(segment0[0][1]).toBe(0);
	expect(segment0[1][0]).toBe(0.75);
	expect(segment0[1][1]).toBe(1);

	const segment1 = ear.graph.clip(graph, ear.line([1, 1], [0.5, 0.5]));
	expect(segment1[0][0]).toBe(0);
	expect(segment1[0][1]).toBe(0);
	expect(segment1[1][0]).toBe(1);
	expect(segment1[1][1]).toBe(1);

});

test("clip line exclusive, edges collinear", () => {
	// expect(ear.graph.clip(graph, ear.line([1, 0], [0, 1]))).toBe(undefined);
	const boundary = ear.graph.unit_square().boundary;
	boundary.exclusive();
	expect(boundary.clip(ear.line([1, 0], [0, 1]))).toBe(undefined);
	expect(boundary.clip(ear.line([1, 0], [0, 0]))).toBe(undefined);
	expect(boundary.clip(ear.line([-1, 0], [0, 0]))).toBe(undefined);
	expect(boundary.clip(ear.line([0, 1], [0, 0]))).toBe(undefined);
	expect(boundary.clip(ear.line([0, -1], [0, 0]))).toBe(undefined);
	expect(boundary.clip(ear.line([1, 0], [0, 0]))).toBe(undefined);
});

test("clip ray", () => {
	const square = ear.graph.unit_square();
	const seg = ear.graph.clip(square, ear.ray([0.1, -0.5], [0.5, 0.5]));
	expect(seg[0][0]).toBe(0.5);
	expect(seg[0][1]).toBe(0.5);
	expect(seg[1][0]).toBe(0.6);
	expect(seg[1][1]).toBe(0);
});

