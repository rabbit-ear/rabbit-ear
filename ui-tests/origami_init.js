const origami = RabbitEar.Origami("canvas-reflection", 800, 800, (origami) => {
  console.log("inside the sketch", origami);

  const line = origami.svg.line(0, 0, 1, 1)
    .stroke("black")
    .strokeWidth(0.01)
    .strokeDasharray("0.01 0.02")
    .strokeLinecap("round");

  const update = function (points, point) {
    line.setPoints(points);
  };

  origami.svg.controls(2)
    .svg(() => RabbitEar.svg.circle().radius(0.02).fill("#e53"))
    .position(i => [(i % 2 === 0 ? 0.75 : 0.25) * origami.svg.getWidth(), 0.5 * origami.svg.getHeight()])
    .onChange((a, b) => update(a, b), true);
});
