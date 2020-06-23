RabbitEar.svg(document.querySelector("#canvas-svg-mask"), (svg) => {
  svg.size(1, 1);
  svg.background("#edb", true);

  var points = Array.from(Array(100))
    .map(() => [random(-1, 2), random(-1, 2)]);

  var maskA = svg.mask();
  var maskB = svg.mask();

  maskA.polygon(points).fill("white").fillRule("evenodd");
  maskB.rect(-1, -1, 3, 3).fill("white");
  maskB.polygon(points).fill("black").fillRule("evenodd");

  svg.circle(random(), random(), 0.5).fill("black").mask(maskA);
  svg.circle(random(), random(), 0.5).fill("#e53").mask(maskB);
});
