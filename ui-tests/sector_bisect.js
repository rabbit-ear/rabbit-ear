RabbitEar.svg("canvas-sector-bisect", -250, -250, 500, 500, (svg) => {
  const { RabbitEar } = window;

  const NUM_WEDGES = 2;
  const vmin = svg.getWidth() > svg.getHeight() ? svg.getHeight() : svg.getWidth();
  const STROKE_WIDTH = vmin * 0.0125;
  const RADIUS = vmin * 0.033333;
  const wColors = ["#158", "#fb3"];
  const lColors = ["#e53", "black"];

  const wedges = Array.from(Array(NUM_WEDGES))
    .map((_, i) => svg.wedge().fill(wColors[i % 2]));
  const bisectLines = Array.from(Array(NUM_WEDGES))
    .map((_, i) => svg.line().stroke(lColors[i % 2]).strokeWidth(STROKE_WIDTH));

  const update = function (points) {
    const angles = points.map(p => Math.atan2(p[1], p[0]));
    const vecs = angles.map(a => [Math.cos(a), Math.sin(a)]);
    const r1 = vmin * 0.333;
    const r1b = vmin * 0.333 * 1.05;
    const r2 = vmin * 0.475;
    wedges.forEach((w, i, a) => {
      w.setArc(0, 0, r1,
        Math.atan2(vecs[i][1], vecs[i][0]),
        Math.atan2(vecs[(i + 1) % a.length][1], vecs[(i + 1) % a.length][0]),
        true);
    });
    RabbitEar.math.bisect_vectors(vecs[0], vecs[1])
      .map((vec, i) => bisectLines[i]
        .setPoints(vec[0] * r1b, vec[1] * r1b, vec[0] * r2, vec[1] * r2));
  };

  svg.controls(2)
    .svg(() => RabbitEar.svg.circle().radius(RADIUS).fill("#e53"))
    .position(() => {
      const a = Math.random() * Math.PI * 2;
      const r = vmin * 0.45;
      return [Math.cos(a) * r, Math.sin(a) * r];
    })
    .onChange((a, b) => update(a, b), true);
});
