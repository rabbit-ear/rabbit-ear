import { EPSILON } from "./constant.js";

// cube root preserve sign
const cubrt = n => (n < 0 ? -((-n) ** (1 / 3)) : (n ** (1 / 3)));

// Robert Lang's cubic solver from Reference Finder
// https://langorigami.com/article/referencefinder/
export const cubicSolver = (degree, a, b, c, d) => {
	switch (degree) {
	case 1: return [-d / c];
	case 2: {
		// quadratic
		const discriminant = (c ** 2) - (4 * b * d);
		// no solution
		if (discriminant < -EPSILON) { return []; }
		// one solution
		const q1 = -c / (2 * b);
		if (discriminant < EPSILON) { return [q1]; }
		// two solutions
		const q2 = Math.sqrt(discriminant) / (2 * b);
		return [q1 + q2, q1 - q2];
	}
	case 3: {
		// cubic
		// Cardano's formula. convert to depressed cubic
		const a2 = b / a;
		const a1 = c / a;
		const a0 = d / a;
		const q = (3 * a1 - (a2 ** 2)) / 9;
		const r = (9 * a2 * a1 - 27 * a0 - 2 * (a2 ** 3)) / 54;
		const d0 = (q ** 3) + (r ** 2);
		const u = -a2 / 3;
		// one solution
		if (d0 > 0) {
			const sqrt_d0 = Math.sqrt(d0);
			const s = cubrt(r + sqrt_d0);
			const t = cubrt(r - sqrt_d0);
			return [u + s + t];
		}
		// two solutions
		if (Math.abs(d0) < EPSILON) {
			const s = (r ** (1 / 3));
			// const S = cubrt(R);
			// instead of checking if S is NaN, check if R was negative
			// if (isNaN(S)) { break; }
			if (r < 0) { return []; }
			return [u + 2 * s, u - s];
		}
		// three solutions
		const sqrt_d0 = Math.sqrt(-d0);
		const phi = Math.atan2(sqrt_d0, r) / 3;
		const r_s = ((r ** 2) - d0) ** (1 / 6);
		const s_r = r_s * Math.cos(phi);
		const s_i = r_s * Math.sin(phi);
		return [
			u + 2 * s_r,
			u - s_r - Math.sqrt(3) * s_i,
			u - s_r + Math.sqrt(3) * s_i,
		];
	}
	default: return [];
	}
};
