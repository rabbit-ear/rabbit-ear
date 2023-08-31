/**
 * Math (c) Kraft
 */
import { EPSILON } from "../general/constant.js";
import {
	magnitude2,
	normalize2,
	cross2,
	scale2,
	add2,
	subtract2,
	midpoint2,
	rotate90,
} from "../algebra/vector.js";
import {
	include,
	exclude,
	includeL,
	includeR,
	includeS,
	excludeL,
	excludeR,
	excludeS,
	epsilonEqualVectors,
} from "../general/function.js";
import { overlapConvexPolygonPoint } from "./overlap.js";
/**
 * @description Find the intersection of two lines. Lines can be
 * lines/rays/segments, and can be inclusive or exclusive in terms
 * of their endpoints and the epsilon value.
 * @param {VecLine} a line object with "vector" and "origin"
 * @param {VecLine} b line object with "vector" and "origin"
 * @param {function} [aDomain=includeL] the domain of the first line
 * @param {function} [bDomain=includeL] the domain of the second line
 * @param {number} [epsilon=1e-6] optional epsilon
 * @returns {number[]|undefined} one 2D point or undefined
 * @linkcode Math ./src/intersect/intersect.js 39
*/
export const intersectLineLine = (
	a,
	b,
	aDomain = includeL,
	bDomain = includeL,
	epsilon = EPSILON,
) => {
	// a normalized determinant gives consistent values across all epsilon ranges
	const det_norm = cross2(normalize2(a.vector), normalize2(b.vector));
	// lines are parallel
	if (Math.abs(det_norm) < epsilon) { return undefined; }
	const determinant0 = cross2(a.vector, b.vector);
	const determinant1 = -determinant0;
	const a2b = [b.origin[0] - a.origin[0], b.origin[1] - a.origin[1]];
	const b2a = [-a2b[0], -a2b[1]];
	const t0 = cross2(a2b, b.vector) / determinant0;
	const t1 = cross2(b2a, a.vector) / determinant1;
	if (aDomain(t0, epsilon / magnitude2(a.vector))
		&& bDomain(t1, epsilon / magnitude2(b.vector))) {
		return add2(a.origin, scale2(a.vector, t0));
	}
	return undefined;
};
/**
 * @description Calculate the intersection of a circle and a line;
 * the line can be a line, ray, or segment.
 * @param {Circle} circle a circle in "radius" "origin" form
 * @param {VecLine} line a line in "vector" "origin" form
 * @param {function} [circleDomain=include] the inclusivity of
 * the circle boundary (currently not used).
 * @param {function} [lineFunc=includeL] set the line/ray/segment
 * and inclusive/exclusive
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @linkcode Math ./src/intersect/intersect.js 74
 */
export const intersectCircleLine = (
	circle,
	line,
	circleDomain = include,
	lineDomain = includeL,
	epsilon = EPSILON,
) => {
	const magSq = line.vector[0] ** 2 + line.vector[1] ** 2;
	const mag = Math.sqrt(magSq);
	const norm = mag === 0 ? line.vector : line.vector.map(c => c / mag);
	const rot90 = rotate90(norm);
	const bvec = subtract2(line.origin, circle.origin);
	const det = cross2(bvec, norm);
	if (Math.abs(det) > circle.radius + epsilon) { return undefined; }
	const side = Math.sqrt((circle.radius ** 2) - (det ** 2));
	const f = (s, i) => circle.origin[i] - rot90[i] * det + norm[i] * s;
	const results = Math.abs(circle.radius - Math.abs(det)) < epsilon
		? [side].map((s) => [s, s].map(f)) // tangent to circle
		: [-side, side].map((s) => [s, s].map(f));
	const ts = results.map(res => res.map((n, i) => n - line.origin[i]))
		.map(v => v[0] * line.vector[0] + line.vector[1] * v[1])
		.map(d => d / magSq);
	return results.filter((_, i) => lineDomain(ts[i], epsilon));
};

