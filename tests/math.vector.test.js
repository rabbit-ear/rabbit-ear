const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear");

test("arguments", () => {
	expect(ear.vector(1, 2, 3)[2]).toBe(3);
	expect(ear.vector([1, 2, 3])[2]).toBe(3);
	expect(ear.vector([[1, 2, 3]])[2]).toBe(3);
	expect(ear.vector([[], [1, 2, 3]])[2]).toBe(3);
	expect(ear.vector([[1], [2], [3]])[2]).toBe(3);
	expect(ear.vector({ x: 1, y: 2, z: 3 })[2]).toBe(3);
	expect(ear.vector([{ x: 1, y: 2, z: 3 }])[2]).toBe(3);
	expect(ear.vector([[{ x: 1, y: 2, z: 3 }]])[2]).toBe(3);
	expect(ear.vector([[], { x: 1, y: 2, z: 3 }])[2]).toBe(3);
});

// static

test("static", () => {
	expect(ear.vector.fromAngle(Math.PI).x).toBeCloseTo(-1);
	expect(ear.vector.fromAngle(Math.PI).y).toBeCloseTo(0);
	expect(ear.vector.fromAngle(Math.PI).z).toBe(undefined);
	expect(ear.vector.fromAngleDegrees(90).x).toBeCloseTo(0);
	expect(ear.vector.fromAngleDegrees(90).y).toBeCloseTo(1);
	expect(ear.vector.fromAngleDegrees(90).z).toBe(undefined);
});

// methods

test("magnitude", () => {
	const v = ear.vector(1, 2, 3).normalize();
	expect(v.magnitude()).toBe(1);
});

test("normalize", () => {
	const v = ear.vector(0).normalize();
	expect(v.magnitude()).toBe(0);
	// normalize appears so many places in these tests...
});

test("isEquivalent", () => {
	const v = ear.vector(1, 2, 3);
	expect(v.isEquivalent([1, 2, 2.99999999])).toBe(true);
	expect(v.isEquivalent([1, 2, 2.9999999])).toBe(true);
	// this is where the current epsilon is
	expect(v.isEquivalent([1, 2, 2.999999])).toBe(false);
	expect(v.isEquivalent([1, 2])).toBe(false);
	expect(v.isEquivalent([1, 2, 0])).toBe(false);
	expect(v.isEquivalent([1, 2, 3, 4])).toBe(false);
});

test("isParallel", () => {
	const v = ear.vector(1, 2, 3).normalize();
	expect(v.isParallel([-1, -2, -3])).toBe(true);
});

test("dot", () => {
	const v = ear.vector(1, 2);
	expect(v.dot([-2, 1])).toBe(0);
});

test("distanceTo", () => {
	const v = ear.vector(3, 0);
	expect(v.distanceTo([-3, 0])).toBe(6);
});

test("bisect", () => {
	expect(ear.vector(1, 0).bisect(ear.vector(0, 1)).x)
		.toBeCloseTo(Math.sqrt(2) / 2);
	expect(ear.vector(1, 0).bisect(ear.vector(0, 1)).y)
		.toBeCloseTo(Math.sqrt(2) / 2);
});

test("copy", () => {
	const v = ear.vector(1, 2, 3);
	expect(v.copy().z).toBe(3);
});

test("scale", () => {
	const v = ear.vector(2, -3);
	expect(v.scale(2).x).toBe(4);
	expect(v.scale(2).y).toBe(-6);
	expect(v.scale(-2).x).toBe(-4);
	expect(v.scale(-2).y).toBe(6);
	expect(v.scale(0).x).toBeCloseTo(0);
	expect(v.scale(0).y).toBeCloseTo(0);
});

test("cross", () => {
	const v = ear.vector(1, 2, 3).normalize();
	let w = ear.vector(3, 4).normalize();
	// [0, 0, 0.8]
	expect(0.8 - w.cross(2, 4)[2]).toBeLessThan(1e-6);
	expect(w.cross(2, -4, 5)[0]).toBe(4);
	expect(w.cross(2, -4, 5)[1]).toBe(-3);
	expect(w.cross(2, -4, 5)[2]).toBe(-4);
	expect(w.cross(2, -4)[2]).toBe(-4);
});

