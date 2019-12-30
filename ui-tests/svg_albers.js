RabbitEar.svg("canvas-albers", (svg) => {
  svg.size(90, 90);
  svg.background("#9590c0");

  var g = svg.group().translate(35, 15);
  var style = { fill: "#2c266d", opacity: 0.4 };

  g.rect(0, 0, 30, 50).setAttributes(style)
    .transformOrigin("0 50")
    .rotate(25);

  g.rect(0, 0, 30, 50).setAttributes(style);

  g.rect(0, 0, 30, 50).setAttributes(style)
    .transformOrigin("0 50")
    .rotate(-25);
});
