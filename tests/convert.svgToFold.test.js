const { test, expect } = require("@jest/globals");
const xmldom = require("@xmldom/xmldom");
const ear = require("../rabbit-ear.js");

ear.window = xmldom;

test("convert svgToFold empty", () => {
	ear.convert.svgToFold("<svg xmlns='http://www.w3.org/2000/svg'></svg>");
	expect(true).toBe(true);
});
