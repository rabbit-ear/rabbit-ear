function Ball() {
  const _this = {};
  _this.position = RabbitEar.vector(Math.random(), Math.random());
  const vMag = 0.02;
  _this.velocity = {
    x: Math.random() * vMag - vMag / 2,
    y: Math.random() * vMag - vMag / 2
  };
  _this.update = function () {
    _this.position = _this.position.add(_this.velocity);
  };
  _this.draw = function () {
    ellipse(_this.position.x, _this.position.y, 2);
  };
  return _this;
}

const origami = RabbitEar.Origami({ folding: true, padding: 0.1, autofit: false });
origami.fold();
origami.drawLayer = origami.svg.group();
const ball = Ball();

origami.ballCircle = RabbitEar.draw.svg.circle(0, 0, 0.02);
origami.drawLayer.appendChild(origami.ballCircle);

origami.svg.animate = function (event) {
  const boundPts = origami.boundaries[0].vertices.map(v => origami.vertices_coords[v]);
  const boundary = RabbitEar.convexPolygon(boundPts);
  ball.update();

  // origami.drawLayer.removeChildren();
  // let edgePoints = boundary.edges
  //  .map(edge => edge.nearestPoint(ball.position.x, ball.position.y));
  // edgePoints.forEach(p => origami.drawLayer.circle(p[0], p[1], 0.02));

  if (origami.ballCircle.setAttribute != null) {
    origami.ballCircle.setAttribute("cx", ball.position.x);
    origami.ballCircle.setAttribute("cy", ball.position.y);
  }
  const inside = boundary.contains(ball.position.x, ball.position.y);

  if (!inside) {
    const nearest = boundary.nearest(ball.position);
    const beyondVec = ball.position.subtract(nearest.point);
    const matrix = nearest.edge.reflection();
    matrix[4] = 0;
    matrix[5] = 0;
    ball.velocity = matrix.transform(ball.velocity);
    ball.position = nearest.point;
    ball.velocity.x += beyondVec.x * 2;
    ball.velocity.y += beyondVec.y * 2;
    ball.position.x += ball.velocity.x * 2;
    ball.position.y += ball.velocity.y * 2;
    // let dampen = beyondVec.scale(0.5);
    // console.log(beyondVec);
    // let mag1 = ball.velocity.magnitude;
    // let mag2 = beyondVec.magnitude;
    // console.log(mag1, mag2);
  }
};
