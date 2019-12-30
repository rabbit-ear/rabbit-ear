let vecDotCallback;

RabbitEar.svg("canvas-vector-dot", -window.innerWidth / 2, -Math.min(window.innerWidth, window.innerHeight) / 2, window.innerWidth, Math.min(window.innerWidth, window.innerHeight), (svg) => {
  const { RabbitEar } = window;
  const strokeW = 10;
  const layer = svg.group().strokeWidth(strokeW);

  const didMove = function (points) {
    layer.removeChildren();
    const lines = points.map(p => RabbitEar.line.fromPoints([0, 0], p));
    const bounds = RabbitEar.polygon(
      [-svg.getWidth() / 2, -svg.getHeight() / 2],
      [svg.getWidth() / 2, -svg.getHeight() / 2],
      [svg.getWidth() / 2, svg.getHeight() / 2],
      [-svg.getWidth() / 2, svg.getHeight() / 2]
    );
    // gray lines extend to end of canvas
    const segments = lines.map(l => bounds.clipLine(l));
    segments.forEach(s => layer.line(s[0][0], s[0][1], s[1][0], s[1][1]).stroke("lightgray"));
    const nearest = points
      .map((p, i) => lines[(i + 1) % lines.length].nearestPoint(p));
    // white lines ontop of the gray
    nearest.forEach(n => layer.line(0, 0, n.x, n.y).stroke("white"));
    points.forEach(p => layer.line(0, 0, p[0], p[1]).stroke("white"));
    // yellow drop-down lines
    nearest.forEach((n, i) => layer
      .line(points[i][0], points[i][1], n.x, n.y).stroke("#fb3"));
    // arrows
    const dasharray = `${svg.getWidth() / 50} ${svg.getWidth() / 100}`;
    points.forEach((p, i) => layer.arrow(0, 0, p[0], p[1])
      .head({ width: strokeW * 2, height: strokeW * 5 })
      .stroke(i % 2 === 0 ? "#158" : "#158")
      .fill(i % 2 === 0 ? "#158" : "#158")
      .strokeDasharray(i % 2 === 0 ? "" : dasharray));
    // points.forEach(p => layer.line(0, 0, p[0], p[1]).stroke("#158"));
    // projection lines, opposite dash from vectors
    nearest.forEach((n, i) => layer.line(0, 0, n.x, n.y)
      .stroke("#e53")
      .strokeDasharray(i % 2 === 1 ? "" : dasharray));
    points.forEach((p, i) => layer.arrow(0, 0, p[0], p[1])
      .head({ width: strokeW * 2, height: strokeW * 5 })
      .stroke("none")
      .fill(i % 2 === 0 ? "#158" : "#158"));
    if (typeof vecDotCallback === "function") {
      vecDotCallback({
        vectors: points.map(p => RabbitEar.vector(p[0], p[1])),
        projections: nearest
      });
    }
  };

  svg.controls(2)
    // .svg(() => RabbitEar.svg.circle().radius(15).fill("#158"))
    .position(() => [
      Math.random() * svg.getWidth() - svg.getWidth() / 2,
      Math.random() * svg.getHeight() - svg.getHeight() / 2])
    .onChange((a, b) => didMove(a, b), true);
});
