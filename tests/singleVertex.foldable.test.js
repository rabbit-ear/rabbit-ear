const fs = require("fs");
const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");

test("verticesFoldable", () => {
	const testfile = fs.readFileSync("./tests/files/fold/box-pleat-3d-invalid.fold", "utf-8");
	const graph = JSON.parse(testfile);
	const verts = ear.singleVertex.verticesFoldable(graph);
	const expected = [
		true, true, true, true, true, true, true, false, true, true, true, true,
	];
	expected.forEach((valid, i) => expect(verts[i]).toBe(valid));
});
