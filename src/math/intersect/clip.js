/**
 * Math (c) Kraft
 */
import { EPSILON } from "../general/constant.js";
import {
	include,
	includeL,
	includeS,
} from "../general/function.js";
import {
	normalize2,
	magnitude2,
	cross2,
	add2,
	subtract2,
	scale2,
	flip,
} from "../algebra/vector.js";
import { overlapConvexPolygonPoint } from "./overlap.js";
/**
 * @description Clip an infinite line inside a bounding box
 * and return either:
 * - an array of two points (a segment)
 * - an array of one point (degenerate segment)
 * - undefined (no intersection)
 * @param {VecLine} line a line with a vector and an origin
 * @param {BoundingBox} box an AABB bounding box
 * @returns {number[] | undefined} the result.
 */
export const clipLineInBoundingBox = ({ vector, origin }, { min, max, span }) => {
	return clipLineConvexPolygon()
};

const lineLineParameter = (
	lineVector,
	lineOrigin,
	polyVector,
	polyOrigin,
	polyLineFunc = includeS,
	epsilon = EPSILON,
) => {
	// a normalized determinant gives consistent values across all epsilon ranges
	const det_norm = cross2(normalize2(lineVector), normalize2(polyVector));
	// lines are parallel
	if (Math.abs(det_norm) < epsilon) { return undefined; }
	const determinant0 = cross2(lineVector, polyVector);
	const determinant1 = -determinant0;
	const a2b = subtract2(polyOrigin, lineOrigin);
	const b2a = flip(a2b);
	const t0 = cross2(a2b, polyVector) / determinant0;
	const t1 = cross2(b2a, lineVector) / determinant1;
	if (polyLineFunc(t1, epsilon / magnitude2(polyVector))) {
		return t0;
	}
	return undefined;
};

const linePointFromParameter = (vector, origin, t) => (
	add2(origin, scale2(vector, t))
);

// get all intersections with polgyon faces using the polyLineFunc:
// - includeS or excludeS
// sort them so we can grab the two most opposite intersections
const getIntersectParameters = (poly, vector, origin, polyLineFunc, epsilon) => poly
	// polygon into array of arrays [vector, origin]
	.map((p, i, arr) => [subtract2(arr[(i + 1) % arr.length], p), p])
	.map(side => lineLineParameter(
		vector,
		origin,
		side[0],
		side[1],
		polyLineFunc,
		epsilon,
	))
	.filter(a => a !== undefined)
	.sort((a, b) => a - b);

// we have already done the test that numbers is a valid array
// and the length is >= 2
const getMinMax = (numbers, func, scaled_epsilon) => {
	let a = 0;
	let b = numbers.length - 1;
	while (a < b) {
		if (func(numbers[a + 1] - numbers[a], scaled_epsilon)) { break; }
		a += 1;
	}
	while (b > a) {
		if (func(numbers[b] - numbers[b - 1], scaled_epsilon)) { break; }
		b -= 1;
	}
	if (a >= b) { return undefined; }
	return [numbers[a], numbers[b]];
};
/**
 * @description find the overlap between one line and one convex polygon and
 * clip the line into a segment (two endpoints) or return undefined if no overlap.
 * The input line can be a line, ray, or segment, as determined by "fnLine".
 * @param {number[][]} poly array of points (which are arrays of numbers)
 * @param {VecLine} line a line in "vector" "origin" form
 * @param {function} [fnPoly=include] include or exclude polygon boundary in clip
 * @param {function} [fnLine=includeL] function to determine line/ray/segment,
 * and inclusive or exclusive.
 * @param {number} [epsilon=1e-6] optional epsilon
 * @linkcode Math ./src/intersect/clip.js 93
 */
