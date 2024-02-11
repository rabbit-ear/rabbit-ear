import { expect, test } from "vitest";
import xmldom from "@xmldom/xmldom";
import ear from "../rabbit-ear.js";

ear.window = xmldom;

test("ear.cp is deprecated, need new test object", () => expect(true).toBe(true));

// test("graph svg extension", () => {
// 	const cp = ear.graph();
// 	cp.ray([0.25, 0.75], [0, 0]).mountain();
// 	const element = cp.svg();
// 	expect(element.childNodes.length).toBe(2);
// 	// custom component getters
// 	const boundaries = Array.from(element.childNodes)
// 		.filter(el => el.getAttribute("class") === "boundaries")[0];
// 	const edges = Array.from(element.childNodes)
// 		.filter(el => el.getAttribute("class") === "edges")[0];
// 	const vertices = Array.from(element.childNodes)
// 		.filter(el => el.getAttribute("class") === "vertices")[0];
// 	const faces = Array.from(element.childNodes)
// 		.filter(el => el.getAttribute("class") === "faces")[0];
// 	expect(boundaries.childNodes.length).toBe(1);
// 	expect(edges.childNodes.length).toBe(2);
// 	expect(vertices == null).toBe(true);
// 	expect(faces == null).toBe(true);
// });

// test("graph svg, with vertices", () => {
// 	const cp = ear.graph();
// 	cp.ray([0.25, 0.75], [0, 0]).mountain();
// 	const element = cp.svg({ vertices: true });
// 	expect(element.childNodes.length).toBe(3);
// 	// custom component getters
// 	const vertices = Array.from(element.childNodes)
// 		.filter(el => el.getAttribute("class") === "vertices")[0];
// 	expect(vertices.childNodes.length).toBe(5);
// });

// // test("graph svg individual methods", () => {
// // 	const cp = ear.graph();
// // 	cp.ray([0.25, 0.75], [0, 0]).mountain();
// // 	// custom component getters
// // 	const vertices = ear.graph.svg.vertices(cp);
// // 	expect(vertices.childNodes.length).toBe(5);
// // 	const edges = ear.graph.svg.edges(cp);
// // 	expect(edges.childNodes.length).toBe(2);
// // 	const faces = ear.graph.svg.faces(cp);
// // 	expect(faces.childNodes.length).toBe(2);
// // });
