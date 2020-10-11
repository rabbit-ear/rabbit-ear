const vmin = svg.getWidth() > svg.getHeight() ? svg.getHeight() : svg.getWidth();
const strokeWidth = vmin * 0.03;
const nudge = svg.getWidth() / 5;
svg.strokeWidth(strokeWidth);

const colors = ["#fb4", "#e53"];
const svgLines = [svg.line().stroke("black"), svg.line().stroke("black")];
const arrowLayer = svg.g().strokeWidth(strokeWidth / 2).strokeDasharray(`${strokeWidth} ${strokeWidth / 2}`);
const lineLayer = svg.g();
const arrowOptions = { width: strokeWidth * 1.5, height: strokeWidth * 4 };

const boundary = ear.polygon([
  [-svg.getWidth(), -svg.getHeight()],
  [svg.getWidth() * 3, -svg.getHeight()],
  [svg.getWidth() * 3, svg.getHeight() * 3],
  [-svg.getWidth(), svg.getHeight() * 3]
]);

const redraw = function (p, i, points) {
  lineLayer.removeChildren();
  arrowLayer.removeChildren();
  const lines = [0, 1]
    .map(i => ear.line.fromPoints(points[i * 2], points[i * 2 + 1]));
  lines.map(l => boundary.clipLine(l))
    .forEach((s, i) => svgLines[i]
      .setPoints(s[0][0], s[0][1], s[1][0], s[1][1]));
  ear.math.bisect_lines2(lines[0].vector, lines[0].origin, lines[1].vector, lines[1].origin)
    .map(b => ear.line(b))
    .map((l, i) => ({ l: boundary.clipLine(l), c: colors[i % 2] }))
    .filter(el => el.l !== undefined)
    .map(el => lineLayer
      .line(el.l[0][0], el.l[0][1], el.l[1][0], el.l[1][1]).stroke(el.c));

  const arrowStroke = (lines[1].vector.dot(lines[0].vector) < 0) ? "#e53" : "#fb4";
  // arrowLayer.arrow(points[0], points[1]).head(arrowOptions).stroke(arrowStroke);
  // arrowLayer.arrow(points[2], points[3]).head(arrowOptions).stroke(arrowStroke);
};

const pos = [
  [svg.getWidth() * 0.5 - nudge, svg.getHeight() * 1 / 3],
  [svg.getWidth() * 0.5 + nudge, svg.getHeight() * 1 / 3],
  [svg.getWidth() * 0.5 - nudge, svg.getHeight() * 2 / 3],
  [svg.getWidth() * 0.5 + nudge, svg.getHeight() * 2 / 3],
];

svg.controls(4)
  .position(i => pos[i])
  .onChange(redraw, true);