const acosSafe = (x) => {
	if (x >= 1.0) return 0;
	if (x <= -1.0) return Math.PI;
	return Math.acos(x);
};

const rotateVector2 = (center, pt, a) => {
	const x = pt[0] - center[0];
	const y = pt[1] - center[1];
	const xRot = x * Math.cos(a) + y * Math.sin(a);
	const yRot = y * Math.cos(a) - x * Math.sin(a);
	return [center[0] + xRot, center[1] + yRot];
};
/**
 * @description calculate the intersection of two circles, resulting
 * in either no intersection, or one or two points.
 * @param {Circle} c1 circle in "radius" "origin" form
 * @param {Circle} c2 circle in "radius" "origin" form
 * @param {function} [circleDomain=include] the inclusivity of
 * the first circle parameter (currently not used).
 * @param {function} [circleDomain=include] the inclusivity of
 * the second circle parameter (currently not used).
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][]|undefined} an array of one or two points, or undefined if no intersection
 * @linkcode Math ./src/intersect/intersect.js 121
 */
export const intersectCircleCircle = (
	c1,
	c2,
	c1Domain = include,
	c2Domain = include,
	epsilon = EPSILON,
) => {
	// sort by largest-smallest radius
	const r = (c1.radius < c2.radius) ? c1.radius : c2.radius;
	const R = (c1.radius < c2.radius) ? c2.radius : c1.radius;
	const smCenter = (c1.radius < c2.radius) ? c1.origin : c2.origin;
	const bgCenter = (c1.radius < c2.radius) ? c2.origin : c1.origin;
	// this is also the starting vector to rotate around the big circle
	const vec = [smCenter[0] - bgCenter[0], smCenter[1] - bgCenter[1]];
	const d = Math.sqrt((vec[0] ** 2) + (vec[1] ** 2));
	// infinite solutions // don't need this because the below case covers it
	// if (d < epsilon && Math.abs(R - r) < epsilon) { return undefined; }
	// no intersection (same center, different size)
	if (d < epsilon) { return undefined; }
	const point = vec.map((v, i) => (v / d) * R + bgCenter[i]);
	// kissing circles
	if (Math.abs((R + r) - d) < epsilon
		|| Math.abs(R - (r + d)) < epsilon) { return [point]; }
	// circles are contained
	if ((d + r) < R || (R + r < d)) { return undefined; }
	const angle = acosSafe((r * r - d * d - R * R) / (-2.0 * d * R));
	const pt1 = rotateVector2(bgCenter, point, +angle);
	const pt2 = rotateVector2(bgCenter, point, -angle);
	return [pt1, pt2];
};

// todo, this is copied over in clip/polygon.js
const getUniquePair = (intersections) => {
	for (let i = 1; i < intersections.length; i += 1) {
		if (!epsilonEqualVectors(intersections[0], intersections[i])) {
			return [intersections[0], intersections[i]];
		}
	}
	return undefined;
};
/**
 * generalized line-ray-segment intersection with convex polygon function
 * for lines and rays, line1 and line2 are the vector, origin in that order.
 * for segments, line1 and line2 are the two endpoints.
 */
