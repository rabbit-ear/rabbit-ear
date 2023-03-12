const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");

test("overlapBoundingBoxes, point overlap", () => {
	const box1 = { min: [0, 0], max: [1, 1] };
	const box2 = { min: [0.9, 0.9], max: [2, 2] };
	expect(ear.math.overlapBoundingBoxes(box1, box2)).toBe(true);
});

test("overlapBoundingBoxes, edge overlap", () => {
	const box1 = { min: [0, 0], max: [1, 1] };
	const box2 = { min: [1, 0], max: [2, 1] };
	expect(ear.math.overlapBoundingBoxes(box1, box2)).toBe(true);
});

test("overlapBoundingBoxes, point overlap, epsilon away", () => {
	const box1 = { min: [0, 0], max: [1, 1] };
	const box2 = { min: [1 + 1e-2, 1 + 1e-2], max: [2, 2] };
	expect(ear.math.overlapBoundingBoxes(box1, box2)).toBe(false);
});

test("overlapBoundingBoxes, edge overlap", () => {
	const box1 = { min: [0, 0], max: [1, 1] };
	const box2 = { min: [1 + 1e-2, 0], max: [2, 1] };
	expect(ear.math.overlapBoundingBoxes(box1, box2)).toBe(false);
});

// test("overlap on member types", () => {
// 	const polygon = ear.math.polygon([0, 1.15], [-1, -0.577], [1, -0.577]);
// 	const circle = ear.math.circle(1);
// 	const line = ear.math.line([1, 2], [0.5, 0]);
// 	const ray = ear.math.ray([-1, 2], [0.5, -0.1]);
// 	const segment = ear.math.segment([-2, 0.5], [2, 0.5]);
// 	const vector = ear.math.vector(0.75, 0.5);

// 	const polygon2 = ear.math.polygon([0, -1.15], [1, 0.577], [-1, 0.577]);
// 	const circle2 = ear.math.circle(1, [0.5, 0]);
// 	const line2 = ear.math.line([-1, 2], [0.5, 0]);
// 	const ray2 = ear.math.ray([1, 2], [-0.5, 0]);
// 	const segment2 = ear.math.segment([0.5, -2], [0.5, 2]);
// 	const vector2 = ear.math.vector(0, 1);
// 	const vector3 = ear.math.vector(0, 1, 0);

// 	[
// 		polygon.overlap(polygon2),
// 		// polygon.overlap(circle),
// 		// polygon.overlap(line),
// 		// polygon.overlap(ray),
// 		// polygon.overlap(segment),
// 		polygon.overlap(vector2),
// 		// circle.overlap(polygon),
// 		// circle.overlap(circle2),
// 		// circle.overlap(line),
// 		// circle.overlap(ray),
// 		// circle.overlap(segment),
// 		circle.overlap(vector),
// 		// line.overlap(polygon),
// 		// line.overlap(circle),
// 		line.overlap(line2),
// 		line.overlap(ray),
// 		line.overlap(segment),
// 		line.overlap(vector),
// 		// ray.overlap(polygon),
// 		// ray.overlap(circle),
// 		ray.overlap(line),
// 		ray.overlap(ray2),
// 		ray.overlap(segment),
// 		ray2.overlap(vector2),
// 		// segment.overlap(polygon),
// 		// segment.overlap(circle),
// 		segment.overlap(line),
// 		segment.overlap(ray),
// 		segment.overlap(segment2),
// 		segment.overlap(vector),
// 		vector2.overlap(polygon),
// 		vector.overlap(circle),
// 		vector.overlap(line),
// 		vector2.overlap(ray2),
// 		vector.overlap(segment),
// 		vector2.overlap(vector3),
// 	].forEach(overlap => expect(overlap).toBe(true));
// });

