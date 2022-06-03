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
const intersection_ud = (line1, line2) => {
	const det = math.core.cross2(line1.u, line2.u);
	if (Math.abs(det) < math.core.EPSILON) { return undefined; }
	const x = line1.d * line2.u[1] - line2.d * line1.u[1];
	const y = line2.d * line1.u[0] - line1.d * line2.u[0];
	return [x / det, y / det];
};
/**
 * @description origami axiom 1: form a line that passes between the given points
 * @param {number[]} point1 one 2D point
 * @param {number[]} point2 one 2D point
 * @returns {{u: number[], d: number}} the line in {u, d} form
 */
export const axiom1ud = (point1, point2) => {
	const u = math.core.normalize2(math.core.rotate90(math.core.subtract2(point2, point1)));
	return { u, d: math.core.dot2(math.core.add2(point1, point2), u) / 2.0 };
};
/**
 * @description origami axiom 2: form a perpendicular bisector between the given points
 * @param {number[]} point1 one 2D point
 * @param {number[]} point2 one 2D point
 * @returns {{u: number[], d: number}} the line in {u, d} form
 */
export const axiom2ud = (point1, point2) => {
	const u = math.core.normalize2(math.core.subtract2(point2, point1));
	return { u, d: math.core.dot2(math.core.add2(point1, point2), u) / 2.0 };
};
/**
 * @description origami axiom 3: form two lines that make the two angular bisectors between
 * two input lines, and in the case of parallel inputs only one solution will be given
 * @param {{u: number[], d: number}} line1 one 2D line in {vector, origin} form
 * @param {{u: number[], d: number}} line2 one 2D line in {vector, origin} form
 * @returns {{u: number[], d: number}[]} an array of lines in {u, d} form
 */
export const axiom3ud = (line1, line2) => {
	// if no intersect, lines are parallel, only one solution exists
	const intersect = intersection_ud(line1, line2);
	return intersect === undefined
		? [{ u: line1.u, d: (line1.d + line2.d * math.core.dot2(line1.u, line2.u)) / 2.0 }]
		: [math.core.add2, math.core.subtract2]
			.map(f => math.core.normalize2(f(line1.u, line2.u)))
			.map(u => ({ u, d: math.core.dot2(intersect, u) }));
};
/**
 * @description origami axiom 4: form a line perpendicular to a given line that
 * passes through a point.
 * @param {{u: number[], d: number}} line one 2D line in {u, d} form
 * @param {number[]} point one 2D point
 * @returns {{u: number[], d: number}} the line in {u, d} form
 */
 export const axiom4ud = (line, point) => {
	const u = math.core.rotate90(line.u);
	const d = math.core.dot2(point, u);
	return {u, d};
};
/**
 * @description origami axiom 5: form up to two lines that pass through a point that also
 * brings another point onto a given line
 * @param {{u: number[], d: number}} line one 2D line in {u, d} form
 * @param {number[]} point one 2D point, the point that the line(s) pass through
 * @param {number[]} point one 2D point, the point that is being brought onto the line
 * @returns {{u: number[], d: number}[]} an array of lines in {u, d} form
 */
export const axiom5ud = (line, point1, point2) => {
	const p1base = math.core.dot2(point1, line.u);
	const a = line.d - p1base;
	const c = math.core.distance2(point1, point2);
	if (a > c) { return []; }
	const b = Math.sqrt(c * c - a * a);
	const a_vec = math.core.scale2(line.u, a);
	const base_center = math.core.add2(point1, a_vec);
	const base_vector = math.core.scale2(math.core.rotate90(line.u), b);
	// if b is near 0 we have one solution, otherwise two
	const mirrors = b < math.core.EPSILON
		? [base_center]
		: [math.core.add2(base_center, base_vector), math.core.subtract2(base_center, base_vector)];
	return mirrors
		.map(pt => math.core.normalize2(math.core.subtract2(point2, pt)))
		.map(u => ({ u, d: math.core.dot2(point1, u) }));
};

// cube root preserve sign
const cubrt = n => n < 0
	? -Math.pow(-n, 1/3)
	: Math.pow(n, 1/3);

