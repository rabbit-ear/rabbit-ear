const { test, expect } = require("@jest/globals");
const xmldom = require("@xmldom/xmldom");
const ear = require("../rabbit-ear");

ear.window = xmldom;

test("graph svg extension", () => {
	const cp = ear.cp();
	cp.ray(0.25, 0.75).mountain();
	const element = cp.svg();
	expect(element.childNodes.length).toBe(4);
	// custom component getters
	expect(element.vertices.childNodes.length).toBe(5);
	expect(element.faces.childNodes.length).toBe(2);
	expect(element.edges.childNodes.length).toBe(2);
});

test("graph svg individual methods", () => {
	const cp = ear.cp();
	cp.ray(0.25, 0.75).mountain();
	// custom component getters
	const vertices = ear.graph.svg.vertices(cp);
	expect(vertices.childNodes.length).toBe(5);
	const edges = ear.graph.svg.edges(cp);
	expect(edges.childNodes.length).toBe(2);
	const faces = ear.graph.svg.faces(cp);
	expect(faces.childNodes.length).toBe(2);
});

