import { expect, test } from "vitest";
import ear from "../src/index.js";

test("ear.math.polynomialSolver - Linear equation (degree 1)", () => {
	// Coefficients for a linear equation: y = 2x + 3
	const result = ear.math.polynomialSolver([3, 2]);
	expect(result).toEqual([-1.5]);
});

test("ear.math.polynomialSolver - Quadratic equation (degree 2)", () => {
	// Coefficients for a quadratic equation: y = x^2 - 4x + 4
	const result = ear.math.polynomialSolver([4, -4, 1]);
	expect(result).toEqual([2]);
});

test("ear.math.polynomialSolver - Quadratic equation (degree 2)", () => {
	// Coefficients for a quadratic equation: y = x^2 - 3x + 2
	const result = ear.math.polynomialSolver([2, -3, 1]);
	expect(result).toEqual([2, 1]);
});

test("ear.math.polynomialSolver - Quadratic equation (degree 2)", () => {
	// Coefficients for a quadratic equation: y = -4x^2 - 4x + 3
	const result = ear.math.polynomialSolver([3, -4, -4]);
	expect(result).toEqual([-1.5, 0.5]);
});

test("ear.math.polynomialSolver - Cubic equation (degree 3)", () => {
	// Coefficients for a cubic equation: y = 2x^3 - 3x^2 + x - 5
	const result = ear.math.polynomialSolver([-5, 1, -3, 2]);
	expect(result[0]).toBeCloseTo(1.9185693343119692);
});

test("ear.math.polynomialSolver - Cubic equation (degree 3)", () => {
	// Coefficients for a cubic equation: y = 2x^3 - 2x^2 + 4x - 4
	const result = ear.math.polynomialSolver([-4, 4, -2, 2]);
	expect(result[0]).toBeCloseTo(1);
});

test("ear.math.polynomialSolver - Cubic equation (degree 3)", () => {
	// Coefficients for a cubic equation: y = 4x^3 - 4x^2 - 10x - 4
	const result = ear.math.polynomialSolver([4, -10, -4, 4]);
	expect(result[0]).toBeCloseTo(2);
	expect(result[1]).toBeCloseTo(-1.3660254037844386);
	expect(result[2]).toBeCloseTo(0.3660254037844386);
});

test("ear.math.polynomialSolver - Constant equation (degree 0)", () => {
	// Coefficients for a constant equation: y = 5
	const result = ear.math.polynomialSolver([5]);
	expect(result).toMatchObject([]);
});

test("ear.math.polynomialSolver - Empty coefficient array", () => {
	// Empty coefficient array
	const result = ear.math.polynomialSolver([]);
	expect(result).toMatchObject([]);
});
