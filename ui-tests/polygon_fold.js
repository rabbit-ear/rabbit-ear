RabbitEar.svg("canvas-fold-poly", 500, 500, (svg) => {
  const { RabbitEar } = window;
  const STROKE_WIDTH = svg.getWidth() * 0.0125;
  const RADIUS = svg.getWidth() * 0.025;

  const paperLayer = svg.g().pointerEvents("none");
  const topLayer = svg.g();

  // build paper
  const hullPoints = Array.from(Array(24)).map(() => {
    const a = Math.random() * Math.PI * 2;
    const r = Math.random() * svg.getHeight() * 0.5;
    return [
      svg.getWidth() * 0.5 + r * Math.cos(a),
      svg.getHeight() * 0.5 + r * Math.sin(a)
    ];
  });
  const hull = RabbitEar.convexPolygon.convexHull(hullPoints);

  const redraw = function (points) {
    paperLayer.removeChildren();

    const vec = [points[1].x - points[0].x, points[1].y - points[0].y];
    const polys = hull.split(points[0], vec);
    const colors = ["#158", "#fb3"];

    if (polys != null) {
      polys.sort((a, b) => b.area - a.area);
      if (polys.length > 1) {
        const matrix = RabbitEar.matrix2.makeReflection(vec, points[0]);
        const reflectedPoints = polys[1].points
          .map(p => matrix.transform(p))
          .map(p => [p[0], p[1]]);
        polys[1] = RabbitEar.convexPolygon(reflectedPoints);
      }
      polys.forEach((p, i) => paperLayer.polygon(p.points)
        .fill(colors[i % 2])
        .stroke("black")
        .strokeLinejoin("bevel")
        .strokeWidth(STROKE_WIDTH));
    }
  };

  svg.controls(2)
    .svg(() => topLayer.circle().radius(RADIUS).fill("#e53"))
    .position(i => (i === 0
      ? [svg.getWidth() * 0.5, svg.getHeight() * 0.5]
      : [Math.random() * svg.getWidth(), Math.random() * svg.getHeight()]))
    .onChange((a, b) => redraw(a, b), true);
});
