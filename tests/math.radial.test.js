const { test, expect } = require("@jest/globals");
const math = require("../ear.js");

const testEqualVectors = function (...args) {
	expect(ear.fnEpsilonEqualVectors(...args)).toBe(true);
};

test("isCounterClockwiseBetween", () => {
	expect(ear.isCounterClockwiseBetween(0.5, 0, 1)).toBe(true);
	expect(ear.isCounterClockwiseBetween(0.5, 1, 0)).toBe(false);
	expect(ear.isCounterClockwiseBetween(11, 10, 12)).toBe(true);
	expect(ear.isCounterClockwiseBetween(11, 12, 10)).toBe(false);
	expect(ear.isCounterClockwiseBetween(
		Math.PI * (2 * 4) + Math.PI / 2,
		0,
		Math.PI,
	)).toBe(true);
	expect(ear.isCounterClockwiseBetween(
		Math.PI * (2 * 4) + Math.PI / 2,
		Math.PI,
		0,
	)).toBe(false);
});

test("interior angles", () => {
	testEqualVectors(
		[Math.PI / 2, Math.PI / 2, Math.PI / 2, Math.PI / 2],
		[[1, 0], [0, 1], [-1, 0], [0, -1]].map((v, i, ar) => math
			.counterClockwiseAngle2(v, ar[(i + 1) % ar.length])),
	);
	testEqualVectors(
		[Math.PI / 2, Math.PI / 2, Math.PI / 2, Math.PI / 2],
		[[1, 1], [-1, 1], [-1, -1], [1, -1]].map((v, i, ar) => math
			.counterClockwiseAngle2(v, ar[(i + 1) % ar.length])),
	);
});

test("counter-clockwise vector sorting", () => {
	testEqualVectors(
		[0, 1, 2, 3],
		ear.counterClockwiseOrder2([1, 1], [-1, 1], [-1, -1], [1, -1]),
	);
	testEqualVectors(
		[0, 3, 2, 1],
		ear.counterClockwiseOrder2([1, -1], [-1, -1], [-1, 1], [1, 1]),
	);
});

// test("sectors", () => {
//   testEqual(Math.PI / 2, ear.sector.fromVectors([1, 0], [0, 1]).angle);
//   testEqual(true, ear.sector.fromVectors([1, 0], [0, 1]).contains([1, 1]));
//   testEqual(false, ear.sector.fromVectors([1, 0], [0, 1]).contains([-1, 1]));
//   testEqual(false, ear.sector.fromVectors([1, 0], [0, 1]).contains([-1, -1]));
//   testEqual(false, ear.sector.fromVectors([1, 0], [0, 1]).contains([1, -1]));
// });

// test("junctions", () => {
//   testEqual([[1, 1], [1, -1], [-1, 1], [-1, -1]],
//     ear.junction([1, 1], [1, -1], [-1, 1], [-1, -1]).vectors);
//   testEqual([0, 2, 3, 1],
//     ear.junction([1, 1], [1, -1], [-1, 1], [-1, -1]).vectorOrder);
//   testEqual([Math.PI / 2, Math.PI / 2, Math.PI / 2, Math.PI / 2],
//     ear.junction([1, 1], [1, -1], [-1, 1], [-1, -1]).angles());
// });

test("clockwiseAngleRadians", () => {
	expect(ear.clockwiseAngleRadians(Math.PI, Math.PI / 2))
		.toBeCloseTo(Math.PI * (1 / 2));
	expect(ear.clockwiseAngleRadians(Math.PI / 2, Math.PI))
		.toBeCloseTo(Math.PI * (3 / 2));
	// same as above with negative numbers
	expect(ear.clockwiseAngleRadians(
		Math.PI + Math.PI * (2 * 4),
		Math.PI / 2 - Math.PI * (2 * 8),
	)).toBeCloseTo(Math.PI * (1 / 2));
	expect(ear.clockwiseAngleRadians(
		Math.PI / 2 - Math.PI * (2 * 3),
		Math.PI + Math.PI * (2 * 4),
	)).toBeCloseTo(Math.PI * (3 / 2));
	expect(ear.clockwiseAngleRadians(
		Math.PI - Math.PI * (2 * 4),
		Math.PI / 2 - Math.PI * (2 * 8),
	)).toBeCloseTo(Math.PI * (1 / 2));
	expect(ear.clockwiseAngleRadians(
		Math.PI / 2 - Math.PI * (2 * 3),
		Math.PI - Math.PI * (2 * 4),
	)).toBeCloseTo(Math.PI * (3 / 2));
});

