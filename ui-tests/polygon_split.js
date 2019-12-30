RabbitEar.svg("canvas-split-poly", 500, 500, (polySplit) => {
  const STROKE_WIDTH = polySplit.getWidth() * 0.0125;
  const RADIUS = polySplit.getWidth() * 0.025;
  const lineLayer = polySplit.group().pointerEvents("none");
  const topLayer = polySplit.group().pointerEvents("none");

  const polygon = topLayer.polygon();
  polygon.setAttribute("stroke", "black");
  polygon.setAttribute("stroke-width", STROKE_WIDTH);
  polygon.setAttribute("fill", "none");
  polygon.setAttribute("stroke-linecap", "round");
  polygon.setAttribute("stroke-dasharray", STROKE_WIDTH + " " + STROKE_WIDTH*2);

  const hullPoints = Array.from(Array(24)).map(() => {
    const a = Math.random() * Math.PI * 2;
    const r = Math.random() * polySplit.getHeight() * 0.5;
    return [
      polySplit.getWidth() * 0.5 + r * Math.cos(a),
      polySplit.getHeight() * 0.5 + r * Math.sin(a)
    ];
  });
  const hull = RabbitEar.convexPolygon.convexHull(hullPoints);
  polygon.setPoints(hull.points);

  const redraw = function (points) {
    const vec = [points[1].x - points[0].x, points[1].y - points[0].y];

    lineLayer.removeChildren();
    let polys = hull.split(points[0], vec);
    let colors = ["#fb3", "#195783"];
    if(polys != null){
      polys.sort((a,b) => b.area - a.area).forEach((p,i)=> {
        let poly = RabbitEar.svg.polygon(p.scale(0.8).points);
        poly.setAttribute("fill", colors[i%2]);
        poly.setAttribute("stroke", "none");
        poly.setAttribute("stroke-width", STROKE_WIDTH);
        poly.setAttribute("stroke-linecap", "round");
        lineLayer.appendChild(poly);
      });
    }
    let ed = hull.clipLine(points[0], vec);
    if (ed !== undefined) {
      let clipLine = lineLayer.line(ed[0][0], ed[0][1], ed[1][0], ed[1][1]);
      clipLine.setAttribute("stroke", "black");
      clipLine.setAttribute("stroke-width", STROKE_WIDTH);
      clipLine.setAttribute("stroke-linecap", "round");
      clipLine.setAttribute("stroke-dasharray", STROKE_WIDTH + " " + STROKE_WIDTH*2);
    }
  };

  polySplit.controls(2)
    .svg(() => RabbitEar.svg.circle().radius(RADIUS).fill("#e53"))
    .position((i) => i === 0
      ? [polySplit.getWidth()*0.5, polySplit.getHeight()*0.5]
      : [Math.random() * polySplit.getWidth(), Math.random() * polySplit.getHeight()])
    .onChange((a, b) => redraw(a, b), true);
});
