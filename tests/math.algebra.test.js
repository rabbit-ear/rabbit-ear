const { test, expect } = require("@jest/globals");
const math = require("../ear.js");

const testEqual = function (...args) {
	expect(ear.fnEpsilonEqualVectors(...args)).toBe(true);
};
/**
 * algebra core
 */
test("magnitude", () => {
	expect(ear.magnitude([0, 0, 0, 0, 0, 1])).toBe(1);
	expect(ear.magnitude([1, 1])).toBeCloseTo(Math.sqrt(2));
	expect(ear.magnitude([0, 0, 0, 0, 0, 0])).toBe(0);
	expect(ear.magnitude([])).toBe(0);
});

test("mag sq", () => {
	expect(ear.magSquared([1, 1, 1, 1])).toBe(4);
	expect(ear.magSquared([])).toBe(0);
	expect(ear.magSquared([1, -2, 3]))
		.toBe((1 ** 2) + (2 ** 2) + (3 ** 2));
	expect(ear.magSquared([-100])).toBe(100 * 100);
});

test("normalize", () => {
	expect(ear.normalize([]).length).toBe(0);
	expect(ear.normalize([1, 1])[0]).toBeCloseTo(Math.sqrt(2) / 2);
	expect(ear.normalize([1, 1])[1]).toBeCloseTo(Math.sqrt(2) / 2);
	expect(ear.normalize([1, -1, 1])[0]).toBeCloseTo(Math.sqrt(3) / 3);
});

test("scale", () => {
	expect(ear.scale([]).length).toBe(0);
	expect(ear.scale([1])[0]).toBe(NaN);
	expect(ear.scale([1], 2)[0]).toBe(2);
	expect(ear.scale([1], -2)[0]).toBe(-2);
});

test("add", () => {
	expect(ear.add([1], [1, 2, 3]).length).toBe(1);
	expect(ear.add([1], [1, 2, 3])[0]).toBe(2);
	expect(ear.add([1, 2, 3], [1, 2])[0]).toBe(2);
	expect(ear.add([1, 2, 3], [1, 2])[1]).toBe(4);
	expect(ear.add([1, 2, 3], [1, 2])[2]).toBe(3);
	expect(ear.add([1, 2, 3], [])[0]).toBe(1);
});

test("subtract", () => {
	expect(ear.subtract([1], [2, 3, 4]).length).toBe(1);
	expect(ear.subtract([1], [2, 3, 4])[0]).toBe(-1);
	expect(ear.subtract([1, 2, 3], [1, 2])[0]).toBe(0);
	expect(ear.subtract([1, 2, 3], [1, 2])[1]).toBe(0);
	expect(ear.subtract([1, 2, 3], [1, 2])[2]).toBe(3);
	expect(ear.subtract([1, 2, 3], [])[0]).toBe(1);
});

test("dot", () => {
	expect(ear.dot([3, 1000], [1, 0])).toBe(3);
	expect(ear.dot([3, 1000], [1, 0])).toBe(3);
	expect(ear.dot([1, 1000], [400])).toBe(400);
	expect(ear.dot([1, 1000], [])).toBe(0);
});

test("midpoint", () => {
	expect(ear.midpoint([1, 2], [5, 6, 7]).length).toBe(2);
	expect(ear.midpoint([1, 2], [5, 6, 7])[0]).toBe(3);
	expect(ear.midpoint([1, 2], [5, 6, 7])[1]).toBe(4);
	expect(ear.midpoint([], [5, 6, 7]).length).toBe(0);
});

test("average function", () => {
	// improper use
	expect(ear.average().length).toBe(0);
	expect(ear.average(0, 1, 2).length).toBe(0);
	expect(ear.average([], [], []).length).toBe(0);
	// correct
	testEqual(
		[3.75, 4.75],
		ear.average([4, 1], [5, 6], [4, 6], [2, 6]),
	);
	testEqual(
		[4, 5, 3],
		ear.average([1, 2, 3], [4, 5, 6], [7, 8]),
	);
	testEqual(
		[4, 5, 6],
		ear.average([1, 2, 3], [4, 5, 6], [7, 8, 9]),
	);
});

