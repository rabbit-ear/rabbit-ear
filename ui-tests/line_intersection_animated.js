// requires perlin.js
var wobble_intersections_callback = undefined;

let wobble;
wobble = RabbitEar.Origami("canvas-intersection-wobble", (wobbleSVG) => {
  // wobble.setBounds(-1, -0.5, 2, 1);
  // wobble.edges.visible = false;

  wobble.intersections = [];

  wobble.faceLayer = wobble.svg.group();
  wobble.intersectionLayer = wobble.svg.group();

  const numLines = 14;

  wobble.vertices_coords = [];
  wobble.edges_vertices = [];
  wobble.edges_assignment = [];
  wobble.edges_foldAngle = [];
  wobble.edges_length = [];
  wobble.faces_vertices = [];
  wobble.faces_edges = [];
  wobble.faces_faces = [];
  wobble.vertices_edges = [];

  for (let i = 0; i < numLines + 1; i += 1) {
    wobble.vertices_coords.push([Math.random(), Math.random()]);
  }
  wobble.edges_vertices = Array.from(Array(numLines)).map((_, i) => [i, i + 1]);
  wobble.edges_assignment = Array(numLines).fill("F");
  wobble.rebuild();
  wobble.svg.draw();

  wobble.svg.animate = function (event) {
    for (let i = 0; i < numLines + 1; i += 1) {
      const xnoise = Math.sin(Math.cos(i * 1.23) + i * 32.198 + event.time * 0.5);
      const ynoise = Math.sin(Math.cos(i * 2.34) + i * 45.678 + event.time * 0.5);
      wobble.vertices_coords[i][0] = xnoise;
      wobble.vertices_coords[i][1] = ynoise;
    }
    wobble.edges_vertices = Array.from(Array(numLines)).map((_, i) => [i, i + 1]);
    wobble.edges_assignment = Array(numLines).fill("B");
    wobble.rebuild();
    wobble.svg.draw();
    wobble.svg.setViewBox(-1, -1, 2, 2);
    const centers = wobble.faces_vertices.map(face => face
      .map(v => wobble.vertices_coords[v])
      .reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0])
      .map(el => el / face.length));

    const xs = centers.map(center => (center[0] * 0.5 + 0.5) * 255);
    const ys = centers.map(center => (1.0 - (center[1] * 0.5 + 0.5)) * 255);

    centers.forEach((center, i) => {
      // wobble.faces[i].svg.style = `fill: rgb(${xs[i] < ys[i] ? ys[i] : xs[i]}, ${ys[i]}, ${ys[i]})`;
      wobble.faces[i].svg.style = `fill: ${i % 2 === 0 ? "#fb3" : "#e53"}`;
    });
  };
});
