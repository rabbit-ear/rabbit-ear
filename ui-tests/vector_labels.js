let vectorTextCallback;

var windowAspect = window.innerWidth / window.innerHeight;
if (windowAspect < 1.0) { windowAspect = 1.0; }
var VecTw = windowAspect >= 1.0 ? windowAspect * 2.8 : 2.0;
var VecTh = windowAspect >= 1.0 ? 2.8 : 2.0 / (windowAspect);
RabbitEar.svg("canvas-vector-labels", -VecTw / 2, -VecTh / 2, VecTw, VecTh, (svg) => {
  const { RabbitEar } = window;

  // returns clockwise angle a then b
  const arcToX = function (vec) {
    const angle = Math.atan2(vec.y, vec.x);
    if (vec.x > 0 && vec.y > 0) { return [0, angle]; }
    if (vec.x > 0 && vec.y < 0) { return [angle, 0]; }
    if (vec.x < 0 && vec.y > 0) { return [angle, Math.PI]; }
    if (vec.x < 0 && vec.y < 0) { return [Math.PI, angle]; }
    return [0, 0];
  };

  const strokeWidth = 0.05;
  const dashArray = `${strokeWidth} ${strokeWidth * 2}`;
  const dotArray = `${strokeWidth / 100} ${strokeWidth * 2}`;

  const gridLayer = svg.g()
    .pointerEvents("none")
    .stroke("#eee")
    .strokeWidth(strokeWidth);
  const drawLayer = svg.g()
    .pointerEvents("none")
    .strokeWidth(strokeWidth)
    .strokeLinecap("round")
    // text
    .fontFamily("Avenir Next, Helvetica")
    .fontWeight("700")
    .fontSize("0.28px")
    .textAnchor("middle")
    .userSelect("none");
  const dotLayer = svg.g()
    .pointerEvents("none");

  for (let i = -8; i <= 8; i += 1) {
    const s = i;
    gridLayer.line(s, -svg.getHeight() * 2, s, svg.getHeight() * 2);
    gridLayer.line(-svg.getWidth() * 2, s, svg.getWidth() * 2, s);
  }

  const redraw = function (points) {
    const v = RabbitEar.vector(points[0]);
    const normalized = v.normalize();
    // const cross = v.cross([0, 0, 1]);
    const dotX = v.dot([1, 0, 0]);
    const dotY = v.dot([0, 1, 0]);
    drawLayer.removeChildren();

    // cross product
    // drawLayer.line(0, 0, cross.x, cross.y)
    //   .stroke("#eee")
    //   .strokeDasharray(dashArray);
    // drawLayer.arc(0, 0, cross.magnitude, ...arcToX(cross))
    //   .stroke("#eee")
    //   .fill("none")
    //   .strokeDasharray(dotArray);
    // drawLayer.circle(cross.x, cross.y).radius(0.12).fill("#eee");

    // dot product
    drawLayer.line(v.x, v.y, dotX, 0)
      .stroke("#fb3")
      .strokeDasharray(dotArray);
    drawLayer.line(v.x, v.y, 0, dotY)
      .stroke("#fb3")
      .strokeDasharray(dotArray);
    drawLayer.line(0, 0, dotX, 0)
      .stroke("#e53");
    drawLayer.line(0, 0, 0, dotY)
      .stroke("#e53");

    drawLayer.line(0, 0, v.x, v.y).stroke("#fb3").strokeDasharray(dotArray);
    drawLayer.line(0, 0, normalized.x, normalized.y).stroke("#158");
    drawLayer.arc(0, 0, normalized.magnitude, ...arcToX(normalized))
      .fill("none")
      .stroke("#158")
      .strokeDasharray(dashArray);

    // text
    const nudgeX = v.y > 0 ? -0.15 : 0.35;
    const nudgeY = v.x > 0 ? -0.6 : 0.6;
    const nudgeNorm = v.y > 0 ? 0.3 : -0.1;
    drawLayer.text(`X ${dotX.toFixed(1)}`, dotX, nudgeX).fill("#e53");
    drawLayer.text(`Y ${dotY.toFixed(1)}`, nudgeY, dotY + 0.05).fill("#e53");
    const normString = `(${normalized[0].toFixed(1)}, ${normalized[1].toFixed(1)})`;
    drawLayer.text(normString, normalized.x, normalized.y + nudgeNorm).fill("#158");

    if (vectorTextCallback != null) {
      vectorTextCallback({ vector: points[0], normalized });
    }
  };

  svg.controls(1)
    .svg(() => dotLayer.circle().radius(0.12).fill("#e53"))
    .position(() => {
      const x = Math.random() < 0.5 ? -1.2 : 1.2;
      const y = Math.random() < 0.5 ? -1.2 : 1.2;
      return [x, y];
    })
    .onChange((a, b) => redraw(a, b), true);
});
