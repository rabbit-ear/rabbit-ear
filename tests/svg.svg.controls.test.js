import { expect, test } from "vitest";
import xmldom from "@xmldom/xmldom";
import ear from "../src/index.js";

ear.svg.window = xmldom;

test("controls", () => {
	const svg = ear.svg();
	const controlLayer = svg.g();
	svg.controls(3)
		.svg(() => ear.svg.circle(svg.getWidth() * 0.1).fill("gray"))
		.position(() => [svg.getWidth() * 0.5, svg.getHeight() * 0.5])
		.parent(controlLayer)
		.onChange((point) => {
			point.svg.setRadius(Math.random() * 10);
		}, true);
});
