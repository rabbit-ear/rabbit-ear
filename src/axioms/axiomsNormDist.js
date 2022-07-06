/**
 * Rabbit Ear (c) Kraft
 * this section contains code from Robert Lang's Reference Finder
 */
import math from "../math";
/*           _                       _              _
						(_)                     (_)            (_)
	 ___  _ __ _  __ _  __ _ _ __ ___  _    __ ___  ___  ___  _ __ ___  ___
	/ _ \| '__| |/ _` |/ _` | '_ ` _ \| |  / _` \ \/ / |/ _ \| '_ ` _ \/ __|
 | (_) | |  | | (_| | (_| | | | | | | | | (_| |>  <| | (_) | | | | | \__ \
	\___/|_|  |_|\__, |\__,_|_| |_| |_|_|  \__,_/_/\_\_|\___/|_| |_| |_|___/
								__/ |
							 |___/
*/
const intersectionUD = (line1, line2) => {
	const det = math.core.cross2(line1.normal, line2.normal);
	if (Math.abs(det) < math.core.EPSILON) { return undefined; }
	const x = line1.distance * line2.normal[1] - line2.distance * line1.normal[1];
	const y = line2.distance * line1.normal[0] - line1.distance * line2.normal[0];
	return [x / det, y / det];
};
/**
 * @description origami axiom 1: form a line that passes between the given points
 * @param {number[]} point1 one 2D point
 * @param {number[]} point2 one 2D point
 * @returns {UniqueLine} the line in {normal, distance} form
 * @linkcode Origami ./src/axioms/axiomsNormDist.js 27
 */
export const normalAxiom1 = (point1, point2) => {
	const normal = math.core.normalize2(math.core.rotate90(math.core.subtract2(point2, point1)));
	return {
		normal,
		distance: math.core.dot2(math.core.add2(point1, point2), normal) / 2.0,
	};
};
/**
 * @description origami axiom 2: form a perpendicular bisector between the given points
 * @param {number[]} point1 one 2D point
 * @param {number[]} point2 one 2D point
 * @returns {UniqueLine} the line in {normal, distance} form
 * @linkcode Origami ./src/axioms/axiomsNormDist.js 41
 */
export const normalAxiom2 = (point1, point2) => {
	const normal = math.core.normalize2(math.core.subtract2(point2, point1));
	return {
		normal,
		distance: math.core.dot2(math.core.add2(point1, point2), normal) / 2.0,
	};
};
/**
 * @description origami axiom 3: form two lines that make the two angular bisectors between
 * two input lines, and in the case of parallel inputs only one solution will be given
 * @param {UniqueLine} line1 one 2D line in {vector, origin} form
 * @param {UniqueLine} line2 one 2D line in {vector, origin} form
 * @returns {UniqueLine[]} an array of lines in {normal, distance} form
 * @linkcode Origami ./src/axioms/axiomsNormDist.js 56
 */
export const normalAxiom3 = (line1, line2) => {
	// if no intersect, lines are parallel, only one solution exists
	const intersect = intersectionUD(line1, line2);
	return intersect === undefined
		? [{
			normal: line1.normal,
			distance: (line1.distance + line2.distance * math.core.dot2(line1.normal, line2.normal)) / 2,
		}]
		: [math.core.add2, math.core.subtract2]
			.map(f => math.core.normalize2(f(line1.normal, line2.normal)))
			.map(normal => ({ normal, distance: math.core.dot2(intersect, normal) }));
};
/**
 * @description origami axiom 4: form a line perpendicular to a given line that
 * passes through a point.
 * @param {UniqueLine} line one 2D line in {normal, distance} form
 * @param {number[]} point one 2D point
 * @returns {UniqueLine} the line in {normal, distance} form
 * @linkcode Origami ./src/axioms/axiomsNormDist.js 76
 */