test("lerp", () => {
	expect(ear.lerp([0, 1], [2, 0], 0)[0]).toBe(0);
	expect(ear.lerp([0, 1], [2, 0], 0)[1]).toBe(1);
	expect(ear.lerp([0, 1], [2, 0], 1)[0]).toBe(2);
	expect(ear.lerp([0, 1], [2, 0], 1)[1]).toBe(0);
	expect(ear.lerp([0, 1], [2, 0], 0.5)[0]).toBe(1);
	expect(ear.lerp([0, 1], [2, 0], 0.5)[1]).toBe(0.5);
});

test("cross2", () => {
	expect(ear.cross2([1, 0], [-4, 3])).toBe(3);
	expect(ear.cross2([2, -1], [1, 3])).toBe(7);
});

test("cross3", () => {
	expect(ear.cross3([-3, 0, -2], [5, -1, 2])[0]).toBe(-2);
	expect(ear.cross3([-3, 0, -2], [5, -1, 2])[1]).toBe(-4);
	expect(ear.cross3([-3, 0, -2], [5, -1, 2])[2]).toBe(3);
	expect(Number.isNaN(ear.cross3([-3, 0], [5, -1, 2])[0])).toBe(true);
	expect(Number.isNaN(ear.cross3([-3, 0], [5, -1, 2])[1])).toBe(true);
	expect(Number.isNaN(ear.cross3([-3, 0], [5, -1, 2])[2])).toBe(false);
});

test("distance3", () => {
	const r1 = ear.distance3([1, 2, 3], [4, 5, 6]);
	const r2 = ear.distance3([1, 2, 3], [4, 5]);
	expect(r1).toBeCloseTo(5.196152422706632);
	expect(Number.isNaN(r2)).toBe(true);
});

test("rotate90, rotate270", () => {
	expect(ear.rotate90([-3, 2])[0]).toBe(-2);
	expect(ear.rotate90([-3, 2])[1]).toBe(-3);
	expect(ear.rotate270([-3, 2])[0]).toBe(2);
	expect(ear.rotate270([-3, 2])[1]).toBe(3);
});

test("flip", () => {
	expect(ear.flip([-2, -1])[0]).toBe(2);
	expect(ear.flip([-2, -1])[1]).toBe(1);
});

test("degenerate", () => {
	expect(ear.degenerate([1], 1)).toBe(false);
	expect(ear.degenerate([1], 1 + ear.EPSILON)).toBe(true);
	expect(ear.degenerate([1, 1], 2)).toBe(false);
	expect(ear.degenerate([1, 1], 2 + ear.EPSILON)).toBe(true);
});

test("parallel", () => {
	expect(ear.parallel([1, 0], [0, 1])).toBe(false);
	expect(ear.parallel([1, 0], [-1, 0])).toBe(true);
	// this is where the parallel test breaks down when it uses dot product
	expect(ear.parallel([1, 0], [1, 0.0014142])).toBe(true);
	expect(ear.parallel([1, 0], [1, 0.0014143])).toBe(false);
	// this is the parallel test using cross product
	expect(ear.parallel2([1, 0], [1, 0.0000009])).toBe(true);
	expect(ear.parallel2([1, 0], [1, 0.0000010])).toBe(false);
});

/*
test("alternating sum", () => {
	const r1 = ear.alternating_sum([1, 2, 3, 4, 5, 6]);
	expect(r1[0]).toBe(9);
	expect(r1[1]).toBe(12);
	const r2 = ear.alternating_sum([1, undefined, 3, 4, 5, 6]);
	expect(r2[0]).toBe(9);
	expect(r2[1]).toBe(10);
	const r3 = ear.alternating_sum([]);
	expect(r3[0]).toBe(0);
	expect(r3[1]).toBe(0);
});
*/
