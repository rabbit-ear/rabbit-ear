import { expect, test } from "vitest";
import xmldom from "@xmldom/xmldom";
import ear from "../rabbit-ear.js";

ear.svg.window = xmldom;

test("set background", () => {
	const svg = ear.svg();
	svg.background("black", true);
	svg.background("#332698", false);
	expect(svg.childNodes.length).toBe(1);
});
