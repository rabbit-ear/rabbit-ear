const fs = require("fs");
const { test, expect } = require("@jest/globals");
const xmldom = require("@xmldom/xmldom");
const ear = require("../rabbit-ear.js");

ear.window = xmldom;

// these fail, and I can't seem to setup a try catch that
// won't break the testing environment.

// test("convert opxToFold no param", () => {
// 	let error;
// 	try {
// 		ear.convert.opxToFold();
// 	} catch (err) {
// 		error = err;
// 	}
// 	expect(error).not.toBe(undefined);
// });

// test("convert opxToFold empty", () => {
// 	let error;
// 	try {
// 		ear.convert.opxToFold("");
// 	} catch (err) {
// 		error = err;
// 	}
// 	expect(error).not.toBe(undefined);
// });

test("convert opxToFold almost empty", () => {
	ear.convert.opxToFold("<void></void>");
	expect(true).toBe(true);
});

test("convert opxToFold invalid", () => {
	ear.convert.opxToFold(`<?xml version="1.0" encoding="UTF-8"?>
<java version="1.5.0_13" class="java.beans.XMLDecoder">
 <object class="oripa.DataSet"></object>
</java>
`);
	expect(true).toBe(true);
});

test("convert opxToFold", () => {
	const testfile = fs.readFileSync("./tests/files/opx/test.opx", "utf-8");
	const result = ear.convert.opxToFold(testfile);
	expect(result.vertices_coords.length).toBe(8);
	expect(result.edges_vertices.length).toBe(10);
	expect(result.faces_vertices.length).toBe(3);
	const boundaries = result.edges_assignment.filter(a => a === "B" || a === "b");
	expect(boundaries.length > 0 && boundaries.length < result.edges_vertices.length)
		.toBe(true);
});

test("convert opxToFold", () => {
	const birdBase = fs.readFileSync("./tests/files/opx/bird-base.opx", "utf-8");
	const result = ear.convert.opxToFold(birdBase);
	expect(result.vertices_coords.length).toBe(9);
	expect(result.edges_vertices.length).toBe(20);
	expect(result.faces_vertices.length).toBe(12);
	const boundaries = result.edges_assignment.filter(a => a === "B" || a === "b");
	expect(boundaries.length > 0 && boundaries.length < result.edges_vertices.length)
		.toBe(true);
});
