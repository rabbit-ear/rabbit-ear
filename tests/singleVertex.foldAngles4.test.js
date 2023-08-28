const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");

test("foldAngles4", () => {
	const foldAngle = Math.PI / 2;
	const sixth = Math.PI / 3;
	const result = ear.singleVertex.foldAngles4(
		[sixth * 1, sixth * 2, sixth * 2, sixth * 1],
		["M", "M", "V", "M"],
		foldAngle,
	);
	const expected = [
		0.9272952180016123,
		foldAngle,
		-0.9272952180016123,
		foldAngle,
	];
	result.forEach((res, i) => expect(res).toBeCloseTo(expected[i]));
});

test("foldAngles4, does not worry about self intersection", () => {
	const seventh = (Math.PI * 2) / 7;
	const assignments = [
		["V", "M", "M", "M"],
		["M", "V", "M", "M"],
		["M", "M", "V", "M"],
		["M", "M", "M", "V"],
	];
	const result = assignments.map(assign => ear.singleVertex.foldAngles4(
		[seventh * 1, seventh * 2, seventh * 2, seventh * 2],
		assign,
		Math.PI / 2,
	));
	result.forEach(res => {
		expect(res).not.toBe(undefined);
		expect(res.length).toBe(4);
	});
});
