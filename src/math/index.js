/**
 * Math (c) Kraft
 */
import * as constant from "./constant.js";
import * as convert from "./convert.js";
import * as compare from "./compare.js";
import * as vector from "./vector.js";
import * as matrix2 from "./matrix2.js";
import * as matrix3 from "./matrix3.js";
import * as matrix4 from "./matrix4.js";
import * as quaternion from "./quaternion.js";
import * as convexHullMethods from "./convexHull.js";
import * as lineMethods from "./line.js";
import * as nearestMethods from "./nearest.js";
import * as planeMethods from "./plane.js";
import * as polygonMethods from "./polygon.js";
import * as radialMethods from "./radial.js";
import * as straightSkeleton from "./straightSkeleton.js";
import * as triangle from "./triangle.js";
import * as encloses from "./encloses.js";
import * as overlapMethods from "./overlap.js";
import * as intersectMethods from "./intersect.js";
import * as clip from "./clip.js";

export default {
	...constant,
	...convert,
	...compare,
	...vector,
	...matrix2,
	...matrix3,
	...matrix4,
	...quaternion,
	...convexHullMethods,
	...lineMethods,
	...nearestMethods,
	...planeMethods,
	...polygonMethods,
	...radialMethods,
	...straightSkeleton,
	...triangle,
	...encloses,
	...overlapMethods,
	...intersectMethods,
	...clip,
};

/**
 * @typedef VecLine
 * @type {{ vector: number[], origin: number[] }}
 * @description a line defined by a vector and a point along the line,
 * capable of representing a line in any dimension.
 * @property {number[]} vector - a vector describing the direction of the line
 * @property {number[]} origin - a point which the line passes through
 */
/**
 * @typedef UniqueLine
 * @type {{ normal: number[], distance: number }}
 * @description a 2D line defined by a unit normal vector and a value that
 * describes the shortest distance from the origin to a point on the line.
 * @property {number[]} normal - a unit vector that is normal to the line
 * @property {number} distance - the shortest distance
 * from the line to the origin
 */

/**
 * @typedef Box
 * @type {{ min: number[], max: number[], span?: number[] }}
 * @description an axis-aligned bounding box, capable of representing
 * a bounding box with any number of dimensions.
 * @property {number[]} min - the point representing the absolute minimum
 * for all axes.
 * @property {number[]} max - the point representing the absolute maximum
 * for all axes.
 */

/**
 * @typedef Circle
 * @type {{ radius: number, origin: number[] }}
 * @description a circle primitive in 2D
 * @property {number} radius - the radius of the circle
 * @property {number[]} origin - the center of the circle as an array of numbers
 */

/**
 * @description A small math library with a focus on linear algebra,
 * computational geometry, and computing the intersection of shapes.
 */
// const math = {
// 	...general,
// 	...algebra,
// 	...geometry,
// 	...intersectMethods,
// };
// const math = primitives;
// Object.assign(math, {
// 	...general,
// 	...algebra,
// 	...geometry,
// 	...intersectMethods,
// 	// ...types,
// });
// export default math;
