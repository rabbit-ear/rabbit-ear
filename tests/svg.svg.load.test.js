const { test, expect } = require("@jest/globals");
const fs = require("fs");
const ear = require("../rabbit-ear.js");
ear.svg.window = require("@xmldom/xmldom");

test("", () => expect(true).toBe(true));

// const path = "./tests/dragon.svg";

// const testSVG = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 150">
// <circle cx="150" cy="75" r="75"/>
// </svg>`;

// test("loading callback", done => {
// 	ear.svg(400, 400, () => {
// 		done();
// 	});
// });

// // test("async attempt promises", () => {
// //   const svg = ear.svg();
// //   svg.load(path)
// //     .then(() => {});
// //   expect(svg.childNodes.length).toBe(0);
// // });

// test("async using fs", (done) => {
// 	const svg = ear.svg();
// 	fs.readFile(path, { encoding: "utf8" }, (err, data) => {
// 		svg.load(data);
// 		const polyline = Array.from(svg.childNodes)
// 			.filter(a => a.nodeName === "polyline")
// 			.shift();
// 		expect(polyline !== undefined).toBe(true);
// 		done();
// 	});
// });

// test("async attempt with node", () => {
// 	const svg = ear.svg();
// 	svg.load(path);
// 	expect(svg.childNodes.length).toBe(0);
// });

// test("sync", () => {
// 	const svg = ear.svg();
// 	svg.load(testSVG);
// 	const circle = Array.from(svg.childNodes)
// 		.filter(a => a.nodeName === "circle")
// 		.shift();

// 	expect(circle !== undefined).toBe(true);
// });

// test("import load()", () => {
// 	const svgString = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="0" x2="300" y2="150" stroke="black" stroke-width="5"/></svg>`;

// 	const svgFromString = ear.svg();
// 	expect(svgFromString.childNodes.length).toBe(0);
// 	svgFromString.load(svgString);
// 	expect(svgFromString.childNodes.length).toBe(1);

// 	// console.log("svgFromString.childNodes", svgFromString.childNodes);
// 	// console.log("window", window);
// 	// console.log("window.document", window.document);
// });

// test("import string in argument", () => {
// 	const svgString = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="0" x2="300" y2="150" stroke="black" stroke-width="5"/></svg>`;

// 	const svg = ear.svg(svgString);
// 	expect(svg.childNodes.length).toBe(1);

// 	// console.log("svg.childNodes", svg.childNodes);
// 	// console.log("window", window);
// 	// console.log("window.document", window.document);
// });

// test("import string in argument with attributes", () => {
// 	const svgString = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="10 20 800 600" display="none"></svg>`;
// 	const svg = ear.svg(svgString);
// 	expect(svg.getAttribute("viewBox")).toBe("10 20 800 600");
// 	expect(svg.getAttribute("display")).toBe("none");
// });
