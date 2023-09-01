const { test, expect } = require("@jest/globals");

test("environment", () => {
	expect(true).toBe(true);
	// console.log("window", window);
	// console.log("window.document", window.document);
});
