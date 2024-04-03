import { expect, test } from "vitest";
import ear from "../src/index.js";

test("rangesOverlapExclusive", () => {
	// default is exclusive
	expect(ear.math.doRangesOverlap([0, 1], [1, 2])).toBe(false);
	// negative epsilon is inclusive
	expect(ear.math.doRangesOverlap([0, 1], [1, 2], -1e-6)).toBe(true);

	// order does not matter
	expect(ear.math.doRangesOverlap([1, 0], [1, 2], 1e-6)).toBe(false);
	expect(ear.math.doRangesOverlap([1, 0], [2, 1], 1e-6)).toBe(false);
	expect(ear.math.doRangesOverlap([1, 0], [1, 2], -1e-6)).toBe(true);
	expect(ear.math.doRangesOverlap([1, 0], [2, 1], -1e-6)).toBe(true);

	// negative numbers
	expect(ear.math.doRangesOverlap([-10, -9], [-9, -8], 1e-6)).toBe(false);
	expect(ear.math.doRangesOverlap([-10, -9], [-9, -8], -1e-6)).toBe(true);

	// same ranges
	expect(ear.math.doRangesOverlap([2, 3], [2, 3], 1e-6)).toBe(true);
	expect(ear.math.doRangesOverlap([2, 3], [2, 3], -1e-6)).toBe(true);
	expect(ear.math.doRangesOverlap([2, 3], [3, 2], 1e-6)).toBe(true);
	expect(ear.math.doRangesOverlap([2, 3], [3, 2], -1e-6)).toBe(true);
	expect(ear.math.doRangesOverlap([-2, -3], [-2, -3], 1e-6)).toBe(true);
	expect(ear.math.doRangesOverlap([-2, -3], [-2, -3], -1e-6)).toBe(true);
	expect(ear.math.doRangesOverlap([-2, -3], [-3, -2], 1e-6)).toBe(true);
	expect(ear.math.doRangesOverlap([-2, -3], [-3, -2], -1e-6)).toBe(true);
});
