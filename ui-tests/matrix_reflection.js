var matrixReflectCallback;

RabbitEar.svg("canvas-reflection", 800, 300, (svg) => {
  const reflLayer = svg.group();

  const line = svg.line()
    .stroke("#e53")
    .strokeWidth(3)
    .strokeDasharray("6 6")
    .strokeLinecap("round");

  const dots = Array.from(Array(10)).map(() => {
    const x = Math.random() * svg.getWidth();
    const y = Math.random() * svg.getHeight();
    const circle = svg.circle(x, y, 6).fill("#158");
    return { pos: [x, y], svg: circle };
  });

  const update = (points) => {
    reflLayer.removeChildren();
    const vec = [points[1].x - points[0].x, points[1].y - points[0].y];
    const matrix = RabbitEar.matrix2.makeReflection(vec, points[0]);
    line.setPoints(points[0].x, points[0].y, points[1].x, points[1].y);
    dots.map(p => matrix.transform(p.pos))
      .forEach(p => reflLayer.circle(p.x, p.y, 6).fill("#fb3"));
    if (matrixReflectCallback !== undefined) {
      matrixReflectCallback({ matrix, segment: points });
    }
  };

  svg.controls(2)
    .svg(() => RabbitEar.svg.circle().radius(8).fill("#e53"))
    .position(i => [(i % 2 === 0 ? 0.75 : 0.25) * svg.getWidth(), 0.5 * svg.getHeight()])
    .onChange((a, b) => update(a, b), true);
});