const intersectConvexPolygonLineInclusive = (
	poly,
	{ vector, origin },
	fn_poly = includeS,
	fn_line = includeL,
	epsilon = EPSILON,
) => {
	const intersections = poly
		.map((p, i, arr) => [p, arr[(i + 1) % arr.length]]) // into segment pairs
		.map(side => intersectLineLine(
			{ vector: subtract2(side[1], side[0]), origin: side[0] },
			{ vector, origin },
			fn_poly,
			fn_line,
			epsilon,
		))
		.filter(a => a !== undefined);
	switch (intersections.length) {
	case 0: return undefined;
	case 1: return [intersections];
	default:
		// for two intersection points or more, in the case of vertex-
		// collinear intersections the same point from 2 polygon sides
		// can be returned. we need to filter for unique points.
		// if no 2 unique points found:
		// there was only one unique intersection point after all.
		return getUniquePair(intersections) || [intersections[0]];
	}
};
/**
 * @description Generalized line-ray-segment intersection with convex
 * polygons.
 * @param {number[][]} poly a polygon as an array of points
 * @param {VecLine} line a line in "vector" "origin" form.
 * @param {function} [fn_poly=includeS] the inclusivity of
 * the edges of the polygon
 * @param {function} [aDomain=includeL] the domain of the line
 * @returns {number[][]} an array of one or two points, or
 * undefined if there is no intersection.
 * @note this doubles as the exclusive condition, and the main export
 * since it checks for exclusive/inclusive and can early-return
 * @linkcode Math ./src/intersect/intersect.js 204
 */
export const intersectConvexPolygonLine = (
	poly,
	{ vector, origin },
	fn_poly = includeS,
	fn_line = excludeL,
	epsilon = EPSILON,
) => {
	const sects = intersectConvexPolygonLineInclusive(
		poly,
		{ vector, origin },
		fn_poly,
		fn_line,
		epsilon,
	);
	// const sects = convex_poly_line_intersect(intersect_func, poly, line1, line2, epsilon);
	let altFunc; // the opposite func, as far as inclusive/exclusive
	switch (fn_line) {
	// case excludeL: altFunc = includeL; break;
	case excludeR: altFunc = includeR; break;
	case excludeS: altFunc = includeS; break;
	default: return sects;
	}
	// here on, we are only dealing with exclusive tests, parsing issues with
	// vertex-on intersections that still intersect or don't intersect the polygon.
	// repeat the computation but include intersections with the polygon's vertices.
	const includes = intersectConvexPolygonLineInclusive(
		poly,
		{ vector, origin },
		includeS,
		altFunc,
		epsilon,
	);
	// const includes = convex_poly_line_intersect(altFunc, poly, line1, line2, epsilon);
	// if there are still no intersections, the line doesn't intersect.
	if (includes === undefined) { return undefined; }
	// if there are intersections, see if the line crosses the entire polygon
	// (gives us 2 unique points)
	const uniqueIncludes = getUniquePair(includes);
	// first, deal with the case that there are no unique 2 points.
	if (uniqueIncludes === undefined) {
		switch (fn_line) {
		// if there is one intersection, check if a ray's origin is inside.
		// 1. if the origin is inside, consider the intersection valid
		// 2. if the origin is outside, same as the line case above. no intersection.
		case excludeR:
			// is the ray origin inside?
			return overlapConvexPolygonPoint(poly, origin, exclude, 1e-3)
				? includes
				: undefined;
		// if there is one intersection, check if either of a segment's points are
		// inside the polygon, same as the ray above. if neither are, consider
		// the intersection invalid for the exclusive case.
		case excludeS:
			return overlapConvexPolygonPoint(poly, add2(origin, vector), exclude, 1e-3)
				|| overlapConvexPolygonPoint(poly, origin, exclude, 1e-3)
				? includes
				: undefined;
		// if there is one intersection, an infinite line is intersecting the
		// polygon from the outside touching at just one vertex. this should be
		// considered undefined for the exclusive case.
		case excludeL: return undefined;
		default: return undefined;
		}
	}
	// now that we've covered all the other cases, we know that the line intersects
	// the polygon at two unique points. this should return true for all cases
	// except one: when the line is collinear to an edge of the polygon.
	// to test this, get the midpoint of the two intersects and do an exclusive
	// check if the midpoint is inside the polygon. if it is, the line is crossing
	// the polygon and the intersection is valid.
	return overlapConvexPolygonPoint(poly, midpoint2(...uniqueIncludes), exclude, 1e-3)
		? uniqueIncludes
		: sects;
};