test("point on line", () => {
	expect(ear.math.overlapLinePoint({ vector: [5, 5], origin: [0, 0] }, [2, 2])).toBe(true);
	expect(ear.math.overlapLinePoint({ vector: [1, 1], origin: [0, 0] }, [2, 2])).toBe(true);
	expect(ear.math.overlapLinePoint({ vector: [2, 2], origin: [0, 0] }, [2.1, 2.1])).toBe(true);
	expect(ear.math.overlapLinePoint({ vector: [2, 2], origin: [0, 0] }, [2.000000001, 2.000000001]))
		.toBe(true);
	expect(ear.math.overlapLinePoint({ vector: [2, 2], origin: [0, 0] }, [-1, -1])).toBe(true);

	expect(ear.math.overlapLinePoint(
		{ vector: [5, 5], origin: [0, 0] },
		[2, 2],
		ear.math.includeR,
	)).toBe(true);
	expect(ear.math.overlapLinePoint(
		{ vector: [1, 1], origin: [0, 0] },
		[2, 2],
		ear.math.includeR,
	)).toBe(true);
	expect(ear.math.overlapLinePoint(
		{ vector: [2, 2], origin: [0, 0] },
		[2.1, 2.1],
		ear.math.includeR,
	)).toBe(true);
	expect(ear.math.overlapLinePoint(
		{ vector: [2, 2], origin: [0, 0] },
		[2.000000001, 2.000000001],
		ear.math.includeR,
	)).toBe(true);
	expect(ear.math.overlapLinePoint(
		{ vector: [-1, -1], origin: [0, 0] },
		[2, 2],
		ear.math.includeR,
	)).toBe(false);
	expect(ear.math.overlapLinePoint(
		{ vector: [1, 1], origin: [0, 0] },
		[-0.1, -0.1],
		ear.math.includeR,
	)).toBe(false);
	expect(ear.math.overlapLinePoint(
		{ vector: [1, 1], origin: [0, 0] },
		[-0.000000001, -0.000000001],
		ear.math.includeR,
	)).toBe(true);
	expect(ear.math.overlapLinePoint(
		{ vector: [1, 1], origin: [0, 0] },
		[-0.000000001, -0.000000001],
		ear.math.excludeR,
	)).toBe(false);

	expect(ear.math.overlapLinePoint(
		{ vector: [5, 5], origin: [0, 0] },
		[2, 2],
		ear.math.includeS,
	)).toBe(true);
	expect(ear.math.overlapLinePoint(
		{ vector: [1, 1], origin: [0, 0] },
		[2, 2],
		ear.math.includeS,
	)).toBe(false);
	expect(ear.math.overlapLinePoint(
		{ vector: [2, 2], origin: [0, 0] },
		[2.1, 2.1],
		ear.math.includeS,
	)).toBe(false);
	expect(ear.math.overlapLinePoint(
		{ vector: [2, 2], origin: [0, 0] },
		[2.000000001, 2.000000001],
		ear.math.includeS,
	)).toBe(true);
	expect(ear.math.overlapLinePoint(
		{ vector: [-1, -1], origin: [0, 0] },
		[2, 2],
		ear.math.includeS,
	)).toBe(false);
	expect(ear.math.overlapLinePoint(
		{ vector: [2, 2], origin: [0, 0] },
		[2.000000001, 2.000000001],
		ear.math.excludeS,
	)).toBe(false);
});

test("overlap.point_on_segment_inclusive", () => {
	expect(ear.math.overlapLinePoint(
		{ vector: [3, 0], origin: [3, 3] },
		[4, 3],
		ear.math.includeS,
	)).toBe(true);
	expect(ear.math.overlapLinePoint(
		{ vector: [3, 0], origin: [3, 3] },
		[3, 3],
		ear.math.includeS,
	)).toBe(true);
	expect(ear.math.overlapLinePoint(
		{ vector: [3, 0], origin: [3, 3] },
		[2.9, 3],
		ear.math.includeS,
	)).toBe(false);
	expect(ear.math.overlapLinePoint(
		{ vector: [3, 0], origin: [3, 3] },
		[2.9999999999, 3],
		ear.math.includeS,
	)).toBe(true);
	expect(ear.math.overlapLinePoint(
		{ vector: [3, 0], origin: [3, 3] },
		[6.1, 3],
		ear.math.includeS,
	)).toBe(false);
	expect(ear.math.overlapLinePoint(
		{ vector: [3, 0], origin: [3, 3] },
		[6.0000000001, 3],
		ear.math.includeS,
	)).toBe(true);

	expect(ear.math.overlapLinePoint(
		{ vector: [2, 2], origin: [2, 2] },
		[3.5, 3.5],
		ear.math.includeS,
	)).toBe(true);
	expect(ear.math.overlapLinePoint(
		{ vector: [2, 2], origin: [2, 2] },
		[2.9, 3.1],
		ear.math.includeS,
	)).toBe(false);
	expect(ear.math.overlapLinePoint(
		{ vector: [2, 2], origin: [2, 2] },
		[2.99999999, 3.000000001],
		ear.math.includeS,
	)).toBe(true);
	// degenerate edge returns false
	expect(ear.math.overlapLinePoint(
		{ vector: [0, 0], origin: [2, 2] },
		[2, 2],
		ear.math.includeS,
	)).toBe(false);
	expect(ear.math.overlapLinePoint(
		{ vector: [0, 0], origin: [2, 2] },
		[2.1, 2.1],
		ear.math.includeS,
	)).toBe(false);
	expect(ear.math.overlapLinePoint(
		{ vector: [0, 0], origin: [2, 2] },
		[2.000000001, 2.00000001],
		ear.math.includeS,
	)).toBe(false);
});

