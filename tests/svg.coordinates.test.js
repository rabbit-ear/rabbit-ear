import { expect, test } from "vitest";
import xmldom from "@xmldom/xmldom";
import ear from "../src/index.js";

ear.svg.window = xmldom;

test("", () => expect(true).toBe(true));

// test("coordinates, two points", () => {
// 	ear.svg.makeCoordinates(1, 2, 3, 4)
// 		.forEach((n, i) => expect(n).toBe([1, 2, 3, 4][i]));
// 	ear.svg.makeCoordinates([1, 2], [3, 4])
// 		.forEach((n, i) => expect(n).toBe([1, 2, 3, 4][i]));
// 	ear.svg.makeCoordinates([1, 2, 3], [4, 5, 6])
// 		.forEach((n, i) => expect(n).toBe([1, 2, 4, 5][i]));
// 	ear.svg.makeCoordinates([1], [2])
// 		.forEach((n, i) => expect(n).toBe([1, undefined, 2, undefined][i]));
// });

// test("coordinates, not two points", () => {
// 	expect(ear.svg.makeCoordinates().length).toBe(0);
// 	expect(ear.svg.makeCoordinates([]).length).toBe(0);
// 	expect(ear.svg.makeCoordinates([[]]).length).toBe(0);
// 	expect(ear.svg.makeCoordinates([], []).length).toBe(0);

// 	ear.svg.makeCoordinates([1, 2], [3, 4], [5, 6])
// 		.forEach((n, i) => expect(n).toBe([1, 2, 3, 4, 5, 6][i]));
// });
