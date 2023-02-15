const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");

test("constants", () => {
	expect(typeof ear.math.EPSILON).toBe("number");
	expect(typeof ear.math.TWO_PI).toBe("number");
	expect(typeof ear.math.D2R).toBe("number");
	expect(typeof ear.math.R2D).toBe("number");
});

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
