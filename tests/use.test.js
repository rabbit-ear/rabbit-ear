const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear");

try {
	const svg = require("../../SVG/svg.js");

	test("use", () => {
		ear.use(svg);
		expect(true).toBe(true);
	});

	test("use, invalid", () => {
		ear.use({});
		ear.use(() => {});
		expect(true).toBe(true);
	});
} catch (err) {
	test("cannot test use() without access to SVG library", () => {
		expect(true).toBe(true);
	});
}
