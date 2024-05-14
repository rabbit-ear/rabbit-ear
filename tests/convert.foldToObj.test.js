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
	const obj = ear.convert.foldToObj(empty);
	expect(obj).toHaveLength(1);
});

test("convert foldToObj FOLD object", () => {
	const cp = ear.graph.fish();
	const obj = ear.convert.foldToObj(cp);
	expect(obj).toHaveLength(336);
	fs.writeFileSync("./tests/tmp/obj-fish-base.obj", obj);
});

test("convert foldToObj FOLD string", () => {
	const cp = ear.graph.fish();
	const FOLD = JSON.stringify(cp);
	const obj = ear.convert.foldToObj(FOLD);
	expect(obj).toHaveLength(336);
});

test("convert foldToObj FOLD file", () => {
	const foldfile = fs.readFileSync("./tests/files/fold/crane-cp.fold", "utf-8");
	const FOLD = JSON.parse(foldfile);
	const obj = ear.convert.foldToObj(FOLD);
	expect(obj).toHaveLength(2275);
});

test("convert foldToObj, folded crane", () => {
	const foldfile = fs.readFileSync("./tests/files/fold/crane.fold", "utf-8");
	const FOLD = JSON.parse(foldfile);
	const cp = ear.graph.getFramesByClassName(FOLD, "foldedForm")[0];
	const obj = ear.convert.foldToObj(cp);
	expect(obj).toHaveLength(3101);
	fs.writeFileSync("./tests/tmp/obj-crane-folded.obj", obj);
});

test("convert foldToObj, Mooser's Train", () => {
	const foldfile = fs.readFileSync("./tests/files/fold/moosers-train.fold", "utf-8");
	const FOLD = JSON.parse(foldfile);
	const cp = ear.graph.getFramesByClassName(FOLD, "foldedForm")[0];
	const obj = ear.convert.foldToObj(cp);
	expect(obj).toHaveLength(12928);
	fs.writeFileSync("./tests/tmp/obj-moosers-train.obj", obj);
});

test("convert foldToObj, Maze U", () => {
	const foldfile = fs.readFileSync("./tests/files/fold/maze-u.fold", "utf-8");
	const FOLD = JSON.parse(foldfile);
	const cp = ear.graph.getFramesByClassName(FOLD, "foldedForm")[0];
	const obj = ear.convert.foldToObj(cp);
	expect(obj).toHaveLength(2512);
	fs.writeFileSync("./tests/tmp/obj-maze-u.obj", obj);
});

test("convert foldToObj, Maze 8x8", () => {
	const foldfile = fs.readFileSync("./tests/files/fold/maze-8x8.fold", "utf-8");
	const FOLD = JSON.parse(foldfile);
	const cp = ear.graph.getFramesByClassName(FOLD, "foldedForm")[0];
	const obj = ear.convert.foldToObj(cp);
	expect(obj).toHaveLength(46521);
	fs.writeFileSync("./tests/tmp/obj-maze-8x8.obj", obj);
});
