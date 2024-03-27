import { expect, test } from "vitest";
import ear from "../rabbit-ear.js";

const testEqualVectorVectors = function (a, b) {
	expect(a.length).toBe(b.length);
	a.forEach((_, i) => expect(ear.math.epsilonEqualVectors(a[i], b[i]))
		.toBe(true));
};

// const overlapConvexPolygonPoint = (
// 	polygon,
// 	point,
// 	polyDomain = exclude,
// 	epsilon = EPSILON,
// ) => {

test("overlapConvexPolygonPoint bad inputs", () => {
	// invalid point
	expect(ear.math.overlapConvexPolygonPoint(
		[[0, 0], [1, 0], [1, 1], [0, 1]],
		[],
		ear.math.exclude,
	).overlap).toBe(true);
});

test("overlapConvexPolygonPoint counter-clockwise point on boundary", () => {
	// counter-clockwise
	const square = [[0, 0], [1, 0], [1, 1], [0, 1]];
	expect(ear.math.overlapConvexPolygonPoint(square, [0.5, 0], ear.math.exclude).overlap)
		.toBe(false);
	expect(ear.math.overlapConvexPolygonPoint(square, [1, 0.5], ear.math.exclude).overlap)
		.toBe(false);
	expect(ear.math.overlapConvexPolygonPoint(square, [0.5, 1], ear.math.exclude).overlap)
		.toBe(false);
	expect(ear.math.overlapConvexPolygonPoint(square, [0, 0.5], ear.math.exclude).overlap)
		.toBe(false);

	expect(ear.math.overlapConvexPolygonPoint(square, [0.5, 0], ear.math.include).overlap)
		.toBe(true);
	expect(ear.math.overlapConvexPolygonPoint(square, [1, 0.5], ear.math.include).overlap)
		.toBe(true);
	expect(ear.math.overlapConvexPolygonPoint(square, [0.5, 1], ear.math.include).overlap)
		.toBe(true);
	expect(ear.math.overlapConvexPolygonPoint(square, [0, 0.5], ear.math.include).overlap)
		.toBe(true);
});

test("overlapConvexPolygonPoint clockwise point on boundary", () => {
	// clockwise
	const square = [[0, 0], [0, 1], [1, 1], [1, 0]];
	expect(ear.math.overlapConvexPolygonPoint(square, [0.5, 0], ear.math.exclude).overlap)
		.toBe(false);
	expect(ear.math.overlapConvexPolygonPoint(square, [1, 0.5], ear.math.exclude).overlap)
		.toBe(false);
	expect(ear.math.overlapConvexPolygonPoint(square, [0.5, 1], ear.math.exclude).overlap)
		.toBe(false);
	expect(ear.math.overlapConvexPolygonPoint(square, [0, 0.5], ear.math.exclude).overlap)
		.toBe(false);

	expect(ear.math.overlapConvexPolygonPoint(square, [0.5, 0], ear.math.include).overlap)
		.toBe(true);
	expect(ear.math.overlapConvexPolygonPoint(square, [1, 0.5], ear.math.include).overlap)
		.toBe(true);
	expect(ear.math.overlapConvexPolygonPoint(square, [0.5, 1], ear.math.include).overlap)
		.toBe(true);
	expect(ear.math.overlapConvexPolygonPoint(square, [0, 0.5], ear.math.include).overlap)
		.toBe(true);
});

test("overlapConvexPolygonPoint counter-clockwise point on vertex", () => {
	// counter-clockwise
	const square = [[0, 0], [1, 0], [1, 1], [0, 1]];
	expect(ear.math.overlapConvexPolygonPoint(square, [0, 0], ear.math.exclude).overlap)
		.toBe(false);
	expect(ear.math.overlapConvexPolygonPoint(square, [1, 0], ear.math.exclude).overlap)
		.toBe(false);
	expect(ear.math.overlapConvexPolygonPoint(square, [1, 1], ear.math.exclude).overlap)
		.toBe(false);
	expect(ear.math.overlapConvexPolygonPoint(square, [0, 1], ear.math.exclude).overlap)
		.toBe(false);

	expect(ear.math.overlapConvexPolygonPoint(square, [0, 0], ear.math.include).overlap)
		.toBe(true);
	expect(ear.math.overlapConvexPolygonPoint(square, [1, 0], ear.math.include).overlap)
		.toBe(true);
	expect(ear.math.overlapConvexPolygonPoint(square, [1, 1], ear.math.include).overlap)
		.toBe(true);
	expect(ear.math.overlapConvexPolygonPoint(square, [0, 1], ear.math.include).overlap)
		.toBe(true);
});

