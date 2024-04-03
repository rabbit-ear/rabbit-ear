import { expect, test } from "vitest";
import ear from "../src/index.js";

test("excluding primitives", () => expect(true).toBe(true));

// const testEqual = function (...args) {
// 	expect(ear.math.equivalent(...args)).toBe(true);
// };

// test("arguments", () => {
// 	const l1 = ear.math.line(1);
// 	expect(l1.origin[0]).toBe(0);
// 	expect(l1.origin[1]).toBe(undefined);
// 	expect(l1.origin[2]).toBe(undefined);
// 	const l2 = ear.math.line(1, 2);
// 	expect(l2.origin[0]).toBe(0);
// 	expect(l2.origin[1]).toBe(0);
// 	expect(l2.origin[2]).toBe(undefined);
// 	const l3 = ear.math.line(1, 2, 3);
// 	expect(l3.origin[0]).toBe(0);
// 	expect(l3.origin[1]).toBe(0);
// 	expect(l3.origin[2]).toBe(0);
// });

// test("u d form", () => {
// 	const l1 = ear.math.line.fromNormalDistance({ normal: [1, 0], distance: 3 });
// 	expect(l1.vector.x).toBeCloseTo(0);
// 	expect(l1.vector.y).toBeCloseTo(-1);
// 	expect(l1.origin.x).toBeCloseTo(3);
// 	expect(l1.origin.y).toBeCloseTo(0);
// });

// // from the prototype
// test("isParallel", () => {
// 	const l = ear.math.line([0, 1], [2, 3]);
// 	expect(l.isParallel([0, -1], [7, 8])).toBe(true);
// });
// test("isDegenerate", () => {
// 	const l = ear.math.line([0, 0], [2, 3]);
// 	expect(l.isDegenerate()).toBe(true);
// });
// test("reflection", () => {
// 	const result = ear.math.line([0, 1], [2, 3]).reflectionMatrix();
// 	expect(result[0]).toBeCloseTo(-1);
// 	expect(result[1]).toBeCloseTo(0);
// 	expect(result[2]).toBeCloseTo(0);
// 	expect(result[3]).toBeCloseTo(0);
// 	expect(result[4]).toBeCloseTo(1);
// 	expect(result[9]).toBeCloseTo(4);
// 	expect(result[10]).toBeCloseTo(0);
// 	// expect(l.reflection().origin).toBe();
// });
// test("nearestPoint", () => {
// 	const res = ear.math.line([1, 1], [2, 3]).nearestPoint(0, 0);
// 	expect(res[0]).toBe(-0.5);
// 	expect(res[1]).toBe(0.5);
// 	// expect(l.nearestPoint(0,0)).toBe(true);
// });
// test("transform", () => {
// 	const res = ear.math.line([0, 1], [2, 3]).transform([2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0]);
// 	expect(res.vector[0]).toBeCloseTo(0);
// 	expect(res.vector[1]).toBeCloseTo(2);
// 	expect(res.origin[0]).toBeCloseTo(4);
// 	expect(res.origin[1]).toBeCloseTo(6);
// });
// test("intersect", () => {
// 	const polygon = ear.math.polygon([0, 1.15], [-1, -0.577], [1, -0.577]);
// 	const circle = ear.math.circle(1);
// 	const line = ear.math.line([1, 2], [-0.5, 0]);
// 	const line2 = ear.math.line([-1, 2], [0.5, 0]);
// 	const ray = ear.math.ray([-1, 2], [0.5, 0]);
// 	const segment = ear.math.segment([-2, 0.5], [2, 0.5]);
// 	[
// 		line.intersect(polygon),
// 		line.intersect(circle),
// 		line.intersect(line2),
// 		line.intersect(ray),
// 		line.intersect(segment),
// 	].forEach(intersect => expect(intersect).not.toBe(undefined));
// });