test("counterClockwiseAngleRadians", () => {
	expect(ear.counterClockwiseAngleRadians(Math.PI, Math.PI / 2))
		.toBeCloseTo(Math.PI * (3 / 2));
	expect(ear.counterClockwiseAngleRadians(Math.PI / 2, Math.PI))
		.toBeCloseTo(Math.PI * (1 / 2));
	// same as above with negative numbers
	expect(ear.counterClockwiseAngleRadians(
		Math.PI - Math.PI * (2 * 4),
		Math.PI / 2 - Math.PI * (2 * 5),
	)).toBeCloseTo(Math.PI * (3 / 2));
	expect(ear.counterClockwiseAngleRadians(
		Math.PI + Math.PI * (2 * 4),
		Math.PI / 2 + Math.PI * (2 * 5),
	)).toBeCloseTo(Math.PI * (3 / 2));
	expect(ear.counterClockwiseAngleRadians(
		Math.PI / 2 - Math.PI * (2 * 7),
		Math.PI - Math.PI * (2 * 3),
	)).toBeCloseTo(Math.PI * (1 / 2));
});

test("clockwiseAngle2", () => {
	expect(ear.clockwiseAngle2([1, 0], [0, 1])).toBeCloseTo(Math.PI * (3 / 2));
	expect(ear.clockwiseAngle2([0, 1], [1, 0])).toBeCloseTo(Math.PI * (1 / 2));
});

test("counterClockwiseAngle2", () => {
	expect(ear.counterClockwiseAngle2([1, 0], [0, 1]))
		.toBeCloseTo(Math.PI * (1 / 2));
	expect(ear.counterClockwiseAngle2([0, 1], [1, 0]))
		.toBeCloseTo(Math.PI * (3 / 2));
});

// test("counter_clockwise_vector_order", () => {
//   ear.counter_clockwise_vector_order(...vectors)
// });

test("interior sector angles", () => {
	expect(ear.counterClockwiseSectors2([1, 0], [0, 1], [-1, 0])[0])
		.toBeCloseTo(Math.PI / 2);
	expect(ear.counterClockwiseSectors2([1, 0], [0, 1], [-1, 0])[1])
		.toBeCloseTo(Math.PI / 2);
	expect(ear.counterClockwiseSectors2([1, 0], [0, 1], [-1, 0])[2])
		.toBeCloseTo(Math.PI);
	expect(ear.counterClockwiseSectors2([1, 0], [-1, 0], [0, -1])[0])
		.toBeCloseTo(Math.PI);
	expect(ear.counterClockwiseSectors2([1, 0], [-1, 0], [0, -1])[1])
		.toBeCloseTo(Math.PI / 2);
	expect(ear.counterClockwiseSectors2([1, 0], [-1, 0], [0, -1])[2])
		.toBeCloseTo(Math.PI / 2);

	expect(ear.counterClockwiseSectors2([[1, 0], [0, 1], [-1, 0]])[0])
		.toBeCloseTo(Math.PI / 2);
	expect(ear.counterClockwiseSectors2([[1, 0], [0, 1], [-1, 0]])[1])
		.toBeCloseTo(Math.PI / 2);
	expect(ear.counterClockwiseSectors2([[1, 0], [0, 1], [-1, 0]])[2])
		.toBeCloseTo(Math.PI);
	expect(ear.counterClockwiseSectors2([[1, 0], [-1, 0], [0, -1]])[0])
		.toBeCloseTo(Math.PI);
	expect(ear.counterClockwiseSectors2([[1, 0], [-1, 0], [0, -1]])[1])
		.toBeCloseTo(Math.PI / 2);
	expect(ear.counterClockwiseSectors2([[1, 0], [-1, 0], [0, -1]])[2])
		.toBeCloseTo(Math.PI / 2);
});

