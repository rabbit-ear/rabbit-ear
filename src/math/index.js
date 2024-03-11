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
