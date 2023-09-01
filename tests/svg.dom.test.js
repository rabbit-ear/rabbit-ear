const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");
ear.svg.window = require("@xmldom/xmldom");

test("removeChildren()", () => {
	const svg = ear.svg();
	svg.line(1, 2, 3, 4);
	expect(svg.childNodes.length).toBe(1);
	svg.removeChildren();
	expect(svg.childNodes.length).toBe(0);
});

// test("appendTo()", () => {
// 	const svg = ear.svg();
// 	expect(svg.childNodes.length).toBe(0);
// 	const line = ear.svg.line();
// 	const circle = ear.svg.circle();
// 	const ellipse = ear.svg.ellipse();
// 	const rect = ear.svg.rect();
// 	const path = ear.svg.path();
// 	const polygon = ear.svg.polygon();
// 	const polyline = ear.svg.polyline();
// 	const group = ear.svg.g();
// 	[line, circle, ellipse, rect, path, polygon, polyline, group]
// 		.forEach(primitive => primitive.appendTo(svg));
// 	expect(svg.childNodes.length).toBe(8);
// });

// test("setAttributes()", () => {
// 	const props = { a: "10", display: "block", style: "color:red" };
// 	const line = ear.svg.line();
// 	line.setAttributes(props);
// 	expect(line.getAttribute("display")).toBe("block");
// 	const group = ear.svg.g();
// 	group.setAttributes(props);
// 	expect(group.getAttribute("style")).toBe("color:red");
// 	const svg = ear.svg();
// 	svg.setAttributes(props);
// 	expect(svg.getAttribute("display")).toBe("block");
// });
