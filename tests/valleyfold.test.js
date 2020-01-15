const RabbitEar = require("../rabbit-ear");

test("valley fold", () => {
  const origami = RabbitEar.origami();
  origami.crease([0.5, 0.5], [1, 0.1]);
  expect(RabbitEar.core.vertices_count(origami)).toBe(6);
  expect(RabbitEar.core.edges_count(origami)).toBe(7);
  expect(RabbitEar.core.faces_count(origami)).toBe(2);
  // console.log("valley folded origami", origami);
});

test("valley fold", () => {
  const origami = RabbitEar.origami();
  origami.crease([0.5, 0.5], [1, 0.1]);
  origami.crease([0.5, 0.5], [0.1, 1]);
  expect(RabbitEar.core.vertices_count(origami)).toBe(9);
  expect(RabbitEar.core.edges_count(origami)).toBe(12);
  expect(RabbitEar.core.faces_count(origami)).toBe(4);
  // console.log("valley folded origami", origami);
});
