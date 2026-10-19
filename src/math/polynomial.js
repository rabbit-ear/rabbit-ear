/**
 * Rabbit Ear (c) Kraft
 */
import { EPSILON } from "./constant.js";

/**
 * @description perform a cube root but preserve the sign of the input
 * @param {number} n
 * @returns {number}
 */
const cubeRootSigned = (n) => (n < 0 ? -((-n) ** (1 / 3)) : n ** (1 / 3));

/**
 * @description Refine a root of the monic cubic x^3 + a2*x^2 + a1*x + a0
 * with a few iterations of Newton's method. Cardano's formula loses
 * precision (especially near double roots).
 * @param {number} a0 the constant coefficient
 * @param {number} a1 the x coefficient
 * @param {number} a2 the x^2 coefficient
 * @param {number} root an approximate root
 * @returns {number} the refined root
 */
const polishCubicRoot = (a0, a1, a2, root) => {
	let x = root;
	let f = ((x + a2) * x + a1) * x + a0;
	for (let i = 0; i < 4; i += 1) {
		const df = (3 * x + 2 * a2) * x + a1;
		if (Math.abs(df) < 1e-12) {
			break;
		}
		// near a double root the derivative is near 0 and a Newton step
		// can overshoot, only accept a step if it brings us closer to 0.
		const next = x - f / df;
		const nextF = ((next + a2) * next + a1) * next + a0;
		if (Math.abs(nextF) >= Math.abs(f)) {
			break;
		}
		x = next;
		f = nextF;
	}
	return x;
};

/**
 * @description This polynomial solver will solve anything polynomial up
 * to a degree 3 (cubic, via Cardano's formula). Polynomial is inputted via an
 * array of its coefficients, which includes the constant, in order from
 * lowest to highest. Index 0 is the constant, index 1 is for x, index 2 is
 * for x^2, index 3 is for x^3. As many items as exists in the polynomial.
 * To solve a quadratic: supply [c, b, a], where a is the x^2 coeff.
 * To solve a cubic: supply [d, c, b, a], where a is the x^3 coeff.
 * @param {number[]} coefficients a list of coefficients to the polynomial
 * @returns {number[]} a solution array with either zero, one, two, or three numbers.
 */
export const polynomialSolver = (coefficients) => {
	// trim any leading (highest-degree) coefficients which are near 0,
	// otherwise we would divide by 0. this reduces the degree of the polynomial.
	let degree = coefficients.length;
	while (degree > 0 && Math.abs(coefficients[degree - 1]) < EPSILON) {
		degree -= 1;
	}
	const [a, b, c, d] = coefficients;

	// the degree of the polynomial is the length of the array - 1,
	// because the constant is included as the first element.
	switch (degree) {
		case 2:
			return [-a / b];
		case 3: {
			// quadratic
			const discriminant = b ** 2 - 4 * a * c;

			// no solution
			if (discriminant < -EPSILON) {
				return [];
			}

			// one solution
			const q1 = -b / (2 * c);
			if (discriminant < EPSILON) {
				return [q1];
			}

			// two solutions
			const q2 = Math.sqrt(discriminant) / (2 * c);
			return [q1 + q2, q1 - q2];
		}
		case 4: {
			// cubic: Cardano's formula
			const a2 = c / d;
			const a1 = b / d;
			const a0 = a / d;
			const q = (3 * a1 - a2 ** 2) / 9;
			const r = (9 * a2 * a1 - 27 * a0 - 2 * a2 ** 3) / 54;
			const d0 = q ** 3 + r ** 2;
			const u = -a2 / 3;

			// the discriminant is built from cubes and squares, so the tolerance
			// for "zero" must scale with these terms.
			const tolerance = 1e-10 * Math.max(1, Math.abs(q) ** 3, r ** 2);

			// one solution, the discriminant is clearly positive.
			if (d0 > tolerance) {
				const sqrt_d0 = Math.sqrt(d0);
				const s = cubeRootSigned(r + sqrt_d0);
				const t = cubeRootSigned(r - sqrt_d0);
				return [polishCubicRoot(a0, a1, a2, u + s + t)];
			}

			// three solutions, some of which may be repeated (double, triple root).
			// floating point error can make d0 a tiny positive number in the case
			// of a repeated root, clamp it to 0. (an earlier approach, testing
			// for a double root with an epsilon, merged distinct close roots.)
			const sqrt_d0 = Math.sqrt(Math.max(0, -d0));
			const phi = Math.atan2(sqrt_d0, r) / 3;
			const r_s = (r ** 2 - Math.min(0, d0)) ** (1 / 6);
			const s_r = r_s * Math.cos(phi);
			const s_i = r_s * Math.sin(phi);
			const roots = [
				polishCubicRoot(a0, a1, a2, u + 2 * s_r),
				polishCubicRoot(a0, a1, a2, u - s_r - Math.sqrt(3) * s_i),
				polishCubicRoot(a0, a1, a2, u - s_r + Math.sqrt(3) * s_i),
			];
			// a repeated root will appear more than once, remove the duplicates.
			return roots.filter(
				(root, i) =>
					!roots
						.slice(0, i)
						.some(
							(other) => Math.abs(other - root) < EPSILON * Math.max(1, Math.abs(root)),
						),
			);
		}
		default:
			return [];
	}
};
