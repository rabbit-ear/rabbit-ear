const { test, expect } = require("@jest/globals");
const xmldom = require("@xmldom/xmldom");
const ear = require("../rabbit-ear.js");

ear.window = xmldom;

test("graph svg extension", () => {
	const cp = ear.cp();
	cp.ray([0.25, 0.75], [0, 0]).mountain();
	const element = cp.svg();
	expect(element.childNodes.length).toBe(4);
	// custom component getters
	const vertices = Array.from(element.childNodes)
		.filter(el => el.className.baseVal === "vertices")[0];
	const edges = Array.from(element.childNodes)
		.filter(el => el.className.baseVal === "edges")[0];
	const faces = Array.from(element.childNodes)
		.filter(el => el.className.baseVal === "faces")[0];
	expect(vertices.childNodes.length).toBe(5);
	expect(faces.childNodes.length).toBe(2);
	expect(edges.childNodes.length).toBe(2);
});

// test("graph svg individual methods", () => {
// 	const cp = ear.cp();
// 	cp.ray([0.25, 0.75], [0, 0]).mountain();
// 	// custom component getters
// 	const vertices = ear.graph.svg.vertices(cp);
// 	expect(vertices.childNodes.length).toBe(5);
// 	const edges = ear.graph.svg.edges(cp);
// 	expect(edges.childNodes.length).toBe(2);
// 	const faces = ear.graph.svg.faces(cp);
// 	expect(faces.childNodes.length).toBe(2);
// });
