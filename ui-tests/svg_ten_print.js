RabbitEar.svg(document.querySelector("#canvas-ten-print"), (svg) => {
  svg.size(40, 25);
  svg.rect(0, 0, svg.getWidth(), svg.getHeight()).fill("#329");

  var clip = svg.clipPath();
  clip.rect(0, 0, svg.getWidth(), svg.getHeight());
  var layer = svg.g()
    .stroke("#76d")
    .strokeWidth("1%")
    .strokeLinecap("square")
    .clipPath(clip);

  const redraw = function () {
    layer.removeChildren();
    var path = svg.path();
    for (var y = 0; y < 25; y += 1) {
      for (var x = 0; x < 40; x += 1) {
        var t = Math.random() - 0.5 > 0 ? 0 : 1;
        var u = t ? 0 : 1;
        path.Move(x, y + t).Line(x + 1, y + u);
      }
    }
    layer.appendChild(path);
  };
  redraw();

  svg.mousePressed = redraw;
});
