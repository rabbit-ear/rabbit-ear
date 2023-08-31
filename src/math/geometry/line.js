/**
 * Math (c) Kraft
 */
import { EPSILON } from "../general/constant.js";
import {
	epsilonEqual,
	epsilonEqualVectors,
} from "../general/function.js";
import {
	dot,
	cross2,
	normalize,
	subtract,
	add2,
	subtract2,
	scale2,
	lerp,
	flip,
} from "../algebra/vector.js";
import { counterClockwiseSubsect2 } from "./radial.js";
/**
 * @description Check if a point is collinear and between two other points.
 * @param {number[]} p0 a segment point
 * @param {number[]} p1 the point to test collinearity
 * @param {number[]} p2 a segment point
 * @param {boolean} [inclusive=false] if the point is the same as the endpoints
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {boolean} true if the point lies collinear and between the other two points.
 * @linkcode Math ./src/geometry/lines.js 29
 */
export const collinearBetween = (p0, p1, p2, inclusive = false, epsilon = EPSILON) => {
	const similar = [p0, p2]
		.map(p => epsilonEqualVectors(p1, p, epsilon))
		.reduce((a, b) => a || b, false);
	if (similar) { return inclusive; }
	const vectors = [[p0, p1], [p1, p2]]
		.map(segment => subtract(segment[1], segment[0]))
		.map(vector => normalize(vector));
	return epsilonEqual(1.0, dot(...vectors), EPSILON);
};
/**
 * @description linear interpolate between two lines
 * @param {VecLine} a a line with a "vector" and "origin" component
 * @param {VecLine} b a line with a "vector" and "origin" component
 * @param {number} t one scalar between 0 and 1 (not clamped)
 * @returns {number[]} one vector, dimensions matching first parameter
 * @linkcode Math ./src/geometry/lines.js 47
 */
export const lerpLines = (a, b, t) => {
	const vector = lerp(a.vector, b.vector, t);
	const origin = lerp(a.origin, b.origin, t);
	return { vector, origin };
};
// export const pleat = (a, b, count) => Array
// 	.from(Array(count - 1))
// 	.map((_, i) => (i + 1) / count)
// 	.map(t => lerpLines(a, b, t));
/**
 * @description Between two lines, make a repeating sequence of
 * evenly-spaced lines to simulate a series of pleats.
 * @param {VecLine} a a line with a "vector" and "origin" component
 * @param {VecLine} b a line with a "vector" and "origin" component
 * @param {number} count the number of faces, the number of lines will be n-1.
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {VecLine[]} an array of lines, objects with "vector" and "origin"
 * @linkcode Math ./src/geometry/lines.js 65
 */
export const pleat = (a, b, count, epsilon = EPSILON) => {
	const dotProd = dot(a.vector, b.vector);
	const determinant = cross2(a.vector, b.vector);
	const numerator = cross2(subtract2(b.origin, a.origin), b.vector);
	const t = numerator / determinant;
	const normalized = [a.vector, b.vector].map(vec => normalize(vec));
	// two sets of pleats will be generated, between either pairs
	// of interior angles, unless the lines are parallel.
	const sides = determinant > -epsilon
		? [[a.vector, b.vector], [flip(b.vector), a.vector]]
		: [[b.vector, a.vector], [flip(a.vector), b.vector]];
	const pleatVectors = sides
		.map(pair => counterClockwiseSubsect2(pair[0], pair[1], count));
	const isParallel = Math.abs(cross2(...normalized)) < epsilon;
	// there is an intersection as long as the lines are not parallel
	const intersection = isParallel
		? undefined
		: add2(a.origin, scale2(a.vector, t));
	// the origin of the lines will be either the intersection,
	// or in the case of parallel, a lerp between the two line origins.
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
/**
 * @description given two lines, find two lines which bisect the given lines,
 * if the given lines have an intersection, or return one
 * line if they are parallel.
 * @param {VecLine} a a line with a "vector" and "origin" component
 * @param {VecLine} b a line with a "vector" and "origin" component
 * @param {number} [epsilon=1e-6] an optional epsilon for testing parallel-ness.
 * @returns {VecLine[]} an array of lines, objects with "vector" and "origin"
 * @linkcode Math ./src/geometry/lines.js 107
 */
export const bisectLines2 = (a, b, epsilon = EPSILON) => {
	const solution = pleat(a, b, 2, epsilon).map(arr => arr[0]);
	solution.forEach((val, i) => {
		if (val === undefined) { delete solution[i]; }
	});
	return solution;
};
// export const bisectLines2 = (a, b, epsilon = EPSILON) => {
// 	const determinant = cross2(a.vector, b.vector);
// 	const dotProd = dot(a.vector, b.vector);
// 	const bisects = determinant > -epsilon
// 		? [counterClockwiseBisect2(a.vector, b.vector)]
// 		: [clockwiseBisect2(a.vector, b.vector)];
// 	bisects[1] = determinant > -epsilon
// 		? rotate90(bisects[0])
// 		: rotate270(bisects[0]);
// 	const numerator = cross2(subtract2(b.origin, a.origin), b.vector);
// 	// const numerator = (b.origin[0] - a.origin[0])
// 	// 	* b.vector[1] - b.vector[0] * (b.origin[1] - a.origin[1]);
// 	const t = numerator / determinant;
// 	const normalized = [a.vector, b.vector].map(vec => normalize(vec));
// 	const isParallel = Math.abs(cross2(...normalized)) < epsilon;
// 	const origin = isParallel
// 		? midpoint(a.origin, b.origin)
// 		: [a.origin[0] + a.vector[0] * t, a.origin[1] + a.vector[1] * t];
// 	const solution = bisects.map(vector => ({ vector, origin }));
// 	if (isParallel) { delete solution[(dotProd > -epsilon ? 1 : 0)]; }
// 	return solution;
// };
