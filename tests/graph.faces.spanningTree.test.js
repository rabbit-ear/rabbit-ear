const fs = require("fs");
const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");

test("makeFaceSpanningTree", () => {
	const foldfile = fs.readFileSync(
		"./tests/files/fold/disjoint-triangles-3d.fold",
		"utf-8",
	);
	const graph = JSON.parse(foldfile);
	ear.graph.makeFaceSpanningTree(graph);
});
