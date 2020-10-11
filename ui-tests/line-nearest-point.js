var nearestPointCallback;

svg.strokeWidth(4);
const backLayer = svg.g();
const lineLayer = svg.g();
const circleLayer = svg.g();
const segments = Array.from(Array(3)).map(() => ear.segment(
  Math.random() * svg.getWidth(), Math.random() * svg.getHeight(),
  Math.random() * svg.getWidth(), Math.random() * svg.getHeight()
));
segments.map(s => lineLayer.line(s[0][0], s[0][1], s[1][0], s[1][1])
  .stroke("black"));

const update = function (point) {
  circleLayer.removeChildren();
  backLayer.removeChildren();
  const points = segments.map(e => e.nearestPoint(point));
  points.map(p => circleLayer.circle(p.x, p.y, 6)
    .fill("white")
    .stroke("black"));
  points.map(p => backLayer.line(p.x, p.y, point.x, point.y)
    .stroke("#fb3")
    .strokeLinecap("round")
    .strokeDasharray("0.1 8"));

  if (nearestPointCallback != null) {
    nearestPointCallback({ mouse: point });
  }
};

update({ x: svg.getWidth() / 2, y: svg.getHeight() / 2});

svg.onMove = update
