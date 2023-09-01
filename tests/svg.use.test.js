const { test, expect } = require("@jest/globals");
// const ear = require("./ear");
const ear = require("../rabbit-ear.js");
ear.svg.window = require("@xmldom/xmldom");

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
