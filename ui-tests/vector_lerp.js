let lerpsCallback = undefined;

let lerps;
lerps = RabbitEar.svg("canvas-lerp", 500, 500, () => {
  const { RabbitEar } = window;
  if (lerps == null) { return; }
  const startAngle = Math.random() * Math.PI * 2;
  const angles = [startAngle];
  angles[1] = angles[0] + Math.random() * Math.PI * 0.7 + 1;
  angles[2] = angles[1] + Math.random() * Math.PI * 0.7 + 1;
  const radii = [
    (0.3 + 0.7 * Math.random()) * lerps.getHeight() * 0.5,
    (0.3 + 0.7 * Math.random()) * lerps.getHeight() * 0.5,
    (0.3 + 0.7 * Math.random()) * lerps.getHeight() * 0.5
  ];

  const bottom = lerps.group()
    .strokeWidth(7)
    .strokeLinecap("round");

  const controls = lerps.controls(3)
    .svg(() => RabbitEar.svg.circle().radius(16).fill("#e53"))
    .position(i => [
      lerps.getWidth() / 2 + Math.cos(angles[i]) * radii[i],
      lerps.getHeight() / 2 + Math.sin(angles[i]) * radii[i]
    ]);

  const top = lerps.group()
    .strokeWidth(7)
    .strokeLinecap("round");

  const grayLine1 = bottom.line().stroke("lightgray").strokeDasharray("7 14");
  const grayLine2 = bottom.line().stroke("lightgray").strokeDasharray("7 14");
  const curve = bottom.bezier().stroke("#fb3").fill("none");
  const midLine = top.line().stroke("#158");//.strokeDasharray("7 14");
  const midPoints = [
    lerps.circle().radius(16).fill("#158"),
    lerps.circle().radius(16).fill("#158")
  ];
  const lerpDot = lerps.circle().radius(16).fill("#fb3");

  const update = function (points, point) {
    const mid1 = [
      (points[2].x * 0.666 + points[0].x * 0.333),
      (points[2].y * 0.666 + points[0].y * 0.333)
    ];
    const mid2 = [
      (points[2].x * 0.666 + points[1].x * 0.333),
      (points[2].y * 0.666 + points[1].y * 0.333)
    ];
    const d = `M ${points[0].x},${points[0].y} C ${mid1[0]},${mid1[1]} ${mid2[0]},${mid2[1]} ${points[1].x},${points[1].y}`;
    curve.setAttribute("d", d);
    grayLine1.setPoints(points[0].x, points[0].y, points[2].x, points[2].y);
    grayLine2.setPoints(points[2].x, points[2].y, points[1].x, points[1].y);
  };

  lerps.animate = function (event) {
    const phase = Math.sin(event.time) * 0.5 + 0.5;
    const vecs = controls.map(el => RabbitEar.vector(el));
    const ctrl = [
      vecs[0].lerp(vecs[2], phase),
      vecs[2].lerp(vecs[1], phase)
    ];
    midPoints.forEach((p, i) => p.setCenter(ctrl[i].x, ctrl[i].y));
    const lerp = ctrl[0].lerp(ctrl[1], phase);
    lerpDot.setCenter(lerp.x, lerp.y);
    midLine.setPoints(ctrl[0].x, ctrl[0].y, ctrl[1].x, ctrl[1].y);
    if (lerpsCallback !== undefined) { lerpsCallback({ t: phase }); }
  };

  controls.onChange((a, b) => update(a, b), true);

});
