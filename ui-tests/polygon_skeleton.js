RabbitEar.svg("canvas-origami-molecule", 500, 500, (polySec) => {
  const STROKE_WIDTH = polySec.getWidth() * 0.015;
  const RADIUS = polySec.getWidth() * 0.03;
  const polygonSVG = polySec.polygon()
    .stroke("#ecb233")
    .strokeWidth(STROKE_WIDTH)
    .fill("none")
    .strokeLinecap("round");
  const drawLayer = polySec.g();

  polySec.recurseMolecule = function(rays, polygon, sides, isEdgeRay) {
    let count = rays.length;
    if (isEdgeRay == null) {
      isEdgeRay = rays.map(() => true);
    }

    // each intersect is with rays at index i and i+1
    let intersects = rays
      .map((ray, i, arr) => ray.intersect(arr[(i + 1) % arr.length]));

    if (count <= 3) {
      let incenter = intersects.filter(i => i !== undefined).shift();
      return [
        [rays[0].origin, incenter],
        [rays[1].origin, incenter],
        [rays[2].origin, incenter]
      ];
    }

    // each ray's 2 distances to the 2 neighboring intersections
    let rayDistances = rays.map((r, i, arr) =>
      [intersects[(i + arr.length - 1) % arr.length], intersects[i]]
    ).map((sects, i) => sects.map(s => s === undefined
      ? [Infinity, Infinity]
      : rays[i].origin.distanceTo(s))
    );
    // let rayDistances = rays.map((r,i,arr) => [
    //  r.origin.distanceTo(intersects[(i+arr.length-1)%arr.length]),
    //  r.origin.distanceTo(intersects[i])
    // ]);
    const sided = rayDistances.map(i => i[0] < i[1]);

    // console.log("isEdgeRay", isEdgeRay);
    // console.log("before", JSON.parse(JSON.stringify(rayDistances)));
    // bad fix for ignoring the inner lines
    isEdgeRay.map((e, i) => ({ e, i }))
      .filter(el => !el.e)
      .forEach((el) => { rayDistances[el.i] = [Infinity, Infinity]; });
    // console.log("after", JSON.parse(JSON.stringify(rayDistances)));


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

    const solutions = [
      [rays[pair[0]].origin, intersects[index]],
      [rays[pair[1]].origin, intersects[index]]
    ];

    const side0 = sides[pair[0]][0];
    const side1 = sides[pair[1]][1];
    const pointA = polygon.points[side0[0]];
    const vectorA = polygon.points[side0[1]].subtract(pointA);
    const pointB = polygon.points[side1[0]];
    const vectorB = polygon.points[side1[1]].subtract(pointB);
    const bisects = RabbitEar.math.bisect_lines2(pointA, vectorA, pointB, vectorB);

    const newRay = RabbitEar.ray(intersects[index], bisects[0][1]);
    const newSides = [side0, side1];

    polygon.points.map((_, i, arr) => [
      [i, (i + arr.length - 1) % arr.length],
      [i, (i + 1) % arr.length]
    ]);

    const rays2 = rays.slice();
    const sides2 = sides.slice();
    if (pair[0] === rays2.length - 1) {
      rays2.splice(pair[0], 1, newRay);
      rays2.splice(0, 1);
      sides2.splice(pair[0], 1, newSides);
      sides2.splice(0, 1);
      isEdgeRay.splice(pair[0], 1, false);
      isEdgeRay.splice(0, 1);
    } else {
      rays2.splice(pair[0], 2, newRay);
      sides2.splice(pair[0], 2, newSides);
      isEdgeRay.splice(pair[0], 2, false);
    }

    return solutions.concat(polySec.recurseMolecule(rays2, polygon, sides2, isEdgeRay));
  };

  polySec.buildMolecule = function(polygon) {
    const rays = polygon.sectors
      .map(s => s.bisect())
      .map((v, i) => RabbitEar.ray(polygon.points[i], v));
    const intersects = rays
      .map((ray, i, arr) => ray.intersect(arr[(i + 1) % arr.length]));
    const sides = polygon.points.map((_, i, arr) => [
      [i, (i + arr.length - 1) % arr.length],
      [i, (i + 1) % arr.length]
    ]);
    return polySec.recurseMolecule(rays, polygon, sides);
  };

  const redraw = (points) => {
    drawLayer.removeChildren();
    const poly = RabbitEar.convexPolygon.convexHull(points);
    polygonSVG.setPoints(poly.points);
    const straight_skeleton = polySec.buildMolecule(poly);
    straight_skeleton
      .map(s => drawLayer.line(s[0][0], s[0][1], s[1][0], s[1][1])
        .stroke("#158")
        .strokeWidth(STROKE_WIDTH));
  };

  polySec.controls(6)
    .svg(() => RabbitEar.svg.circle().radius(RADIUS).fill("#e53"))
    .position(() => [Math.random() * polySec.getWidth(), Math.random() * polySec.getHeight()])
    .onChange((a, b) => redraw(a, b), true);
});
