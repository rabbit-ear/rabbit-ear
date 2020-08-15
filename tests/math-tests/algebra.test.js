const ear = require("../../rabbit-ear");

const testEqual = function (...args) {
  expect(ear.math.equivalent(...args)).toBe(true);
};

/**
 * algebra core
 */
test("average function", () => {
  // improper use
  expect(ear.math.average().length).toBe(0);
  expect(ear.math.average(0, 1, 2).length).toBe(0);
  expect(ear.math.average([], [], []).length).toBe(0);
  // correct
  testEqual([3.75, 4.75],
    ear.math.average([4, 1], [5, 6], [4, 6], [2, 6]));
  testEqual([4, 5, 3],
    ear.math.average([1, 2, 3], [4, 5, 6], [7, 8]));
  testEqual([4, 5, 6],
    ear.math.average([1, 2, 3], [4, 5, 6], [7, 8, 9]));
});

test("distance3", () => {
  const r1 = ear.math.distance3([1,2,3], [4,5,6]);
  const r2 = ear.math.distance3([1,2,3], [4,5]);
  expect(r1).toBeCloseTo(5.196152422706632);
  expect(isNaN(r2)).toBe(true);
});
