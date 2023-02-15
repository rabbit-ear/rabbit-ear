/* Math (c) Kraft, MIT License */
import { EPSILON } from '../general/constants.js';
import { cross2, normalize2, magnitude2, add2, scale2, rotate90, subtract2, midpoint2 } from '../algebra/vectors.js';
import { includeL, excludeS, excludeR, excludeL, exclude, includeS, fnEpsilonEqualVectors, includeR } from '../general/functions.js';
import { overlapConvexPolygonPoint } from './overlap.js';

const intersectLineLine = (
	a,
	b,
	aFunction = includeL,
	bFunction = includeL,
	epsilon = EPSILON,
) => {
	const det_norm = cross2(normalize2(a.vector), normalize2(b.vector));
	if (Math.abs(det_norm) < epsilon) { return undefined; }
	const determinant0 = cross2(a.vector, b.vector);
	const determinant1 = -determinant0;
	const a2b = [b.origin[0] - a.origin[0], b.origin[1] - a.origin[1]];
	const b2a = [-a2b[0], -a2b[1]];
	const t0 = cross2(a2b, b.vector) / determinant0;
	const t1 = cross2(b2a, a.vector) / determinant1;
	if (aFunction(t0, epsilon / magnitude2(a.vector))
		&& bFunction(t1, epsilon / magnitude2(b.vector))) {
		return add2(a.origin, scale2(a.vector, t0));
	}
	return undefined;
};
const intersectCircleLine = (
	circle,
	line,
	line_func = includeL,
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
		? [side].map((s) => [s, s].map(f))
		: [-side, side].map((s) => [s, s].map(f));
	const ts = results.map(res => res.map((n, i) => n - line.origin[i]))
		.map(v => v[0] * line.vector[0] + line.vector[1] * v[1])
		.map(d => d / magSq);
	return results.filter((_, i) => line_func(ts[i], epsilon));
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
const intersectCircleCircle = (c1, c2, epsilon = EPSILON) => {
	const r = (c1.radius < c2.radius) ? c1.radius : c2.radius;
	const R = (c1.radius < c2.radius) ? c2.radius : c1.radius;
	const smCenter = (c1.radius < c2.radius) ? c1.origin : c2.origin;
	const bgCenter = (c1.radius < c2.radius) ? c2.origin : c1.origin;
	const vec = [smCenter[0] - bgCenter[0], smCenter[1] - bgCenter[1]];
	const d = Math.sqrt((vec[0] ** 2) + (vec[1] ** 2));
	if (d < epsilon) { return undefined; }
	const point = vec.map((v, i) => (v / d) * R + bgCenter[i]);
	if (Math.abs((R + r) - d) < epsilon
		|| Math.abs(R - (r + d)) < epsilon) { return [point]; }
	if ((d + r) < R || (R + r < d)) { return undefined; }
	const angle = acosSafe((r * r - d * d - R * R) / (-2.0 * d * R));
	const pt1 = rotateVector2(bgCenter, point, +angle);
	const pt2 = rotateVector2(bgCenter, point, -angle);
	return [pt1, pt2];
};
const getUniquePair = (intersections) => {
	for (let i = 1; i < intersections.length; i += 1) {
		if (!fnEpsilonEqualVectors(intersections[0], intersections[i])) {
			return [intersections[0], intersections[i]];
		}
	}
	return undefined;
};
const intersectConvexPolygonLineInclusive = (
	poly,
	{ vector, origin },
	fn_poly = includeS,
	fn_line = includeL,
	epsilon = EPSILON,
) => {
	const intersections = poly
		.map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
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
		return getUniquePair(intersections) || [intersections[0]];
	}
};
const intersectConvexPolygonLine = (
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
	let altFunc;
	switch (fn_line) {
	case excludeR: altFunc = includeR; break;
	case excludeS: altFunc = includeS; break;
	default: return sects;
	}
	const includes = intersectConvexPolygonLineInclusive(
		poly,
		{ vector, origin },
		includeS,
		altFunc,
		epsilon,
	);
	if (includes === undefined) { return undefined; }
	const uniqueIncludes = getUniquePair(includes);
	if (uniqueIncludes === undefined) {
		switch (fn_line) {
		case excludeR:
			return overlapConvexPolygonPoint(poly, origin, exclude, epsilon)
				? includes
				: undefined;
		case excludeS:
			return overlapConvexPolygonPoint(poly, add2(origin, vector), exclude, epsilon)
				|| overlapConvexPolygonPoint(poly, origin, exclude, epsilon)
				? includes
				: undefined;
		case excludeL: return undefined;
		default: return undefined;
		}
	}
	return overlapConvexPolygonPoint(poly, midpoint2(...uniqueIncludes), exclude, epsilon)
		? uniqueIncludes
		: sects;
};

export { intersectCircleCircle, intersectCircleLine, intersectConvexPolygonLine, intersectLineLine };
