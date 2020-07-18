RabbitEar.svg("canvas-origami-molecule", 500, 500, (polySec) => {
  const { RabbitEar } = window;
  const STROKE_WIDTH = polySec.getWidth() * 0.01;
  const RADIUS = polySec.getWidth() * 0.02;

  const polygonSVG = polySec.polygon()
    .stroke("#ecb233")
    .strokeWidth(STROKE_WIDTH)
    .fill("none")
    .strokeLinecap("round");

  const drawLayer = polySec.g();
  const stepColors = ["#666", "#999", "#ccc", "#eee", "#fff"];
  let recursionSteps = 0;

  polySec.recurseMolecule = function (rays, polygon, sides) {
    const count = rays.length;
    // console.log("+ ", count);

    // each intersect is with rays at index i and i+1
    const intersects = rays
      .map((ray, i, arr) => ray.intersect(arr[(i + 1) % arr.length]));

    if (count <= 3) {
      // console.log("===== DONE", rays);
      return [
        [rays[0].origin, intersects[0]],
        [rays[1].origin, intersects[0]],
        [rays[2].origin, intersects[0]],
      ];
    }

    // each ray's 2 distances to the 2 neighboring intersections
    const rayDistances = rays.map((r, i, arr) => [
      r.origin.distanceTo(intersects[(i + arr.length - 1) % arr.length]),
      r.origin.distanceTo(intersects[i])
    ]);
    const sided = rayDistances.map(i => i[0] < i[1]);

    const smallest = rayDistances
      .map((d, i) => ({
        d: sided[i] ? d[0] : d[1],
        i,
        side: sided[i]
      })).sort((a, b) => a.d - b.d).shift();

    const index = smallest.side
      ? (smallest.i + count - 1) % count
      : smallest.i;
    const pair = (smallest.side)
      ? [(smallest.i + count - 1) % count, smallest.i]
      : [smallest.i, (smallest.i + 1) % count];

    drawLayer.circle(
      rays[pair[smallest.side ? 1 : 0]].origin[0],
      rays[pair[smallest.side ? 1 : 0]].origin[1],
      20
    ).setAttribute("fill", "#30C080");
    drawLayer.circle(
      rays[pair[smallest.side ? 0 : 1]].origin[0],
      rays[pair[smallest.side ? 0 : 1]].origin[1],
      20
    ).setAttribute("fill", "#CCC");

    const solutions = [
      [rays[pair[0]].origin, intersects[index]],
      [rays[pair[1]].origin, intersects[index]]
    ];

    const side0 = sides[pair[0]][0];
    const side1 = sides[pair[1]][1];
    // console.log(side0, side1);
    const pointA = polygon.points[side0[0]];
    const vectorA = polygon.points[side0[1]].subtract(pointA);
    const pointB = polygon.points[side1[0]];
    const vectorB = polygon.points[side1[1]].subtract(pointB);
    const bisects = RabbitEar.math.bisect_lines2(pointA, vectorA, pointB, vectorB);

    const newRay = RabbitEar.ray(intersects[index], bisects[0][1]);
    // console.log("newRay", newRay);

    // let next0 = sides[(pair[0]+sides.length-1)%sides.length][0];
    // let next1 = sides[(pair[1]+1)%sides.length][1];
    // let newSides = [next0, next1];
    const newSides = [side0, side1];
    // console.log("newSides", newSides);

    polygon.points.map((_, i, arr) => [
      [i, (i + arr.length - 1) % arr.length],
      [i, (i + 1) % arr.length]
    ]);

    const l2 = drawLayer.line(
      pointA[0],
      pointA[1],
      pointA[0] + vectorA[0],
      pointA[1] + vectorA[1]
    );
    l2.setAttribute("stroke-width", 10 - recursionSteps * 4);
    l2.setAttribute("stroke", stepColors[recursionSteps % 5]);
    const l3 = drawLayer.line(
      pointB[0],
      pointB[1],
      pointB[0] + vectorB[0],
      pointB[1] + vectorB[1]
    );
    l3.setAttribute("stroke-width", 10 - recursionSteps * 4);
    l3.setAttribute("stroke", stepColors[recursionSteps % 5]);

    const l = drawLayer.line(
      intersects[index][0],
      intersects[index][1],
      intersects[index][0] + 100 * bisects[0][1][0],
      intersects[index][1] + 100 * bisects[0][1][1]
    );
    l.setAttribute("stroke-width", 10 - recursionSteps * 4);
    l.setAttribute("stroke", stepColors[recursionSteps % 5]);


    const rays2 = rays.slice();
    const sides2 = sides.slice();
    if (pair[0] === rays2.length - 1) {
      rays2.splice(pair[0], 1, newRay);
      rays2.splice(0, 1);
      sides2.splice(pair[0], 1, newSides);
      sides2.splice(0, 1);
    } else {
      rays2.splice(pair[0], 2, newRay);
      sides2.splice(pair[0], 2, newSides);
      // sides2.splice(pair[0], 1);
    }

    recursionSteps += 1;
    return solutions.concat(polySec.recurseMolecule(rays2, polygon, sides2));
  };

  const buildMolecule = function (polygon) {
    recursionSteps = 0;
    const rays = polygon.sectors
      .map(s => s.bisect())
      .map((v, i) => RabbitEar.ray(polygon.points[i], v));
    const intersects = rays
      .map((ray, i, arr) => ray.intersect(arr[(i + 1) % arr.length]));
    const sides = polygon.points.map((_, i, arr) => [
      [i, (i + arr.length - 1) % arr.length],
      [i, (i + 1) % arr.length]
    ]);

    const lines = polySec.recurseMolecule(rays, polygon, sides);

    lines.map(s => drawLayer.line(s[0][0], s[0][1], s[1][0], s[1][1])
      .strokeWidth(4)
      .stroke("#158"));

    // let leftRight = rays.map((b,i,arr) => [
    //  b.point.distanceTo(intersects[(i+arr.length-1)%arr.length]),
    //  b.point.distanceTo(intersects[i])
    // ]).map(i => i[0] < i[1])

    // leftRight
    //  .map((lr,i,arr) => !lr ? intersects[i] : intersects[(i+arr.length-1)%arr.length])
    //  .map((p,i) => [rays[i].point, p])
    //  .map(s => drawLayer.line(s[0][0], s[0][1], s[1][0], s[1][1]))
    //  .forEach(l => {
    //    l.setAttribute("stroke-width", 4);
    //    l.setAttribute("stroke", "rgb(34, 76, 114)");
    //  });
  };

  const redraw = function (points) {
    drawLayer.removeChildren();
    const poly = RabbitEar.convexPolygon.convexHull(points);
    buildMolecule(poly);
    // rays.map(s => [s.point, s.point.add(s.vector.scale(80))])
    //  .map(s => drawLayer.line(s[0][0], s[0][1], s[1][0], s[1][1]))
    //  .forEach(l => {
    //    l.setAttribute("stroke-width", 4);
    //    l.setAttribute("stroke", "rgb(34, 76, 114)");
    //  });
    polygonSVG.setPoints(poly.points);
  };

  polySec.controls(6)
    .svg(() => RabbitEar.svg.circle().radius(RADIUS).fill("#e53"))
    .position(() => [Math.random() * polySec.getWidth(), Math.random() * polySec.getHeight()])
    .onChange((a, b) => redraw(a, b), true);
});