// // todo problems
// test("bisect", () => {
// 	expect(true).toBe(true);
// 	const l0 = ear.math.line([0, 1], [0, 0]);
// 	const l1 = ear.math.line([0, 1], [1, 0]);
// 	const res = l0.bisect(l1);
// 	// console.log("Bisec", res);
// 	// expect(l.bisectLine()).toBe(true);
// });

// // line
// test("fromPoints", () => {
// 	const result = ear.math.line.fromPoints([1, 2], [3, 4]);
// 	expect(result.origin.x).toBe(1);
// 	expect(result.origin.y).toBe(2);
// 	expect(result.vector.x).toBe(2);
// 	expect(result.vector.y).toBe(2);
// });
// test("perpendicularBisector", () => {
// 	const result = ear.math.line.perpendicularBisector([0, 1], [2, 3]);
// 	expect(result.origin.x).toBe(1);
// 	expect(result.origin.y).toBe(2);
// 	expect(result.vector.x).toBe(-2);
// 	expect(result.vector.y).toBe(2);
// });
// // this is no longer a property
// // test("length infinity", () => {
// //   expect(ear.math.line().length).toBe(Infinity);
// //   expect(ear.math.line([1,2],[3,4]).length).toBe(Infinity);
// //   expect(ear.math.line.fromPoints([1,2],[3,4]).length).toBe(Infinity);

// //   expect(ear.math.ray().length).toBe(Infinity);
// //   expect(ear.math.ray([1,2],[3,4]).length).toBe(Infinity);
// //   expect(ear.math.ray.fromPoints([1,2],[3,4]).length).toBe(Infinity);
// // });
// // // ray
// // test("transform", () => {
// //   const r = ear.math.ray(0,1,2,3);
// //   expect(r.transform()).toBe(true);
// // });
// test("ray", () => {
// 	const result = ear.math.ray([1, 2], [3, 3]);
// 	expect(result.origin.x).toBe(3);
// 	expect(result.origin.y).toBe(3);
// 	expect(result.vector.x).toBe(1);
// 	expect(result.vector.y).toBe(2);
// });
// test("flip", () => {
// 	const result = ear.math.ray([1, 2], [3, 3]).flip();
// 	expect(result.origin.x).toBe(3);
// 	expect(result.origin.y).toBe(3);
// 	expect(result.vector.x).toBe(-1);
// 	expect(result.vector.y).toBe(-2);
// });
// test("scale", () => {
// 	const ray = ear.math.ray([6, 2], [3, 4]);
// 	const res = ray.scale(1 / 2);
// 	expect(res.vector.x).toBe(3);
// 	expect(res.vector.y).toBe(1);
// });
// test("normalize", () => {
// 	const ray = ear.math.ray([4, 4], [2, 3]);
// 	const res = ray.normalize();
// 	expect(res.vector.x).toBeCloseTo(Math.SQRT1_2);
// 	expect(res.vector.y).toBeCloseTo(Math.SQRT1_2);
// });
// test("fromPoints", () => {
// 	const result = ear.math.ray.fromPoints([1, 2], [3, 4]);
// 	expect(result.origin.x).toBe(1);
// 	expect(result.origin.y).toBe(2);
// 	expect(result.vector.x).toBe(2);
// 	expect(result.vector.y).toBe(2);
// });
// test("nearestPoint", () => {
// 	const result = ear.math.ray([1, 1], [2, 3]).nearestPoint(0, 0);
// 	expect(result[0]).toBe(2);
// 	expect(result[1]).toBe(3);
// 	const result2 = ear.math.ray([0, 1], [5, -5]).nearestPoint(0, 0);
// 	expect(result2[0]).toBe(5);
// 	expect(result2[1]).toBe(0);
// });