test("point on line epsilon", () => {

});

test("point in poly", () => {
	const poly = [[1, 0], [0, 1], [-1, 0], [0, -1]];
	expect(ear.math.overlapConvexPolygonPoint(poly, [0.0, 0.0])).toBe(true);
	expect(ear.math.overlapConvexPolygonPoint(poly, [0.999, 0.0])).toBe(true);
	expect(ear.math.overlapConvexPolygonPoint(poly, [0.9999999999, 0.0])).toBe(false);
	// edge collinear
	expect(ear.math.overlapConvexPolygonPoint(poly, [0.5, 0.5])).toBe(false);
	expect(ear.math.overlapConvexPolygonPoint(poly, [0.49, 0.49])).toBe(true);
	expect(ear.math.overlapConvexPolygonPoint(poly, [0.51, 0.51])).toBe(false);
	expect(ear.math.overlapConvexPolygonPoint(poly, [0.500000001, 0.500000001])).toBe(false);
	expect(ear.math.overlapConvexPolygonPoint(poly, [0.5, -0.5])).toBe(false);
	// expect(ear.math.overlapConvexPolygonPoint(poly, [-0.5, 0.5])).toBe(false);
	// expect(ear.math.overlapConvexPolygonPoint(poly, [-0.5, -0.5])).toBe(false);
	// polygon points
	expect(ear.math.overlapConvexPolygonPoint(poly, [1.0, 0.0])).toBe(false);
	expect(ear.math.overlapConvexPolygonPoint(poly, [0.0, 1.0])).toBe(false);
	// expect(ear.math.overlapConvexPolygonPoint(poly, [-1.0, 0.0])).toBe(false);
	expect(ear.math.overlapConvexPolygonPoint(poly, [0.0, -1.0])).toBe(false);
});

test("convex point in poly inclusive", () => {
	const poly = [[1, 0], [0, 1], [-1, 0], [0, -1]];
	expect(ear.math.overlapConvexPolygonPoint(poly, [0.0, 0.0], ear.math.include))
		.toBe(true);
	expect(ear.math.overlapConvexPolygonPoint(poly, [0.999, 0.0], ear.math.include))
		.toBe(true);
	expect(ear.math.overlapConvexPolygonPoint(poly, [0.9999999999, 0.0], ear.math.include))
		.toBe(true);
	expect(ear.math.overlapConvexPolygonPoint(poly, [1.1, 0.0], ear.math.include))
		.toBe(false);
	expect(ear.math.overlapConvexPolygonPoint(poly, [1.000000001, 0.0], ear.math.include))
		.toBe(true);
	// edge collinear
	expect(ear.math.overlapConvexPolygonPoint(poly, [0.5, 0.5], ear.math.include))
		.toBe(true);
	expect(ear.math.overlapConvexPolygonPoint(poly, [0.49, 0.49], ear.math.include))
		.toBe(true);
	expect(ear.math.overlapConvexPolygonPoint(poly, [0.499999999, 0.499999999], ear.math.include))
		.toBe(true);
	expect(ear.math.overlapConvexPolygonPoint(poly, [0.51, 0.51], ear.math.include))
		.toBe(false);
	expect(ear.math.overlapConvexPolygonPoint(poly, [0.500000001, 0.500000001], ear.math.include))
		.toBe(true);
	expect(ear.math.overlapConvexPolygonPoint(poly, [0.5, -0.5], ear.math.include))
		.toBe(true);
	expect(ear.math.overlapConvexPolygonPoint(poly, [-0.5, 0.5], ear.math.include))
		.toBe(true);
	expect(ear.math.overlapConvexPolygonPoint(poly, [-0.5, -0.5], ear.math.include))
		.toBe(true);
	// polygon points
	expect(ear.math.overlapConvexPolygonPoint(poly, [1.0, 0.0], ear.math.include))
		.toBe(true);
	expect(ear.math.overlapConvexPolygonPoint(poly, [0.0, 1.0], ear.math.include))
		.toBe(true);
	expect(ear.math.overlapConvexPolygonPoint(poly, [-1.0, 0.0], ear.math.include))
		.toBe(true);
	expect(ear.math.overlapConvexPolygonPoint(poly, [0.0, -1.0], ear.math.include))
		.toBe(true);
});

