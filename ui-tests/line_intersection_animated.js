// requires perlin.js
let wobble_intersections_callback = undefined;

const wobble = new re.Origami("canvas-intersection-wobble");
// wobble.setBounds(-1, -0.5, 2, 1);
wobble.edges.visible = false;

wobble.intersections = [];
wobble.faceLayer = re.svg.group();
wobble.intersectionLayer = re.svg.group();

const numLines = 14;

wobble.reset = function () {
  wobble.cp = re.CreasePattern.empty();
  wobble.cp.vertices_coords = [];
  wobble.cp.edges_vertices = [];
  wobble.cp.edges_assignment = [];
  for (let i = 0; i < numLines + 1; i += 1) {
    wobble.cp.vertices_coords.push([Math.random(), Math.random()]);
  }
  wobble.cp.edges_vertices = Array.from(Array(numLines)).map((_, i) => [i, i + 1]);
  wobble.cp.edges_assignment = Array(numLines).fill("F");
  wobble.cp.rebuild();
  wobble.draw();
};

wobble.reset();

wobble.animate = function (event) {
  for (let i = 0; i < numLines + 1; i += 1) {
    const xnoise = Math.sin(Math.cos(i * 1.23) + i * 32.198 + event.time * 0.5);
    const ynoise = Math.sin(Math.cos(i * 2.34) + i * 45.678 + event.time * 0.5);
    wobble.cp.vertices_coords[i][0] = xnoise;
    wobble.cp.vertices_coords[i][1] = ynoise;
  }
  wobble.cp.edges_vertices = Array.from(Array(numLines)).map((_, i) => [i, i + 1]);
  wobble.cp.edges_assignment = Array(numLines).fill("F");
  wobble.cp.rebuild();
  wobble.draw();
  wobble.setViewBox(-1, -1, 2, 2);
  let centers = wobble.cp.faces_vertices.map(face => face
    .map(v => wobble.cp.vertices_coords[v])
    .reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0])
    .map(el => el / face.length));

  let xs = centers.map(center => (center[0] * 0.5 + 0.5) * 255);
  let ys = centers.map(center => (1.0 - (center[1] * 0.5 + 0.5)) * 255);

  centers.forEach((center, i) => wobble.faces[i].svg.style = `fill: rgb(${xs[i] < ys[i] ? ys[i] : xs[i]}, ${ys[i]}, ${ys[i]})`);
};

wobble.onResize = function (event) { };
wobble.onMouseDown = function (event) { };
wobble.onMouseUp = function (event) { };
wobble.onMouseMove = function (event) { };
