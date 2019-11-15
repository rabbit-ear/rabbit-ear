const RabbitEar = require("../rabbit-ear");

test("axiom 1, input param", () => {
  const a = RabbitEar.axiom(1, 2/3, 1/3, 1/3, 2/3);
  const b = RabbitEar.axiom(1, [2/3, 1/3], [1/3, 2/3]);
  const c = RabbitEar.axiom(1, [[2/3, 1/3], [1/3, 2/3]]);
  const d = RabbitEar.axiom(1, [2/3, 1/3, 1/3, 2/3]);
  // 3d points
  const e = RabbitEar.axiom(1, [2/3, 1/3, 0], [1/3, 2/3, 0]);
  const f = RabbitEar.axiom(1, [[2/3, 1/3, 0], [1/3, 2/3, 0]]);

  const solution = [[2/3, 1/3], [-Math.SQRT1_2, Math.SQRT1_2]];
  expect(RabbitEar.equivalent([solution], a.solutions)).toBe(true);
  expect(RabbitEar.equivalent(a.solutions, b.solutions)).toBe(true);
  expect(RabbitEar.equivalent(b.solutions, c.solutions)).toBe(true);
  expect(RabbitEar.equivalent(c.solutions, d.solutions)).toBe(true);
  expect(RabbitEar.equivalent(d.solutions, e.solutions)).toBe(true);
  expect(RabbitEar.equivalent(e.solutions, f.solutions)).toBe(true);
});

test("axiom 2, input param", () => {
  const a = RabbitEar.axiom(2, 2/3, 1/3, 1/3, 2/3);
  const b = RabbitEar.axiom(2, [2/3, 1/3], [1/3, 2/3]);
  const c = RabbitEar.axiom(2, [[2/3, 1/3], [1/3, 2/3]]);
  const d = RabbitEar.axiom(2, [2/3, 1/3, 1/3, 2/3]);
  // 3d points
  const e = RabbitEar.axiom(2, [2/3, 1/3, 0], [1/3, 2/3, 0]);
  const f = RabbitEar.axiom(2, [[2/3, 1/3, 0], [1/3, 2/3, 0]]);

  const solution = [[0.5, 0.5], [Math.SQRT1_2, Math.SQRT1_2]];

  expect(RabbitEar.equivalent([solution], a.solutions)).toBe(true);
  expect(RabbitEar.equivalent(a.solutions, b.solutions)).toBe(true);
  expect(RabbitEar.equivalent(b.solutions, c.solutions)).toBe(true);
  expect(RabbitEar.equivalent(c.solutions, d.solutions)).toBe(true);
  expect(RabbitEar.equivalent(d.solutions, e.solutions)).toBe(true);
  expect(RabbitEar.equivalent(e.solutions, f.solutions)).toBe(true);
});

test("axiom 3, input param", () => {
  const a = RabbitEar.axiom(3, [0.5, 0.5, 0, 1, 0, 0.5, 1, 0]);
  const b = RabbitEar.axiom(3, [0.5, 0.5, 0, 1], [0, 0.5, 1, 0]);
  const c = RabbitEar.axiom(3, [0.5, 0.5], [0, 1], [0, 0.5], [1, 0]);
  const d = RabbitEar.axiom(3, [[0.5, 0.5], [0, 1]], [[0, 0.5], [1, 0]]);
  const e = RabbitEar.axiom(3, [[[0.5, 0.5], [0, 1]], [[0, 0.5], [1, 0]]]);

  const solutions = [
    [[0.5, 0.5], [Math.SQRT1_2, Math.SQRT1_2]],
    [[0.5, 0.5], [-Math.SQRT1_2, Math.SQRT1_2]],
  ];

  expect(RabbitEar.equivalent(solutions, a.solutions)).toBe(true);
  expect(RabbitEar.equivalent(a.solutions, b.solutions)).toBe(true);
  expect(RabbitEar.equivalent(b.solutions, c.solutions)).toBe(true);
  expect(RabbitEar.equivalent(c.solutions, d.solutions)).toBe(true);
  expect(RabbitEar.equivalent(d.solutions, e.solutions)).toBe(true);
});
