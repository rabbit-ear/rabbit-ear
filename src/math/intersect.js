/**
 * Rabbit Ear (c) Kraft
 */
import {
	EPSILON,
} from "./constant.js";
import {
	magnitude2,
	normalize2,
	cross2,
	scale2,
	add2,
	subtract2,
	rotate90,
} from "./vector.js";
import {
	include,
	includeL,
} from "./compare.js";

/**
 * @description Find the intersection of two lines. Lines can be
 * lines/rays/segments, and can be inclusive or exclusive in terms
 * of their endpoints and the epsilon value.
 * @param {VecLine2} a line object with "vector" and "origin"
 * @param {VecLine2} b line object with "vector" and "origin"
 * @param {Function} [aDomain=includeL] the domain of the first line
 * @param {Function} [bDomain=includeL] the domain of the second line
 * @param {number} [epsilon=1e-6] optional epsilon
 * @returns {{
 *   point: ([number, number] | undefined)
 *   a: (number | undefined)
 *   b: (number | undefined)
 * }} object with properties:
 * - point: {[number, number]|undefined} one 2D point or undefined
 * - a: {number|undefined} the intersection parameter along the first line
 * - b: {number|undefined} the intersection parameter along the second line
*/
export const intersectLineLine = (
	a,
	b,
	aDomain = includeL,
	bDomain = includeL,
	epsilon = EPSILON,
) => {
	// a normalized determinant gives consistent values across all epsilon ranges
	const det_norm = cross2(normalize2(a.vector), normalize2(b.vector));
	// lines are parallel
	if (Math.abs(det_norm) < epsilon) {
		return { a: undefined, b: undefined, point: undefined };
	}
	const determinant0 = cross2(a.vector, b.vector);
	const determinant1 = -determinant0;
	/** @type {[number, number]} */
	const a2b = [b.origin[0] - a.origin[0], b.origin[1] - a.origin[1]];
	/** @type {[number, number]} */
	const b2a = [-a2b[0], -a2b[1]];
	const t0 = cross2(a2b, b.vector) / determinant0;
	const t1 = cross2(b2a, a.vector) / determinant1;
	if (aDomain(t0, epsilon / magnitude2(a.vector))
		&& bDomain(t1, epsilon / magnitude2(b.vector))) {
		return { a: t0, b: t1, point: add2(a.origin, scale2(a.vector, t0)) };
	}
	return { a: undefined, b: undefined, point: undefined };
};

// export const intersectCircleLine = (
// 	circle,
// 	line,
// 	_ = include,
// 	lineDomain = includeL,
// 	epsilon = EPSILON,
// ) => {
// 	const magSq = line.vector[0] ** 2 + line.vector[1] ** 2;
// 	const mag = Math.sqrt(magSq);
// 	const norm = mag === 0 ? line.vector : scale2(line.vector, 1 / mag);
// 	const rot90 = rotate90(norm);
// 	const bvec = subtract2(line.origin, circle.origin);
// 	const det = cross2(bvec, norm);
// 	if (Math.abs(det) > circle.radius + epsilon) { return undefined; }
// 	const side = Math.sqrt((circle.radius ** 2) - (det ** 2));
// 	/** @param {number} s @param {number} i */
// 	const f = (s, i) => circle.origin[i] - rot90[i] * det + norm[i] * s;
// 	const isDegenerate = Math.abs(circle.radius - Math.abs(det)) < epsilon;
// 	/** @type {[number, number][]} */
// 	const results = isDegenerate
// 		? [side].map(s => s.map(f)) // tangent to circle
// 		: [-side, side].map(s => s.map(f));
// 	// ? [side].map((s, i) => [f(s, i), f(s, i)]) // tangent to circle
// 	// : [-side, side].map((s, i) => [f(s, i), f(s, i)]);
// 	const ts = results
// 		.map(res => res.map((n, i) => n - line.origin[i]))
// 		.map(v => v[0] * line.vector[0] + v[1] * line.vector[1])
// 		.map(d => d / magSq);
// 	return results.filter((__, i) => lineDomain(ts[i], epsilon));
// };
/**
 * @description Calculate the intersection of a circle and a line;
 * the line can be a line, ray, or segment.
 * @param {Circle} circle a circle in "radius" "origin" form
 * @param {VecLine2} line a line in "vector" "origin" form
 * @param {Function} [_=include] the inclusivity of
 * the circle boundary (currently not used).
 * @param {Function} [lineDomain=includeL] set the line/ray/segment
 * and inclusive/exclusive
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {[number, number][]} a list of 2D points
 */
export const intersectCircleLine = (
	circle,
	line,
	_ = include,
	lineDomain = includeL,
	epsilon = EPSILON,
) => {
	const magSq = line.vector[0] ** 2 + line.vector[1] ** 2;
	const mag = Math.sqrt(magSq);
	const norm = mag === 0 ? line.vector : scale2(line.vector, 1 / mag);
	const rot90 = rotate90(norm);
	const bvec = subtract2(line.origin, circle.origin);
	const det = cross2(bvec, norm);
	if (Math.abs(det) > circle.radius + epsilon) { return undefined; }
	const side = Math.sqrt((circle.radius ** 2) - (det ** 2));
	const f = (s, i) => circle.origin[i] - rot90[i] * det + norm[i] * s;
	/** @type {[number, number][]} */
	const results = Math.abs(circle.radius - Math.abs(det)) < epsilon
		? [side].map((s) => [f(s, 0), f(s, 1)]) // tangent to circle
		: [-side, side].map((s) => [f(s, 0), f(s, 1)]);
	const ts = results.map(res => res.map((n, i) => n - line.origin[i]))
		.map(v => v[0] * line.vector[0] + line.vector[1] * v[1])
		.map(d => d / magSq);
	return results.filter((_, i) => lineDomain(ts[i], epsilon));
};
