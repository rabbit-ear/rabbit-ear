const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");
ear.svg.window = require("@xmldom/xmldom");

test("animation", () => {
	const svg = ear.svg();
	svg.play = e => {};
	svg.stop();
});
