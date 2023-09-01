const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");
ear.svg.window = require("@xmldom/xmldom");

test("", () => expect(true).toBe(true));

// test("export options", () => {
// 	const svg = ear.svg();
// 	const save0 = svg.save();
// 	const save1 = svg.save({ output: "string" });
// 	const save2 = svg.save({ output: "svg" });
// 	const save3 = svg.save({ windowStyle: true });
// 	expect(typeof save0).toBe("string");
// 	expect(typeof save1).toBe("string");
// 	expect(typeof save2).toBe("object");
// 	expect(typeof save3).toBe("string");
// });

// test("svg export", () => {
// 	const svg = ear.svg();
// 	svg.line(0, 0, 300, 150).stroke("black").strokeWidth(5);
// 	const asString = svg.save();
// 	const asSvg = svg.save({ output: "svg" });
// 	const expectedString = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg">
// 	<line x1="0" y1="0" x2="300" y2="150" stroke="black" stroke-width="5"/>
// </svg>`;
// 	// const expectedString = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg"><line x1="0" y1="0" x2="300" y2="150" stroke="black" stroke-width="5"/></svg>`;
// 	expect(asString).toBe(expectedString);
// 	expect(asSvg.childNodes.length).toBe(1);
// 	expect(asSvg.childNodes[0].nodeName).toBe("line");
// });

// test("svg export with comments", () => {
// 	const svgString = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg">
// 	<!-- this is a comment-->
// 		<line x1="0" y1="0" x2="300" y2="150" stroke="black" stroke-width="5"/>
// 	<!--a comment with <xml> things <inside/> </inside>< ></ >< / > it-->
// </svg>`;
// 	const svg = ear.svg(svgString);
// 	const asSvg = svg.save({ output: "svg" });
// 	expect(asSvg.childNodes.length).toBe(3);
// 	expect(asSvg.childNodes[0].nodeName).toBe("#comment");
// 	expect(asSvg.childNodes[1].nodeName).toBe("line");
// 	expect(asSvg.childNodes[2].nodeName).toBe("#comment");
// });
