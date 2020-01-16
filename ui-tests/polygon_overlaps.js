RabbitEar.svg("canvas-polygon-overlaps", 800, 500, (svg) => {
  const { RabbitEar } = window;
  svg.strokeWidth(6);

  const COUNT = 3;
  const speeds = Array.from(Array(COUNT)).map(() => Math.random() - 0.5);
  const r = 120;
  const centers = Array.from(Array(COUNT)).map((_, i) => [
    svg.getWidth() / COUNT * 0.5 + i * svg.getWidth() / (COUNT),
    svg.getHeight() * 0.5
  ]);

  let polys = centers.map(c => RabbitEar.convexPolygon
    .regularPolygon(Math.floor(Math.random() * 2) + 4, c[0], c[1], r));
  const polygonFills = polys.map(p => svg.polygon(p.points).stroke("none"));
  const polygonLines = polys.map(p => svg.polygon(p.points).fill("none"));

  const update = function () {
    const polysOverlap = polys.map(() => false);
    for (let i = 0; i < polys.length - 1; i += 1) {
      for (let j = i + 1; j < polys.length; j += 1) {
        if (polys[i].overlaps(polys[j].points)) {
          polysOverlap[i] = true;
          polysOverlap[j] = true;
        }
      }
    }
    polygonFills.forEach((polygon, i) => {
      polygon.fill(polysOverlap[i] ? "#fb3" : "white");
      polygon.setPoints(polys[i].points);
    });
    polygonLines.forEach((polygon, i) => {
      polygon.stroke(polysOverlap[i] ? "#e53" : "#158");
      polygon.setPoints(polys[i].points);
    });
  };

  svg.animate = function () {
    polys = polys.map((p, i) => p
      .rotate(0.025 * speeds[i], centers[i]));
    update();
  };
});