test("clockwise bisect", () => {
	expect(ear.clockwiseBisect2([1, 0], [0, -1])[0]).toBeCloseTo(Math.sqrt(2) / 2);
	expect(ear.clockwiseBisect2([1, 0], [0, -1])[1]).toBeCloseTo(-Math.sqrt(2) / 2);
	expect(ear.clockwiseBisect2([1, 0], [-1, 0])[0]).toBeCloseTo(0);
	expect(ear.clockwiseBisect2([1, 0], [-1, 0])[1]).toBeCloseTo(-1);
	expect(ear.clockwiseBisect2([1, 0], [0, 1])[0]).toBeCloseTo(-Math.sqrt(2) / 2);
	expect(ear.clockwiseBisect2([1, 0], [0, 1])[1]).toBeCloseTo(-Math.sqrt(2) / 2);
	expect(ear.clockwiseBisect2([1, 0], [1, 0])[0]).toBeCloseTo(1);
	expect(ear.clockwiseBisect2([1, 0], [1, 0])[1]).toBeCloseTo(0);
});

test("counter-clockwise bisect", () => {
	expect(ear.counterClockwiseBisect2([1, 0], [0, 1])[0]).toBeCloseTo(Math.sqrt(2) / 2);
	expect(ear.counterClockwiseBisect2([1, 0], [0, 1])[1]).toBeCloseTo(Math.sqrt(2) / 2);
	expect(ear.counterClockwiseBisect2([1, 0], [-1, 0])[0]).toBeCloseTo(0);
	expect(ear.counterClockwiseBisect2([1, 0], [-1, 0])[1]).toBeCloseTo(1);
	expect(ear.counterClockwiseBisect2([1, 0], [0, -1])[0]).toBeCloseTo(-Math.sqrt(2) / 2);
	expect(ear.counterClockwiseBisect2([1, 0], [0, -1])[1]).toBeCloseTo(Math.sqrt(2) / 2);
	expect(ear.counterClockwiseBisect2([1, 0], [1, 0])[0]).toBeCloseTo(1);
	expect(ear.counterClockwiseBisect2([1, 0], [1, 0])[1]).toBeCloseTo(0);
});

test("counterClockwiseBisect2", () => {
	expect(ear.counterClockwiseBisect2([1, 0], [0, 1])[0])
		.toBeCloseTo(Math.sqrt(2) / 2);
	expect(ear.counterClockwiseBisect2([1, 0], [0, 1])[1])
		.toBeCloseTo(Math.sqrt(2) / 2);
	expect(ear.counterClockwiseBisect2([0, 1], [-1, 0])[0])
		.toBeCloseTo(-Math.sqrt(2) / 2);
	expect(ear.counterClockwiseBisect2([0, 1], [-1, 0])[1])
		.toBeCloseTo(Math.sqrt(2) / 2);
	// flipped vectors
	expect(ear.counterClockwiseBisect2([1, 0], [-1, 0])[0]).toBeCloseTo(0);
	expect(ear.counterClockwiseBisect2([1, 0], [-1, 0])[1]).toBeCloseTo(1);
});

test("bisectLines2", () => {
	expect(ear.bisectLines2([0, 1], [0, 0], [0, 1], [1, 0])[1])
		.toBe(undefined);
	expect(ear.bisectLines2([0, 1], [0, 0], [0, 1], [1, 0])[0].vector[0])
		.toBeCloseTo(0);
	expect(ear.bisectLines2([0, 1], [0, 0], [0, 1], [1, 0])[0].vector[1])
		.toBeCloseTo(1);
	expect(ear.bisectLines2([0, 1], [0, 0], [0, 1], [1, 0])[0].origin[0])
		.toBeCloseTo(0.5);
	expect(ear.bisectLines2([0, 1], [0, 0], [0, 1], [1, 0])[0].origin[1])
		.toBeCloseTo(0);

	expect(ear.bisectLines2([0, 1], [0, 0], [1, 1], [1, 0])[0].vector[0])
		.toBeCloseTo(0.3826834323650897);
	expect(ear.bisectLines2([0, 1], [0, 0], [1, 1], [1, 0])[0].vector[1])
		.toBeCloseTo(0.9238795325112867);
	expect(ear.bisectLines2([0, 1], [0, 0], [1, 1], [1, 0])[0].origin[0])
		.toBeCloseTo(0);
	expect(ear.bisectLines2([0, 1], [0, 0], [1, 1], [1, 0])[0].origin[1])
		.toBeCloseTo(-1);
});

