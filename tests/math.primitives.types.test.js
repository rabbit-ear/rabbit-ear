import { expect, test } from "vitest";
import ear from "../src/index.js";

test("excluding primitives", () => expect(true).toBe(true));

// const names = [
// 	"vector",
// 	"matrix",
// 	"segment",
// 	"ray",
// 	"line",
// 	"rect",
// 	"circle",
// 	"ellipse",
// 	"polygon",
// 	// "junction",
// ];

// const primitives = names
// 	.map(key => ear.math[key]());

// test("primitive constructor function names", () => primitives
// 	.forEach((primitive, i) => expect(primitive.constructor.name)
// 		.toBe(names[i])));

// test("primitives Typeof", () => primitives
// 	.forEach((primitive, i) => expect(ear.math.typeof(primitive))
// 		.toBe(names[i])));

// test("primitives instanceof", () => primitives
// 	.forEach((primitive, i) => expect(primitive instanceof ear.math[names[i]])
// 		.toBe(true)));

// test("primitives constructor", () => primitives
// 	.forEach((primitive, i) => expect(primitive.constructor === ear.math[names[i]])
// 		.toBe(true)));

// test("interchangeability with get_", () => {
// 	const vector = ear.math.vector(1, 2, 3);
// 	const matrix = ear.math.matrix(1, 2, 3, 4);
// 	const line = ear.math.line(1, 2);
// 	const ray = ear.math.ray(1, 2);
// 	const segment = ear.math.segment([1, 2], [3, 4]);
// 	const circle = ear.math.circle(1);
// 	const rect = ear.math.rect(2, 4);
// 	const ellipse = ear.math.ellipse(1, 2);
// 	expect(ear.math.getVector(vector)[2]).toBe(3);
// 	// expect(ear.math.getVectorOfVectors(segment)[0]).toBe(1);
// 	expect(ear.math.getSegment(segment)[0][1]).toBe(2);
// 	expect(ear.math.getLine(line).vector[1]).toBe(2);
// 	expect(ear.math.getRect(rect).height).toBe(4);
// 	expect(ear.math.getMatrix3x4(matrix)[4]).toBe(4);
// //  expect(ear.math.get_matrix2(matrix)[1]).toBe(2);
// });
