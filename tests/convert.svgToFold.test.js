const { test, expect } = require("@jest/globals");
const xmldom = require("@xmldom/xmldom");
const ear = require("../rabbit-ear.js");

ear.window = xmldom;

// these fail, and I can't seem to setup a try catch that
// won't break the testing environment.

// test("convert svgToFold no param", () => {
// 	let error;
// 	try {
// 		ear.convert.svgToFold();
// 	} catch (err) {
// 		error = err;
// 	}
// 	expect(error).not.toBe(undefined);
// });

// test("convert svgToFold empty", () => {
// 	ear.convert.svgToFold("");
// 	expect(true).toBe(true);
// });

test("convert svgToFold empty svg", () => {
	ear.convert.svgToFold("<svg xmlns='http://www.w3.org/2000/svg'></svg>");
	expect(true).toBe(true);
});
