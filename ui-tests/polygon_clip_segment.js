var clipSegmentCallback;
RabbitEar.svg("canvas-clip-segment", 500, 500, (svg) => {
  const { RabbitEar } = window;
  function equivalent2(a, b, epsilon = 1e-12) {
    return Math.abs(a[0] - b[0]) < epsilon && Math.abs(a[1] - b[1]) < epsilon;
  }
  const vmin = svg.getWidth() > svg.getHeight() ? svg.getHeight() : svg.getWidth();
  const STROKE_WIDTH = vmin * 0.02;
  const RADIUS = vmin * 0.04;
  const polygon = svg.polygon()
    .fill("none")
    .stroke("#fb3")
    .strokeWidth(STROKE_WIDTH)
    .strokeLinecap("round");
  const topLayer = svg.group();
  // const boundary = [ [0, 0], [500, 0], [500, 500], [0, 500] ];
  const boundary = RabbitEar.polygon([
    [-svg.getWidth(), -svg.getHeight()],
    [svg.getWidth() * 3, -svg.getHeight()],
    [svg.getWidth() * 3, svg.getHeight() * 3],
    [-svg.getWidth(), svg.getHeight() * 3]
  ]);
  const hullPoints = Array.from(Array(24)).map(() => {
    const a = Math.random() * Math.PI * 2;
    const r = Math.random() * svg.getHeight() * 0.5;
    return [
      svg.getWidth() * 0.5 + r * Math.cos(a),
      svg.getHeight() * 0.5 + r * Math.sin(a)
    ];
  });
  const hull = RabbitEar.polygon.convexHull(hullPoints);
  polygon.setPoints(hull.points);

  const redraw = function (points) {
    topLayer.removeChildren();

    // const backLine = RabbitEar.segment(points);
    // RabbitEar.math.intersection.convex_poly_line(boundary.points, backLine.origin, backLine.vector);
    const seg = hull.clipSegment(points);
    points[0].svg.fill("#e53");
    points[1].svg.fill("#e53");
    if (seg != null) {
      topLayer.line(seg[0][0], seg[0][1], seg[1][0], seg[1][1])
        .stroke("#fb3")
        .strokeWidth(STROKE_WIDTH)
        .strokeLinecap("round")
        .strokeDasharray(`${STROKE_WIDTH} ${STROKE_WIDTH * 2}`);
      topLayer.circle(seg[0][0], seg[0][1], RADIUS).fill("#158");
      topLayer.circle(seg[1][0], seg[1][1], RADIUS).fill("#158");
      // color the big touches
      if (equivalent2(points[0], seg[0]) || equivalent2(points[0], seg[1])) {
        points[0].svg.fill("#158");
      }
      if (equivalent2(points[1], seg[0]) || equivalent2(points[1], seg[1])) {
        points[1].svg.fill("#158");
      }
    }
    if (clipSegmentCallback !== undefined) {
      clipSegmentCallback({ segment: seg });
    }
  };

  const center = [svg.getWidth() * 0.5, svg.getHeight() * 0.5];
  svg.controls(2)
    .svg(() => RabbitEar.svg.circle().radius(RADIUS * 1.5).fill("#e53"))
    .position(i => (i === 0 ? center : [Math.random() * svg.getWidth(), Math.random() * svg.getHeight()]))
    .onChange((a, b) => redraw(a, b), true);
});
