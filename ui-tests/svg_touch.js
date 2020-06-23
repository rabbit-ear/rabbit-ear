var svgTouchCallback;

var windowAspect = window.innerWidth / window.innerHeight;
var VecTw = window.innerWidth > window.innerHeight ? windowAspect * 2.8 : 2.0;
var VecTh = window.innerWidth > window.innerHeight ? 2.8 : 2.0 / (windowAspect);

RabbitEar.svg(document.querySelector("#canvas-svg-touch"), -VecTw / 2, -VecTh / 2, VecTw, VecTh, (svg) => {
  const { RabbitEar } = window;

  const strokeWidth = 0.04;
  const GRIDS = 8;

  const gridLayer = svg.g()
    .fill("lightgray")
    .stroke("lightgray")
    .strokeLinecap("round")
    .strokeWidth(strokeWidth);

  // grid lines
  for (let i = -GRIDS; i <= GRIDS; i += 1) {
    gridLayer.line(i, -GRIDS, i, GRIDS);
    gridLayer.line(-GRIDS, i, GRIDS, i);
  }
  gridLayer.line(0, -GRIDS, 0, GRIDS).stroke("black");
  gridLayer.line(-GRIDS, 0, GRIDS, 0).stroke("black");

  const points = [];

  const drawLayer = svg.g();

  const p = svg.polyline()
    .fill("none")
    .stroke("black")
    .strokeWidth(strokeWidth);

  const update = function (mouse) {
    drawLayer.removeChildren();
    if (mouse.isPressed) {
      // drawLayer.circle(mouse.pressed.x, mouse.pressed.y, 0.1).fill("#e53");
      drawLayer.arrow(mouse.pressed.x, mouse.pressed.y, mouse.x, mouse.y)
        .stroke("#158")
        .fill("#158")
        .head({ width: strokeWidth * 2, height: strokeWidth * 6 })
        .strokeWidth(strokeWidth);
      p.stroke("#e53");
    } else {
      p.stroke("black");
    }
    if (typeof svgTouchCallback === "function") { svgTouchCallback(mouse); }
  };

  svg.mouseMoved = function (mouse) {
    points.push(mouse);
    if (points.length > 30) { points.shift(); }
    p.setPoints(points);
    update(mouse);
  };
  svg.mousePressed = function (mouse) {
    update(mouse);
  };
  svg.mouseReleased = function (mouse) {
    update(mouse);
  };
});