test("convex point in poly exclusive", () => {
	const poly = [[1, 0], [0, 1], [-1, 0], [0, -1]];
	expect(ear.math.overlapConvexPolygonPoint(poly, [0.0, 0.0], ear.math.exclude))
		.toBe(true);
	expect(ear.math.overlapConvexPolygonPoint(poly, [0.999, 0.0], ear.math.exclude))
		.toBe(true);
	expect(ear.math.overlapConvexPolygonPoint(poly, [0.9999999999, 0.0], ear.math.exclude))
		.toBe(false);
	// edge collinear
	expect(ear.math.overlapConvexPolygonPoint(poly, [0.5, 0.5], ear.math.exclude))
		.toBe(false);
	expect(ear.math.overlapConvexPolygonPoint(poly, [0.49, 0.49], ear.math.exclude))
		.toBe(true);
	expect(ear.math.overlapConvexPolygonPoint(poly, [0.499999999, 0.499999999], ear.math.exclude))
		.toBe(false);
	expect(ear.math.overlapConvexPolygonPoint(poly, [0.51, 0.51], ear.math.exclude))
		.toBe(false);
	expect(ear.math.overlapConvexPolygonPoint(poly, [0.5, -0.5], ear.math.exclude))
		.toBe(false);
	expect(ear.math.overlapConvexPolygonPoint(poly, [-0.5, 0.5], ear.math.exclude))
		.toBe(false);
	expect(ear.math.overlapConvexPolygonPoint(poly, [-0.5, -0.5], ear.math.exclude))
		.toBe(false);
	// polygon points
	expect(ear.math.overlapConvexPolygonPoint(poly, [1.0, 0.0], ear.math.exclude))
		.toBe(false);
	expect(ear.math.overlapConvexPolygonPoint(poly, [0.0, 1.0], ear.math.exclude))
		.toBe(false);
	expect(ear.math.overlapConvexPolygonPoint(poly, [-1.0, 0.0], ear.math.exclude))
		.toBe(false);
	expect(ear.math.overlapConvexPolygonPoint(poly, [0.0, -1.0], ear.math.exclude))
		.toBe(false);
});

