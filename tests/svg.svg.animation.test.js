import { expect, test } from "vitest";
import xmldom from "@xmldom/xmldom";
import ear from "../rabbit-ear.js";

ear.svg.window = xmldom;

test("animation", () => {
	const svg = ear.svg();
	svg.play = e => {};
	svg.stop();
});
