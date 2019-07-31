const re = require("../rabbit-ear");

test("valley fold", () => {
  const origami = re.Origami();
  origami.crease([0.5, 0.5], [1, 0.1]);
  expect(re.core.vertices_count(origami)).toBe(6);
  expect(re.core.edges_count(origami)).toBe(7);
  expect(re.core.faces_count(origami)).toBe(2);
  // console.log("valley folded origami", origami);
});

test("valley fold", () => {
  const origami = re.Origami();
  origami.crease([0.5, 0.5], [1, 0.1]);
  origami.crease([0.5, 0.5], [0.1, 1]);
  expect(re.core.vertices_count(origami)).toBe(9);
  expect(re.core.edges_count(origami)).toBe(12);
  expect(re.core.faces_count(origami)).toBe(4);
  // console.log("valley folded origami", origami);
});
