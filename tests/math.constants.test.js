const { test, expect } = require("@jest/globals");
const math = require("../ear.js");

test("constants", () => {
	expect(typeof ear.EPSILON).toBe("number");
	expect(typeof ear.TWO_PI).toBe("number");
	expect(typeof ear.D2R).toBe("number");
	expect(typeof ear.R2D).toBe("number");
});
