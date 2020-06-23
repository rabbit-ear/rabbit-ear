RabbitEar.svg(document.querySelector("#canvas-svg-controls"), (svg) => {
  svg.size(800, 800);

  var back = svg.g();
  var l1 = svg.line().stroke("black");
  var l2 = svg.line().stroke("black");
  var curve = svg.path();

  svg.controls(4)
    .svg(function () { return RabbitEar.svg.circle(0, 0, svg.getWidth() * 0.05).fill("#e53"); })
    .position(function () { return [random(svg.getWidth()), random(svg.getHeight())]; })
    .parent(back)
    .onChange(function () {
      l1.setPoints(this[0], this[1]);
      l2.setPoints(this[3], this[2]);
      curve.clear().Move(this[0]).Curve(this[1], this[2], this[3]);
    }, true);
});