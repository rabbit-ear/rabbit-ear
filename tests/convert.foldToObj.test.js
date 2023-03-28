const { test, expect } = require("@jest/globals");
const xmldom = require("@xmldom/xmldom");
const ear = require("../rabbit-ear.js");

ear.window = xmldom;

test("convert foldToObj", () => {
	const cp = ear.cp.fish();
	ear.convert.foldToObj(cp);
	expect(true).toBe(true);
});
