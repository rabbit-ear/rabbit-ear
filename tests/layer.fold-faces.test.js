const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");

// test("circularArrayValidRanges", () => {
// 	circularArrayValidRanges([0, 1, undefined, 2, 3, undefined, undefined, 4])
// 	circularArrayValidRanges([0, 1, 2, undefined, 3, 4, undefined, undefined])
// 	circularArrayValidRanges([undefined, 0, 1, 2, undefined, 3, 4, undefined])
// 	circularArrayValidRanges([undefined, 0, 1, 2, undefined, 3, 4])
// });

test("foldStripWithAssignments, boundaries", () => {
	const res1 = ear.layer
		.foldStripWithAssignments([2, 2, 2, 2], Array.from("bbbb"));
	expect(JSON.stringify(res1))
		.toBe(JSON.stringify([[0, 2], null, null, null]));

	const res2 = ear.layer
		.foldStripWithAssignments([2, 2, 2, 2], Array.from("mmmm"));
	expect(JSON.stringify(res2))
		.toBe(JSON.stringify([[0, 2], [2, 0], [0, 2], [2, 0]]));

	const res3 = ear.layer
		.foldStripWithAssignments([2, 2, 2, 2], Array.from("mmmb"));
	expect(JSON.stringify(res3))
		.toBe(JSON.stringify([[0, 2], [2, 0], [0, 2], null]));

	const res4 = ear.layer
		.foldStripWithAssignments([2, 2, 2, 2], Array.from("mmbm"));
	expect(JSON.stringify(res4))
		.toBe(JSON.stringify([[0, 2], [2, 0], null, null]));

	const res5 = ear.layer
		.foldStripWithAssignments([2, 2, 2, 2], Array.from("mbmm"));
	expect(JSON.stringify(res5))
		.toBe(JSON.stringify([[0, 2], null, null, null]));

	const res6 = ear.layer
		.foldStripWithAssignments([2, 2, 2, 2], Array.from("bmmm"));
	expect(JSON.stringify(res6))
		.toBe(JSON.stringify([[0, 2], [2, 0], [0, 2], [2, 0]]));
});

test("foldStripWithAssignments, flat", () => {
	const res1 = ear.layer
		.foldStripWithAssignments([2, 2, 2, 2], Array.from("ffff"));
	expect(JSON.stringify(res1))
		.toBe(JSON.stringify([[0, 2], [2, 4], [4, 6], [6, 8]]));

	const res2 = ear.layer
		.foldStripWithAssignments([2, 2, 2, 2], Array.from("fffm"));
	expect(JSON.stringify(res2))
		.toBe(JSON.stringify([[0, 2], [2, 4], [4, 6], [6, 4]]));

	const res3 = ear.layer
		.foldStripWithAssignments([2, 2, 2, 2], Array.from("ffmf"));
	expect(JSON.stringify(res3))
		.toBe(JSON.stringify([[0, 2], [2, 4], [4, 2], [2, 0]]));

	const res4 = ear.layer
		.foldStripWithAssignments([2, 2, 2, 2], Array.from("fmff"));
	expect(JSON.stringify(res4))
		.toBe(JSON.stringify([[0, 2], [2, 0], [0, -2], [-2, -4]]));

	const res5 = ear.layer
		.foldStripWithAssignments([2, 2, 2, 2], Array.from("mfff"));
	expect(JSON.stringify(res5))
		.toBe(JSON.stringify([[0, 2], [2, 4], [4, 6], [6, 8]]));

	const res6 = ear.layer
		.foldStripWithAssignments([2, 2, 2, 2], Array.from("fmfv"));
	expect(JSON.stringify(res6))
		.toBe(JSON.stringify([[0, 2], [2, 0], [0, -2], [-2, 0]]));

	const res7 = ear.layer
		.foldStripWithAssignments([2, 2, 2, 2], Array.from("mfvf"));
	expect(JSON.stringify(res7))
		.toBe(JSON.stringify([[0, 2], [2, 4], [4, 2], [2, 0]]));
});

test("foldStripWithAssignments, boundary and flat", () => {
	const res1 = ear.layer
		.foldStripWithAssignments([5, 4, 3, 4], Array.from("mvmm"));
	expect(JSON.stringify(res1))
		.toBe(JSON.stringify([[0, 5], [5, 1], [1, 4], [4, 0]]));

	const res2 = ear.layer
		.foldStripWithAssignments([5, 4, 3, 4], Array.from("mvbb"));
	expect(JSON.stringify(res2))
		.toBe(JSON.stringify([[0, 5], [5, 1], null, null]));

	const res3 = ear.layer
		.foldStripWithAssignments([5, 4, null, 3, 4, 7], Array.from("mvbbmm"));
	expect(JSON.stringify(res3))
		.toBe(JSON.stringify([[0, 5], [5, 1], null, null, null, null]));

	const res4 = ear.layer
		.foldStripWithAssignments([5, 4, 3, 3, 4, 7], Array.from("bmvmmb"));
	expect(JSON.stringify(res4))
		.toBe(JSON.stringify([[0, 5], [5, 1], [1, 4], [4, 1], [1, 5], null]));
});
