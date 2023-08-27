const fs = require("fs");
const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");

test("flattenFrame", () => {
	const foldfile = fs.readFileSync("./tests/files/fold/nested-frames.fold", "utf-8");
	const FOLD = JSON.parse(foldfile);
	const flat = ear.graph.flattenFrame(FOLD, 3);
	expect(flat.frame_classes.length).toBe(1);
	expect(flat.frame_classes[0]).toBe("foldedForm");
});

test("mergeFrame", () => {

});

test("getFramesAsFlatArray", () => {

});

test("getFramesByClassName", () => {

});
