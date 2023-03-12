const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");

test("clamp functions", () => {
	expect(ear.math.clampLine(0)).toBe(0);
	expect(ear.math.clampLine(-Infinity)).toBe(-Infinity);
	expect(ear.math.clampLine(Infinity)).toBe(Infinity);
	expect(ear.math.clampLine(NaN)).toBe(NaN);

	expect(ear.math.clampRay(0)).toBe(0);
	expect(ear.math.clampRay(-1e-10)).toBe(-1e-10);
	expect(ear.math.clampRay(-1e-1)).toBe(0);
	expect(ear.math.clampRay(Infinity)).toBe(Infinity);
	expect(ear.math.clampRay(-Infinity)).toBe(0);

	expect(ear.math.clampSegment(0)).toBe(0);
	expect(ear.math.clampSegment(-1e-10)).toBe(-1e-10);
	expect(ear.math.clampSegment(-1e-1)).toBe(0);
	expect(ear.math.clampSegment(Infinity)).toBe(1);
	expect(ear.math.clampSegment(-Infinity)).toBe(0);
});

test("equivalent vectors", () => {
	const smEp = ear.math.EPSILON / 10; // smaller than epsilon
	const bgEp = ear.math.EPSILON * 10; // larger than epsilon
	expect(ear.math.epsilonCompare(0, 0)).toBe(0);
	expect(ear.math.epsilonCompare(0, smEp)).toBe(0);
	expect(ear.math.epsilonCompare(10, 10)).toBe(0);
	expect(ear.math.epsilonCompare(0, 1)).toBe(1);
	expect(ear.math.epsilonCompare(1, 0)).toBe(-1);
	expect(ear.math.epsilonCompare(0, 0, smEp)).toBe(0);
	expect(ear.math.epsilonCompare(0, 0, 1)).toBe(0);
	expect(ear.math.epsilonCompare(0, 1, smEp)).toBe(1);
	expect(ear.math.epsilonCompare(1, 0, smEp)).toBe(-1);
	expect(ear.math.epsilonCompare(0, 1, 10)).toBe(0);
	expect(ear.math.epsilonCompare(0, smEp, bgEp)).toBe(0);
	expect(ear.math.epsilonCompare(0, bgEp, smEp)).toBe(1);
	expect(ear.math.epsilonCompare(bgEp, 0, smEp)).toBe(-1);
});

test("equivalent vectors", () => {
	const smEp = ear.math.EPSILON / 10; // smaller than epsilon
	const bgEp = ear.math.EPSILON * 10; // larger than epsilon
	expect(ear.math.epsilonEqualVectors([1, 2, 3], [1, 2, 3])).toBe(true);
	expect(ear.math.epsilonEqualVectors([1, 2 + smEp], [1, 2 - smEp])).toBe(true);
	expect(ear.math.epsilonEqualVectors([1, 2 + bgEp], [1, 2 - bgEp])).toBe(false);
	expect(ear.math.epsilonEqualVectors([1, 2], [1, 2.0000000001])).toBe(true);
	expect(ear.math.epsilonEqualVectors([1, 2, 3, 4], [1, 2])).toBe(false);
	expect(ear.math.epsilonEqualVectors([], [])).toBe(true);
	expect(ear.math.epsilonEqualVectors([1.000000001, -1], [1, -1])).toBe(true);
	expect(ear.math.epsilonEqualVectors([1.000000001, 0], [1])).toBe(true);
	expect(ear.math.epsilonEqualVectors([1.000000001, 0], [1, 0])).toBe(true);
});
