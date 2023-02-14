const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");

test("excluding primitives", () => expect(true).toBe(true));

// test("math types, clip line in rect", () => {
// 	// const rect = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
// 	const rect = ear.math.rect(-1, -1, 2, 2);
// 	rect.exclusive();
// 	expect(rect.clip(ear.math.line(1, 1))).not.toBe(undefined);
// 	expect(rect.clip(ear.math.line([1, 0], [0, 1]))).toBe(undefined);
// 	expect(rect.clip(ear.math.line(1, -1))).not.toBe(undefined);
// 	rect.inclusive();
// 	expect(rect.clip(ear.math.line([1, 0], [0, 1]))).not.toBe(undefined);

// 	// same as above, but inclusive test.
// 	const result1 = clip_line_in_convex_poly_inclusive(
// 		rect,
// 		ear.math.line(1, 1).vector,
// 		ear.math.line(1, 1).origin,
// 	);
// 	expect(result1[0][0]).toBe(-1);
// 	expect(result1[0][1]).toBe(-1);
// 	expect(result1[1][0]).toBe(1);
// 	expect(result1[1][1]).toBe(1);
// 	const result2 = clip_line_in_convex_poly_inclusive(
// 		rect,
// 		ear.math.line([1, 0], [0, 1]).vector,
// 		ear.math.line([1, 0], [0, 1]).origin,
// 	);
// 	expect(result2[0][0]).toBe(-1);
// 	expect(result2[0][1]).toBe(1);
// 	expect(result2[1][0]).toBe(1);
// 	expect(result2[1][1]).toBe(1);
// 	const result3 = clip_line_in_convex_poly_inclusive(
// 		rect,
// 		ear.math.line(1, -1).vector,
// 		ear.math.line(1, -1).origin,
// 	);
// 	expect(result3[0][0]).toBe(-1);
// 	expect(result3[0][1]).toBe(1);
// 	expect(result3[1][0]).toBe(1);
// 	expect(result3[1][1]).toBe(-1);
// });

// test("math types, clip ray in rect", () => {
// 	const rect = ear.math.rect(-1, -1, 2, 2);
// 	const result1 = rect.clip(ear.math.ray(1, 1));
// 	expect(result1[0][0]).toBe(0);
// 	expect(result1[0][1]).toBe(0);
// 	expect(result1[1][0]).toBe(1);
// 	expect(result1[1][1]).toBe(1);
// 	rect.inclusive();
// 	expect(rect.clip(ear.math.ray([1, 0], [0, 1]))).not.toBe(undefined);
// 	rect.exclusive();
// 	expect(rect.clip(ear.math.ray([1, 0], [0, 1]))).toBe(undefined);
// 	const result3 = rect.clip(ear.math.ray(1, -1));
// 	expect(result3[0][0]).toBe(0);
// 	expect(result3[0][1]).toBe(0);
// 	expect(result3[1][0]).toBe(1);
// 	expect(result3[1][1]).toBe(-1);
// });

// test("math types, clip segment in rect", () => {
// 	const rect = ear.math.rect(-1, -1, 2, 2);
// 	const result1 = rect.clip(ear.math.segment([0, 0], [1, 1]));
// 	expect(result1[0][0]).toBe(0);
// 	expect(result1[0][1]).toBe(0);
// 	expect(result1[1][0]).toBe(1);
// 	expect(result1[1][1]).toBe(1);
// 	const result2 = rect.clip(ear.math.segment([0, 0], [2, 2]));
// 	expect(result2[0][0]).toBe(0);
// 	expect(result2[0][1]).toBe(0);
// 	expect(result2[1][0]).toBe(1);
// 	expect(result2[1][1]).toBe(1);
// 	const result3 = rect.clip(ear.math.segment([0, 0], [1, -1]));
// 	expect(result3[0][0]).toBe(0);
// 	expect(result3[0][1]).toBe(0);
// 	expect(result3[1][0]).toBe(1);
// 	expect(result3[1][1]).toBe(-1);
// });

// test("no clips", () => {
// 	const rect = ear.math.rect(-1, -1, 2, 2);
// 	const result1 = rect.clip(ear.math.line([-0.707, 0.707], [2, 0]));
// 	expect(result1).toBe(undefined);
// });

// test("core clip", () => {
// 	const poly = [...ear.math.rect(-1, -1, 2, 2)];
// 	const vector = [1, 1];
// 	const origin = [0, 0];
// 	[
// 		clip_line_in_convex_poly_inclusive(poly, vector, origin),
// 		clip_ray_in_convex_poly_exclusive(poly, vector, origin),
// 		clip_ray_in_convex_poly_inclusive(poly, vector, origin),
// 		clip_segment_in_convex_poly_exclusive(poly, vector, origin),
// 		clip_segment_in_convex_poly_inclusive(poly, vector, origin),
// 	].forEach(res => expect(res).not.toBe(undefined));
// });

