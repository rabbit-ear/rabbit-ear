RabbitEar.svg("canvas-line-bisect", window.innerWidth, window.innerHeight, (svg) => {
  const { RabbitEar } = window;
  const vmin = svg.getWidth() > svg.getHeight() ? svg.getHeight() : svg.getWidth();
  const strokeWidth = vmin * 0.03;
  const nudge = svg.getWidth() / 5;
  svg.strokeWidth(strokeWidth);

  const colors = ["#fb3", "#e53"];
  const svgLines = [svg.line().stroke("black"), svg.line().stroke("black")];
  const arrowLayer = svg.group().strokeWidth(strokeWidth / 2).strokeDasharray(`${strokeWidth} ${strokeWidth / 2}`);
  const lineLayer = svg.group();
  const arrowOptions = { width: strokeWidth * 1.5, height: strokeWidth * 4 };
  // const boundary = RabbitEar.polygon([
  //   [0, 0],
  //   [svg.getWidth(), 0],
  //   [svg.getWidth(), svg.getHeight()],
  //   [0, svg.getHeight()]
  // ]);
  const boundary = RabbitEar.polygon([
    [-svg.getWidth(), -svg.getHeight()],
    [svg.getWidth() * 3, -svg.getHeight()],
    [svg.getWidth() * 3, svg.getHeight() * 3],
    [-svg.getWidth(), svg.getHeight() * 3]
  ]);

  const redraw = function (points) {
    lineLayer.removeChildren();
    arrowLayer.removeChildren();
    const lines = [0, 1]
      .map(i => RabbitEar.line.fromPoints(points[i * 2], points[i * 2 + 1]));
    lines.map(l => boundary.clipLine(l))
      .forEach((s, i) => svgLines[i]
        .setPoints(s[0][0], s[0][1], s[1][0], s[1][1]));
    lines[0].bisectLine(lines[1])
      .map(b => RabbitEar.line(b[0][0], b[0][1], b[1][0], b[1][1]))
      .map((l, i) => ({ l: boundary.clipLine(l), c: colors[i % 2] }))
      .filter(el => el.l !== undefined)
      .map(el => lineLayer
        .line(el.l[0][0], el.l[0][1], el.l[1][0], el.l[1][1]).stroke(el.c));

    const arrowStroke = (lines[1].vector.dot(lines[0].vector) < 0) ? "#e53" : "#fb3";
    arrowLayer.arrow(points[0], points[1]).head(arrowOptions).stroke(arrowStroke);
    arrowLayer.arrow(points[2], points[3]).head(arrowOptions).stroke(arrowStroke);
  };

  const pos = [
    [svg.getWidth() * 0.5 - nudge, svg.getHeight() * 1 / 3],
    [svg.getWidth() * 0.5 + nudge, svg.getHeight() * 1 / 3],
    [svg.getWidth() * 0.5 - nudge, svg.getHeight() * 2 / 3],
    [svg.getWidth() * 0.5 + nudge, svg.getHeight() * 2 / 3],
  ];
  svg.controls(4)
    .position(i => pos[i])
    .onChange((a, b) => redraw(a, b), true);
});
