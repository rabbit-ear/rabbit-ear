const fs = require("fs");
const { test, expect } = require("@jest/globals");
const xmldom = require("@xmldom/xmldom");
const ear = require("../rabbit-ear.js");

ear.window = xmldom;

test("convert objToFold empty", () => {
	ear.convert.objToFold("");
	expect(true).toBe(true);
});

test("convert objToFold sphere with holes", () => {
	const sphere = fs.readFileSync("./tests/files/obj/sphere-with-holes.obj", "utf-8");
	const result = ear.convert.objToFold(sphere);

	expect(result.vertices_coords.length).toBe(39);
	expect(result.edges_vertices.length).toBe(102);
	expect(result.faces_vertices.length).toBe(62);

	const boundaries = result.edges_assignment
		.filter(a => a === "B" || a === "b");
	expect(boundaries.length > 0 && boundaries.length < 102).toBe(true);
});
