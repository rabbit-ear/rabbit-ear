import { expect, test } from "vitest";
import xmldom from "@xmldom/xmldom";
import ear from "../rabbit-ear.js";

ear.svg.window = xmldom;

test("environment", () => {
	expect(true).toBe(true);
});
