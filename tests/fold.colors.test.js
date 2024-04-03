import { expect, test } from "vitest";
import ear from "../src/index.js";

test("rgbToAssignment, all assignments", () => {
	expect(ear.graph.rgbToAssignment(255, 0, 0)).toBe("M");
	expect(ear.graph.rgbToAssignment(0, 255, 0)).toBe("C");
	expect(ear.graph.rgbToAssignment(0, 0, 255)).toBe("V");
	expect(ear.graph.rgbToAssignment(255, 255, 0)).toBe("J");
	expect(ear.graph.rgbToAssignment(255, 255, 255)).toBe("F");
	expect(ear.graph.rgbToAssignment(127, 127, 127)).toBe("F");
	expect(ear.graph.rgbToAssignment(0, 0, 0)).toBe("B");
});

test("rgbToAssignment red to gray", () => {
	// red to gray
	expect(ear.graph.rgbToAssignment(255, 0, 0)).toBe("M");
	expect(ear.graph.rgbToAssignment(200, 127, 60)).toBe("M");
	expect(ear.graph.rgbToAssignment(192, 127, 127)).toBe("M");
	// too gray, now it is "F"
	expect(ear.graph.rgbToAssignment(152, 127, 127)).toBe("F");
});
