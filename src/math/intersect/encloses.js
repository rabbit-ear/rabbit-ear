/* Math (c) Kraft, MIT License */
import { include } from '../general/functions.js';
import overlapConvexPolygonPoint from './overlapPolygonPoint.js';

const enclosingBoundingBoxes = (outer, inner) => {
	const dimensions = Math.min(outer.min.length, inner.min.length);
	for (let d = 0; d < dimensions; d += 1) {
		if (inner.min[d] < outer.min[d] || inner.max[d] > outer.max[d]) {
			return false;
		}
	}
	return true;
};
const enclosingPolygonPolygon = (outer, inner, fnInclusive = include) => {
	const outerGoesInside = outer
		.map(p => overlapConvexPolygonPoint(inner, p, fnInclusive))
		.reduce((a, b) => a || b, false);
	const innerGoesOutside = inner
		.map(p => overlapConvexPolygonPoint(inner, p, fnInclusive))
		.reduce((a, b) => a && b, true);
	return (!outerGoesInside && innerGoesOutside);
};

export { enclosingBoundingBoxes, enclosingPolygonPolygon };
