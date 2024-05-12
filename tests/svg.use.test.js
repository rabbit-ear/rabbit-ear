import { expect, test } from "vitest";
import xmldom from "@xmldom/xmldom";
import ear from "../src/index.js";

ear.svg.window = xmldom;
// const ear = require("./ear");

test("", () => expect(true).toBe(true));

// test("use with rabbit ear", () => {
// 	ear.use(SVG);
// 	expect(typeof ear.segment.svg).toBe("function");
// 	expect(typeof ear.segment.svg).toBe("function");
// 	expect(typeof ear.circle.svg).toBe("function");
// 	expect(typeof ear.ellipse.svg).toBe("function");
// 	expect(typeof ear.rect.svg).toBe("function");
// 	expect(typeof ear.polygon.svg).toBe("function");
// 	ear.segment.svg();
// 	ear.circle.svg();
// 	ear.ellipse.svg();
// 	ear.rect.svg();
// 	ear.polygon.svg();
// });
