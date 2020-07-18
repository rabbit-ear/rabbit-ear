RabbitEar.svg("canvas-junction-bisect", -250, -250, 500, 500, (svg) => {
  const { RabbitEar } = window;

  const drawLayer = svg.g().pointerEvents("none");
  const touchLayer = svg.g().pointerEvents("none");

  const vmin = (svg.getWidth() > svg.getHeight()
    ? svg.getHeight()
    : svg.getWidth());

  const didChange = function (points) {
    const junction = RabbitEar.junction(points);
    drawLayer.removeChildren();
    const angles = junction.sectors()
      .map(s => s.vectors[0])
      .map(v => Math.atan2(v[1], v[0]));

    const wedgeColors = ["#fb3", "#158", "#e53"];
    const radii = junction.sectors()
      .map(s => vmin * 0.4 - ((s.angle / (Math.PI * 2)) ** 0.5) * vmin * 0.25);
    // color wedges
    angles.map((_, i, arr) => drawLayer.wedge(0, 0, radii[i], angles[i], angles[(i + 1) % arr.length]).fill(wedgeColors[i % 3]));
    const r2 = vmin * 0.45;
    // dots
    junction.sectors()
      .map(s => s.bisect())
      .map(b => [b[0] * r2, b[1] * r2])
      .map(p => drawLayer.circle(p[0], p[1], 10)
        .fill("#000"));
    // black lines
    points.map(c => drawLayer.line(0, 0, c[0], c[1])
      .stroke("black")
      .strokeWidth(6)
      .strokeLinecap("round"));
  };

  const controls = svg.controls(3, {
    parent: touchLayer,
    radius: svg.getWidth() * 0.01,
    fill: "#000"
  }).position(() => {
    const a = Math.random() * Math.PI * 2;
    return [(vmin * 0.4) * Math.cos(a), (vmin * 0.4) * Math.sin(a)];
  }).onChange((a, b) => didChange(a, b), true);

  controls.forEach((p) => {
    p.positionDidUpdate = function (mouse) {
      const a = Math.atan2(mouse[1], mouse[0]);
      return [(vmin * 0.4) * Math.cos(a), (vmin * 0.4) * Math.sin(a)];
    };
  });
});
