/* Math (c) Kraft, MIT License */
import { EPSILON } from '../general/constants.js';
import { exclude } from '../general/functions.js';
import { cross2, subtract, normalize } from '../algebra/vectors.js';

const overlapConvexPolygonPoint = (poly, point, func = exclude, epsilon = EPSILON) => poly
	.map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
	.map(s => cross2(normalize(subtract(s[1], s[0])), subtract(point, s[0])))
	.map(side => func(side, epsilon))
	.map((s, _, arr) => s === arr[0])
	.reduce((prev, curr) => prev && curr, true);

export { overlapConvexPolygonPoint as default };
