const RabbitEar = require("../rabbit-ear");

test("boundaries", () => {
  const square = RabbitEar.origami();
  const lineClip = square.boundaries[0].clipLine([[0.5, 0.5], [0.1, -0.5]]);
  const rayClip = square.boundaries[0].clipRay([[0.5, 0.5], [0.1, -0.5]]);
  expect(lineClip).toMatchObject([[0.6, 0], [0.4, 1]]);
  expect(rayClip).toMatchObject([[0.5, 0.5], [0.6, 0]]);
});
