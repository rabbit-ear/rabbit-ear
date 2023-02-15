/* Math (c) Kraft, MIT License */
import { EPSILON } from '../general/constants.js';
import { exclude, excludeL } from '../general/functions.js';
import { distance2, cross2, subtract2, add2, dot2, magnitude2, magSquared, normalize2, rotate90 } from '../algebra/vectors.js';

const overlapBoundingBoxes = (box1, box2, epsilon = EPSILON) => {
	const dimensions = Math.min(box1.min.length, box2.min.length);
	for (let d = 0; d < dimensions; d += 1) {
		if (box1.min[d] > box2.max[d] + epsilon
			|| box1.max[d] < box2.min[d] - epsilon) {
			return false;
		}
	}
	return true;
};
const overlapCirclePoint = ({ radius, origin }, point, fn = exclude, epsilon = EPSILON) => (
	fn(radius - distance2(origin, point), epsilon)
);
const overlapLineLine = (
	a,
	b,
	aFunction = excludeL,
	bFunction = excludeL,
	epsilon = EPSILON,
) => {
	const denominator0 = cross2(a.vector, b.vector);
	const denominator1 = -denominator0;
	const a2b = subtract2(b.origin, a.origin);
	if (Math.abs(denominator0) < epsilon) {
		if (Math.abs(cross2(a2b, a.vector)) > epsilon) { return false; }
		const aPt1 = subtract2(a.origin, b.origin);
		const aPt2 = add2(aPt1, a.vector);
		const bPt1 = a2b;
		const bPt2 = add2(bPt1, b.vector);
		const aProjLen = dot2(a.vector, a.vector);
		const bProjLen = dot2(a.vector, a.vector);
		const aProj1 = dot2(aPt1, b.vector) / bProjLen;
		const aProj2 = dot2(aPt2, b.vector) / bProjLen;
		const bProj1 = dot2(bPt1, a.vector) / aProjLen;
		const bProj2 = dot2(bPt2, a.vector) / aProjLen;
		return aFunction(bProj1, epsilon) || aFunction(bProj2, epsilon)
			|| bFunction(aProj1, epsilon) || bFunction(aProj2, epsilon);
	}
	const b2a = [-a2b[0], -a2b[1]];
	const t0 = cross2(a2b, b.vector) / denominator0;
	const t1 = cross2(b2a, a.vector) / denominator1;
	return aFunction(t0, epsilon / magnitude2(a.vector))
		&& bFunction(t1, epsilon / magnitude2(b.vector));
};
const overlapLinePoint = ({ vector, origin }, point, func = excludeL, epsilon = EPSILON) => {
	const p2p = subtract2(point, origin);
	const lineMagSq = magSquared(vector);
	const lineMag = Math.sqrt(lineMagSq);
	if (lineMag < epsilon) { return false; }
	const cross = cross2(p2p, vector.map(n => n / lineMag));
	const proj = dot2(p2p, vector) / lineMagSq;
	return Math.abs(cross) < epsilon && func(proj, epsilon / lineMag);
};
const overlapConvexPolygonPoint = (poly, point, func = exclude, epsilon = EPSILON) => poly
	.map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
	.map(s => cross2(normalize2(subtract2(s[1], s[0])), subtract2(point, s[0])))
	.map(side => func(side, epsilon))
	.map((s, _, arr) => s === arr[0])
	.reduce((prev, curr) => prev && curr, true);
const overlapConvexPolygons = (poly1, poly2, epsilon = EPSILON) => {
	for (let p = 0; p < 2; p += 1) {
		const polyA = p === 0 ? poly1 : poly2;
		const polyB = p === 0 ? poly2 : poly1;
		for (let i = 0; i < polyA.length; i += 1) {
			const origin = polyA[i];
			const vector = rotate90(subtract2(polyA[(i + 1) % polyA.length], polyA[i]));
			const projected = polyB
				.map(point => subtract2(point, origin))
				.map(v => dot2(vector, v));
			const other_test_point = polyA[(i + 2) % polyA.length];
			const side_a = dot2(vector, subtract2(other_test_point, origin));
			const side = side_a > 0;
			const one_sided = projected
				.map(dotProd => (side ? dotProd < epsilon : dotProd > -epsilon))
				.reduce((a, b) => a && b, true);
			if (one_sided) { return false; }
		}
	}
	return true;
};

export { overlapBoundingBoxes, overlapCirclePoint, overlapConvexPolygonPoint, overlapConvexPolygons, overlapLineLine, overlapLinePoint };