test("overlapConvexPolygonPoint clockwise point on vertex", () => {
	// clockwise
	const square = [[0, 0], [0, 1], [1, 1], [1, 0]];
	expect(ear.math.overlapConvexPolygonPoint(square, [0, 0], ear.math.exclude).overlap)
		.toBe(false);
	expect(ear.math.overlapConvexPolygonPoint(square, [1, 0], ear.math.exclude).overlap)
		.toBe(false);
	expect(ear.math.overlapConvexPolygonPoint(square, [1, 1], ear.math.exclude).overlap)
		.toBe(false);
	expect(ear.math.overlapConvexPolygonPoint(square, [0, 1], ear.math.exclude).overlap)
		.toBe(false);

	expect(ear.math.overlapConvexPolygonPoint(square, [0, 0], ear.math.include).overlap)
		.toBe(true);
	expect(ear.math.overlapConvexPolygonPoint(square, [1, 0], ear.math.include).overlap)
		.toBe(true);
	expect(ear.math.overlapConvexPolygonPoint(square, [1, 1], ear.math.include).overlap)
		.toBe(true);
	expect(ear.math.overlapConvexPolygonPoint(square, [0, 1], ear.math.include).overlap)
		.toBe(true);
});

test("overlapConvexPolygonPoint counter-clockwise point inside", () => {
	// counter-clockwise
	const square = [[0, 0], [1, 0], [1, 1], [0, 1]];
	expect(ear.math.overlapConvexPolygonPoint(square, [0.5, 0.5], ear.math.exclude).overlap)
		.toBe(true);
	expect(ear.math.overlapConvexPolygonPoint(square, [0.5, 0.5], ear.math.include).overlap)
		.toBe(true);
});

test("overlapConvexPolygonPoint clockwise point inside", () => {
	// clockwise
	const square = [[0, 0], [0, 1], [1, 1], [1, 0]];
	expect(ear.math.overlapConvexPolygonPoint(square, [0.5, 0.5], ear.math.exclude).overlap)
		.toBe(true);
	expect(ear.math.overlapConvexPolygonPoint(square, [0.5, 0.5], ear.math.include).overlap)
		.toBe(true);
});

test("overlapConvexPolygonPoint counter-clockwise point outside", () => {
	// counter-clockwise
	const square = [[0, 0], [1, 0], [1, 1], [0, 1]];
	expect(ear.math.overlapConvexPolygonPoint(square, [2, 0.5], ear.math.exclude).overlap)
		.toBe(false);
	expect(ear.math.overlapConvexPolygonPoint(square, [0.5, 2], ear.math.exclude).overlap)
		.toBe(false);
	expect(ear.math.overlapConvexPolygonPoint(square, [-2, 0.5], ear.math.exclude).overlap)
		.toBe(false);
	expect(ear.math.overlapConvexPolygonPoint(square, [0.5, -2], ear.math.exclude).overlap)
		.toBe(false);

	expect(ear.math.overlapConvexPolygonPoint(square, [2, 0.5], ear.math.include).overlap)
		.toBe(false);
	expect(ear.math.overlapConvexPolygonPoint(square, [0.5, 2], ear.math.include).overlap)
		.toBe(false);
	expect(ear.math.overlapConvexPolygonPoint(square, [-2, 0.5], ear.math.include).overlap)
		.toBe(false);
	expect(ear.math.overlapConvexPolygonPoint(square, [0.5, -2], ear.math.include).overlap)
		.toBe(false);
});

test("overlapConvexPolygonPoint clockwise point outside", () => {
	// clockwise
	const square = [[0, 0], [0, 1], [1, 1], [1, 0]];
	expect(ear.math.overlapConvexPolygonPoint(square, [2, 0.5], ear.math.exclude).overlap)
		.toBe(false);
	expect(ear.math.overlapConvexPolygonPoint(square, [0.5, 2], ear.math.exclude).overlap)
		.toBe(false);
	expect(ear.math.overlapConvexPolygonPoint(square, [-2, 0.5], ear.math.exclude).overlap)
		.toBe(false);
	expect(ear.math.overlapConvexPolygonPoint(square, [0.5, -2], ear.math.exclude).overlap)
		.toBe(false);

	expect(ear.math.overlapConvexPolygonPoint(square, [2, 0.5], ear.math.include).overlap)
		.toBe(false);
	expect(ear.math.overlapConvexPolygonPoint(square, [0.5, 2], ear.math.include).overlap)
		.toBe(false);
	expect(ear.math.overlapConvexPolygonPoint(square, [-2, 0.5], ear.math.include).overlap)
		.toBe(false);
	expect(ear.math.overlapConvexPolygonPoint(square, [0.5, -2], ear.math.include).overlap)
		.toBe(false);
});
