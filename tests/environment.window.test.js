import { expect, test } from "vitest";
import xmldom from "@xmldom/xmldom";
import ear from "../src/index.js";

ear.window = xmldom;
/**
 * this works even when Rabbit Ear is built without SVG library,
 * and it uses svgMini instead.
 */
test("nodejs window, svg mini library", () => {
	// const svg = ear.svg();
	const p = ear.svg.path("M1 2L3 4L-5 6z");
	p.setAttribute("stroke", "red");
	expect(p.getAttribute("d")).toBe("M1 2L3 4L-5 6z");
	expect(p.getAttribute("stroke")).toBe("red");
});
/**
 * this ONLY WORKS when the SVG library is included.
 */
test("nodejs window, svg library", () => {
	const svg = ear.svg();
	const p = svg.path()
		.Move(1, 2)
		.Line(3, 4)
		.Line(-5, 6)
		.close()
		.stroke("red");
	expect(p.getAttribute("d")).toBe("M1 2L3 4L-5 6z");
	expect(p.getAttribute("stroke")).toBe("red");
});
