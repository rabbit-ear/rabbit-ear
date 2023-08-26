const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");

test("foldStripWithAssignments", () => {
	const res = ear.layer.foldStripWithAssignments(
		[1, 2, 3, 4, 5, 6],
		["V", "V", "V", "V", "V", "V"],
	);
	for (let i = 0; i < 6; i += 1) {
		expect(Math.abs(res[i][0])).toBe(Math.floor((i + 1) / 2));
		expect(Math.abs(res[i][1])).toBe(Math.floor(i / 2) + 1);
	}
});

test("foldStripWithAssignments self-intersect", () => {
	const res = ear.layer.foldStripWithAssignments(
		[2, 1, 2],
		["V", "V", "V"],
	);
	expect(JSON.stringify(res.flat())).toBe(JSON.stringify([0, 2, 2, 1, 1, 3]));
});

test("foldStripWithAssignments boundary 1", () => {
	const res = ear.layer.foldStripWithAssignments(
		[2, 4, 4, 2],
		["V", "B", "V", "M"],
	);
	expect(res[0]).not.toBe(undefined);
	expect(res[1]).toBe(undefined);
	expect(res[2]).toBe(undefined);
	expect(res[3]).toBe(undefined);
});

test("foldStripWithAssignments boundary 2", () => {
	const res = ear.layer.foldStripWithAssignments(
		[2, 4, 4, 2],
		["B", "V", "V", "M"],
	);
	expect(res[0]).not.toBe(undefined);
	expect(res[1]).not.toBe(undefined);
	expect(res[2]).not.toBe(undefined);
	expect(res[3]).not.toBe(undefined);
});

test("foldStripWithAssignments boundary 3", () => {
	const res = ear.layer.foldStripWithAssignments(
		[2, 4, 4, 2],
		["V", "V", "M", "B"],
	);
	expect(res[0]).not.toBe(undefined);
	expect(res[1]).not.toBe(undefined);
	expect(res[2]).not.toBe(undefined);
	expect(res[3]).toBe(undefined);
});
