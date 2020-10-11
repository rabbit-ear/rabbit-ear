let lerpsCallback = undefined;

svg.size(500, 500);

const bottom = svg.g()
  .strokeWidth(7)
  .strokeLinecap("round");
const middle = svg.g();
const top = svg.g()
  .strokeWidth(7)
  .strokeLinecap("round");

const grayLine1 = bottom.line().stroke("lightgray").strokeDasharray("7 14");
const grayLine2 = bottom.line().stroke("lightgray").strokeDasharray("7 14");
const curve = bottom.path().stroke("#fb4").fill("none");
const midLine = top.line().stroke("#158");
const midPoints = [
  svg.circle().radius(16).fill("#158"),
  svg.circle().radius(16).fill("#158")
];
const lerpDot = svg.circle().radius(16).fill("#fb4");

const angles = [Math.random() * Math.PI * 2];
angles[1] = angles[0] + Math.random() * Math.PI * 0.7 + 1;
angles[2] = angles[1] + Math.random() * Math.PI * 0.7 + 1;
const positions = angles.map((a, i) => [
  svg.getWidth() / 2 + Math.cos(a) * svg.getHeight() * 0.4,
  svg.getHeight() / 2 + Math.sin(a) * svg.getHeight() * 0.4,
]);

const controls = svg.controls(3)
  .svg(() => middle.circle().radius(16).fill("#e53"))
  .position(i => positions[i])
  .onChange((point, i, points) => {
    const mids = [0,1].map(i => ear.vector(points[i]).lerp(points[2], 0.666));
    curve.clear().Move(points[0]).Curve(...mids, points[1]);
    grayLine1.setPoints(points[0].x, points[0].y, points[2].x, points[2].y);
    grayLine2.setPoints(points[2].x, points[2].y, points[1].x, points[1].y);
  }, true);

svg.play = function (event) {
  if (!controls) { return; }
  const phase = Math.sin(event.time) * 0.5 + 0.5;
  const vecs = controls.map(el => ear.vector(el));
  const ctrl = [
    vecs[0].lerp(vecs[2], phase),
    vecs[2].lerp(vecs[1], phase)
  ];
  midPoints.forEach((p, i) => p.setCenter(ctrl[i].x, ctrl[i].y));
  const lerp = ctrl[0].lerp(ctrl[1], phase);
  lerpDot.setCenter(lerp.x, lerp.y);
  midLine.setPoints(ctrl[0].x, ctrl[0].y, ctrl[1].x, ctrl[1].y);
  if (lerpsCallback !== undefined) { lerpsCallback({ t: phase }); }
};
