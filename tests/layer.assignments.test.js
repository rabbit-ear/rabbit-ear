// this is not included and accessible from the main rabbit-ear export anymore

import { expect, test } from "vitest";
import ear from "../rabbit-ear.js";

test("skip", () => expect(true).toBe(true));

// const isEqual = (...args) => args
// 	.map(el => JSON.stringify(el))
// 	.map((el, i, arr) => [el, arr[(i + 1) % arr.length]])
// 	.map(pair => pair[0] === pair[1])
// 	.reduce((a, b) => a && b, true);

// test("assignmentsToFacesFlip, empty", () => {
// 	try {
// 		ear.vertex.assignmentsToFacesFlip(undefined);
// 	} catch (error) {
// 		expect(error).not.toBe(undefined);
// 	}
// 	const res1 = isEqual(
// 		ear.layer.assignmentsToFacesFlip([]),
// 		[],
// 	);
// 	expect(res1).toBe(false);
// });

// test("assignmentsToFacesFlip, mv only", () => {
// 	const res1 = isEqual(
// 		ear.layer.assignmentsToFacesFlip(Array.from("mmmm")),
// 		[false, true, false, true],
// 	);
// 	const res2 = isEqual(
// 		ear.layer.assignmentsToFacesFlip(Array.from("mVvM")),
// 		[false, true, false, true],
// 	);
// 	const res3 = isEqual(
// 		ear.layer.assignmentsToFacesFlip(Array.from("m")),
// 		[false],
// 	);
// 	const res4 = isEqual(
// 		ear.layer.assignmentsToFacesFlip(Array.from("V")),
// 		[false],
// 	);
// 	expect([res1, res2, res3, res4].reduce((a, b) => a && b, true))
// 		.toBe(true);
// });

// test("assignmentsToFacesFlip, with flat folds", () => {
// 	const res1 = isEqual(
// 		ear.layer.assignmentsToFacesFlip(Array.from("ffff")),
// 		[false, false, false, false],
// 	);
// 	const res2 = isEqual(
// 		ear.layer.assignmentsToFacesFlip(Array.from("mfff")),
// 		[false, false, false, false],
// 	);
// 	const res3 = isEqual(
// 		ear.layer.assignmentsToFacesFlip(Array.from("ffffm")),
// 		[false, false, false, false, true],
// 	);
// 	const res4 = isEqual(
// 		ear.layer.assignmentsToFacesFlip(Array.from("vvffff")),
// 		[false, true, true, true, true, true],
// 	);
// 	expect([res1, res2, res3, res4].reduce((a, b) => a && b, true))
// 		.toBe(true);
// });

// test("assignmentsToFacesVertical, MV", () => {
// 	const res1 = ear.layer.assignmentsToFacesVertical(Array.from("MMMM"));
// 	expect(JSON.stringify(res1)).toBe(JSON.stringify([-1, 1, -1, 1]));

// 	const res2 = ear.layer.assignmentsToFacesVertical(Array.from("MMMV"));
// 	expect(JSON.stringify(res2)).toBe(JSON.stringify([-1, 1, 1, 1]));

// 	const res3 = ear.layer.assignmentsToFacesVertical(Array.from("MMVM"));
// 	expect(JSON.stringify(res3)).toBe(JSON.stringify([-1, -1, -1, 1]));

// 	const res4 = ear.layer.assignmentsToFacesVertical(Array.from("MVMM"));
// 	expect(JSON.stringify(res4)).toBe(JSON.stringify([1, 1, -1, 1]));

// 	const res5 = ear.layer.assignmentsToFacesVertical(Array.from("VMMM"));
// 	expect(JSON.stringify(res5)).toBe(JSON.stringify([-1, 1, -1, -1]));
// });

// test("assignmentsToFacesVertical, with flat", () => {
// 	const res1 = ear.layer.assignmentsToFacesVertical(Array.from("ffff"));
// 	expect(JSON.stringify(res1)).toBe(JSON.stringify([0, 0, 0, 0]));

// 	const res2 = ear.layer.assignmentsToFacesVertical(Array.from("fffm"));
// 	expect(JSON.stringify(res2)).toBe(JSON.stringify([0, 0, -1, -0]));

// 	const res3 = ear.layer.assignmentsToFacesVertical(Array.from("ffmf"));
// 	expect(JSON.stringify(res3)).toBe(JSON.stringify([0, -1, -0, -0]));

// 	const res4 = ear.layer.assignmentsToFacesVertical(Array.from("fmff"));
// 	expect(JSON.stringify(res4)).toBe(JSON.stringify([-1, -0, -0, -0]));

// 	const res5 = ear.layer.assignmentsToFacesVertical(Array.from("mfff"));
// 	expect(JSON.stringify(res5)).toBe(JSON.stringify([0, 0, 0, -1]));

// 	const res6 = ear.layer.assignmentsToFacesVertical(Array.from("ffvf"));
// 	expect(JSON.stringify(res6)).toBe(JSON.stringify([0, 1, 0, 0]));

// 	const res7 = ear.layer.assignmentsToFacesVertical(Array.from("fffv"));
// 	expect(JSON.stringify(res7)).toBe(JSON.stringify([0, 0, 1, 0]));
// });

// test("assignmentsToFacesVertical, with boundary", () => {
// 	const res1 = ear.layer.assignmentsToFacesVertical(Array.from("bbbb"));
// 	expect(JSON.stringify(res1)).toBe(JSON.stringify([0, 0, 0, 0]));

// 	const res2 = ear.layer.assignmentsToFacesVertical(Array.from("bbbm"));
// 	expect(JSON.stringify(res2)).toBe(JSON.stringify([0, 0, -1, -0]));

// 	const res3 = ear.layer.assignmentsToFacesVertical(Array.from("bbmb"));
// 	expect(JSON.stringify(res3)).toBe(JSON.stringify([0, -1, -0, -0]));

// 	const res4 = ear.layer.assignmentsToFacesVertical(Array.from("bmbb"));
// 	expect(JSON.stringify(res4)).toBe(JSON.stringify([-1, -0, -0, -0]));

// 	const res5 = ear.layer.assignmentsToFacesVertical(Array.from("mbbb"));
// 	expect(JSON.stringify(res5)).toBe(JSON.stringify([0, 0, 0, -1]));

// 	const res6 = ear.layer.assignmentsToFacesVertical(Array.from("bbvb"));
// 	expect(JSON.stringify(res6)).toBe(JSON.stringify([0, 1, 0, 0]));

// 	const res7 = ear.layer.assignmentsToFacesVertical(Array.from("bbbv"));
// 	expect(JSON.stringify(res7)).toBe(JSON.stringify([0, 0, 1, 0]));
// });
