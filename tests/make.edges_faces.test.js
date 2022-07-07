const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear");

test("edges_faces square", () => {
	const result = ear.graph.makeEdgesFaces({
		faces_edges: [[0, 4, 3], [1, 2, 4]],
	});
	expect(result[0]).toEqual(expect.arrayContaining([0]));
	expect(result[1]).toEqual(expect.arrayContaining([1]));
	expect(result[2]).toEqual(expect.arrayContaining([1]));
	expect(result[3]).toEqual(expect.arrayContaining([0]));
	expect(result[4]).toEqual(expect.arrayContaining([0, 1]));
});

test("edges_faces", () => {
	const result = ear.graph.makeEdgesFaces({
		faces_edges: [[8, 7, 6], [5, 4, 3]],
	});
	expect(result[0].length).toBe(0);
	expect(result[1].length).toBe(0);
	expect(result[2].length).toBe(0);
	expect(result[3]).toEqual(expect.arrayContaining([1]));
	expect(result[4]).toEqual(expect.arrayContaining([1]));
	expect(result[5]).toEqual(expect.arrayContaining([1]));
	expect(result[6]).toEqual(expect.arrayContaining([0]));
	expect(result[7]).toEqual(expect.arrayContaining([0]));
	expect(result[8]).toEqual(expect.arrayContaining([0]));
});
