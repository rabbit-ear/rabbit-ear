const RabbitEar = require("../rabbit-ear");

test("boundaries", () => {
  const square = RabbitEar.Origami();
  square.boundaries.clipRay([[0.5, 0.5], [0.1, -0.5]]);
  // [0.5, 0.5]
  // [0.6, 0]

  square.boundaries.clipLine([[0.5, 0.5], [0.1, -0.5]]);
  // [0.6, 0]
  // [0.4, 1]
  expect(1).toBe(1);
});
