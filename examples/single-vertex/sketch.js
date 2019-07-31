const { RabbitEar } = window;
const origami = RabbitEar.Origami({ padding: 0.05 });
const folded = RabbitEar.Origami({ padding: 0.05 });

origami.boot = function () {
  origami.load({
    vertices_coords: [[0, 0], [1, 0], [1, 1], [0, 1], [0.5, 0.5]],
    edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 4], [1, 4], [3, 4]],
    edges_assignment: ["B", "B", "B", "B", "V", "M", "V"]
  });
  origami.threeCorners = origami.copy();
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
  origami.load(origami.threeCorners);
  origami.vertices_coords[origami.midVertex] = [point.x, point.y];
  origami.complete();

  const a = { x: 0, y: 0 };
  const b = { x: 1, y: 1 };
  const poke_through = (b.x - a.x)
    * (origami.vertices_coords[origami.midVertex][1] - a.y)
    > (b.y - a.y)
    * (origami.vertices_coords[origami.midVertex][0] - a.x);

  origami.edges_assignment[4] = poke_through ? "V" : "M";
  const { index } = origami.nearest(0.5, 0.5).vertex;
  const solutions = RabbitEar.core.kawasaki_solutions(origami, index);
  const solution = solutions[1];

  const segment = origami.boundaries.clipRay(origami.vertices_coords[index], solution);
  origami.mark(segment[0], segment[1], "V");

  // origami.kawasaki(origami.midVertex, 1, poke_through ? "V" : "M");
  // origami.vertex[4].kawasaki

  origami.svg.draw();

  folded.load(origami.copy());
  folded.fold(0);
  folded["faces_re:layer"] = poke_through ? [1, 0, 2, 3] : [0, 1, 3, 2];
  // folded.clean();
  folded.svg.draw();
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

origami.svg.onMouseMove = function (mouse) {
  if (mouse.isPressed) {
    origami.updateCenter(mouse);
  }
};

origami.svg.onMouseDown = function (mouse) {
  origami.updateCenter(mouse);
  origami.startTime = Infinity;
};

// origami.updateCenter({x:0.4+Math.random()*0.2, y:0.4+Math.random()*0.2});
