const RabbitEar = require("../rabbit-ear");

test("boundaries", () => {
  const square = RabbitEar.Origami();
  const rayClip = square.boundaries.clipRay([[0.5, 0.5], [0.1, -0.5]]);
  // [0.5, 0.5]
  // [0.6, 0]

  const lineClip = square.boundaries.clipLine([[0.5, 0.5], [0.1, -0.5]]);
  // [0.6, 0]
  // [0.4, 1]
  // console.log("rayClip", rayClip);
  // console.log("lineClip", lineClip);
  expect(1).toBe(1);
});
