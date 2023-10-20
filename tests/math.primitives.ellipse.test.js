import { expect, test } from "vitest";
import ear from "../rabbit-ear.js";

test("excluding primitives", () => expect(true).toBe(true));

// test("x, y", () => {
// 	const ellipse0 = ear.math.ellipse(2, 1);
// 	expect(ellipse0.x).toBe(0);
// 	expect(ellipse0.y).toBe(0);
// 	// expect(ellipse0.z).toBe(0);
// 	const ellipse1 = ear.math.ellipse(2, 1, 5, 6);
// 	expect(ellipse1.x).toBe(5);
// 	expect(ellipse1.y).toBe(6);
// 	const ellipse2 = ear.math.ellipse(2, 1, [5, 6], 9);
// 	expect(ellipse2.x).toBe(5);
// 	expect(ellipse2.y).toBe(6);
// 	expect(ellipse2.spin).toBe(9);
// });

// test("foci", () => {
// 	const result = ear.math.ellipse(1, 0.5).foci;
// 	// one of these is negative
// 	expect(Math.abs(result[0].x)).toBeCloseTo(Math.sqrt(3) / 2);
// 	expect(result[0].y).toBeCloseTo(0);
// 	expect(Math.abs(result[1].x)).toBeCloseTo(Math.sqrt(3) / 2);
// 	expect(result[1].y).toBeCloseTo(0);
// });
// // test("nearestPoint", () => {
// //   const result = ear.math.ellipse(2, 1).nearestPoint(0, 0);
// // };
// // test("intersect", () => {
// //   const result = ear.math.ellipse(2, 1).intersect(object);
// // };
// test("svgPath", () => {
// 	expect(ear.math.ellipse(2, 1).svgPath()).toBe("M2 0A2 1 0 0 1 -2 0A2 1 0 0 1 2 0");
// 	expect(ear.math.ellipse(2, 1, 5, 6).svgPath()).toBe("M7 6A2 1 0 0 1 3 6A2 1 0 0 1 7 6");
// });
// test("points", () => {
// 	expect(ear.math.ellipse(2, 1).points().length).toBe(128);
// 	expect(ear.math.ellipse(2, 1).points(10).length).toBe(10);
// });
// test("polygon", () => {
// 	const result = ear.math.ellipse(2, 1).polygon();
// 	expect(result.length).toBe(128);
// 	expect(result[0][0]).toBeCloseTo(2);
// 	expect(result[0][1]).toBeCloseTo(0);
// });
// test("segments", () => {
// 	const result = ear.math.ellipse(2, 1).segments();
// 	expect(result.length).toBe(128);
// 	expect(result[0][0][0]).toBeCloseTo(2);
// 	expect(result[0][0][1]).toBeCloseTo(0);
// });
