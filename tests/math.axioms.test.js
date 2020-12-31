const ear = require("../rabbit-ear");

test("axiom 1", () => {
  const res0 = ear.math.axiom1([2/3, 1/3], [1/3, 2/3]);
  const res1 = ear.math.axiom1([2/3, 1/3, 0], [1/3, 2/3, 0]);
  const expected = {
		vector: [-Math.SQRT1_2, Math.SQRT1_2],
		origin: [2/3, 1/3],
	};
  expect(ear.math.equivalent(res0.vector, expected.vector)).toBe(true);
  expect(ear.math.equivalent(res0.origin, expected.origin)).toBe(true);
  expect(ear.math.equivalent(res1.vector, expected.vector)).toBe(true);
  expect(ear.math.equivalent(res1.origin, expected.origin)).toBe(true);
});

test("axiom 2", () => {
  const res0 = ear.math.axiom2([2/3, 1/3], [1/3, 2/3]);
  const res1 = ear.math.axiom2([2/3, 1/3, 0], [1/3, 2/3, 0]);
  const expected = {
		vector: [-Math.SQRT1_2, -Math.SQRT1_2],
		origin: [0.5, 0.5],
	};
  expect(ear.math.equivalent(res0.vector, expected.vector)).toBe(true);
  expect(ear.math.equivalent(res0.origin, expected.origin)).toBe(true);
  expect(ear.math.equivalent(res1.vector, expected.vector)).toBe(true);
  expect(ear.math.equivalent(res1.origin, expected.origin)).toBe(true);
});

test("axiom 3", () => {
  const res = ear.math.axiom3([0, 1], [0.5, 0.5], [1, 0], [0, 0.5]);
  const expected = [
    { origin: [0.5, 0.5], vector: [Math.SQRT1_2, Math.SQRT1_2] },
    { origin: [0.5, 0.5], vector: [Math.SQRT1_2, -Math.SQRT1_2] },
  ];
	expect(ear.math.equivalent(res[0].vector, expected[0].vector)).toBe(true);
	expect(ear.math.equivalent(res[0].origin, expected[0].origin)).toBe(true);
	expect(ear.math.equivalent(res[1].vector, expected[1].vector)).toBe(true);
	expect(ear.math.equivalent(res[1].origin, expected[1].origin)).toBe(true);
});

test("axiom 4", () => {
	const vecA = [1, 1];
	const pointB = [3, 1];
	const res = ear.math.axiom4(vecA, pointB);
	expect(res.vector.x).toBeCloseTo(-Math.SQRT1_2);
	expect(res.vector.y).toBeCloseTo(Math.SQRT1_2);
	expect(res.origin.x).toBe(3);
	expect(res.origin.y).toBe(1);
});

test("axiom 7", () => {
	const res = ear.math.axiom7([1, 1], [-1, 0], [1, -1], [1, 0]);
	expect(res.vector.x).toBeCloseTo(-Math.SQRT1_2);
	expect(res.vector.y).toBeCloseTo(-Math.SQRT1_2);
	expect(res.origin.x).toBe(0.5);
	expect(res.origin.y).toBe(0.5);
});

test("axiom 5", () => {
	const res = ear.math.axiom5([0, 1], [0.5, 0.5], [0, 0], [1, 0]);
	expect(res[0].vector.x).toBeCloseTo(Math.sqrt(3)/2);
	expect(res[0].vector.y).toBeCloseTo(-0.5);
	expect(res[1].vector.x).toBeCloseTo(-Math.sqrt(3)/2);
	expect(res[1].vector.y).toBeCloseTo(-0.5);
	expect(res[0].origin.x).toBeCloseTo(0.75);
	expect(res[0].origin.y).toBeCloseTo(-0.4330127);
	expect(res[1].origin.x).toBeCloseTo(0.75);
	expect(res[1].origin.y).toBeCloseTo(0.4330127);
});

test("axiom 6 with no params", () => {
	const res = ear.math.axiom6([], [], [], [], [], []);
});

test("axiom 6 with 3 results", () => {
	const vectorA = [0, 1];
	const originA = [1, 0];
	const vectorB = [1, 0];
	const originB = [0, 1];
	const pointA = [0.75, 0];
	const pointB = [0, 0.75];
	const res = ear.math.axiom6(vectorA, originA, vectorB, originB, pointA, pointB);
});

test("axiom 6 with 3 results, second", () => {
	const vectorA = [1, 1];
	const originA = [3, 4];
	const vectorB = [-2, 1];
	const originB = [-1, 3];
	const pointA = [0.5, 0.5];
	const pointB = [0, 3];
	const res = ear.math.axiom6(vectorA, originA, vectorB, originB, pointA, pointB);
});

test("axiom 6 with 2 results", () => {
	const vectorA = [0, 1];
  const originA = [1, 0];
  const vectorB = [1, 0];
  const originB = [0, 1];
  const pointA = [0.75, 0];
  const pointB = [0, 0.75];
  ear.math.axiom6(vectorA, originA, vectorB, originB, pointA, pointB);
});

