const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");

test("implied count, empty, invalid", (done) => {
	try {
		ear.graph.countImplied.vertices();
	} catch (error) {
		expect(error).not.toBe(undefined);
		done();
	}
});

test("implied count, empty", () => {
	expect(ear.graph.countImplied.vertices({})).toBe(0);
	expect(ear.graph.countImplied.edges({})).toBe(0);
	expect(ear.graph.countImplied.faces({})).toBe(0);
});

test("irrelevant arrays", () => {
	expect(ear.graph.countImplied.edges({
		faces_vertices: [[4, 6, 7], [11, 9, 6], [14, 12, 5], [11, 6, 9]],
	})).toBe(0);
	expect(ear.graph.countImplied.faces({
		faces_vertices: [[4, 6, 7], [11, 9, 6], [14, 12, 5], [11, 6, 9]],
	})).toBe(0);
	expect(ear.graph.countImplied.vertices({
		vertices_edges: [[4, 6, 7], [11, 9, 6], [14, 12, 5], [11, 6, 9]],
	})).toBe(0);
});

test("implied vertices", () => {
	expect(ear.graph.countImplied.vertices({
		faces_vertices: [[4, 6, 7], [11, 9, 6], [14, 12, 5], [11, 6, 9]],
	})).toBe(15);
});

test("implied edgeOrders", () => {
	expect(ear.graph.countImplied.edges({
		edgeOrders: [[4, 6, 0], [11, 9, -1], [14, 12, 0], [11, 6, 1]],
	})).toBe(15);
});
