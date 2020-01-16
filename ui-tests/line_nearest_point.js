var nearestPointCallback;

RabbitEar.svg("nearest-point", 600, 300, (svg) => {
  const { RabbitEar } = window;

  svg.strokeWidth(4);
  const backLayer = svg.group();
  const lineLayer = svg.group();
  const circleLayer = svg.group();
  const segments = Array.from(Array(3)).map(() => RabbitEar.segment(
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
    points.map(p => backLayer.line(p.x, p.y, point[0], point[1])
      .stroke("#fb3")
      .strokeLinecap("round")
      .strokeDasharray("0.1 8"));

    if (nearestPointCallback != null) {
      nearestPointCallback({ mouse: point });
    }
  };

  update([svg.getWidth() / 2, svg.getHeight() / 2]);

  svg.mouseMoved = function (mouse) {
    update(mouse.position);
  };
});
