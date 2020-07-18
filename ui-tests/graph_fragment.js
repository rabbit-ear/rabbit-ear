ear.svg(document.getElementById("canvas-graph-fragment"), (svg) => {
  const { ear } = window;

  const drawLayer = svg.g();
  const topLayer = svg.g();
  const numVertices = 10;
  const numEdges = numVertices * 1.2;
  let controls;

  svg.size(1, 1);
  const graph = ear.graph();

  graph.edges_vertices = Array.from(Array(numVertices)).map((_, i) => [i,
    (i + 1 + Math.floor(Math.random() * (numVertices - 1))) % numVertices
  ]);
  while (graph.edges_vertices.length < numEdges) {
    graph.edges_vertices.push([
      Math.floor(Math.random() * numVertices),
      Math.floor(Math.random() * numVertices)]);
    graph.clean();
  }
  const edges_vertices = JSON.parse(JSON.stringify(graph.edges_vertices));

  const update = function () {
    drawLayer.removeChildren();
    Object.keys(graph).forEach(key => delete graph[key]);
    graph.vertices_coords = Array.from(Array(numVertices))
      .map((_, i) => controls[i]);
    graph.edges_vertices = edges_vertices;
    graph.populate();
    graph.fragment();
    graph.populate();

    // draw
    graph.faces_vertices
      .map(fv => fv.map(v => graph.vertices_coords[v]))
      .map(pts => ear.polygon(pts))
      .map(poly => poly.scale(0.5))
      .map(poly => drawLayer.polygon(poly.points).fill("#fb3"));
    graph.edges_vertices.map(ev => ev.map(v => graph.vertices_coords[v]))
      // .map(e => ear.segment(e).scale(0.8))
      .map((e) => {
        const seg = ear.segment(e);
        const vec0 = seg.vector.normalize().scale(0.03);
        const vec1 = seg.vector.flip().normalize().scale(0.03);
        return [
          seg[0].add(vec0),
          seg[1].add(vec1)
        ];
        // return seg;
      })
      .map(e => drawLayer.line(e[0][0], e[0][1], e[1][0], e[1][1])
        .stroke("black")
        .strokeWidth(0.005));
    graph.vertices_coords.map(v => drawLayer.circle(0.01).center(v).fill("#fb3"));
  };

  controls = svg.controls(numVertices)
    .position(() => [Math.random(), Math.random()])
    .svg(() => topLayer.circle().radius(0.02).fill("#e53"))
    .onChange((a, b) => update(a, b));

  update();
});
