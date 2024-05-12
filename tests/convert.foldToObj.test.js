import fs from "fs";
import { expect, test } from "vitest";
import xmldom from "@xmldom/xmldom";
import ear from "../src/index.js";

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
	const cp = ear.graph.fish();
	ear.convert.foldToObj(cp);
	expect(true).toBe(true);
});

test("convert foldToObj FOLD string", () => {
	const cp = ear.graph.fish();
	const FOLD = JSON.stringify(cp);
	ear.convert.foldToObj(FOLD);
	expect(true).toBe(true);
});

test("convert FOLD file", () => {
	const foldfile = fs.readFileSync("./tests/files/fold/crane-cp.fold", "utf-8");
	const FOLD = JSON.parse(foldfile);
	ear.convert.foldToObj(FOLD);
	expect(true).toBe(true);
});