// test("core no clip", () => {
// 	const poly = [...ear.math.rect(-1, -1, 2, 2)];
// 	const vector = [1, 1];
// 	const origin = [10, 0];
// 	const seg0 = [10, 0];
// 	const seg1 = [0, 10];
// 	[
// 		clip_line_in_convex_poly_inclusive(poly, vector, origin),
// 		clip_ray_in_convex_poly_exclusive(poly, vector, origin),
// 		clip_ray_in_convex_poly_inclusive(poly, vector, origin),
// 		clip_segment_in_convex_poly_exclusive(poly, seg0, seg1),
// 		clip_segment_in_convex_poly_inclusive(poly, seg0, seg1),
// 	].forEach(res => expect(res).toBe(undefined));
// });

// test("core clip segments exclusive", () => {
// 	const poly = [...ear.math.rect(-1, -1, 2, 2)];
// 	// all inside
// 	const seg0 = [[0, 0], [0.2, 0.2]];
// 	const result0 = clip_segment_in_convex_poly_exclusive(poly, ...seg0);
// 	expect(ear.math.fnEpsilonEqualVectors(seg0[0], result0[0])).toBe(true);
// 	expect(ear.math.fnEpsilonEqualVectors(seg0[1], result0[1])).toBe(true);
// 	// all outside
// 	const seg1 = [[10, 10], [10.2, 10.2]];
// 	// const result1 = clip_segment_in_convex_poly_exclusive(poly, ...seg1);
// 	const result1 = ear.math.clipLineConvexPolygon(
// 		[[-1, -1], [1, -1], [1, 1], [-1, 1]],
// 		[0.2, 0.2],
// 		[10, 10],
// 		ear.math.include,
// 		ear.math.includeS,
// 	);
// 	expect(result1).toBe(undefined);
// 	// inside and collinear
// 	const seg2 = [[0, 0], [1, 0]];
// 	const result2 = ear.math.clipLineConvexPolygon(
// 		poly,
// 		[1, 0],
// 		[0, 0],
// 		ear.math.include,
// 		ear.math.includeS,
// 	);
// 	expect(ear.math.fnEpsilonEqualVectors(seg2[0], result2[0])).toBe(true);
// 	expect(ear.math.fnEpsilonEqualVectors(seg2[1], result2[1])).toBe(true);
// 	// outside and collinear
// 	const seg3 = [[5, 0], [1, 0]];
// 	// const result3 = clip_segment_in_convex_poly_exclusive(poly, ...seg3);
// 	const result3 = ear.math.clipLineConvexPolygon(
// 		poly,
// 		[5, 0],
// 		[1, 0],
// 		ear.math.exclude,
// 		ear.math.excludeS,
// 	);
// 	expect(result3).toBe(undefined);

// 	// inside and collinear
// 	const seg4 = [[-1, 0], [1, 0]];
// 	const result4 = clip_segment_in_convex_poly_exclusive(poly, ...seg4);
// 	expect(ear.math.fnEpsilonEqualVectors(seg4[0], result4[0])).toBe(true);
// 	expect(ear.math.fnEpsilonEqualVectors(seg4[1], result4[1])).toBe(true);
// });

// test("core clip segments inclusive", () => {
// 	const poly = [...ear.math.rect(-1, -1, 2, 2)];
// 	// all inside
// 	const seg0 = [[0, 0], [0.2, 0.2]];
// 	const result0 = clip_segment_in_convex_poly_inclusive(poly, ...seg0);
// 	expect(ear.math.fnEpsilonEqualVectors(seg0[0], result0[0])).toBe(true);
// 	expect(ear.math.fnEpsilonEqualVectors(seg0[1], result0[1])).toBe(true);
// 	// all outside
// 	const seg1 = [[10, 10], [10.2, 10.2]];
// 	const result1 = clip_segment_in_convex_poly_inclusive(poly, ...seg1);
// 	expect(result1).toBe(undefined);
// 	// inside and collinear
// 	const seg2 = [[0, 0], [1, 0]];
// 	const result2 = clip_segment_in_convex_poly_inclusive(poly, ...seg2);
// 	expect(ear.math.fnEpsilonEqualVectors(seg2[0], result2[0])).toBe(true);
// 	expect(ear.math.fnEpsilonEqualVectors(seg2[1], result2[1])).toBe(true);
// 	// outside and collinear
// 	// const seg3 = [[5, 0], [1, 0]];
// 	// const result3 = clip_segment_in_convex_poly_inclusive(poly, ...seg3);
// 	const result3 = ear.math.clipLineConvexPolygon(
// 		poly,
// 		[5, 0],
// 		[1, 0],
// 		ear.math.include,
// 		ear.math.includeS,
// 	);
// 	expect(result3).toBe(undefined);
// 	// inside and collinear
// 	const seg4 = [[-1, 0], [1, 0]];
// 	const result4 = clip_segment_in_convex_poly_inclusive(poly, ...seg4);
// 	expect(ear.math.fnEpsilonEqualVectors(seg4[0], result4[0])).toBe(true);
// 	expect(ear.math.fnEpsilonEqualVectors(seg4[1], result4[1])).toBe(true);
// });
