var clipLineCallback;

RabbitEar.svg("canvas-clip-line", window.innerWidth, window.innerHeight, (svg) => {
  const { RabbitEar } = window;

  const vmin = svg.getWidth() > svg.getHeight() ? svg.getHeight() : svg.getWidth();
  const STROKE_WIDTH = vmin * 0.02;
  const RADIUS = vmin * 0.04;
  const backLayer = svg.g();
  const polygon = svg.polygon()
    .stroke("#fb3")
    .strokeWidth(STROKE_WIDTH)
    .fill("white")
    .strokeLinecap("round");
  const topLayer = svg.g();
  // const boundary = [[0, 0], [500, 0], [500, 500], [0, 500]];
  const boundary = RabbitEar.polygon([
    [-svg.getWidth(), -svg.getHeight()],
    [svg.getWidth() * 3, -svg.getHeight()],
    [svg.getWidth() * 3, svg.getHeight() * 3],
    [-svg.getWidth(), svg.getHeight() * 3]
  ]);

  const hullPoints = Array.from(Array(24)).map(() => {
    const a = Math.random() * Math.PI * 2;
    const r = Math.random() * svg.getHeight() * 0.5;
    return [svg.getWidth() * 0.5 + r * Math.cos(a), svg.getHeight() * 0.5 + r * Math.sin(a)];
  });
  const hull = RabbitEar.polygon.convexHull(hullPoints);
  // const pointsString = hull.points.reduce((prev, curr) => prev + curr[0] + "," + curr[1] + " ", "");
  polygon.setPoints(hull.points);
  // polygon.setAttribute("points", pointsString);

  const redraw = function (points) {
    const vec = [points[1].x - points[0].x, points[1].y - points[0].y];
    backLayer.removeChildren();
    // const backLine = RabbitEar.line(points[1], vec);
    // const backEdge = RabbitEar.math.intersection
    //   .convex_poly_line(boundary.points, backLine.origin, backLine.vector);
    // backLayer.line(backEdge[0][0], backEdge[0][1], backEdge[1][0], backEdge[1][1])
    //   .stroke("#fb3")
    //   .fill("#fb3")
    //   .strokeWidth(STROKE_WIDTH)
    //   .strokeLinecap("round");

    const edge = hull.clipLine(points[0], vec);

    topLayer.removeChildren();
    if (edge != null) {
      topLayer.line(edge[0][0], edge[0][1], edge[1][0], edge[1][1])
        .stroke("#fb3")
        .strokeWidth(STROKE_WIDTH)
        .strokeLinecap("round")
        .strokeDasharray(`${STROKE_WIDTH} ${STROKE_WIDTH * 2}`);
      topLayer.circle(edge[0][0], edge[0][1], RADIUS).fill("#158");
      topLayer.circle(edge[1][0], edge[1][1], RADIUS).fill("#158");
    }
    if (clipLineCallback !== undefined) {
      clipLineCallback({ edge });
    }
  };

  const center = [svg.getWidth() * 0.5, svg.getHeight() * 0.5];
  svg.touches = svg.controls(2)
    .svg(() => RabbitEar.svg.circle().radius(RADIUS * 1.5).fill("#e53"))
    .position(i => (i === 0 ? center : [Math.random() * svg.getWidth(), Math.random() * svg.getHeight()]))
    .onChange((a, b) => redraw(a, b), true);
});
