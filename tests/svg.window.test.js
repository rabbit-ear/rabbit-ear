const { test, expect } = require("@jest/globals");
const xmldom = require("@xmldom/xmldom");
const ear = require("../rabbit-ear.js");

ear.svg.window = xmldom;

test("environment", () => {
	expect(true).toBe(true);
});
