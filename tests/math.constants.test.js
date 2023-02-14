const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");

test("constants", () => {
	expect(typeof ear.math.EPSILON).toBe("number");
	expect(typeof ear.math.TWO_PI).toBe("number");
	expect(typeof ear.math.D2R).toBe("number");
	expect(typeof ear.math.R2D).toBe("number");
});
