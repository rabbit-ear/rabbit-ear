RabbitEar.origami(document.querySelector("#origami"), { padding: 0.02 }, function (origami) {
  var layer = origami.svg.group();
  var controls;

  slider.oninput = function (e) {
    var NUM_CREASES = parseInt(e.target.value) * 2 + 1;
    if (controls) { controls.removeAll(); }
    controls = origami.svg.controls(NUM_CREASES)
      .position(() => [Math.random(), Math.random()])
      .svg(() => origami.svg.circle().radius(0.01).fill("#e53"))
      .onChange((points, point) => {
        layer.removeChildren();

        points.map(p => RabbitEar.ray(0.5, 0.5, p[0] - 0.5, p[1] - 0.5))
          .map(line => origami.boundaries[0].clipRay(line))
          .forEach(s => layer.line(...s)
            .stroke("black")
            .strokeWidth(0.005)
            .strokeDasharray("0.02 0.01"));

        var radians = points.map(p => [p[0] - 0.5, p[1] - 0.5])
          .map(v => Math.atan2(v[1], v[0]))
          .sort((a, b) => a-b);
        // console.log(radians);
        var solutions = RabbitEar.core.kawasaki_solutions_radians(radians);
        solutions.filter(s => s !== undefined)
          .forEach(angle => {
          layer.arrow(0.5, 0.5, 0.5 + 0.4 * Math.cos(angle), 0.5 + 0.4 * Math.sin(angle))
            .head({width: 0.015, height: 0.04})
            .fill("black")
            .stroke("black")
        })
      }, true);
    // origami3D.foldPercent = parseInt(e.target.value, 10) / 100.0;
    document.querySelector("#label").innerHTML = `Creases: ${NUM_CREASES}`;
  };

  slider.oninput({target:{value:1}});
});