export const normalAxiom4 = (line, point) => {
	const normal = math.core.rotate90(line.normal);
	const distance = math.core.dot2(point, normal);
	return { normal, distance };
};
/**
 * @description origami axiom 5: form up to two lines that pass through a point that also
 * brings another point onto a given line
 * @param {UniqueLine} line one 2D line in {normal, distance} form
 * @param {number[]} point one 2D point, the point that the line(s) pass through
 * @param {number[]} point one 2D point, the point that is being brought onto the line
 * @returns {UniqueLine[]} an array of lines in {normal, distance} form
 * @linkcode Origami ./src/axioms/axiomsNormDist.js 90
 */
export const normalAxiom5 = (line, point1, point2) => {
	const p1base = math.core.dot2(point1, line.normal);
	const a = line.distance - p1base;
	const c = math.core.distance2(point1, point2);
	if (a > c) { return []; }
	const b = Math.sqrt(c * c - a * a);
	const a_vec = math.core.scale2(line.normal, a);
	const base_center = math.core.add2(point1, a_vec);
	const base_vector = math.core.scale2(math.core.rotate90(line.normal), b);
	// if b is near 0 we have one solution, otherwise two
	const mirrors = b < math.core.EPSILON
		? [base_center]
		: [math.core.add2(base_center, base_vector), math.core.subtract2(base_center, base_vector)];
	return mirrors
		.map(pt => math.core.normalize2(math.core.subtract2(point2, pt)))
		.map(normal => ({ normal, distance: math.core.dot2(point1, normal) }));
};

// cube root preserve sign
const cubrt = n => (n < 0
	? -Math.pow(-n, 1 / 3)
	: Math.pow(n, 1 / 3));

// Robert Lang's cubic solver from Reference Finder
// https://langorigami.com/article/referencefinder/
const polynomial = (degree, a, b, c, d) => {
	switch (degree) {
	case 1: return [-d / c];
	case 2: {
		// quadratic
		const discriminant = Math.pow(c, 2.0) - (4.0 * b * d);
		// no solution
		if (discriminant < -math.core.EPSILON) { return []; }
		// one solution
		const q1 = -c / (2.0 * b);
		if (discriminant < math.core.EPSILON) { return [q1]; }
		// two solutions
		const q2 = Math.sqrt(discriminant) / (2.0 * b);
		return [q1 + q2, q1 - q2];
	}
	case 3: {
		// cubic
		// Cardano's formula. convert to depressed cubic
		const a2 = b / a;
		const a1 = c / a;
		const a0 = d / a;
		const q = (3.0 * a1 - Math.pow(a2, 2.0)) / 9.0;
		const r = (9.0 * a2 * a1 - 27.0 * a0 - 2.0 * Math.pow(a2, 3.0)) / 54.0;
		const d0 = Math.pow(q, 3.0) + Math.pow(r, 2.0);
		const u = -a2 / 3.0;
		// one solution
		if (d0 > 0.0) {
			const sqrt_d0 = Math.sqrt(d0);
			const s = cubrt(r + sqrt_d0);
			const t = cubrt(r - sqrt_d0);
			return [u + s + t];
		}
		// two solutions
		if (Math.abs(d0) < math.core.EPSILON) {
			const s = Math.pow(r, 1.0 / 3.0);
			// const S = cubrt(R);
			// instead of checking if S is NaN, check if R was negative
			// if (isNaN(S)) { break; }
			if (r < 0.0) { return []; }
			return [u + 2.0 * s, u - s];
		}
		// three solutions
		const sqrt_d0 = Math.sqrt(-d0);
		const phi = Math.atan2(sqrt_d0, r) / 3.0;
		const r_s = Math.pow((Math.pow(r, 2.0) - d0), 1.0 / 6.0);
		const s_r = r_s * Math.cos(phi);
		const s_i = r_s * Math.sin(phi);
		return [
			u + 2.0 * s_r,
			u - s_r - Math.sqrt(3.0) * s_i,
			u - s_r + Math.sqrt(3.0) * s_i,
		];
	}
	default: return [];
	}
};
/**
 * @description origami axiom 6: form up to three lines that are made by bringing
 * a point to a line and a second point to a second line.
 * @param {UniqueLine} line1 one 2D line in {normal, distance} form
 * @param {UniqueLine} line2 one 2D line in {normal, distance} form
 * @param {number[]} point1 the point to bring to the first line
 * @param {number[]} point2 the point to bring to the second line
 * @returns {UniqueLine[]} an array of lines in {normal, distance} form
 * @linkcode Origami ./src/axioms/axiomsNormDist.js 181
 */
