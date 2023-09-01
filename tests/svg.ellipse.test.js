const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");
ear.svg.window = require("@xmldom/xmldom");

test("ellipse setters", () => {
	expect(ear.svg.ellipse().radius(5, 6).getAttribute("rx")).toBe("5");
	expect(ear.svg.ellipse().radius(5, 6).getAttribute("ry")).toBe("6");
	expect(ear.svg.ellipse().setRadius(5, 6).getAttribute("rx")).toBe("5");
	expect(ear.svg.ellipse().setRadius(5, 6).getAttribute("ry")).toBe("6");
	expect(ear.svg.ellipse().origin(2, 3).getAttribute("cx")).toBe("2");
	expect(ear.svg.ellipse().origin(2, 3).getAttribute("cy")).toBe("3");
	expect(ear.svg.ellipse().setOrigin(2, 3).getAttribute("cx")).toBe("2");
	expect(ear.svg.ellipse().setOrigin(2, 3).getAttribute("cy")).toBe("3");
	expect(ear.svg.ellipse().center(2, 3).getAttribute("cx")).toBe("2");
	expect(ear.svg.ellipse().center(2, 3).getAttribute("cy")).toBe("3");
	expect(ear.svg.ellipse().setCenter(2, 3).getAttribute("cx")).toBe("2");
	expect(ear.svg.ellipse().setCenter(2, 3).getAttribute("cy")).toBe("3");
	expect(ear.svg.ellipse().position(2, 3).getAttribute("cx")).toBe("2");
	expect(ear.svg.ellipse().position(2, 3).getAttribute("cy")).toBe("3");
	expect(ear.svg.ellipse().setPosition(2, 3).getAttribute("cx")).toBe("2");
	expect(ear.svg.ellipse().setPosition(2, 3).getAttribute("cy")).toBe("3");
	// incomplete info
	expect(ear.svg.ellipse().setRadius(5).getAttribute("rx")).toBe("5");
	// expect(ear.svg.ellipse().setRadius(5).getAttribute("ry")).toBe("");
});
