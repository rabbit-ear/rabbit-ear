const { test, expect } = require("@jest/globals");
const xmldom = require("@xmldom/xmldom");
const ear = require("../rabbit-ear.js");

ear.window = xmldom;

test("convert foldToObj no param", () => {
	let error;
	try {
		ear.convert.foldToObj();
	} catch (err) {
		error = err;
	}
	expect(error).not.toBe(undefined);
});

test("convert foldToObj empty", () => {
	const empty = {};
	ear.convert.foldToObj(empty);
	expect(true).toBe(true);
});

test("convert foldToObj FOLD object", () => {
	const cp = ear.cp.fish();
	ear.convert.foldToObj(cp);
	expect(true).toBe(true);
});

test("convert foldToObj FOLD string", () => {
	const cp = ear.cp.fish();
	const FOLD = JSON.stringify(cp);
	ear.convert.foldToObj(FOLD);
	expect(true).toBe(true);
});
