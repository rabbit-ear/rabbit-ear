svg.size(-250, -250, 500, 500);

const NUM_LINES = 2;

let colors = ["#158", "#fb4", "#e53"];
const lines = Array.from(Array(NUM_LINES))
  .map(() => svg.line().stroke("black").strokeWidth(5).strokeLinecap("round"));
const wedges = Array.from(Array(NUM_LINES))
  .map((_, i) => svg.wedge().fill(colors[i % 3]));

const update = function (p, i, points) {
  let angles = points.map(el => Math.atan2(el[1], el[0]));
  let vecs = angles.map(a => [Math.cos(a), Math.sin(a)]);
  let r = svg.getHeight() / 3;

  vecs.map(vec => vec.map((n, i) => n * r))
    .map(pt2 => [[0, 0], pt2])
    .forEach((pts, i) => lines[i].setPoints(...pts));

  wedges.forEach((w,i,a) => {
    w.setArc(0, 0,
      svg.getWidth() * 0.25,
      Math.atan2(vecs[i][1], vecs[i][0]),
      Math.atan2(vecs[(i+1)%a.length][1], vecs[(i+1)%a.length][0]),
      true
    );
  });
};

svg.controls(NUM_LINES)
  .svg(() => ear.svg.circle(10).fill("#e53"))
  .position(() => [
    (Math.random() - 0.5) * svg.getWidth(),
    (Math.random() - 0.5) * svg.getHeight(),
  ])
  .onChange(update, true);
