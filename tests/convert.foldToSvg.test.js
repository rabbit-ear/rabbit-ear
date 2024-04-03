import fs from "fs";
import { expect, test } from "vitest";
import xmldom from "@xmldom/xmldom";
import ear from "../src/index.js";

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
	const cp = ear.graph.fish();
	ear.convert.foldToSvg(cp);
	expect(true).toBe(true);
});

test("convert foldToSvg FOLD string", () => {
	const cp = ear.graph.fish();
	const FOLD = JSON.stringify(cp);
	ear.convert.foldToSvg(FOLD);
	expect(true).toBe(true);
});

test("convert FOLD file", () => {
	const foldfile = fs.readFileSync("./tests/files/fold/crane-cp.fold", "utf-8");
	const FOLD = JSON.parse(foldfile);
	ear.convert.foldToSvg(FOLD);
	expect(true).toBe(true);
});

test("foldToSvg CP all assignments, no opacity", () => {
	const foldfile = fs.readFileSync("./tests/files/fold/crane-cp-bmvfcj.fold", "utf-8");
});

test("foldToSvg CP foldAngles and opacity", () => {
	const foldfile = fs.readFileSync("./tests/files/fold/bird-base-3d-cp.fold", "utf-8");
});

test("foldToSvg folded form, flat folded", () => {
	const foldfile = fs.readFileSync("./tests/files/fold/crane.fold", "utf-8");
});

test("foldToSvg folded form, with foldAngles", () => {
	const foldfile = fs.readFileSync("./tests/files/fold/bird-base-3d.fold", "utf-8");
});
