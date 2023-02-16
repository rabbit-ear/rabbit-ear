/* Math (c) Kraft, MIT License */
import { EPSILON } from '../general/constants.js';
import { include } from '../general/functions.js';
import { overlapConvexPolygonPoint } from './overlap.js';

/**
 * Math (c) Kraft
 */
/**
 * @description does one bounding box (outer) completely enclose
 * another bounding box (inner)?
 * @param {object} outer an n-dimensional bounding box
 * @param {object} inner an n-dimensional bounding box
 * @param {number} [epsilon=1e-6] an optional epsilon to pad the area
 * around the outer bounding box; a negative number will make
 * the boundary exclusive.
 * @returns {boolean} is the "inner" polygon completely inside the "outer"
 * @linkcode
 */
const enclosingBoundingBoxes = (outer, inner, epsilon = EPSILON) => {
	const dimensions = Math.min(outer.min.length, inner.min.length);
	for (let d = 0; d < dimensions; d += 1) {
		// if one minimum is above the other's maximum, or visa versa
		if (inner.min[d] < outer.min[d] - epsilon
			|| inner.max[d] > outer.max[d] + epsilon) {
			return false;
		}
	}
	return true;
};
/**
 * @description does one polygon (outer) completely enclose another polygon (inner),
 * currently, this only works for convex polygons.
 * @param {number[][]} outer a 2D convex polygon
 * @param {number[][]} inner a 2D convex polygon
 * @param {function} [fnInclusive] by default, the boundary is considered inclusive
 * @returns {boolean} is the "inner" polygon completely inside the "outer"
 *
 * @todo: should one function be include and the other exclude?
 * @linkcode Math ./src/intersection/encloses.js 30
 */
const enclosingPolygonPolygon = (outer, inner, fnInclusive = include) => {
	// these points should be *not inside* (false)
	const outerGoesInside = outer
		.map(p => overlapConvexPolygonPoint(inner, p, fnInclusive))
		.reduce((a, b) => a || b, false);
	// these points should be *inside* (true)
	const innerGoesOutside = inner
		.map(p => overlapConvexPolygonPoint(inner, p, fnInclusive))
		.reduce((a, b) => a && b, true);
	return (!outerGoesInside && innerGoesOutside);
};

export { enclosingBoundingBoxes, enclosingPolygonPolygon };