test("counterClockwiseSubsectRadians", () => {
	testEqualVectors(
		ear.counterClockwiseSubsectRadians(3, 0, 3),
		[1, 2],
	);
	testEqualVectors(
		ear.counterClockwiseSubsectRadians(3, -1, 2),
		[0, 1],
	);
	expect(ear.counterClockwiseSubsectRadians(4, 0, -Math.PI)[0])
		.toBeCloseTo(Math.PI * (1 / 4));
	expect(ear.counterClockwiseSubsectRadians(4, 0, -Math.PI)[1])
		.toBeCloseTo(Math.PI * (2 / 4));
	expect(ear.counterClockwiseSubsectRadians(4, 0, -Math.PI)[2])
		.toBeCloseTo(Math.PI * (3 / 4));
	expect(ear.counterClockwiseSubsectRadians(2, 0, -Math.PI)[0])
		.toBeCloseTo(Math.PI / 2);
	expect(ear.counterClockwiseSubsectRadians(1, 0, -Math.PI).length)
		.toBe(0);
});

test("counterClockwiseSubsect2", () => {
	expect(ear.counterClockwiseSubsect2(2, [1, 0], [0, 1])[0][0])
		.toBeCloseTo(Math.sqrt(2) / 2);
	expect(ear.counterClockwiseSubsect2(2, [1, 0], [0, 1])[0][1])
		.toBeCloseTo(Math.sqrt(2) / 2);

	expect(ear.counterClockwiseSubsect2(4, [1, 0], [-1, 0])[0][0])
		.toBeCloseTo(Math.sqrt(2) / 2);
	expect(ear.counterClockwiseSubsect2(4, [1, 0], [-1, 0])[0][1])
		.toBeCloseTo(Math.sqrt(2) / 2);
	expect(ear.counterClockwiseSubsect2(4, [1, 0], [-1, 0])[1][0])
		.toBeCloseTo(0);
	expect(ear.counterClockwiseSubsect2(4, [1, 0], [-1, 0])[1][1])
		.toBeCloseTo(1);
	expect(ear.counterClockwiseSubsect2(4, [1, 0], [-1, 0])[2][0])
		.toBeCloseTo(-Math.sqrt(2) / 2);
	expect(ear.counterClockwiseSubsect2(4, [1, 0], [-1, 0])[2][1])
		.toBeCloseTo(Math.sqrt(2) / 2);
});

test("threePointTurnDirection", () => {
	expect(ear.threePointTurnDirection([0, 0], [1, 0], [2, 0])).toBe(0);
	expect(ear.threePointTurnDirection([0, 0], [1, 0], [2, 1])).toBe(1);
	expect(ear.threePointTurnDirection([0, 0], [1, 0], [2, -1])).toBe(-1);
	// with epsilon
	expect(ear.threePointTurnDirection([0, 0], [1, 0], [2, 0.000001], 0.001)).toBe(0);
	expect(ear.threePointTurnDirection([0, 0], [1, 0], [2, 0.001], 0.000001)).toBe(1);
	expect(ear.threePointTurnDirection([0, 0], [1, 0], [2, -0.000001], 0.001)).toBe(0);
	expect(ear.threePointTurnDirection([0, 0], [1, 0], [2, -0.001], 0.000001)).toBe(-1);
	// 180 degree turn
	expect(ear.threePointTurnDirection([0, 0], [2, 0], [1, 0])).toBe(undefined);
	expect(ear.threePointTurnDirection([0, 0], [5, 5], [2, 2])).toBe(undefined);
	expect(ear.threePointTurnDirection([0, 0], [5, 0], [0, 0])).toBe(undefined);
	expect(ear.threePointTurnDirection([0, 0], [1, 0], [-1, 0])).toBe(undefined);
});
