/* Math (c) Kraft, MIT License */
import { EPSILON } from '../general/constants.js';
import { fnNotUndefined, include, includeL, includeS } from '../general/functions.js';
import { subtract, magnitude, add, scale, cross2, normalize, flip } from '../algebra/vectors.js';
import overlapConvexPolygonPoint from './overlapPolygonPoint.js';

const lineLineParameter = (
	lineVector,
	lineOrigin,
	polyVector,
	polyOrigin,
	polyLineFunc = includeS,
	epsilon = EPSILON,
) => {
	const det_norm = cross2(normalize(lineVector), normalize(polyVector));
	if (Math.abs(det_norm) < epsilon) { return undefined; }
	const determinant0 = cross2(lineVector, polyVector);
	const determinant1 = -determinant0;
	const a2b = subtract(polyOrigin, lineOrigin);
	const b2a = flip(a2b);
	const t0 = cross2(a2b, polyVector) / determinant0;
	const t1 = cross2(b2a, lineVector) / determinant1;
	if (polyLineFunc(t1, epsilon / magnitude(polyVector))) {
		return t0;
	}
	return undefined;
};
const linePointFromParameter = (vector, origin, t) => (
	add(origin, scale(vector, t))
);
const getIntersectParameters = (poly, vector, origin, polyLineFunc, epsilon) => poly
	.map((p, i, arr) => [subtract(arr[(i + 1) % arr.length], p), p])
	.map(side => lineLineParameter(
		vector,
		origin,
		side[0],
		side[1],
		polyLineFunc,
		epsilon,
	))
	.filter(fnNotUndefined)
	.sort((a, b) => a - b);
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
const clipLineConvexPolygon = (
	poly,
	{ vector, origin },
	fnPoly = include,
	fnLine = includeL,
	epsilon = EPSILON,
) => {
	const numbers = getIntersectParameters(poly, vector, origin, includeS, epsilon);
	if (numbers.length < 2) { return undefined; }
	const scaled_epsilon = (epsilon * 2) / magnitude(vector);
	const ends = getMinMax(numbers, fnPoly, scaled_epsilon);
	if (ends === undefined) { return undefined; }
	const clip_fn = (t) => {
		if (fnLine(t)) { return t; }
		return t < 0.5 ? 0 : 1;
	};
	const ends_clip = ends.map(clip_fn);
	if (Math.abs(ends_clip[0] - ends_clip[1]) < (epsilon * 2) / magnitude(vector)) {
		return undefined;
	}
	const mid = linePointFromParameter(vector, origin, (ends_clip[0] + ends_clip[1]) / 2);
	return overlapConvexPolygonPoint(poly, mid, fnPoly, epsilon)
		? ends_clip.map(t => linePointFromParameter(vector, origin, t))
		: undefined;
};

export { clipLineConvexPolygon as default };