test("overlap lines", () => {
	const aV = [2, 3];
	const aP = [-1, 1];
	const bV = [-3, 2];
	const bP = [5, 0];

	const a0 = [-1, 1];
	const a1 = [1, 4];
	const b0 = [5, 0];
	const b1 = [2, 2];

	expect(
		ear.math.overlapLineLine(
			{ vector: aV, origin: aP },
			{ vector: bV, origin: bP },
			ear.math.includeL,
			ear.math.includeL,
		),
	).toBe(true);
	expect(
		ear.math.overlapLineLine(
			{ vector: aV, origin: aP },
			{ vector: bV, origin: bP },
			ear.math.includeL,
			ear.math.includeR,
		),
	).toBe(true);
	expect(
		ear.math.overlapLineLine(
			{ vector: aV, origin: aP },
			{ vector: ear.math.subtract(b1, b0), origin: b0 },
			ear.math.includeL,
			ear.math.includeS,
		),
	).toBe(false);
	expect(
		ear.math.overlapLineLine(
			{ vector: aV, origin: aP },
			{ vector: bV, origin: bP },
			ear.math.includeR,
			ear.math.includeR,
		),
	).toBe(true);
	expect(
		ear.math.overlapLineLine(
			{ vector: aV, origin: aP },
			{ vector: ear.math.subtract(b1, b0), origin: b0 },
			ear.math.includeR,
			ear.math.includeS,
		),
	).toBe(false);
	expect(
		ear.math.overlapLineLine(
			{ vector: ear.math.subtract(a1, a0), origin: a0 },
			{ vector: ear.math.subtract(b1, b0), origin: b0 },
			ear.math.includeS,
			ear.math.includeS,
		),
	).toBe(false);
	expect(
		ear.math.overlapLineLine(
			{ vector: aV, origin: aP },
			{ vector: bV, origin: bP },
			ear.math.excludeL,
			ear.math.excludeL,
		),
	).toBe(true);
	expect(
		ear.math.overlapLineLine(
			{ vector: aV, origin: aP },
			{ vector: bV, origin: bP },
			ear.math.excludeL,
			ear.math.excludeR,
		),
	).toBe(true);
	expect(
		ear.math.overlapLineLine(
			{ vector: aV, origin: aP },
			{ vector: ear.math.subtract(b1, b0), origin: b0 },
			ear.math.excludeL,
			ear.math.excludeS,
		),
	).toBe(false);
	expect(
		ear.math.overlapLineLine(
			{ vector: aV, origin: aP },
			{ vector: bV, origin: bP },
			ear.math.excludeR,
			ear.math.excludeR,
		),
	).toBe(true);
	expect(
		ear.math.overlapLineLine(
			{ vector: aV, origin: aP },
			{ vector: ear.math.subtract(b1, b0), origin: b0 },
			ear.math.excludeR,
			ear.math.excludeS,
		),
	).toBe(false);
	expect(
		ear.math.overlapLineLine(
			{ vector: ear.math.subtract(a1, a0), origin: a0 },
			{ vector: ear.math.subtract(b1, b0), origin: b0 },
			ear.math.excludeS,
			ear.math.excludeS,
		),
	).toBe(false);
});

test("overlap lines parallel", () => {
	expect(
		ear.math.overlapLineLine(
			{ vector: [1, 0], origin: [0, 0] },
			{ vector: [1, 0], origin: [0, 1] },
			ear.math.includeL,
			ear.math.includeL,
		),
	).toBe(false);
	expect(
		ear.math.overlapLineLine(
			{ vector: [1, 0], origin: [0, 0] },
			{ vector: [1, 0], origin: [0, 0] },
			ear.math.includeL,
			ear.math.includeL,
		),
	).toBe(true);
	expect(
		ear.math.overlapLineLine(
			{ vector: [3, 0], origin: [0, 0] },
			{ vector: [3, 0], origin: [8, 0] },
			ear.math.includeL,
			ear.math.includeL,
		),
	).toBe(true);
	expect(
		ear.math.overlapLineLine(
			{ vector: [3, 0], origin: [0, 0] },
			{ vector: [3, 0], origin: [8, 0] },
			ear.math.includeS,
			ear.math.includeS,
		),
	).toBe(false);
	expect(
		ear.math.overlapLineLine(
			{ vector: [3, 0], origin: [0, 0] },
			{ vector: [3, 0], origin: [8, 0] },
			ear.math.includeR,
			ear.math.includeS,
		),
	).toBe(true);
	expect(
		ear.math.overlapLineLine(
			{ vector: [3, 0], origin: [0, 0] },
			{ vector: [3, 0], origin: [8, 0] },
			ear.math.includeS,
			ear.math.includeR,
		),
	).toBe(false);
	// segments
	expect(
		ear.math.overlapLineLine(
			{ vector: [3, 0], origin: [0, 0] },
			{ vector: [3, 0], origin: [3, 0] },
			ear.math.includeS,
			ear.math.includeS,
		),
	).toBe(true);
	expect(
		ear.math.overlapLineLine(
			{ vector: [3, 0], origin: [0, 0] },
			{ vector: [3, 0], origin: [3, 0] },
			ear.math.includeS,
			ear.math.excludeS,
		),
	).toBe(true);
	expect(
		ear.math.overlapLineLine(
			{ vector: [3, 0], origin: [0, 0] },
			{ vector: [3, 0], origin: [3, 0] },
			ear.math.excludeS,
			ear.math.includeS,
		),
	).toBe(true);
	expect(
		ear.math.overlapLineLine(
			{ vector: [3, 0], origin: [0, 0] },
			{ vector: [3, 0], origin: [3, 0] },
			ear.math.excludeS,
			ear.math.excludeS,
		),
	).toBe(false);
});

