/* Math (c) Kraft, MIT License */
import { EPSILON } from '../general/constants.js';
import { fnEpsilonEqualVectors, fnEpsilonEqual } from '../general/functions.js';
import { subtract, normalize, dot, lerp, cross2, subtract2, flip, add2, scale2 } from '../algebra/vectors.js';
import { counterClockwiseSubsect2 } from './radial.js';

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
const lerpLines = (a, b, t) => {
	const vector = lerp(a.vector, b.vector, t);
	const origin = lerp(a.origin, b.origin, t);
	return { vector, origin };
};
const pleat = (a, b, count, epsilon = EPSILON) => {
	const dotProd = dot(a.vector, b.vector);
	const determinant = cross2(a.vector, b.vector);
	const numerator = cross2(subtract2(b.origin, a.origin), b.vector);
	const t = numerator / determinant;
	const normalized = [a.vector, b.vector].map(vec => normalize(vec));
	const sides = determinant > -epsilon
		? [[a.vector, b.vector], [flip(b.vector), a.vector]]
		: [[b.vector, a.vector], [flip(a.vector), b.vector]];
	const pleatVectors = sides
		.map(pair => counterClockwiseSubsect2(pair[0], pair[1], count));
	const isParallel = Math.abs(cross2(...normalized)) < epsilon;
	const intersection = isParallel
		? undefined
		: add2(a.origin, scale2(a.vector, t));
	const iter = Array.from(Array(count - 1));
	const origins = isParallel
		? iter.map((_, i) => lerp(a.origin, b.origin, (i + 1) / count))
		: iter.map(() => intersection);
	const solution = pleatVectors
		.map(side => side.map((vector, i) => ({
			vector,
			origin: [...origins[i]],
		})));
	if (isParallel) { solution[(dotProd > -epsilon ? 1 : 0)] = []; }
	return solution;
};
const bisectLines2 = (a, b, epsilon = EPSILON) => {
	const solution = pleat(a, b, 2, epsilon).map(arr => arr[0]);
	solution.forEach((val, i) => {
		if (val === undefined) { delete solution[i]; }
	});
	return solution;
};

export { bisectLines2, collinearBetween, lerpLines, pleat };
