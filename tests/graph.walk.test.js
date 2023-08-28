const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");

test("counterClockwiseWalk", () => {
	const vertices_vertices = [
		[1, 4, 3],
		[2, 4, 0],
		[3, 4, 1],
		[0, 4, 2],
		[0, 1, 2, 3],
	];
	ear.graph.counterClockwiseWalk({ vertices_vertices }, 0, 1)
		.vertices.forEach((v, i) => expect(v).toBe([0, 1, 4][i]));
	ear.graph.counterClockwiseWalk({ vertices_vertices }, 1, 2)
		.vertices.forEach((v, i) => expect(v).toBe([1, 2, 4][i]));
	ear.graph.counterClockwiseWalk({ vertices_vertices }, 2, 3)
		.vertices.forEach((v, i) => expect(v).toBe([2, 3, 4][i]));
	ear.graph.counterClockwiseWalk({ vertices_vertices }, 3, 0)
		.vertices.forEach((v, i) => expect(v).toBe([3, 0, 4][i]));
	ear.graph.counterClockwiseWalk({ vertices_vertices }, 0, 3)
		.vertices.forEach((v, i) => expect(v).toBe([0, 3, 2, 1][i]));
});

test("counterClockwiseWalk incomplete vertices_vertices", (done) => {
	const vertices_vertices = [
		[1, 4, 3],
		[2, 4, 0],
		[3, 4, 1],
		[0, 4, 2],
	];
	try {
		ear.graph.counterClockwiseWalk({ vertices_vertices }, 0, 1);
	} catch (error) {
		expect(error).not.toBe(undefined);
		done();
	}
});

test("counterClockwiseWalk with weird circular paths", () => {
	const vertices_vertices = [
		[1, 2, 3],
		[2, 3, 0],
		[3, 0, 1],
		[0, 1, 2],
	];
	const result = ear.graph.counterClockwiseWalk({ vertices_vertices }, 0, 1);
	const expected = [0, 1, 3, 0, 2, 3, 1, 2];
	result.vertices.forEach((v, i) => expect(v).toBe(expected[i]));
});