// Robert Lang's cubic solver from Reference Finder
// https://langorigami.com/article/referencefinder/
const polynomial = (degree, a, b, c, d) => {
	switch (degree) {
		case 1: return [-d / c];
		case 2: {
			// quadratic
			let discriminant = Math.pow(c, 2.0) - (4.0 * b * d);
			// no solution
			if (discriminant < -math.core.EPSILON) { return []; }
			// one solution
			let q1 = -c / (2.0 * b);
			if (discriminant < math.core.EPSILON) { return [q1]; }
			// two solutions
			let q2 = Math.sqrt(discriminant) / (2.0 * b);
			return [q1 + q2, q1 - q2];
		}
		case 3: {
			// cubic
			// Cardano's formula. convert to depressed cubic
			let a2 = b / a;
			let a1 = c / a;
			let a0 = d / a;
			let q = (3.0 * a1 - Math.pow(a2, 2.0)) / 9.0;
			let r = (9.0 * a2 * a1 - 27.0 * a0 - 2.0 * Math.pow(a2, 3.0)) / 54.0;
			let d0 = Math.pow(q, 3.0) + Math.pow(r, 2.0);
			let u = -a2 / 3.0;
			// one solution
			if (d0 > 0.0) {
				let sqrt_d0 = Math.sqrt(d0);
				let s = cubrt(r + sqrt_d0);
				let t = cubrt(r - sqrt_d0);
				return [u + s + t];
			}
			// two solutions
			if (Math.abs(d0) < math.core.EPSILON) {
				let s = Math.pow(r, 1.0/3.0);
				// let S = cubrt(R);
				// instead of checking if S is NaN, check if R was negative
				// if (isNaN(S)) { break; }
				if (r < 0.0) { return []; }
				return [u + 2.0 * s, u - s];
			}
			// three solutions
			let sqrt_d0 = Math.sqrt(-d0);
			let phi = Math.atan2(sqrt_d0, r) / 3.0;
			let r_s = Math.pow((Math.pow(r, 2.0) - d0), 1.0/6.0);
			let s_r = r_s * Math.cos(phi);
			let s_i = r_s * Math.sin(phi);
			return [
				u + 2.0 * s_r,
				u - s_r - Math.sqrt(3.0) * s_i,
				u - s_r + Math.sqrt(3.0) * s_i
			];      
		}
		default: return [];
	}
};
/**
 * @description origami axiom 6: form up to three lines that are made by bringing
 * a point to a line and a second point to a second line.
 * @param {{u: number[], d: number}} line1 one 2D line in {u, d} form
 * @param {{u: number[], d: number}} line2 one 2D line in {u, d} form
 * @param {number[]} point1 the point to bring to the first line
 * @param {number[]} point2 the point to bring to the second line
 * @returns {{u: number[], d: number}[]} an array of lines in {u, d} form
 */
export const axiom6ud = (line1, line2, point1, point2) => {
	// at least pointA must not be on lineA
	// for some reason this epsilon is much higher than 1e-6
	if (Math.abs(1.0 - (math.core.dot2(line1.u, point1) / line1.d)) < 0.02) { return []; }
	// line vec is the first line's vector, along the line, not the normal
	const line_vec = math.core.rotate90(line1.u);
	const vec1 = math.core.subtract2(math.core.add2(point1, math.core.scale2(line1.u, line1.d)), math.core.scale2(point2, 2.0));
	const vec2 = math.core.subtract2(math.core.scale2(line1.u, line1.d), point1);
	const c1 = math.core.dot2(point2, line2.u) - line2.d;
	const c2 = 2.0 * math.core.dot2(vec2, line_vec);
	const c3 = math.core.dot2(vec2, vec2);
	const c4 = math.core.dot2(math.core.add2(vec1, vec2), line_vec);
	const c5 = math.core.dot2(vec1, vec2);
	const c6 = math.core.dot2(line_vec, line2.u);
	const c7 = math.core.dot2(vec2, line2.u);
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
		.map(n => math.core.add2(math.core.scale2(line1.u, line1.d), math.core.scale2(line_vec, n)))
		.map(p => ({ p, u: math.core.normalize2(math.core.subtract2(p, point1)) }))
		.map(el => ({ u: el.u, d: math.core.dot2(el.u, math.core.midpoint2(el.p, point1)) }));
};
/**
 * @description origami axiom 7: form a line by bringing a point onto a given line
 * while being perpendicular to another given line.
 * @param {{u: number[], d: number}} line1 one 2D line in {u, d} form,
 * the line the point will be brought onto.
 * @param {{u: number[], d: number}} line2 one 2D line in {u, d} form,
 * the line which the perpendicular will be based off.
 * @param {number[]} point the point to bring onto the line
 * @returns {{u: number[], d: number} | undefined} the line in {u, d} form
 * or undefined if the given lines are parallel
 */
export const axiom7ud = (line1, line2, point) => {
	let u = math.core.rotate90(line1.u);
	let u_u = math.core.dot2(u, line2.u);
	// if u_u is close to 0, the two input lines are parallel, no solution
	if (Math.abs(u_u) < math.core.EPSILON) { return undefined; }
	let a = math.core.dot2(point, u);
	let b = math.core.dot2(point, line2.u);
	let d = (line2.d + 2.0 * a * u_u - b) / (2.0 * u_u);
	return {u, d};
};
