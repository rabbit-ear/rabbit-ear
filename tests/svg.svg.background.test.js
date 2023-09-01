const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");
ear.svg.window = require("@xmldom/xmldom");

test("set background", () => {
	const svg = ear.svg();
	svg.background("black", true);
	svg.background("#332698", false);
	expect(svg.childNodes.length).toBe(1);
});
