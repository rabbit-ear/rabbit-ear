const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");

const testEqual = function (...args) {
	expect(ear.math.epsilonEqualVectors(...args)).toBe(true);
};
/**
 * algebra core
 */
test("magnitude", () => {
	expect(ear.math.magnitude([0, 0, 0, 0, 0, 1])).toBe(1);
	expect(ear.math.magnitude([1, 1])).toBeCloseTo(Math.sqrt(2));
	expect(ear.math.magnitude([0, 0, 0, 0, 0, 0])).toBe(0);
	expect(ear.math.magnitude([])).toBe(0);

	expect(ear.math.magnitude2([1, 0, 10])).toBe(1);
	expect(ear.math.magnitude2([1, 0])).toBe(1);
	expect(ear.math.magnitude2([0, 0, 1])).toBe(0);

	expect(ear.math.magnitude3([0, 0, 10])).toBe(10);
	expect(ear.math.magnitude3([1, 0, 0])).toBe(1);
	expect(ear.math.magnitude3([0, 0, 1])).toBe(1);
	expect(ear.math.magnitude3([0, 0, 0, 1])).toBe(0);
});

test("mag sq", () => {
	expect(ear.math.magSquared([1, 1, 1, 1])).toBe(4);
	expect(ear.math.magSquared([])).toBe(0);
	expect(ear.math.magSquared([1, -2, 3]))
		.toBe((1 ** 2) + (2 ** 2) + (3 ** 2));
	expect(ear.math.magSquared([-100])).toBe(100 * 100);
});

test("normalize", () => {
	expect(ear.math.normalize([]).length).toBe(0);
	expect(ear.math.normalize([1, 1])[0]).toBeCloseTo(Math.sqrt(2) / 2);
	expect(ear.math.normalize([1, 1])[1]).toBeCloseTo(Math.sqrt(2) / 2);
	expect(ear.math.normalize([1, -1, 1])[0]).toBeCloseTo(Math.sqrt(3) / 3);

	expect(ear.math.normalize2([]).length).toBe(2);
	expect(ear.math.normalize2([1, 1])[0]).toBeCloseTo(Math.sqrt(2) / 2);
	expect(ear.math.normalize2([1, 1])[1]).toBeCloseTo(Math.sqrt(2) / 2);
	expect(ear.math.normalize2([1, 1])[2]).toBe(undefined);
	expect(ear.math.normalize2([1, 1, 10])[0]).toBeCloseTo(Math.sqrt(2) / 2);
	expect(ear.math.normalize2([1, 1, 10])[1]).toBeCloseTo(Math.sqrt(2) / 2);
	expect(ear.math.normalize2([1, 1, 10])[2]).toBe(undefined);

	expect(ear.math.normalize3([]).length).toBe(3);
	expect(ear.math.normalize3([0, 0, 0])[0]).toBeCloseTo(0);
	expect(ear.math.normalize3([0, 0, 0])[1]).toBeCloseTo(0);
	expect(ear.math.normalize3([0, 0, 0])[2]).toBeCloseTo(0);
	expect(ear.math.normalize3([1, 1, 1])[0]).toBeCloseTo(Math.sqrt(3) / 3);
	expect(ear.math.normalize3([1, 1, 1])[1]).toBeCloseTo(Math.sqrt(3) / 3);
	expect(ear.math.normalize3([1, 1, 1])[2]).toBeCloseTo(Math.sqrt(3) / 3);
	expect(ear.math.normalize3([1, 1, 1])[3]).toBe(undefined);
	expect(ear.math.normalize3([1, 1, 1, 10])[0]).toBeCloseTo(Math.sqrt(3) / 3);
	expect(ear.math.normalize3([1, 1, 1, 10])[1]).toBeCloseTo(Math.sqrt(3) / 3);
	expect(ear.math.normalize3([1, 1, 1, 10])[2]).toBeCloseTo(Math.sqrt(3) / 3);
	expect(ear.math.normalize3([1, 1, 1, 10])[3]).toBe(undefined);
});

