/**
 * Math (c) Kraft
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
 * @param {VecLine} a line object with "vector" and "origin"
 * @param {VecLine} b line object with "vector" and "origin"
 * @param {function} [aDomain=includeL] the domain of the first line
 * @param {function} [bDomain=includeL] the domain of the second line
 * @param {number} [epsilon=1e-6] optional epsilon
 * @returns {{
 *   point: (number[] | undefined)
 *   a: (number | undefined)
 *   b: (number | undefined)
 * }} object with properties:
 * - point: {number[]|undefined} one 2D point or undefined
 * - a: {number|undefined} the intersection parameter along the first line
 * - b: {number|undefined} the intersection parameter along the second line
 * @linkcode Math ./src/intersect/intersect.js 39
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
	const a2b = [b.origin[0] - a.origin[0], b.origin[1] - a.origin[1]];
	const b2a = [-a2b[0], -a2b[1]];
	const t0 = cross2(a2b, b.vector) / determinant0;
	const t1 = cross2(b2a, a.vector) / determinant1;
	if (aDomain(t0, epsilon / magnitude2(a.vector))
		&& bDomain(t1, epsilon / magnitude2(b.vector))) {
		return { a: t0, b: t1, point: add2(a.origin, scale2(a.vector, t0)) };
	}
	return { a: undefined, b: undefined, point: undefined };
};

/**
 * @description Calculate the intersection of a circle and a line;
 * the line can be a line, ray, or segment.
 * @param {Circle} circle a circle in "radius" "origin" form
 * @param {VecLine} line a line in "vector" "origin" form
 * @param {function} [circleDomain=include] the inclusivity of
 * the circle boundary (currently not used).
 * @param {function} [lineFunc=includeL] set the line/ray/segment
 * and inclusive/exclusive
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @linkcode Math ./src/intersect/intersect.js 74
 */
export const intersectCircleLine = (
	circle,
	line,
	circleDomain = include,
	lineDomain = includeL,
	epsilon = EPSILON,
) => {
	const magSq = line.vector[0] ** 2 + line.vector[1] ** 2;
	const mag = Math.sqrt(magSq);
	const norm = mag === 0 ? line.vector : line.vector.map(c => c / mag);
	const rot90 = rotate90(norm);
	const bvec = subtract2(line.origin, circle.origin);
	const det = cross2(bvec, norm);
	if (Math.abs(det) > circle.radius + epsilon) { return undefined; }
	const side = Math.sqrt((circle.radius ** 2) - (det ** 2));
	const f = (s, i) => circle.origin[i] - rot90[i] * det + norm[i] * s;
	const results = Math.abs(circle.radius - Math.abs(det)) < epsilon
		? [side].map((s) => [s, s].map(f)) // tangent to circle
		: [-side, side].map((s) => [s, s].map(f));
	const ts = results.map(res => res.map((n, i) => n - line.origin[i]))
		.map(v => v[0] * line.vector[0] + line.vector[1] * v[1])
		.map(d => d / magSq);
	return results.filter((_, i) => lineDomain(ts[i], epsilon));
};