test("add", () => {
	const v = ear.vector(1, 2, 3);
	for (let i = 0; i < v.length; i += 1) {
		expect(v.add([-1, 2, 3])[i]).toBe([0, 4, 6][i]);
	}
	for (let i = 0; i < v.length; i += 1) {
		expect(v.add([-1, 2])[i]).toBe([0, 4, 3][i]);
	}
});

test("subtract", () => {
	const v = ear.vector(1, 2, 3);
	for (let i = 0; i < v.length; i += 1) {
		expect(v.subtract([-1, 2, 3])[i]).toBe([2, 0, 0][i]);
	}
	for (let i = 0; i < v.length; i += 1) {
		expect(v.subtract([-1, 2])[i]).toBe([2, 0, 3][i]);
	}
});

test("rotate90", () => {
	const v = ear.vector(1, 2, 3);
	expect(v.rotate90().x).toBe(-2);
	expect(v.rotate90().y).toBe(1);
	expect(v.rotate90().z).toBe(undefined);
});

test("rotate270", () => {
	const v = ear.vector(1, 2, 3);
	expect(v.rotate270().x).toBe(2);
	expect(v.rotate270().y).toBe(-1);
	expect(v.rotate270().z).toBe(undefined);
});

test("flip", () => {
	const v = ear.vector(1, 2, 3);
	expect(v.flip().x).toBe(-1);
	expect(v.flip().y).toBe(-2);
	expect(v.flip().z).toBe(-3);
});

test("lerp", () => {
	const v = ear.vector(2, 0);
	expect(v.lerp([-2, 0], 0.5)[0]).toBe(0);
	expect(v.lerp([-2, 0], 0.25)[0]).toBe(1);
	expect(v.lerp([-2, 0], 0.75)[0]).toBe(-1);
	expect(v.lerp([-2], 0.25)[0]).toBe(1);
	expect(v.lerp([-2], 0.75)[0]).toBe(-1);
});

test("midpoint", () => {
	const v = ear.vector(1, 2, 3);
	expect(v.midpoint([1, 2])[2]).toBe(1.5);
	expect(v.midpoint([1, 2, 10]).x).toBe(1);
	expect(v.midpoint([1, 2, 10]).y).toBe(2);
	expect(v.midpoint([1, 2, 10]).z).toBe(6.5);
	expect(v.midpoint([1, 2, 10, 20])[3]).toBe(10);
	expect(v.midpoint([1]).y).toBe(1);
	expect(v.midpoint([]).z).toBe(1.5);
});

test("transform", () => {
	const v = ear.vector(1, 2);
	expect(v.transform(1, 0, 0, 0, 1, 0, 0, 0, 1).x).toBe(1);
	expect(v.transform(1, 0, 0, 0, 1, 0, 0, 0, 1).y).toBe(2);
	// rotate around x
	expect(v.transform(1, 0, 0, 0, 0, -1, 0, 1, 0).x).toBe(1);
	expect(v.transform(1, 0, 0, 0, 0, -1, 0, 1, 0).y).toBe(0);
	expect(v.transform(1, 0, 0, 0, 0, -1, 0, 1, 0).z).toBe(-2);
	// rotate around z
	expect(v.transform(0, -1, 0, 1, 0, 0, 0, 0, 1).x).toBe(2);
	expect(v.transform(0, -1, 0, 1, 0, 0, 0, 0, 1).y).toBe(-1);
	expect(v.transform(0, -1, 0, 1, 0, 0, 0, 0, 1).z).toBe(0);
	// rotate 2D
	expect(v.transform(0, -1, 1, 0).x).toBe(2);
	expect(v.transform(0, -1, 1, 0).y).toBe(-1);
});

test("rotateZ", () => {
	const v = ear.vector(1);
	expect(v.rotateZ(Math.PI / 2).x).toBeCloseTo(0);
	expect(v.rotateZ(Math.PI / 2).y).toBeCloseTo(1);
	expect(v.rotateZ(-Math.PI / 2).x).toBeCloseTo(0);
	expect(v.rotateZ(-Math.PI / 2).y).toBeCloseTo(-1);
});
