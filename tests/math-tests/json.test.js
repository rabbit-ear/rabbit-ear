const ear = require("../../rabbit-ear");

test("vector", () => {
  const v = JSON.stringify(ear.vector(1, 2, 3));
  expect(v).toBe(`{"0":1,"1":2,"2":3,"length":3}`);
});

test("circle", () => {
  const c = JSON.stringify(ear.circle(1, 2, 3));
  expect(c).toBe(`{"radius":1,"origin":{"0":2,"1":3,"length":2}}`);
});
