/* Math (c) Kraft, MIT License */
import { EPSILON } from '../general/constants.js';
import { add, midpoint, subtract } from '../algebra/vectors.js';
import { excludeS, excludeR, excludeL, exclude, includeS, fnEpsilonEqualVectors, includeL, includeR } from '../general/functions.js';
import intersectLineLine from './intersectLineLine.js';
import overlapConvexPolygonPoint from './overlapPolygonPoint.js';

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
			{ vector: subtract(side[1], side[0]), origin: side[0] },
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
			return overlapConvexPolygonPoint(poly, add(origin, vector), exclude, epsilon)
				|| overlapConvexPolygonPoint(poly, origin, exclude, epsilon)
				? includes
				: undefined;
		case excludeL: return undefined;
		default: return undefined;
		}
	}
	return overlapConvexPolygonPoint(poly, midpoint(...uniqueIncludes), exclude, epsilon)
		? uniqueIncludes
		: sects;
};

export { intersectConvexPolygonLine as default };
