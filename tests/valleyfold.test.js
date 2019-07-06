const re = require("../rabbit-ear");

/**
 * valley fold
 */
test("valley fold", () => {
  const origami = re.Origami();
  origami.valleyFold([0.5, 0.5], [1, 0.1]);
  expect(re.core.vertices_count(origami)).toBe(6);
  expect(re.core.edges_count(origami)).toBe(7);
  expect(re.core.faces_count(origami)).toBe(2);
  // console.log("valley folded origami", origami);
});
