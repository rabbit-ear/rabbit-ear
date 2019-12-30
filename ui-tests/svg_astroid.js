RabbitEar.svg("canvas-svg-astroid", (svg) => {
  svg.size(512, 512);
  svg.stroke("black");

  var SEGMENTS = 80;
  var w = svg.getWidth() / SEGMENTS * 0.5;
  var h = svg.getHeight() / SEGMENTS * 0.5;

  for (var i = 0; i < SEGMENTS; i += 1) {
    var j = SEGMENTS - i;
    svg.line(w * i, svg.getHeight() / 2, svg.getWidth() / 2, h * j);
    svg.line(svg.getWidth() - w * j, svg.getHeight() / 2, svg.getWidth() / 2, h * i);
    svg.line(svg.getWidth() - w * i, svg.getHeight() / 2, svg.getWidth() / 2, svg.getHeight() - h * j);
    svg.line(svg.getWidth() / 2, svg.getHeight() - h * i, w * j, svg.getHeight() / 2);
  }
});
