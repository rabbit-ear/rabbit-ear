const fs = require("fs");
const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");

test("makeFacesNormal crease pattern", () => {
	const foldfile = fs.readFileSync("./tests/files/fold/crane-cp.fold", "utf-8");
	const FOLD = JSON.parse(foldfile);
	const faceNormals = ear.graph.makeFacesNormal(FOLD);
	faceNormals
		.map(normal => ear.math.dot(normal, [0, 0, 1]))
		.forEach(dot => expect(dot).toBeCloseTo(1));
});

test("makeVerticesNormal crease pattern", () => {
	const foldfile = fs.readFileSync("./tests/files/fold/crane-cp.fold", "utf-8");
	const FOLD = JSON.parse(foldfile);
	const verticesNormal = ear.graph.makeVerticesNormal(FOLD);
	verticesNormal
		.map(normal => ear.math.dot(normal, [0, 0, 1]))
		.forEach(dot => expect(dot).toBeCloseTo(1));
});

test("makeFacesNormal 3d form", () => {
	const sphere = fs.readFileSync("./tests/files/obj/sphere-with-holes.obj", "utf-8");
	const FOLD = ear.convert.objToFold(sphere);
	const facesNormals = ear.graph.makeFacesNormal(FOLD);
	const m1 = facesNormals.filter(normal => ear.math.dot(normal, [1, 0, 0]) > 0.999);
	const m2 = facesNormals.filter(normal => ear.math.dot(normal, [-1, 0, 0]) > 0.999);
	const m3 = facesNormals.filter(normal => ear.math.dot(normal, [0, 1, 0]) > 0.999);
	const m4 = facesNormals.filter(normal => ear.math.dot(normal, [0, -1, 0]) > 0.999);
	const m5 = facesNormals.filter(normal => ear.math.dot(normal, [0, 0, 1]) > 0.999);
	const m6 = facesNormals.filter(normal => ear.math.dot(normal, [0, 0, -1]) > 0.999);
	expect(m1.length).toBe(0);
	expect(m2.length).toBe(0);
	expect(m3.length).toBe(0);
	expect(m4.length).toBe(0);
	expect(m5.length).toBe(0);
	expect(m6.length).toBe(0);
});

test("makeVerticesNormal 3d form", () => {
	const sphere = fs.readFileSync("./tests/files/obj/sphere-with-holes.obj", "utf-8");
	const FOLD = ear.convert.objToFold(sphere);
	const verticesNormal = ear.graph.makeVerticesNormal(FOLD);

	const m1 = verticesNormal.filter(normal => ear.math.dot(normal, [0, 1, 0]) > 0.999);
	const m2 = verticesNormal.filter(normal => ear.math.dot(normal, [0, -1, 0]) > 0.999);
	const m3 = verticesNormal.filter(normal => ear.math.dot(normal, [0, 0, -1]) > 0.999);
	expect(m1.length).toBe(1);
	expect(m2.length).toBe(1);
	expect(m3.length).toBe(1);
});