export const normalAxiom6 = (line1, line2, point1, point2) => {
	// at least pointA must not be on lineA
	// for some reason this epsilon is much higher than 1e-6
	if (Math.abs(1.0 - (math.core.dot2(line1.normal, point1) / line1.distance)) < 0.02) { return []; }
	// line vec is the first line's vector, along the line, not the normal
	const line_vec = math.core.rotate90(line1.normal);
	const vec1 = math.core.subtract2(
		math.core.add2(point1, math.core.scale2(line1.normal, line1.distance)),
		math.core.scale2(point2, 2.0),
	);
	const vec2 = math.core.subtract2(math.core.scale2(line1.normal, line1.distance), point1);
	const c1 = math.core.dot2(point2, line2.normal) - line2.distance;
	const c2 = 2.0 * math.core.dot2(vec2, line_vec);
	const c3 = math.core.dot2(vec2, vec2);
	const c4 = math.core.dot2(math.core.add2(vec1, vec2), line_vec);
	const c5 = math.core.dot2(vec1, vec2);
	const c6 = math.core.dot2(line_vec, line2.normal);
	const c7 = math.core.dot2(vec2, line2.normal);
	const a = c6;
	const b = c1 + c4 * c6 + c7;
	const c = c1 * c2 + c5 * c6 + c4 * c7;
	const d = c1 * c3 + c5 * c7;
	// construct the solution from the root, the solution being the parameter
	// point reflected across the fold line, lying on the parameter line
	let polynomial_degree = 0;
	if (Math.abs(c) > math.core.EPSILON) { polynomial_degree = 1; }
	if (Math.abs(b) > math.core.EPSILON) { polynomial_degree = 2; }
	if (Math.abs(a) > math.core.EPSILON) { polynomial_degree = 3; }
	return polynomial(polynomial_degree, a, b, c, d)
		.map(n => math.core.add2(
			math.core.scale2(line1.normal, line1.distance),
			math.core.scale2(line_vec, n),
		))
		.map(p => ({ p, normal: math.core.normalize2(math.core.subtract2(p, point1)) }))
		.map(el => ({
			normal: el.normal,
			distance: math.core.dot2(el.normal, math.core.midpoint2(el.p, point1)),
		}));
};
/**
 * @description origami axiom 7: form a line by bringing a point onto a given line
 * while being perpendicular to another given line.
 * @param {UniqueLine} line1 one 2D line in {normal, distance} form,
 * the line the point will be brought onto.
 * @param {UniqueLine} line2 one 2D line in {normal, distance} form,
 * the line which the perpendicular will be based off.
 * @param {number[]} point the point to bring onto the line
 * @returns {UniqueLine | undefined} the line in {normal, distance} form
 * or undefined if the given lines are parallel
 * @linkcode Origami ./src/axioms/axiomsNormDist.js 232
 */
export const normalAxiom7 = (line1, line2, point) => {
	const normal = math.core.rotate90(line1.normal);
	const norm_norm = math.core.dot2(normal, line2.normal);
	// if norm_norm is close to 0, the two input lines are parallel, no solution
	if (Math.abs(norm_norm) < math.core.EPSILON) { return undefined; }
	const a = math.core.dot2(point, normal);
	const b = math.core.dot2(point, line2.normal);
	const distance = (line2.distance + 2.0 * a * norm_norm - b) / (2.0 * norm_norm);
	return { normal, distance };
};
