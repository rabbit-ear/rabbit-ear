import { expect, test } from "vitest";
import ear from "../src/index.js";

test("projectPointOnPlane - Point projected onto XY plane", () => {
	const point = [3, 4, 5];
	const vector = [0, 0, 1];
	const origin = [0, 0, 0];
	const result = ear.math.projectPointOnPlane(point, vector, origin);
	// Expected result is the point projected onto the XY plane
	expect(result).toMatchObject([3, 4, 0]);
});

test("projectPointOnPlane - Point projected onto XZ plane", () => {
	const point = [3, 4, 5];
	const vector = [0, 1, 0];
	const origin = [0, 0, 0];
	const result = ear.math.projectPointOnPlane(point, vector, origin);
	// Expected result is the point projected onto the XZ plane
	expect(result).toMatchObject([3, 0, 5]);
});

test("projectPointOnPlane - Point projected onto YZ plane", () => {
	const point = [3, 4, 5];
	const vector = [1, 0, 0];
	const origin = [0, 0, 0];
	const result = ear.math.projectPointOnPlane(point, vector, origin);
	// Expected result is the point projected onto the YZ plane
	expect(result).toMatchObject([0, 4, 5]);
});

test("projectPointOnPlane - Point projected onto arbitrary plane", () => {
	const point = [3, 4, 5];
	const vector = [1, 1, 1];
	const origin = [1, 2, 3];
	const result = ear.math.projectPointOnPlane(point, vector, origin);
	// Expected result is the point projected onto the arbitrary plane
	expect(result[0]).toBeCloseTo(1);
	expect(result[1]).toBeCloseTo(2);
	expect(result[2]).toBeCloseTo(3);
});

test("projectPointOnPlane - Point and plane on same line", () => {
	const point = [3, 4, 5];
	const vector = [1, 0, 0];
	const origin = [3, 4, 5];
	const result = ear.math.projectPointOnPlane(point, vector, origin);
	// Expected result is the same point since it's already on the plane
	expect(result).toMatchObject([3, 4, 5]);
});

test("projectPointOnPlane - Point projected onto a plane passing through origin", () => {
	const point = [3, 4, 5];
	const vector = [1, 1, 1];
	const origin = [0, 0, 0];
	// Call the function to project the point onto the plane
	const result = ear.math.projectPointOnPlane(point, vector, origin);
	// Check if the result matches the expected projection
	expect(result[0]).toBeCloseTo(-1);
	expect(result[1]).toBeCloseTo(0);
	expect(result[2]).toBeCloseTo(1);
});

test("projectPointOnPlane - Point projected onto a plane with non-zero origin", () => {
	const point = [3, 4, 5];
	const vector = [1, 1, 1];
	const origin = [1, 2, 3];
	// Call the function to project the point onto the plane
	const result = ear.math.projectPointOnPlane(point, vector, origin);
	// Check if the result matches the expected projection
	expect(result[0]).toBeCloseTo(1);
	expect(result[1]).toBeCloseTo(2);
	expect(result[2]).toBeCloseTo(3);
});

test("projectPointOnPlane - Point projected onto a vertical plane", () => {
	const point = [3, 4, 5];
	const vector = [0, 1, 0];
	const origin = [0, 0, 0];
	// Call the function to project the point onto the plane
	const result = ear.math.projectPointOnPlane(point, vector, origin);
	// Check if the result matches the expected projection
	expect(result).toEqual([3, 0, 5]);
});

test("projectPointOnPlane - Point projected onto a horizontal plane", () => {
	const point = [3, 4, 5];
	const vector = [1, 0, 0];
	const origin = [0, 0, 0];
	// Call the function to project the point onto the plane
	const result = ear.math.projectPointOnPlane(point, vector, origin);
	// Check if the result matches the expected projection
	expect(result).toEqual([0, 4, 5]);
});

test("projectPointOnPlane - Point projected onto a plane with negative coordinates", () => {
	const point = [-3, -4, -5];
	const vector = [1, 1, 1];
	const origin = [0, 0, 0];
	// Call the function to project the point onto the plane
	const result = ear.math.projectPointOnPlane(point, vector, origin);
	// Check if the result matches the expected projection
	expect(result[0]).toBeCloseTo(1);
	expect(result[1]).toBeCloseTo(0);
	expect(result[2]).toBeCloseTo(-1);
});

test("projectPointOnPlane - Point with very large coordinates", () => {
	const point = [0, 0, Number.MAX_VALUE];
	const vector = [0, 0, 1];
	const origin = [0, 0, 0];
	// Call the function to project the point onto the plane
	const result = ear.math.projectPointOnPlane(point, vector, origin);
	// Check if the result matches the expected projection
	expect(result[0]).toBeCloseTo(0);
	expect(result[1]).toBeCloseTo(0);
	expect(result[2]).toBeCloseTo(0);
});

test("projectPointOnPlane - Point with large coordinates", () => {
	const point = [0, 1e10, 1e10];
	const vector = [0, 1, 1];
	const origin = [0, 0, 0];
	// Call the function to project the point onto the plane
	const result = ear.math.projectPointOnPlane(point, vector, origin);
	// Check if the result matches the expected projection
	expect(result[0]).toBeCloseTo(0);
	expect(result[1]).toBeCloseTo(0);
	expect(result[2]).toBeCloseTo(0);
});

test("projectPointOnPlane - Point with large coordinates", () => {
	const point = [1e10, 1e10, 1e10];
	const vector = [1, 1, 1];
	const origin = [0, 0, 0];
	// Call the function to project the point onto the plane
	const result = ear.math.projectPointOnPlane(point, vector, origin);
	// Check if the result matches the expected projection
	expect(result[0]).toBeCloseTo(0);
	expect(result[1]).toBeCloseTo(0);
	expect(result[2]).toBeCloseTo(0);
});

test("projectPointOnPlane - Point with very small coordinates", () => {
	const point = [Number.MIN_VALUE, Number.MIN_VALUE, Number.MIN_VALUE];
	const vector = [1, 1, 1];
	const origin = [0, 0, 0];
	// Call the function to project the point onto the plane
	const result = ear.math.projectPointOnPlane(point, vector, origin);
	// Check if the result matches the expected projection
	expect(result[0]).toBeCloseTo(0);
	expect(result[1]).toBeCloseTo(0);
	expect(result[2]).toBeCloseTo(0);
});