test("overlap circle point", () => {
	expect(
		ear.math.overlapCirclePoint(
			{ radius: 1, origin: [0, 0] },
			[0.5, 0.5],
		),
	).toBe(true);
	expect(
		ear.math.overlapCirclePoint(
			{ radius: 1, origin: [0, 0] },
			[Math.SQRT1_2, Math.SQRT1_2],
			ear.math.include,
		),
	).toBe(true);
	expect(
		ear.math.overlapCirclePoint(
			{ radius: 1, origin: [0, 0] },
			[Math.SQRT1_2, Math.SQRT1_2],
			ear.math.exclude,
		),
	).toBe(false);
	expect(
		ear.math.overlapCirclePoint(
			{ radius: 1, origin: [10, 0] },
			[10 + Math.SQRT1_2, Math.SQRT1_2],
			ear.math.include,
		),
	).toBe(true);
	expect(
		ear.math.overlapCirclePoint(
			{ radius: 1, origin: [10, 0] },
			[10 + Math.SQRT1_2, Math.SQRT1_2],
			ear.math.exclude,
		),
	).toBe(false);
});

// if we choose to bring back exclusive / inclusive polygon overlap
// test("convex polygons overlap with point inside each other", () => {
// 	const poly1 = [[0, 0], [1, 0], [1, 1], [0, 1]];
// 	const polyA = [[0.5, 0.5], [10, 10], [10, 0]];
// 	const polyB = [[-10, -10], [10, -10], [10, 10], [-10, 10]];
// 	expect(ear.math.overlapConvexPolygons(poly1, polyA, ear.math.includeS, ear.math.include)).toBe(true);
// 	expect(ear.math.overlapConvexPolygons(poly1, polyB, ear.math.includeS, ear.math.include)).toBe(true);
// 	expect(ear.math.overlapConvexPolygons(polyA, poly1, ear.math.includeS, ear.math.include)).toBe(true);
// 	expect(ear.math.overlapConvexPolygons(polyB, poly1, ear.math.includeS, ear.math.include)).toBe(true);
// });

// test("convex polygons overlap", () => {
//   const poly1 = [[1,0], [0,1], [-1,0]];  // top
//   const poly2 = [[0,1], [-1,0], [0,-1]]; // left
//   const poly3 = [[1,0], [0,1], [0,-1]];  // right
//   // inclusive
//   expect(ear.math.overlapConvexPolygons(poly1, poly2, ear.math.includeS, ear.math.include)).toBe(true);
//   expect(ear.math.overlapConvexPolygons(poly2, poly3, ear.math.includeS, ear.math.include)).toBe(true);
//   expect(ear.math.overlapConvexPolygons(poly1, poly3, ear.math.includeS, ear.math.include)).toBe(true);
//   // exclusive
//   expect(ear.math.overlapConvexPolygons(poly1, poly2, ear.math.excludeS, ear.math.exclude)).toBe(true);
//   expect(ear.math.overlapConvexPolygons(poly2, poly3, ear.math.excludeS, ear.math.exclude)).toBe(false);
//   expect(ear.math.overlapConvexPolygons(poly1, poly3, ear.math.excludeS, ear.math.exclude)).toBe(true);
// });
// until then, exclusive only
test("convex polygons overlap", () => {
	const poly1 = [[1, 0], [0, 1], [-1, 0]]; // top
	const poly2 = [[0, 1], [-1, 0], [0, -1]]; // left
	const poly3 = [[1, 0], [0, 1], [0, -1]]; // right
	// exclusive
	expect(ear.math.overlapConvexPolygons(poly1, poly2)).toBe(true);
	expect(ear.math.overlapConvexPolygons(poly2, poly3)).toBe(false);
	expect(ear.math.overlapConvexPolygons(poly1, poly3)).toBe(true);
});