test("scale", () => {
	expect(ear.math.scale([]).length).toBe(0);
	expect(ear.math.scale([1])[0]).toBe(NaN);
	expect(ear.math.scale([1], 2)[0]).toBe(2);
	expect(ear.math.scale([1], -2)[0]).toBe(-2);

	expect(ear.math.scale2([]).length).toBe(2);
	expect(ear.math.scale2([1])[0]).toBe(NaN);
	expect(ear.math.scale2([1], 2)[1]).toBe(NaN);
	expect(ear.math.scale2([1], 2)[2]).toBe(undefined);
	expect(ear.math.scale2([1, 1], 2)[1]).toBe(2);
	expect(ear.math.scale2([1, 1], 2)[2]).toBe(undefined);
	expect(ear.math.scale2([1, 1, 1], 2)[2]).toBe(undefined);

	expect(ear.math.scale3([]).length).toBe(3);
	expect(ear.math.scale3([1])[0]).toBe(NaN);
	expect(ear.math.scale3([1], 2)[1]).toBe(NaN);
	expect(ear.math.scale3([1], 2)[2]).toBe(NaN);
	expect(ear.math.scale3([1, 1, 1], 2)[1]).toBe(2);
	expect(ear.math.scale3([1, 1, 1], 2)[2]).toBe(2);
	expect(ear.math.scale3([1, 1, 1], 2)[3]).toBe(undefined);
});

test("add", () => {
	expect(ear.math.add([1], [1, 2, 3]).length).toBe(1);
	expect(ear.math.add([1], [1, 2, 3])[0]).toBe(2);
	expect(ear.math.add([1, 2, 3], [1, 2])[0]).toBe(2);
	expect(ear.math.add([1, 2, 3], [1, 2])[1]).toBe(4);
	expect(ear.math.add([1, 2, 3], [1, 2])[2]).toBe(3);
	expect(ear.math.add([1, 2, 3], [])[0]).toBe(1);

	expect(ear.math.add2([1], [1, 2, 3]).length).toBe(2);
	expect(ear.math.add2([1], [1, 2, 3])[0]).toBe(2);
	expect(ear.math.add2([1], [1, 2, 3])[1]).toBe(NaN);
	expect(ear.math.add2([1, 2, 3], [1, 2])[0]).toBe(2);
	expect(ear.math.add2([1, 2, 3], [1, 2])[1]).toBe(4);
	expect(ear.math.add2([1, 2, 3], [1, 2])[2]).toBe(undefined);
	expect(ear.math.add2([1, 2, 3], [])[0]).toBe(NaN);

	expect(ear.math.add3([1], [1, 2, 3]).length).toBe(3);
	expect(ear.math.add3([1], [1, 2, 3])[0]).toBe(2);
	expect(ear.math.add3([1], [1, 2, 3])[1]).toBe(NaN);
	expect(ear.math.add3([1, 2, 3], [1, 2])[0]).toBe(2);
	expect(ear.math.add3([1, 2, 3], [1, 2])[1]).toBe(4);
	expect(ear.math.add3([1, 2, 3], [1, 2])[2]).toBe(NaN);
	expect(ear.math.add3([1, 2, 3], [])[0]).toBe(NaN);
});

test("subtract", () => {
	expect(ear.math.subtract([1], [2, 3, 4]).length).toBe(1);
	expect(ear.math.subtract([1], [2, 3, 4])[0]).toBe(-1);
	expect(ear.math.subtract([1, 2, 3], [1, 2])[0]).toBe(0);
	expect(ear.math.subtract([1, 2, 3], [1, 2])[1]).toBe(0);
	expect(ear.math.subtract([1, 2, 3], [1, 2])[2]).toBe(3);
	expect(ear.math.subtract([1, 2, 3], [])[0]).toBe(1);

	expect(ear.math.subtract2([1], [2, 3, 4]).length).toBe(2);
	expect(ear.math.subtract2([1], [2, 3, 4])[0]).toBe(-1);
	expect(ear.math.subtract2([1, 2, 3], [1, 2])[0]).toBe(0);
	expect(ear.math.subtract2([1, 2, 3], [1, 2])[1]).toBe(0);
	expect(ear.math.subtract2([1, 2, 3], [1, 2])[2]).toBe(undefined);
	expect(ear.math.subtract2([1, 2, 3], [])[0]).toBe(NaN);

	expect(ear.math.subtract3([1], [2, 3, 4]).length).toBe(3);
	expect(ear.math.subtract3([1], [2, 3, 4])[0]).toBe(-1);
	expect(ear.math.subtract3([1, 2, 3], [1, 2])[0]).toBe(0);
	expect(ear.math.subtract3([1, 2, 3], [1, 2])[1]).toBe(0);
	expect(ear.math.subtract3([1, 2, 3], [1, 2])[2]).toBe(NaN);
	expect(ear.math.subtract3([1, 2, 3], [])[0]).toBe(NaN);
});

