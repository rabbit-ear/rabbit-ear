import { expect, test } from "vitest";
import ear from "../src/index.js";

test("deprecated", () => expect(true).toBe(true));

// test("splitConvexPolygon", () => {
// 	const rect_counter = [
// 		[-1, -1],
// 		[+1, -1],
// 		[+1, +1],
// 		[-1, +1],
// 	];
// 	const rect_clock = [
// 		[-1, -1],
// 		[-1, +1],
// 		[+1, +1],
// 		[+1, -1],
// 	];
// 	const res0 = ear.math.splitConvexPolygon(rect_counter, { vector: [1, 2], origin: [0, 0] });
// 	[[-1, 1], [-1, -1], [-0.5, -1], [0.5, 1]].forEach((expected, i) => {
// 		expect(JSON.stringify(expected)).toBe(JSON.stringify(res0[0][i]));
// 	});
// 	[[1, -1], [1, 1], [0.5, 1], [-0.5, -1]].forEach((expected, i) => {
// 		expect(JSON.stringify(expected)).toBe(JSON.stringify(res0[1][i]));
// 	});
// });

// test("splitConvexPolygon no overlap", () => {
// 	const rect_counter = [
// 		[-1, -1],
// 		[+1, -1],
// 		[+1, +1],
// 		[-1, +1],
// 	];
// 	const result = ear.math.splitConvexPolygon(rect_counter, { vector: [1, 2], origin: [10, 0] });
// 	rect_counter.forEach((expected, i) => {
// 		expect(JSON.stringify(expected)).toBe(JSON.stringify(result[0][i]));
// 	});
// });

// test("splitConvexPolygon vertex collinear", () => {
// 	const rect_counter = [
// 		[-1, -1],
// 		[+1, -1],
// 		[+1, +1],
// 		[-1, +1],
// 	];
// 	const res0 = ear.math.splitConvexPolygon(rect_counter, { vector: [1, 1], origin: [0, 0] });
// 	[[1, 1], [-1, 1], [-1, -1]].forEach((expected, i) => {
// 		expect(JSON.stringify(expected)).toBe(JSON.stringify(res0[0][i]));
// 	});
// 	[[-1, -1], [1, -1], [1, 1]].forEach((expected, i) => {
// 		expect(JSON.stringify(expected)).toBe(JSON.stringify(res0[1][i]));
// 	});
// });

// test("splitConvexPolygon 1 edge and 1 vertex collinear", () => {
// 	const rect_counter = [
// 		[-1, -1],
// 		[+1, -1],
// 		[+1, +1],
// 		[-1, +1],
// 	];
// 	const res0 = ear.math.splitConvexPolygon(rect_counter, { vector: [1, 2], origin: [-1, -1] });
// 	[[-1, 1], [-1, -1], [0, 1]].forEach((expected, i) => {
// 		expect(JSON.stringify(expected)).toBe(JSON.stringify(res0[0][i]));
// 	});
// 	[[1, -1], [1, 1], [0, 1], [-1, -1]].forEach((expected, i) => {
// 		expect(JSON.stringify(expected)).toBe(JSON.stringify(res0[1][i]));
// 	});
// });
