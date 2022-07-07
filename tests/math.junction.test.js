const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear");

test("empty", () => { expect(true).toBe(true); });

/*
test("getters", () => {
	const junction = ear.junction([1, 0], [0, 1], [-1, 0]);
	expect(junction.order.length).toBe(3);
	expect(junction.radians.length).toBe(3);
	expect(junction.vectors.length).toBe(3);
	expect(junction.sectors.length).toBe(3);
});

test("alternating angle sum", () => {
	const junction = ear.junction([1, 0], [0, 1], [-1, 0], [0, -1]);
	const res = junction.alternatingAngleSum();
	expect(res[0]).toBe(Math.PI);
	expect(res[1]).toBe(Math.PI);
});

test("alternating angle 3", () => {
	const junction = ear.junction([1, 0], [0, 1], [-1, 0]);
	const res = junction.alternatingAngleSum();
	expect(res[0]).toBe(Math.PI / 2 * 3);
	expect(res[1]).toBe(Math.PI / 2);
});

test("static fromRadians 1", () => {
	const junction = ear.junction.fromRadians(0, 1, 2);
	expect(ear.math.equivalent_vectors(junction.radians, [0, 1, 2])).toBe(true);
});

test("static fromRadians 2", () => {
	const junction = ear.junction.fromRadians(Math.PI/2, Math.PI, Math.PI/2*3);
	expect(junction.vectors[0].x).toBeCloseTo(0);
	expect(junction.vectors[0].y).toBeCloseTo(1);

	expect(junction.vectors[1].x).toBeCloseTo(-1);
	expect(junction.vectors[1].y).toBeCloseTo(0);

	expect(junction.vectors[2].x).toBeCloseTo(0);
	expect(junction.vectors[2].y).toBeCloseTo(-1);
});
*/
