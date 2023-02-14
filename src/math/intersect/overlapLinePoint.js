/* Math (c) Kraft, MIT License */
import { EPSILON } from '../general/constants.js';
import { excludeL } from '../general/functions.js';
import { subtract, magSquared, cross2, dot } from '../algebra/vectors.js';

const overlapLinePoint = ({ vector, origin }, point, func = excludeL, epsilon = EPSILON) => {
	const p2p = subtract(point, origin);
	const lineMagSq = magSquared(vector);
	const lineMag = Math.sqrt(lineMagSq);
	if (lineMag < epsilon) { return false; }
	const cross = cross2(p2p, vector.map(n => n / lineMag));
	const proj = dot(p2p, vector) / lineMagSq;
	return Math.abs(cross) < epsilon && func(proj, epsilon / lineMag);
};

export { overlapLinePoint as default };
