const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");

test("excluding primitives", () => expect(true).toBe(true));

// test("intersections", () => {
// 	const polygon = ear.math.polygon([0, 1.15], [-1, -0.577], [1, -0.577]);
// 	const circle = ear.math.circle(1);
// 	const line = ear.math.line([1, 2], [0.5, 0]);
// 	const ray = ear.math.ray([-1, 2], [0.5, -0.1]);
// 	const segment = ear.math.segment([-2, 0.5], [2, 0.5]);

// 	const polygon2 = ear.math.polygon([0, -1.15], [1, 0.577], [-1, 0.577]);
// 	const circle2 = ear.math.circle(1, [0.5, 0]);
// 	const line2 = ear.math.line([-1, 2], [0.5, 0]);
// 	const ray2 = ear.math.ray([1, 2], [-0.5, 0]);
// 	const segment2 = ear.math.segment([0.5, -2], [0.5, 2]);

// 	[
// 		// polygon.intersect(polygon2),
// 		// polygon.intersect(circle),
// 		polygon.intersect(line),
// 		polygon.intersect(ray),
// 		polygon.intersect(segment),
// 		// circle.intersect(polygon),
// 		circle.intersect(circle2),
// 		circle.intersect(line),
// 		circle.intersect(ray),
// 		circle.intersect(segment),
// 		line.intersect(polygon),
// 		line.intersect(circle),
// 		line.intersect(line2),
// 		line.intersect(ray),
// 		line.intersect(segment),
// 		ray.intersect(polygon),
// 		ray.intersect(circle),
// 		ray.intersect(line),
// 		ray.intersect(ray2),
// 		ray.intersect(segment),
// 		segment.intersect(polygon),
// 		segment.intersect(circle),
// 		segment.intersect(line),
// 		segment.intersect(ray),
// 		segment.intersect(segment2),
// 	].forEach(intersect => expect(intersect).not.toBe(undefined));
// });

// test("collinear segment intersections, types not core", () => {
// 	[ // horizontal
// 		ear.math.segment([0, 2], [2, 2]).intersect(ear.math.segment([-1, 2], [10, 2])),
// 		ear.math.segment([0, 2], [2, 2]).intersect(ear.math.segment([10, 2], [-1, 2])),
// 		// vertical
// 		ear.math.segment([2, 0], [2, 2]).intersect(ear.math.segment([2, -1], [2, 10])),
// 		ear.math.segment([2, 0], [2, 2]).intersect(ear.math.segment([2, 10], [2, -1])),
// 		// diagonal
// 		ear.math.segment([0, 0], [2, 2]).intersect(ear.math.segment([-1, -1], [5, 5])),
// 		ear.math.segment([0, 0], [2, 2]).intersect(ear.math.segment([5, 5], [-1, -1])),
// 	].forEach(res => expect(res).toBe(undefined));
// });
