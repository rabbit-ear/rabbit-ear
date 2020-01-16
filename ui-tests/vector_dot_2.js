const vecDotKey = RabbitEar.svg("canvas-vector-dot-key", 0, 0, 600, 100);

vecDotCallback = function (e) {
  vecDotKey.removeChildren();
  const vecs = e.vectors;
  const projs = e.projections;
  const max = vecs.map(v => v.magnitude).reduce((a, b) => (a > b ? a : b), 0);
  const vecsLen = vecs.map(v => v.magnitude / max);
  const projsLen = projs.map(p => p.magnitude / max);
  vecsLen.forEach((v, i) => {
    vecDotKey.line((i * 150) + 50, 33, (i * 150) + 50 + v * 100, 33)
      .stroke("#158")
      .strokeWidth(4)
      .strokeDasharray(i % 2 === 0 ? "" : "10 5");
  });
  projsLen.forEach((p, i) => {
    const altI = (i + 1) % 2;
    vecDotKey.line((altI * 150) + 50, 66, (altI * 150) + 50 + p * 100, 66)
      .stroke("#e53")
      .strokeWidth(4)
      .strokeDasharray(altI % 2 === 0 ? "" : "10 5");
  });

  vecsLen.forEach((v, i) => {
    const altI = (i + 1) % 2;
    const proj = projsLen[altI];
    vecDotKey.rect((i * 125) + 350, 33, v * 100, proj * 100).fill("#fb3");
    vecDotKey.line((i * 125) + 350, 33, (i * 125) + 350 + v * 100, 33)
      .stroke("#158")
      .strokeWidth(4)
      .strokeDasharray(i % 2 === 0 ? "" : "10 5");
    vecDotKey.line((i * 125) + 350, 33 + proj * 100, (i * 125) + 350 + v * 100, 33 + proj * 100)
      .stroke("#158")
      .strokeWidth(4)
      .strokeDasharray(i % 2 === 0 ? "" : "10 5");
    vecDotKey.line((i * 125) + 350, 33, (i * 125) + 350, 33 + proj * 100)
      .stroke("#e53")
      .strokeWidth(4)
      .strokeDasharray(i % 2 === 0 ? "" : "10 5");
    vecDotKey.line((i * 125) + 350 + v * 100, 33, (i * 125) + 350 + v * 100, 33 + proj * 100)
      .stroke("#e53")
      .strokeWidth(4)
      .strokeDasharray(i % 2 === 0 ? "" : "10 5");
  });
};
