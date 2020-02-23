const RabbitEar = require("../rabbit-ear");

const eq = RabbitEar.equivalent;

test("axiom 1, input param", () => {
  const axiom1 = RabbitEar.axiom(1, {points:[[0,1], [2,3]]});
  expect(axiom1.solutions.length).toBe(1);
  expect(eq(axiom1.solutions[0].origin.x, 0)).toBe(true);
  expect(eq(axiom1.solutions[0].origin.y, 1)).toBe(true);
  expect(eq(axiom1.solutions[0].vector.x, Math.SQRT1_2)).toBe(true);
  expect(eq(axiom1.solutions[0].vector.y, Math.SQRT1_2)).toBe(true);

  // const a = RabbitEar.axiom(1, {points: [[2/3, 1/3], [1/3, 2/3]]});
  // const b = RabbitEar.axiom(1, [2/3, 1/3], [1/3, 2/3]);
  // const c = RabbitEar.axiom(1, [[2/3, 1/3], [1/3, 2/3]]);
  // const d = RabbitEar.axiom(1, [2/3, 1/3, 1/3, 2/3]);
  // // 3d points
  // const e = RabbitEar.axiom(1, [2/3, 1/3, 0], [1/3, 2/3, 0]);
  // const f = RabbitEar.axiom(1, [[2/3, 1/3, 0], [1/3, 2/3, 0]]);

  // const solution = [[2/3, 1/3], [-Math.SQRT1_2, Math.SQRT1_2]];
  // expect(RabbitEar.equivalent(solution, a.solutions[0])).toBe(true);
  // expect(RabbitEar.equivalent(a.solutions[0], b.solutions[0])).toBe(true);
  // expect(RabbitEar.equivalent(b.solutions[0], c.solutions[0])).toBe(true);
  // expect(RabbitEar.equivalent(c.solutions[0], d.solutions[0])).toBe(true);
  // expect(RabbitEar.equivalent(d.solutions[0], e.solutions[0])).toBe(true);
  // expect(RabbitEar.equivalent(e.solutions[0], f.solutions[0])).toBe(true);
});

test("axiom 2", () => {
  const axiom2 = RabbitEar.axiom(2, 2/3, 1/3, 1/3, 2/3);

  expect(axiom2.solutions.length).toBe(1);
  expect(eq(axiom2.solutions[0].origin.x, 0.5)).toBe(true);
  expect(eq(axiom2.solutions[0].origin.y, 0.5)).toBe(true);
  expect(eq(axiom2.solutions[0].vector.x, Math.SQRT1_2)).toBe(true);
  expect(eq(axiom2.solutions[0].vector.y, Math.SQRT1_2)).toBe(true);
});

test("axiom 3", () => {
  const axiom3 = RabbitEar.axiom(3, {
    lines:[
      {point:[0,0], vector:[0, 1]},
      {point:[0.2,0.6], vector:[-1, 0]}
    ]});
  expect(eq(axiom3.solutions[0].origin.x, 0)).toBe(true);
  expect(eq(axiom3.solutions[0].origin.y, 0.6)).toBe(true);
  expect(eq(axiom3.solutions[0].vector.x, -Math.SQRT1_2)).toBe(true);
  expect(eq(axiom3.solutions[0].vector.y, Math.SQRT1_2)).toBe(true);

  expect(eq(axiom3.solutions[1].origin.x, 0)).toBe(true);
  expect(eq(axiom3.solutions[1].origin.y, 0.6)).toBe(true);
  expect(eq(axiom3.solutions[1].vector.x, -Math.SQRT1_2)).toBe(true);
  expect(eq(axiom3.solutions[1].vector.y, -Math.SQRT1_2)).toBe(true);
});

test("axiom 7, inputs", () => {
  const axiom7 = RabbitEar.axiom(7, {
    points:[[0.2, 0.9]],
    lines:[
      {point:[0,0], vector:[1,1]},
      {point:[0.2,0.6], vector:[-1,0]}
    ]});
  expect(eq(axiom7.solutions[0].origin.x, 0.55)).toBe(true);
  expect(eq(axiom7.solutions[0].origin.y, 0.9)).toBe(true);
  expect(eq(axiom7.solutions[0].vector.x, 0)).toBe(true);
  expect(eq(axiom7.solutions[0].vector.y, 1)).toBe(true);
});

