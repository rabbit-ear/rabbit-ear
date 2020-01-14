var returned; 
returned = RabbitEar.Origami("canvas-reflection", 800, 800, (origami) => {
  console.log("inside the sketch", origami);
  returned = origami;

  // const line = origami.svg.line()
  //   .stroke("#e53")
  //   .strokeWidth(3)
  //   .strokeDasharray("6 6")
  //   .strokeLinecap("round");

  // const update = function (points, point) {

  // };

  // origami.svg.controls(2)
  //   .svg(() => RabbitEar.svg.circle().radius(8).fill("#e53"))
  //   .position(i => [(i % 2 === 0 ? 0.75 : 0.25) * origami.svg.getWidth(), 0.5 * origami.svg.getHeight()])
  //   .onChange((a, b) => update(a, b), true);
});
