const { test, expect } = require("@jest/globals");
const xmldom = require("@xmldom/xmldom");
const ear = require("../rabbit-ear.js");

ear.window = xmldom;

test("convert foldToSvg", () => {
	const cp = ear.cp.fish();
	ear.convert.foldToSvg(cp);
	expect(true).toBe(true);
});
