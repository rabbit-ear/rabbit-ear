RabbitEar.svg("canvas-convex-hull", 500, 500, (svg) => {
  const { RabbitEar } = window;

  const STROKE_WIDTH = svg.getWidth() * 0.02;
  const RADIUS = svg.getWidth() * 0.04;
  svg.strokeWidth(STROKE_WIDTH);
  const drawLayer = svg.g();
  const polygon = svg.polygon()
    .fill("none")
    .stroke("#fb3")
    .strokeLinecap("round");

  const redraw = function (points) {
    drawLayer.removeChildren();
    const poly = RabbitEar.convexPolygon.convexHull(points);
    poly.sectors.map(s => s.vectors.map(v => Math.atan2(v[1], v[0])))
      .forEach((a, i) => drawLayer
        .wedge(poly.points[i][0], poly.points[i][1], RADIUS * 3, a[0], a[1])
        .fill("#158"));
    polygon.setPoints(poly.points);
  };

  svg.controls(6)
    .svg(() => RabbitEar.svg.circle().radius(RADIUS).fill("#e53"))
    .position(() => [Math.random() * svg.getWidth(), Math.random() * svg.getHeight()])
    .onChange((a, b) => redraw(a, b), true);
});
