/* Math (c) Kraft, MIT License */
import { EPSILON } from '../general/constants.js';
import { rotate90, subtract, dot } from '../algebra/vectors.js';

const overlapConvexPolygons = (poly1, poly2, epsilon = EPSILON) => {
	for (let p = 0; p < 2; p += 1) {
		const polyA = p === 0 ? poly1 : poly2;
		const polyB = p === 0 ? poly2 : poly1;
		for (let i = 0; i < polyA.length; i += 1) {
			const origin = polyA[i];
			const vector = rotate90(subtract(polyA[(i + 1) % polyA.length], polyA[i]));
			const projected = polyB
				.map(point => subtract(point, origin))
				.map(v => dot(vector, v));
			const other_test_point = polyA[(i + 2) % polyA.length];
			const side_a = dot(vector, subtract(other_test_point, origin));
			const side = side_a > 0;
			const one_sided = projected
				.map(dotProd => (side ? dotProd < epsilon : dotProd > -epsilon))
				.reduce((a, b) => a && b, true);
			if (one_sided) { return false; }
		}
	}
	return true;
};

export { overlapConvexPolygons as default };
