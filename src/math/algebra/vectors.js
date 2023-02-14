/* Math (c) Kraft, MIT License */
import { EPSILON } from '../general/constants.js';
import { fnSquare, fnAdd } from '../general/functions.js';

const magnitude = v => Math.sqrt(v
	.map(fnSquare)
	.reduce(fnAdd, 0));
const magnitude2 = v => Math.sqrt(v[0] * v[0] + v[1] * v[1]);
const magnitude3 = v => Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
const magSquared = v => v
	.map(fnSquare)
	.reduce(fnAdd, 0);
const normalize = (v) => {
	const m = magnitude(v);
	return m === 0 ? v : v.map(c => c / m);
};
const normalize2 = (v) => {
	const m = magnitude2(v);
	return m === 0 ? v : [v[0] / m, v[1] / m];
};
const normalize3 = (v) => {
	const m = magnitude3(v);
	return m === 0 ? v : [v[0] / m, v[1] / m, v[2] / m];
};
const scale = (v, s) => v.map(n => n * s);
const scale2 = (v, s) => [v[0] * s, v[1] * s];
const scale3 = (v, s) => [v[0] * s, v[1] * s, v[2] * s];
const add = (v, u) => v.map((n, i) => n + (u[i] || 0));
const add2 = (v, u) => [v[0] + u[0], v[1] + u[1]];
const add3 = (v, u) => [v[0] + u[0], v[1] + u[1], v[2] + u[2]];
const subtract = (v, u) => v.map((n, i) => n - (u[i] || 0));
const subtract2 = (v, u) => [v[0] - u[0], v[1] - u[1]];
const subtract3 = (v, u) => [v[0] - u[0], v[1] - u[1], v[2] - u[2]];
const dot = (v, u) => v
	.map((_, i) => v[i] * u[i])
	.reduce(fnAdd, 0);
const dot2 = (v, u) => v[0] * u[0] + v[1] * u[1];
const dot3 = (v, u) => v[0] * u[0] + v[1] * u[1] + v[2] * u[2];
const midpoint = (v, u) => v.map((n, i) => (n + u[i]) / 2);
const midpoint2 = (v, u) => scale2(add2(v, u), 0.5);
const midpoint3 = (v, u) => scale3(add3(v, u), 0.5);
const average = function () {
	if (arguments.length === 0) { return []; }
	const dimension = (arguments[0].length > 0) ? arguments[0].length : 0;
	const sum = Array(dimension).fill(0);
	Array.from(arguments)
		.forEach(vec => sum.forEach((_, i) => { sum[i] += vec[i] || 0; }));
	return sum.map(n => n / arguments.length);
};
const lerp = (v, u, t) => {
	const inv = 1.0 - t;
	return v.map((n, i) => n * inv + (u[i] || 0) * t);
};
const cross2 = (v, u) => v[0] * u[1] - v[1] * u[0];
const cross3 = (v, u) => [
	v[1] * u[2] - v[2] * u[1],
	v[2] * u[0] - v[0] * u[2],
	v[0] * u[1] - v[1] * u[0],
];
const distance = (v, u) => Math.sqrt(v
	.map((_, i) => (v[i] - u[i]) ** 2)
	.reduce(fnAdd, 0));
const distance2 = (v, u) => {
	const p = v[0] - u[0];
	const q = v[1] - u[1];
	return Math.sqrt((p * p) + (q * q));
};
const distance3 = (v, u) => {
	const a = v[0] - u[0];
	const b = v[1] - u[1];
	const c = v[2] - u[2];
	return Math.sqrt((a * a) + (b * b) + (c * c));
};
const flip = v => v.map(n => -n);
const rotate90 = v => [-v[1], v[0]];
const rotate270 = v => [v[1], -v[0]];
const degenerate = (v, epsilon = EPSILON) => v
	.map(n => Math.abs(n))
	.reduce(fnAdd, 0) < epsilon;
const parallelNormalized = (v, u, epsilon = EPSILON) => 1 - Math
	.abs(dot(v, u)) < epsilon;
const parallel = (v, u, epsilon = EPSILON) => parallelNormalized(
	normalize(v),
	normalize(u),
	epsilon,
);
const parallel2 = (v, u, epsilon = EPSILON) => Math
	.abs(cross2(v, u)) < epsilon;
const resize = (d, v) => (v.length === d
	? v
	: Array(d).fill(0).map((z, i) => (v[i] ? v[i] : z)));
const resizeUp = (a, b) => [a, b]
	.map(v => resize(Math.max(a.length, b.length), v));

export { add, add2, add3, average, cross2, cross3, degenerate, distance, distance2, distance3, dot, dot2, dot3, flip, lerp, magSquared, magnitude, magnitude2, magnitude3, midpoint, midpoint2, midpoint3, normalize, normalize2, normalize3, parallel, parallel2, parallelNormalized, resize, resizeUp, rotate270, rotate90, scale, scale2, scale3, subtract, subtract2, subtract3 };
