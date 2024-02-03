import { expect, test } from "vitest";
import ear from "../rabbit-ear.js";

test("intersection method has been removed", () => expect(true).toBe(true));

// test("intersections", () => {
// 	const polygon = [[0, 1.15], [-1, -0.577], [1, -0.577]];
// 	const circle = { radius: 1, origin: [0, 0] };
// 	const line = { vector: [1, 2], origin: [0.5, 0] };
// 	const ray = { vector: [-1, 2], origin: [0.5, -0.1], domain: ear.math.excludeR };
// 	const segment = { vector: [4, 0], origin: [-2, 0.5], domain: ear.math.excludeS };

// 	const polygon2 = [[0, -1.15], [1, 0.577], [-1, 0.577]];
// 	const circle2 = { radius: 1, origin: [0.5, 0] };
// 	const line2 = { vector: [-1, 2], origin: [0.5, 0] };
// 	const ray2 = { vector: [1, 2], origin: [-0.5, 0], domain: ear.math.excludeR };
// 	const segment2 = { vector: [0, 4], origin: [0.5, -2], domain: ear.math.excludeS };

// 	[
// 		ear.math.intersect(polygon, line),
// 		ear.math.intersect(polygon, ray),
// 		ear.math.intersect(polygon, segment),
// 		ear.math.intersect(circle, circle2),
// 		ear.math.intersect(circle, line),
// 		ear.math.intersect(circle, ray),
// 		ear.math.intersect(circle, segment),
// 		ear.math.intersect(line, polygon),
// 		ear.math.intersect(line, circle),
// 		ear.math.intersect(line, line2),
// 		ear.math.intersect(line, ray),
// 		ear.math.intersect(line, segment),
// 		ear.math.intersect(ray, polygon),
// 		ear.math.intersect(ray, circle),
// 		ear.math.intersect(ray, line),
// 		ear.math.intersect(ray, ray2),
// 		ear.math.intersect(ray, segment),
// 		ear.math.intersect(segment, polygon),
// 		ear.math.intersect(segment, circle),
// 		ear.math.intersect(segment, line),
// 		ear.math.intersect(segment, ray),
// 		ear.math.intersect(segment, segment2),
// 	].forEach(intersect => expect(intersect).not.toBeUndefined());

// 	// intersection between these types is not yet implemented
// 	[
// 		ear.math.intersect(polygon, polygon2),
// 		ear.math.intersect(polygon, circle),
// 		ear.math.intersect(circle, polygon),
// 	].forEach(intersect => expect(intersect).toBeUndefined());
// });

// test("collinear segment intersections, types not core", () => {
// 	// horizontal
// 	const seg01 = ear.math.pointsToLine([0, 2], [2, 2]);
// 	const seg02 = ear.math.pointsToLine([-1, 2], [10, 2]);
// 	const seg03 = ear.math.pointsToLine([0, 2], [2, 2]);
// 	const seg04 = ear.math.pointsToLine([10, 2], [-1, 2]);
// 	// vertical
// 	const seg05 = ear.math.pointsToLine([2, 0], [2, 2]);
// 	const seg06 = ear.math.pointsToLine([2, -1], [2, 10]);
// 	const seg07 = ear.math.pointsToLine([2, 0], [2, 2]);
// 	const seg08 = ear.math.pointsToLine([2, 10], [2, -1]);
// 	// diagonal
// 	const seg09 = ear.math.pointsToLine([0, 0], [2, 2]);
// 	const seg10 = ear.math.pointsToLine([-1, -1], [5, 5]);
// 	const seg11 = ear.math.pointsToLine([0, 0], [2, 2]);
// 	const seg12 = ear.math.pointsToLine([5, 5], [-1, -1]);
// 	[seg01, seg02, seg03, seg04, seg05, seg06, seg07, seg08, seg09, seg10, seg11, seg12]
// 		.forEach(seg => { seg.domain = ear.math.excludeS; });
// 	[[seg01, seg02],
// 		[seg03, seg04],
// 		[seg05, seg06],
// 		[seg07, seg08],
// 		[seg09, seg10],
// 		[seg11, seg12],
// 	].map(pair => ear.math.intersect(...pair))
// 		.forEach(res => expect(res.point).toBeUndefined());
// });
