const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");

test("", () => {
	const res = ear.graph.getEdgesSegmentIntersection(ear.cp.fish(), [0.7, 0.9], [1, 1]);
	expect(res.filter(() => true).length).toBe(5);
	res.forEach(p => expect(p[0]).toBe(1));
	res.forEach(p => expect(p[1]).toBe(1));
});

test("", () => {
	const res = ear.graph.getEdgesSegmentIntersection(ear.cp.fish(), [0.45, 0.45], [0.55, 0.55]);
	expect(res.filter(() => true).length).toBe(2);
});

test("", () => {
	const res = ear.graph.getEdgesSegmentIntersection(ear.cp.fish(), [0.2, 0.1], [0.1, 0.2]);
	expect(res.filter(() => true).length).toBe(1);
});
