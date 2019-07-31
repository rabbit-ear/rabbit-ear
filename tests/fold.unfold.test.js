const re = require("../rabbit-ear");

test("fold and unfold, valley fold", () => {
  const origami = re.Origami();
  origami.crease([0.5, 0.5], [1, 0.1]);
  origami.fold();
  origami.unfold();
});

test("fold and unfold base", () => {
  const origami = re.Origami(re.bases.frog);
  // origami.load();
  origami.fold();
  origami.unfold();
});
