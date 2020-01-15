const RabbitEar = require("../rabbit-ear");

test("crease pattern", () => {
  const origami = RabbitEar.origami();
  origami.square();

  origami.segment(0, 0, 1, 1).valley();
  origami.segment(0, 1, 1, 0).valley();

  origami.rebuild();

  origami.edges_assignment[6] = "M";
});
