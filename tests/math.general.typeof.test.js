import { expect, test } from "vitest";
import ear from "../rabbit-ear.js";

test("removed", () => expect(true).toBe(true));

// test("type guessing", () => {
// 	const vector1 = [1, 2, 3];
// 	const vector2 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
// 	const line = { vector: [1, 1], origin: [0.5, 0.5] };
// 	const segment1 = [[1, 2], [4, 5]];
// 	const polygon1 = [[1, 2]];
// 	const polygon2 = [[1, 2], [4, 5], [6, 7]];
// 	const polygon3 = [[1], [2], [3], [4]];
// 	const circle = { radius: 1, origin: [1, 2] };
// 	const boundingBox1 = { min: [1, 2], max: [6, 8], span: [5, 6] };
// 	const boundingBox2 = { min: [3], max: [5], span: [2] };

// 	expect(ear.math.typeof(vector1)).toBe("vector");
// 	expect(ear.math.typeof(vector2)).toBe("vector");
// 	expect(ear.math.typeof(line)).toBe("line");
// 	expect(ear.math.typeof(segment1)).toBe("segment");
// 	expect(ear.math.typeof(polygon1)).toBe("polygon");
// 	expect(ear.math.typeof(polygon2)).toBe("polygon");
// 	expect(ear.math.typeof(polygon3)).toBe("polygon");
// 	expect(ear.math.typeof(circle)).toBe("circle");
// 	expect(ear.math.typeof(boundingBox1)).toBe("box");
// 	expect(ear.math.typeof(boundingBox2)).toBe("box");
// 	// Javascript primitives
// 	expect(ear.math.typeof({})).toBe("object");
// 	expect(ear.math.typeof([])).toBe("object");
// 	expect(ear.math.typeof(() => {})).toBe("function");
// 	expect(ear.math.typeof(4)).toBe("number");
// 	expect(ear.math.typeof(true)).toBe("boolean");
// 	expect(ear.math.typeof("s")).toBe("string");
// });

// test("speed of type guessing", () => {
// 	const objects = [
// 		[1, 2, 3],
// 		[1, 2, 3, 4, 5, 6, 7, 8, 9],
// 		{ vector: [1, 1], origin: [0.5, 0.5] },
// 		[[1, 2], [4, 5]],
// 		[[1, 2]],
// 		[[1, 2], [4, 5], [6, 7]],
// 		[[1], [2], [3], [4]],
// 		{ radius: 1, origin: [1, 2] },
// 	];
// 	// one million takes 54 milliseconds
// 	console.time("type-speed");
// 	for (let i = 0; i < 1000000; i += 1) {
// 		ear.math.typeof(objects[i % objects.length]);
// 	}
// 	console.timeEnd("type-speed");
// });
