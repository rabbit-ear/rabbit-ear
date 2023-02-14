const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");

test("excluding type detection", () => expect(true).toBe(true));

// test("smart detection", () => {
// 	expect(ear.math.typeof({ x: 1, y: 2 })).toBe("vector");
// });

// test("type guessing", () => {
// 	const vector1 = { x: 1, y: 2, z: 3 };
// 	const vector2 = [1, 2, 3];
// 	const line = { vector: [1, 1], origin: [0.5, 0.5] };
// 	const segment = [[1, 2], [4, 5]];
// 	const circle = { radius: 1 };
// 	const rect = { width: 2, height: 1 };

// 	expect(ear.math.typeof(vector1)).toBe("vector");
// 	expect(ear.math.typeof(vector2)).toBe("vector");
// 	expect(ear.math.typeof(line)).toBe("line");
// 	expect(ear.math.typeof(segment)).toBe("segment");
// 	expect(ear.math.typeof(circle)).toBe("circle");
// 	expect(ear.math.typeof(rect)).toBe("rect");
// 	expect(ear.math.typeof({})).toBe(undefined);
// 	expect(ear.math.typeof(4)).toBe(undefined);
// 	expect(ear.math.typeof(true)).toBe(undefined);
// 	expect(ear.math.typeof("s")).toBe(undefined);
// });
