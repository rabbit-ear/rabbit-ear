/* Math (c) Kraft, MIT License */
import { EPSILON } from '../general/constants.js';
import { includeL } from '../general/functions.js';
import { cross2, normalize2, magnitude2, add2, scale2 } from '../algebra/vectors.js';

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

export { intersectLineLine as default };
