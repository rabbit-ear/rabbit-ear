var basisVecSketchCallback;

var windowAspect = window.innerWidth / window.innerHeight;
var VecTw = window.innerWidth > window.innerHeight ? windowAspect * 2.8 : 2.0;
var VecTh = window.innerWidth > window.innerHeight ? 2.8 : 2.0 / (windowAspect);
RabbitEar.svg("canvas-matrix-basis", -VecTw / 2, -VecTh / 2, VecTw, VecTh, (basisVec) => {
  const { RabbitEar } = window;

  const strokeWidth = 0.04;
  const arrowStrokeWidth = 0.06;
  const circleRadius = 0.08;
  const arrowHead = {
    width: arrowStrokeWidth * 1.5,
    height: arrowStrokeWidth * 3
  };
  const basisColors = ["#158", "#e53"];
  const dotArray = "0.001 0.1425";
  const GRIDS = 8;

  const gridLayer = basisVec.g()
    .fill("lightgray")
    .stroke("lightgray")
    .strokeLinecap("round")
    .strokeWidth(strokeWidth);
  const drawLayer = basisVec.g();

  // grid lines
  for (let i = -GRIDS; i <= GRIDS; i += 1) {
    gridLayer.line(i, -GRIDS * 1.0, i, GRIDS * 1.0).strokeWidth(strokeWidth);//.strokeDasharray(dotArray);
    gridLayer.line(-GRIDS * 1.0, i, GRIDS * 1.0, i).strokeWidth(strokeWidth);//.strokeDasharray(dotArray);
  }
  gridLayer.rect(0, 0, 1, 1).stroke("none");
  gridLayer.circle(0, 0, circleRadius).stroke("none");
  const movingGridLines = Array.from(Array((GRIDS * 2 + 1) * 2))
    .map(() => gridLayer.line().stroke("black"));

  // shapes
  const parallelogram = drawLayer.polygon();
  const arrows = [0, 1].map((_, i) => drawLayer.arrow()
    .head(arrowHead)
    .stroke(basisColors[i])
    .fill(basisColors[i])
    .strokeWidth(arrowStrokeWidth));

  let prevOrigin = [0, 0];
  const update = function (points, point) {
    if (point === points[2]) {
      const dOrigin = [point.x - prevOrigin[0], point.y - prevOrigin[1]];
      points[0][0] += dOrigin[0];
      points[0][1] += dOrigin[1];
      points[1][0] += dOrigin[0];
      points[1][1] += dOrigin[1];
      prevOrigin = [point.x, point.y];
    }
    const origin = RabbitEar.vector(points[2]);
    const vectors = [0, 1]
      .map(i => RabbitEar.vector(points[i]).subtract(origin));
    const normalized = vectors.map(a => a.normalize());
    const cross = normalized[0].cross(normalized[1]);

    let iter = 0;
    for (let i = -GRIDS; i <= GRIDS; i += 1) {
      movingGridLines[iter * 2].setPoints(
        origin.x + vectors[0].x * i - GRIDS * vectors[1].x,
        origin.y + vectors[0].y * i - GRIDS * vectors[1].y,
        origin.x + vectors[0].x * i + GRIDS * vectors[1].x,
        origin.y + vectors[0].y * i + GRIDS * vectors[1].y,
      );
      movingGridLines[iter * 2 + 1].setPoints(
        origin.x + vectors[1].x * i - GRIDS * vectors[0].x,
        origin.y + vectors[1].y * i - GRIDS * vectors[0].y,
        origin.x + vectors[1].x * i + GRIDS * vectors[0].x,
        origin.y + vectors[1].y * i + GRIDS * vectors[0].y,
      );
      iter += 1;
    }

    const corner = origin.add(vectors[0]).add(vectors[1]);
    parallelogram.setPoints([origin, points[0], corner, points[1]])
      .fill((cross[2] > 0 ? "#fb3" : "#7b4"));
    arrows.forEach((a, i) => a
      .setPoints(origin.x, origin.y, points[i].x, points[i].y));

    if (basisVecSketchCallback != null) {
      basisVecSketchCallback({
        origin,
        axes: vectors
      });
    }
  };

  basisVec.controls(3)
    .svg(i => (i === 2 ? RabbitEar.svg.circle().radius(circleRadius).fill("black") : null))
    .position(i => (i === 2 ? [0, 0] : [(i + 1) % 2, i % 2]))
    .onChange((a, b) => update(a, b), true);
});
