const origami = re.Origami({ padding: 0.05 });
const folded = re.Origami({ padding: 0.05 });

// origami.boot = function () {
//   origami.threeCorners = {
//     file_spec: 1.1,
//     frame_attributes: ["2D"],
//     frame_classes: ["creasePattern"],
//     vertices_coords: [[0, 0], [1, 0], [1, 1], [0, 1], [0.5, 0.5]],
//     vertices_vertices: [[1, 3], [2, 0], [3, 1], [0, 2], [0, 1, 3]],
//     vertices_faces: [[0, 2], [0, 1], [1], [1, 2], [0, 1, 2]],
//     edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 4], [1, 4], [3, 4]],
//     edges_faces: [[0], [1], [1], [2], [2, 0], [0, 1], [1, 2]],
//     edges_assignment: ["B", "B", "B", "B", "V", "M", "V"],
//     edges_foldAngle: [0, 0, 0, 0, 180, 180, 180],
//     edges_length: [1, 1, 1, 1, 0.70710678, 0.70710678, 0.70710678],
//     faces_vertices: [[0, 1, 4], [1, 2, 3, 4], [3, 0, 4]],
//     faces_edges: [[0, 5, 4], [1, 2, 6, 5], [3, 4, 6]]
//   };
//   origami.cp = re.CreasePattern(origami.threeCorners);
// };

origami.boot = function () {
  origami.cp = {
    vertices_coords: [[0, 0], [1, 0], [1, 1], [0, 1], [0.5, 0.5]],
    edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 4], [1, 4], [3, 4]],
    edges_assignment: ["B", "B", "B", "B", "V", "M", "V"]
  };
  origami.threeCorners = origami.cp.copy();
};

origami.boot();

origami.midVertex = 4;

origami.updateCenter = function (point) {
  // check bounds of point
  const ep = 0.01;
  if (point.x < ep) { point.x = ep; }
  if (point.y < ep) { point.y = ep; }
  if (point.x > 1 - ep) { point.x = 1 - ep; }
  if (point.y > 1 - ep) { point.y = 1 - ep; }

  // reset back to the 3 crease CP
  origami.cp = re.CreasePattern(origami.threeCorners);
  origami.cp.vertices_coords[origami.midVertex] = [point.x, point.y];

  const a = { x: 0, y: 0 };
  const b = { x: 1, y: 1 };
  const poke_through = (b.x - a.x)
    * (origami.cp.vertices_coords[origami.midVertex][1] - a.y)
    > (b.y - a.y)
    * (origami.cp.vertices_coords[origami.midVertex][0] - a.x);

  origami.cp.edges_assignment[4] = poke_through ? "V" : "M";
  const { index } = origami.nearest(0.5, 0.5).vertex;
  console.log(index);
  let solutions = re.core.kawasaki_solutions(origami.cp, index);
  console.log(solutions);
  let solution = solutions[1];
  origami.cp.creaseRay(origami.cp.vertices_coords[index], solution);

  // origami.cp.kawasaki(origami.midVertex, 1, poke_through ? "V" : "M");
  // origami.cp.vertex[4].kawasaki

  origami.draw();

  folded.cp = origami.cp.copy();
  folded.fold(0);
  folded.cp["faces_re:layer"] = poke_through ? [1, 0, 2, 3] : [0, 1, 3, 2];
  folded.draw();
};

origami.startTime = 1.0 + Math.random() * 2;
origami.duration = 4.0;
origami.animPhase = 0;
origami.step = 0.03;

// origami.animate = function (event) {
//   if (event.time > origami.startTime) {
//     const t = (event.time - origami.startTime) / origami.duration;
//     const inc = (1.0 - Math.cos(t * Math.PI * 2)) * 0.5;
//     origami.animPhase += inc * origami.step;
//     if (t >= 1) {
//       origami.startTime = event.time + 0.2 + Math.random() * 5; // wait time
//       origami.duration = 2.0 + Math.random() * 4;
//     }
//     origami.drawFrame();
//   }
// };

origami.drawFrame = function () {
  const scale = 0.2;
  const sp = 0.12345;
  const sp2 = 0.22222;
  const off = 50.2; // 11.111;
  const point = {
    x: Math.sin(6.28 * Math.cos(off + sp * (origami.animPhase + 6))),
    y: Math.cos(6.28 * Math.cos(off + sp2 * (origami.animPhase + 6)))
  };
  const newCenter = { x: 0.5 + point.x * scale, y: 0.5 + point.y * scale };
  origami.updateCenter(newCenter);
};
origami.drawFrame();

origami.onMouseMove = function (mouse) {
  if (mouse.isPressed) {
    origami.updateCenter(mouse);
  }
};

origami.onMouseDown = function (mouse) {
  origami.updateCenter(mouse);
  origami.startTime = Infinity;
};

// origami.updateCenter({x:0.4+Math.random()*0.2, y:0.4+Math.random()*0.2});