// // segment
// test("[0], [1]", () => {
// 	const result = ear.math.segment([1, 2], [3, 4]);
// 	expect(result[0][0]).toBe(1);
// 	expect(result[0][1]).toBe(2);
// 	expect(result[1][0]).toBe(3);
// 	expect(result[1][1]).toBe(4);
// });
// test("length", () => {
// 	const result = ear.math.segment([1, 2], [3, 4]);
// 	// the Array.prototype length property
// 	expect(result.length).toBe(2);
// 	// geometric length
// 	expect(result.magnitude).toBeCloseTo(Math.sqrt(2) * 2);
// });
// test("transform", () => {
// 	const result1 = ear.math.segment([1, 2], [3, 4]).transform(ear.math.matrix().scale([0.5, 0.5, 0.5]));
// 	expect(result1[0].x).toBe(0.5);
// 	expect(result1[0].y).toBe(1);
// 	expect(result1[1].x).toBe(1.5);
// 	expect(result1[1].y).toBe(2);
// });
// test("midpoint", () => {
// 	const result = ear.math.segment([1, 2], [3, 4]).midpoint();
// 	expect(result.x).toBe(2);
// 	expect(result.y).toBe(3);
// });
// test("fromPoints", () => {
// 	const result = ear.math.segment.fromPoints([1, 2], [3, 4]);
// 	expect(result[0].x).toBe(1);
// 	expect(result[0].y).toBe(2);
// 	expect(result[1].x).toBe(3);
// 	expect(result[1].y).toBe(4);
// });
// test("nearestPoint", () => {
// 	const res = ear.math.segment([1, 1], [2, 3]).nearestPoint(0, 0);
// 	expect(res[0]).toBe(1);
// 	expect(res[1]).toBe(1);
// });

// /**
//  * lines, rays, segments
//  */

// // test("line ray segment intersections", () => {
// //   testEqual([5, 5], ear.math.line(0, 0, 1, 1).intersect(ear.math.line(10, 0, -1, 1)));
// //   testEqual([5, 5], ear.math.line(0, 0, 1, 1).intersect(ear.math.ray(10, 0, -1, 1)));
// //   testEqual([5, 5], ear.math.line(0, 0, 1, 1).intersect(ear.math.segment(10, 0, 0, 10)));
// // });

// // test("line ray segment parallel", () => {
// //   testEqual(true, ear.math.line(0, 0, 1, 1).isParallel(ear.math.ray(10, 0, 1, 1)));
// //   testEqual(true, ear.math.line(0, 0, -1, 1).isParallel(ear.math.segment(0, 0, -2, 2)));
// //   testEqual(false, ear.math.line(0, 0, -1, 1).isParallel(ear.math.segment(10, 0, 1, 1)));
// // });

// // test("line ray segment reflection matrices", () => {
// //   testEqual(
// //     ear.math.line(10, 0, -1, 1).reflection(),
// //     ear.math.ray(10, 0, -1, 1).reflection()
// //   );
// //   testEqual(
// //     ear.math.segment(10, 0, 0, 10).reflection(),
// //     ear.math.ray(10, 0, -1, 1).reflection()
// //   );
// // });

// test("line ray segment nearest points", () => {
// 	// testEqual([20, -10], ear.math.line(10, 0, -1, 1).nearestPoint([20, -10]));
// 	// testEqual([-50, 60], ear.math.line(10, 0, -1, 1).nearestPoint([-10, 100]));
// 	// testEqual([10, 0], ear.math.ray(10, 0, -1, 1).nearestPoint([20, -10]));
// 	// testEqual([-50, 60], ear.math.ray(10, 0, -1, 1).nearestPoint([-10, 100]));
// 	// testEqual([10, 0], ear.math.segment(10, 0, 0, 10).nearestPoint([20, -10]));
// 	// testEqual([0, 10], ear.math.segment(10, 0, 0, 10).nearestPoint([-10, 100]));
// 	// testEqual(
// 	//   ear.math.ray(10, 0, -1, 1).nearestPoint([0, 0]),
// 	//   ear.math.line(10, 0, -1, 1).nearestPoint([0, 0])
// 	// );
// 	// testEqual(
// 	//   ear.math.segment(10, 0, 0, 10).nearestPoint([0, 0]),
// 	//   ear.math.ray(10, 0, -1, 1).nearestPoint([0, 0])
// 	// );
// });
