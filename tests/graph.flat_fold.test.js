const ear = require("../rabbit-ear");

test("valley fold", () => {
  const origami = ear.origami();
  origami.flatFold(ear.line([1, 0.1], [0.5, 0.5]));
  expect(ear.graph.count.vertices(origami)).toBe(6);
  expect(ear.graph.count.edges(origami)).toBe(7);
  expect(ear.graph.count.faces(origami)).toBe(2);
  // console.log("valley folded origami", origami);
});

test("valley fold", () => {
  const origami = ear.origami();
  origami.flatFold(ear.line([1, 0.1], [0.5, 0.5]));
  origami.flatFold(ear.line([0.1, 1], [0.5, 0.5]));
  expect(ear.graph.count.vertices(origami)).toBe(9);
  expect(ear.graph.count.edges(origami)).toBe(12);
  expect(ear.graph.count.faces(origami)).toBe(4);
  // console.log("valley folded origami", origami);
});

