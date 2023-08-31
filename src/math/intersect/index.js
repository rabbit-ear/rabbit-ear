/**
 * Math (c) Kraft
 */
import * as encloses from "./encloses.js";
import * as overlapMethods from "./overlap.js";
import * as intersectMethods from "./intersect.js";
import * as clip from "./clip.js";
import * as split from "./split.js";
import intersect from "./intersectMethod.js";

export default {
	...encloses,
	...overlapMethods,
	...intersectMethods,
	...clip,
	...split,
	intersect,
};
