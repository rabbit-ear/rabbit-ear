RabbitEar.svg("canvas-svg-arrows", (svg) => {
  svg.size(100, 100);

  var arrowBlue = svg.arrow()
    .stroke("#158")
    .fill("#158")
    .strokeWidth(8)
    .head({ width: 8, height: 16 })
    .strokeDasharray("8 4");

  var arrowBlack = svg.arrow()
    .stroke("black")
    .strokeWidth(0.3)
    .head({ width: 1, height: 4 })
    .tail({ width: 1, height: 4 });

  var arrowRed = svg.arrow()
    .stroke("#e53")
    .fill("#e53")
    .curve(0.4)
    .head({ width: 2, height: 6 });

  svg.controls(4)
    .position(function () { return [random(svg.getWidth()), random(svg.getHeight())]; })
    .onChange(function () {
      arrowBlue.setPoints(this[0], this[1]);
      arrowBlack.setPoints(this[1], this[2]);
      arrowRed.setPoints(this[2], this[3]);
    }, true);

});
