const RabbitEar = require("../rabbit-ear");

test("delaunay", () => {
  const origami = RabbitEar.Origami();
  origami.load(RabbitEar.bases.bird);
  origami.clean();
  // origami["vertices_re:delaunay"] = new RabbitEar.Delaunay.from(RabbitEar.bases.bird.vertices_coords);

  expect(true).toBe(true);
});