test("dot", () => {
	expect(ear.math.dot([3, 1000], [1, 0])).toBe(3);
	expect(ear.math.dot([3, 1000], [1, 0])).toBe(3);
	expect(ear.math.dot([3, 1000], [0, 1])).toBe(1000);
	expect(ear.math.dot([1, 1000], [400])).toBe(400);
	expect(ear.math.dot([1, 1000], [400, 0])).toBe(400);
	expect(ear.math.dot([1, 1000], [400, 1])).toBe(1400);
	expect(ear.math.dot([1, 1000], [])).toBe(0);

	expect(ear.math.dot2([3, 1000], [1, 0])).toBe(3);
	expect(ear.math.dot2([3, 1000], [1, 0])).toBe(3);
	expect(ear.math.dot2([3, 1000], [0, 1])).toBe(1000);
	expect(ear.math.dot2([1, 1000], [400])).toBe(NaN);
	expect(ear.math.dot2([1, 1000], [400, 0])).toBe(400);
	expect(ear.math.dot2([1, 1000], [400, 1])).toBe(1400);
	expect(ear.math.dot2([1, 1000], [])).toBe(NaN);

	expect(ear.math.dot3([3, 1000], [1, 0])).toBe(NaN);
	expect(ear.math.dot3([3, 1000], [1, 0])).toBe(NaN);
	expect(ear.math.dot3([3, 1000], [0, 1])).toBe(NaN);
	expect(ear.math.dot3([1, 1000], [400])).toBe(NaN);
	expect(ear.math.dot3([1, 1000], [400, 0])).toBe(NaN);
	expect(ear.math.dot3([1, 1000], [400, 1])).toBe(NaN);
	expect(ear.math.dot3([1, 1000], [])).toBe(NaN);
	expect(ear.math.dot3([3, 1000, 0], [1, 0, 0])).toBe(3);
	expect(ear.math.dot3([3, 1000, 0], [0, 1, 0])).toBe(1000);
	expect(ear.math.dot3([3, 1000, 200], [1, 1, 1])).toBe(1203);
	expect(ear.math.dot3([1, 1000, 0], [400])).toBe(NaN);
	expect(ear.math.dot3([1, 1000, 0], [400, 0, 0])).toBe(400);
	expect(ear.math.dot3([1, 1000, 0], [400, 1, 0])).toBe(1400);
	expect(ear.math.dot3([1, 1000, 0], [])).toBe(NaN);
});

test("midpoint", () => {
	expect(ear.math.midpoint([1, 2], [5, 6, 7]).length).toBe(2);
	expect(ear.math.midpoint([1, 2], [5, 6, 7])[0]).toBe(3);
	expect(ear.math.midpoint([1, 2], [5, 6, 7])[1]).toBe(4);
	expect(ear.math.midpoint([], [5, 6, 7]).length).toBe(0);

	expect(ear.math.midpoint2([1, 2], [5, 6, 7]).length).toBe(2);
	expect(ear.math.midpoint2([1, 2], [5, 6, 7])[0]).toBe(3);
	expect(ear.math.midpoint2([1, 2], [5, 6, 7])[1]).toBe(4);
	expect(ear.math.midpoint2([1, 2], [5, 6, 7])[2]).toBe(undefined);
	expect(ear.math.midpoint2([], [5, 6, 7]).length).toBe(2);
	expect(ear.math.midpoint2([], [5, 6, 7])[0]).toBe(NaN);
	expect(ear.math.midpoint2([], [5, 6, 7])[1]).toBe(NaN);

	expect(ear.math.midpoint3([1, 2], [5, 6, 7]).length).toBe(3);
	expect(ear.math.midpoint3([1, 2], [5, 6, 7])[0]).toBe(3);
	expect(ear.math.midpoint3([1, 2], [5, 6, 7])[1]).toBe(4);
	expect(ear.math.midpoint3([1, 2], [5, 6, 7])[2]).toBe(NaN);
	expect(ear.math.midpoint3([], [5, 6, 7]).length).toBe(3);
	expect(ear.math.midpoint3([], [5, 6, 7])[0]).toBe(NaN);
	expect(ear.math.midpoint3([], [5, 6, 7])[1]).toBe(NaN);
});

test("average function", () => {
	// improper use
	expect(ear.math.average().length).toBe(0);
	expect(ear.math.average(0, 1, 2).length).toBe(0);
	expect(ear.math.average([], [], []).length).toBe(0);
	// correct
	testEqual(
		[3.75, 4.75],
		ear.math.average([4, 1], [5, 6], [4, 6], [2, 6]),
	);
	testEqual(
		[4, 5, 3],
		ear.math.average([1, 2, 3], [4, 5, 6], [7, 8]),
	);
	testEqual(
		[4, 5, 6],
		ear.math.average([1, 2, 3], [4, 5, 6], [7, 8, 9]),
	);
});

