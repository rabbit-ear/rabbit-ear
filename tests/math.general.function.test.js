import { expect, test } from "vitest";
import ear from "../rabbit-ear.js";

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

test("epsilonEqual", () => {
	const smEp = ear.math.EPSILON / 10; // smaller than epsilon
	const bgEp = ear.math.EPSILON * 10; // larger than epsilon
	expect(ear.math.epsilonEqual(0, 0)).toBe(true);
	expect(ear.math.epsilonEqual(0, smEp)).toBe(true);
	expect(ear.math.epsilonEqual(10, 10)).toBe(true);
	expect(ear.math.epsilonEqual(0, 1)).toBe(false);
	expect(ear.math.epsilonEqual(1, 0)).toBe(false);
	expect(ear.math.epsilonEqual(0, 0, smEp)).toBe(true);
	expect(ear.math.epsilonEqual(0, 0, 1)).toBe(true);
	expect(ear.math.epsilonEqual(0, 1, smEp)).toBe(false);
	expect(ear.math.epsilonEqual(1, 0, smEp)).toBe(false);
	expect(ear.math.epsilonEqual(0, 1, 10)).toBe(true);
	expect(ear.math.epsilonEqual(0, smEp, bgEp)).toBe(true);
	expect(ear.math.epsilonEqual(0, bgEp, smEp)).toBe(false);
	expect(ear.math.epsilonEqual(bgEp, 0, smEp)).toBe(false);
});

test("epsilonCompare", () => {
	const smEp = ear.math.EPSILON / 10; // smaller than epsilon
	const bgEp = ear.math.EPSILON * 10; // larger than epsilon
	expect(ear.math.epsilonCompare(0, 0)).toBe(0);
	expect(ear.math.epsilonCompare(0, smEp)).toBe(0);
	expect(ear.math.epsilonCompare(10, 10)).toBe(0);
	expect(ear.math.epsilonCompare(0, 1)).toBe(-1);
	expect(ear.math.epsilonCompare(1, 0)).toBe(1);
	expect(ear.math.epsilonCompare(0, 0, smEp)).toBe(0);
	expect(ear.math.epsilonCompare(0, 0, 1)).toBe(0);
	expect(ear.math.epsilonCompare(0, 1, smEp)).toBe(-1);
	expect(ear.math.epsilonCompare(1, 0, smEp)).toBe(1);
	expect(ear.math.epsilonCompare(0, 1, 10)).toBe(0);
	expect(ear.math.epsilonCompare(0, smEp, bgEp)).toBe(0);
	expect(ear.math.epsilonCompare(0, bgEp, smEp)).toBe(-1);
	expect(ear.math.epsilonCompare(bgEp, 0, smEp)).toBe(1);
});

test("epsilonCompare to sort", () => {
	const smEp = ear.math.EPSILON / 10; // smaller than epsilon
	const array = [0, 0 + smEp, 1, 3 + smEp * 2, 3, 2, 1.1];
	// sort increasing (or leave pairs untouched)
	array.sort(ear.math.epsilonCompare);
	// the result is an increasing array, except that values within an epsilon
	// are allowed to be unsorted with respect to each other.
	// hence, we test for equality. will be either "less than" or "equal".
	for (let i = 0; i < array.length - 1; i += 1) {
		const equal = ear.math.epsilonEqual(array[i], array[i + 1]);
		const lessThan = array[i] < array[i + 1];
		expect(equal || lessThan).toBe(true);
	}
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
