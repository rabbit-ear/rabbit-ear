/* Math (c) Kraft, MIT License */
import { EPSILON } from '../general/constants.js';
import { fnEpsilonEqualVectors, fnEpsilonEqual } from '../general/functions.js';
import { subtract, normalize, dot, cross2, rotate90, rotate270, midpoint, lerp } from '../algebra/vectors.js';
import { counterClockwiseBisect2, clockwiseBisect2 } from './radial.js';

const collinearBetween = (p0, p1, p2, inclusive = false, epsilon = EPSILON) => {
	const similar = [p0, p2]
		.map(p => fnEpsilonEqualVectors(p1, p))
		.reduce((a, b) => a || b, false);
	if (similar) { return inclusive; }
	const vectors = [[p0, p1], [p1, p2]]
		.map(segment => subtract(segment[1], segment[0]))
		.map(vector => normalize(vector));
	return fnEpsilonEqual(1.0, dot(...vectors), epsilon);
};
const bisectLines2 = (a, b, epsilon = EPSILON) => {
	const determinant = cross2(a.vector, b.vector);
	const dotProd = dot(a.vector, b.vector);
	const bisects = determinant > -epsilon
		? [counterClockwiseBisect2(a.vector, b.vector)]
		: [clockwiseBisect2(a.vector, b.vector)];
	bisects[1] = determinant > -epsilon
		? rotate90(bisects[0])
		: rotate270(bisects[0]);
	const numerator = (b.origin[0] - a.origin[0])
		* b.vector[1] - b.vector[0] * (b.origin[1] - a.origin[1]);
	const t = numerator / determinant;
	const normalized = [a.vector, b.vector].map(vec => normalize(vec));
	const isParallel = Math.abs(cross2(...normalized)) < epsilon;
	const origin = isParallel
		? midpoint(a.origin, b.origin)
		: [a.origin[0] + a.vector[0] * t, a.origin[1] + a.vector[1] * t];
	const solution = bisects.map(vector => ({ vector, origin }));
	if (isParallel) { delete solution[(dotProd > -epsilon ? 1 : 0)]; }
	return solution;
};
const lerpLines = (a, b, t) => {
	const vector = lerp(a.vector, b.vector, t);
	const origin = lerp(a.origin, b.origin, t);
	return { vector, origin };
};
const pleat = (a, b, count) => Array
	.from(Array(count - 1))
	.map((_, i) => (i + 1) / count)
	.map(t => lerpLines(a, b, t));

export { bisectLines2, collinearBetween, lerpLines, pleat };
