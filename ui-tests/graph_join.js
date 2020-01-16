RabbitEar.svg("canvas-graph-join", (svg) => {
  const { RabbitEar } = window;

  const drawLayer = svg.group();
  const topLayer = svg.group();

  const graph1 = RabbitEar.graph(RabbitEar.bases.kite);
  const graph2 = RabbitEar.graph(RabbitEar.bases.fish);
  graph2.scale(0.585786437626905);

  svg.size(-0.05, -0.05, 1.1, 1.1);

  const update = function (points) {
    drawLayer.removeChildren();
    const g1 = graph1.copy();
    g1.translate(points[0][0], points[0][1]);
    const g2 = graph2.copy();
    g2.translate(points[1][0], points[1][1]);
    const graph = RabbitEar.graph(g1);

    graph.join(g2, 0.05);

    // draw
    graph.faces_vertices
      .map(fv => fv.map(v => graph.vertices_coords[v]))
      .map(pts => RabbitEar.convexPolygon(pts))
      .map(poly => poly.scale(0.5))
      .map(poly => drawLayer.polygon(poly.points).fill("#fb3"));
    graph.edges_vertices.map(ev => ev.map(v => graph.vertices_coords[v]))
      .map((e) => {
        const seg = RabbitEar.segment(e);
        const vec0 = seg.vector.normalize().scale(0.03);
        const vec1 = seg.vector.flip().normalize().scale(0.03);
        return [seg[0].add(vec0), seg[1].add(vec1)];
      })
      .map(e => drawLayer.line(e[0][0], e[0][1], e[1][0], e[1][1])
        .stroke("black")
        .strokeWidth(0.005));
    graph.vertices_coords.map(v => drawLayer.circle(v[0], v[1], 0.01).fill("#fb3"));
  };

  svg.controls(2)
    .position(i => (i === 0 ? [0, 0] : [Math.random() * 0.5, Math.random() * 0.5]))
    .svg(() => topLayer.circle().radius(0.0333).fill("#e53"))
    .onChange((a, b) => update(a, b), true);
});