export const clipLineConvexPolygon = (
	poly,
	{ vector, origin },
	fnPoly = include,
	fnLine = includeL,
	epsilon = EPSILON,
) => {
	const numbers = getIntersectParameters(poly, vector, origin, includeS, epsilon);
	if (numbers.length < 2) { return undefined; }
	const scaled_epsilon = (epsilon * 2) / magnitude2(vector);
	// ends is now an array, length 2, of the min and max parameter on the line
	// this also verifies the two intersections are not the same point
	const ends = getMinMax(numbers, fnPoly, scaled_epsilon);
	if (ends === undefined) { return undefined; }
	// ends_clip is the intersection between 2 domains, the result
	// and the valid inclusive/exclusive function
	// todo: this line hardcodes the parameterization that segments and rays are cropping
	// their lowest point at 0 and highest (if segment) at 1
	const clip_fn = (t) => {
		if (fnLine(t)) { return t; }
		return t < 0.5 ? 0 : 1;
	};
	const ends_clip = ends.map(clip_fn);
	// if endpoints are the same, exit
	if (Math.abs(ends_clip[0] - ends_clip[1]) < (epsilon * 2) / magnitude2(vector)) {
		return undefined;
	}
	// test if the solution is collinear to an edge by getting the segment midpoint
	// then test inclusive or exclusive depending on user parameter
	const mid = linePointFromParameter(vector, origin, (ends_clip[0] + ends_clip[1]) / 2);
	return overlapConvexPolygonPoint(poly, mid, fnPoly, epsilon)
		? ends_clip.map(t => linePointFromParameter(vector, origin, t))
		: undefined;
};
/**
 * @description Clip two 2D polygons and return their union. This works
 * for non-convex poylgons, but both polygons must have counter-clockwise
 * winding; will not work even if both are similarly-clockwise.
 * Sutherland-Hodgman algorithm.
 * Implementation is from Rosetta Code, refactored to incorporate an epsilon
 * to specify inclusivity around the edges.
 * @attribution https://rosettacode.org/wiki/Sutherland-Hodgman_polygon_clipping#JavaScript
 * @param {number[][]} polygon1 an array of points, where each point
 * is an array of numbers.
 * @param {number[][]} polygon2 an array of points, where each point
 * is an array of numbers.
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][]} a polygon as an array of points.
 * @linkcode Math ./src/intersect/clip.js 143
 */
export const clipPolygonPolygon = (polygon1, polygon2, epsilon = EPSILON) => {
	const inside = (p, cp1, cp2) => (
		(cp2[0] - cp1[0]) * (p[1] - cp1[1])) > ((cp2[1] - cp1[1]) * (p[0] - cp1[0]) + epsilon
	);
	const intersection = (cp1, cp2, e, s) => {
		const dc = subtract2(cp1, cp2);
		const dp = subtract2(s, e);
		const n1 = cross2(cp1, cp2);
		const n2 = cross2(s, e);
		const n3 = 1.0 / cross2(dc, dp);
		// return [
		// 	(n1 * dp[0] - n2 * dc[0]) * n3,
		// 	(n1 * dp[1] - n2 * dc[1]) * n3,
		// ];
		return scale2(subtract2(scale2(dp, n1), scale2(dc, n2)), n3);
	};
	let outputList = polygon1;
	let cp1 = polygon2[polygon2.length - 1];
	for (let j = 0; j < polygon2.length; j += 1) {
		const cp2 = polygon2[j];
		const inputList = outputList;
		outputList = [];
		let s = inputList[inputList.length - 1];
		for (let i = 0; i < inputList.length; i += 1) {
			const e = inputList[i];
			if (inside(e, cp1, cp2)) {
				if (!inside(s, cp1, cp2)) {
					outputList.push(intersection(cp1, cp2, e, s));
				}
				outputList.push(e);
			} else if (inside(s, cp1, cp2)) {
				outputList.push(intersection(cp1, cp2, e, s));
			}
			s = e;
		}
		cp1 = cp2;
	}
	return outputList.length === 0 ? undefined : outputList;
};
