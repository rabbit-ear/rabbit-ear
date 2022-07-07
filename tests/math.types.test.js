const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear");

const names = [
	"vector",
	"matrix",
	"segment",
	"ray",
	"line",
	"rect",
	"circle",
	"ellipse",
	"polygon",
	// "junction",
];

const primitives = names
	.map(key => ear[key]());

test("smart detection", () => {
	expect(ear.typeof({ x: 1, y: 2 })).toBe("vector");
});

test("primitive constructor function names", () => primitives
	.forEach((primitive, i) => expect(primitive.constructor.name)
		.toBe(names[i])));

test("primitives Typeof", () => primitives
	.forEach((primitive, i) => expect(ear.typeof(primitive))
		.toBe(names[i])));

test("primitives instanceof", () => primitives
	.forEach((primitive, i) => expect(primitive instanceof ear[names[i]])
		.toBe(true)));

test("primitives constructor", () => primitives
	.forEach((primitive, i) => expect(primitive.constructor === ear[names[i]])
		.toBe(true)));

test("type guessing", () => {
	const vector1 = { x: 1, y: 2, z: 3 };
	const vector2 = [1, 2, 3];
	const line = { vector: [1, 1], origin: [0.5, 0.5] };
	const segment = [[1, 2], [4, 5]];
	const circle = { radius: 1 };
	const rect = { width: 2, height: 1 };

	expect(ear.typeof(vector1)).toBe("vector");
	expect(ear.typeof(vector2)).toBe("vector");
	expect(ear.typeof(line)).toBe("line");
	expect(ear.typeof(segment)).toBe("segment");
	expect(ear.typeof(circle)).toBe("circle");
	expect(ear.typeof(rect)).toBe("rect");
	expect(ear.typeof({})).toBe(undefined);
	expect(ear.typeof(4)).toBe(undefined);
	expect(ear.typeof(true)).toBe(undefined);
	expect(ear.typeof("s")).toBe(undefined);
});
