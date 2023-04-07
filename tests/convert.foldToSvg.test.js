const { test, expect } = require("@jest/globals");
const xmldom = require("@xmldom/xmldom");
const ear = require("../rabbit-ear.js");

ear.window = xmldom;

test("convert foldToSvg no param", () => {
	let error;
	try {
		ear.convert.foldToSvg();
	} catch (err) {
		error = err;
	}
	expect(error).not.toBe(undefined);
});

test("convert foldToSvg empty", () => {
	const empty = {};
	ear.convert.foldToSvg(empty);
	expect(true).toBe(true);
});

test("convert foldToSvg FOLD object", () => {
	const cp = ear.cp.fish();
	ear.convert.foldToSvg(cp);
	expect(true).toBe(true);
});

test("convert foldToSvg FOLD string", () => {
	const cp = ear.cp.fish();
	const FOLD = JSON.stringify(cp);
	ear.convert.foldToSvg(FOLD);
	expect(true).toBe(true);
});