test("lerp", () => {
	expect(ear.math.lerp([0, 1], [2, 0], 0)[0]).toBe(0);
	expect(ear.math.lerp([0, 1], [2, 0], 0)[1]).toBe(1);
	expect(ear.math.lerp([0, 1], [2, 0], 1)[0]).toBe(2);
	expect(ear.math.lerp([0, 1], [2, 0], 1)[1]).toBe(0);
	expect(ear.math.lerp([0, 1], [2, 0], 0.5)[0]).toBe(1);
	expect(ear.math.lerp([0, 1], [2, 0], 0.5)[1]).toBe(0.5);
});

test("cross2", () => {
	expect(ear.math.cross2([1, 0], [-4, 3])).toBe(3);
	expect(ear.math.cross2([2, -1], [1, 3])).toBe(7);
});

test("cross3", () => {
	expect(ear.math.cross3([-3, 0, -2], [5, -1, 2])[0]).toBe(-2);
	expect(ear.math.cross3([-3, 0, -2], [5, -1, 2])[1]).toBe(-4);
	expect(ear.math.cross3([-3, 0, -2], [5, -1, 2])[2]).toBe(3);
	expect(Number.isNaN(ear.math.cross3([-3, 0], [5, -1, 2])[0])).toBe(true);
	expect(Number.isNaN(ear.math.cross3([-3, 0], [5, -1, 2])[1])).toBe(true);
	expect(Number.isNaN(ear.math.cross3([-3, 0], [5, -1, 2])[2])).toBe(false);
});

test("distance3", () => {
	const r1 = ear.math.distance3([1, 2, 3], [4, 5, 6]);
	const r2 = ear.math.distance3([1, 2, 3], [4, 5]);
	expect(r1).toBeCloseTo(5.196152422706632);
	expect(Number.isNaN(r2)).toBe(true);
});

test("rotate90, rotate270", () => {
	expect(ear.math.rotate90([-3, 2])[0]).toBe(-2);
	expect(ear.math.rotate90([-3, 2])[1]).toBe(-3);
	expect(ear.math.rotate270([-3, 2])[0]).toBe(2);
	expect(ear.math.rotate270([-3, 2])[1]).toBe(3);
});

test("flip", () => {
	expect(ear.math.flip([-2, -1])[0]).toBe(2);
	expect(ear.math.flip([-2, -1])[1]).toBe(1);
});

test("degenerate", () => {
	expect(ear.math.degenerate([1])).toBe(false);
	expect(ear.math.degenerate([1], 1)).toBe(false);
	expect(ear.math.degenerate([1], 1 + ear.math.EPSILON)).toBe(true);
	expect(ear.math.degenerate([1, 1], 2)).toBe(false);
	expect(ear.math.degenerate([1, 1], 2 + ear.math.EPSILON)).toBe(true);
});

test("parallel", () => {
	expect(ear.math.parallel([1, 0], [0, 1])).toBe(false);
	expect(ear.math.parallel([1, 0], [-1, 0])).toBe(true);
	// this is where the parallel test breaks down when it uses dot product
	expect(ear.math.parallel([1, 0], [1, 0.0014142])).toBe(true);
	expect(ear.math.parallel([1, 0], [1, 0.0014143])).toBe(false);
	// this is the parallel test using cross product
	expect(ear.math.parallel2([1, 0], [1, 0.0000009])).toBe(true);
	expect(ear.math.parallel2([1, 0], [1, 0.0000010])).toBe(false);
});

test("parallelNormalized", () => {
	expect(ear.math.parallelNormalized([1, 0], [0, 1])).toBe(false);
	expect(ear.math.parallelNormalized([1, 0], [1, 0])).toBe(true);
	expect(ear.math.parallelNormalized([1, 0], [-1, 0])).toBe(true);
	// unintended usage
	expect(ear.math.parallelNormalized([3, 0], [3, 0])).toBe(true);
	expect(ear.math.parallelNormalized([2, 0], [1, 0])).toBe(true);
	expect(ear.math.parallelNormalized([-2, 0], [1, 0])).toBe(true);
	expect(ear.math.parallelNormalized([1, 0], [2, 0])).toBe(true);
	expect(ear.math.parallelNormalized([1, 0], [-2, 0])).toBe(true);
});

/*
test("alternating sum", () => {
	const r1 = ear.math.alternating_sum([1, 2, 3, 4, 5, 6]);
	expect(r1[0]).toBe(9);
	expect(r1[1]).toBe(12);
	const r2 = ear.math.alternating_sum([1, undefined, 3, 4, 5, 6]);
	expect(r2[0]).toBe(9);
	expect(r2[1]).toBe(10);
	const r3 = ear.math.alternating_sum([]);
	expect(r3[0]).toBe(0);
	expect(r3[1]).toBe(0);
});
*/
