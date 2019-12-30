let cirPPad = 6;
RabbitEar.svg("canvas-circle-packing", -cirPPad, -cirPPad, 500 + 2 * cirPPad, 500 + 2 * cirPPad, (circlePack) => {
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  circlePack.appendChild(defs);
  // const defs = circlePack.defs();
  const clipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
  defs.appendChild(clipPath);
  clipPath.setAttribute("id", "page-clip");
  const clipRect = RabbitEar.svg.rect(0, 0, 500, 500);
  clipPath.appendChild(clipRect);

  const circleLayer = circlePack.group();
  circlePack.rect(0, 0, 500, 500)
    .fill("none")
    .strokeWidth(6)
    .stroke("black");
  const drawLayer = circlePack.group();
  const circles = Array.from(Array(12)).map(() => RabbitEar.circle(0, 0, 0));
  circles.forEach((c) => { c.svg = circleLayer.circle(0, 0, 0); });

  const theAnimatefunc = function (event) {
    if (circlePack.mouse.isPressed) {
      // circles.forEach(c => c.radius *= 1.002);
    }
    const result = circlePack.analyze();
    const mag = result.magnitude;
    const stillCount = result.stillCount;
    const frameDiff = mag - circlePack.readings[event.frame % 2];
    // if (Math.abs(frameDiff) < .02 && stillCount < 2) {
    if (Math.abs(frameDiff) < .05 && stillCount < 2) {
      circlePack.frozenCount += 1;
    }
    if (circlePack.frozenCount > 40) {
      circlePack.animate = undefined;
    }
    // console.log(circlePack.frozenCount, frameDiff);
    circlePack.readings[event.frame % 2] = mag;
    if (mag > -50) {
      circles.forEach((c) => { c.radius *= 1.003; });//1.002);
    } else {
      circles.forEach((c) => { c.radius *= 0.997; });//0.998);
    }
    circlePack.update();
    // console.log(mag);
    // circlePack.increment();
  };

  const boot = function () {
    circles.forEach((c) => {
      c.origin[0] = Math.random() * 500;
      c.origin[1] = Math.random() * 500;
      c.radius = 6 + Math.random() * 60;
    });

    circles.forEach(c => c.svg.setAttribute("fill", "#158"));
    circles.forEach(c => c.svg.setAttribute("style", "clip-path: url(#page-clip)"));
    circlePack.readings = [];
    circlePack.frozenCount = 0;
    circlePack.animate = theAnimatefunc;
  };
  boot();

  circlePack.analyze = function () {
    const matrix = Array.from(Array(12)).map(() => []);
    for (let i = 0; i < 12 - 1; i += 1) {
      for (let j = i + 1; j < 12; j += 1) {
        matrix[i][j] = Math.sqrt(
          ((circles[i].origin[0] - circles[j].origin[0]) ** 2) +
          ((circles[i].origin[1] - circles[j].origin[1]) ** 2)
        ) - (circles[i].radius + circles[j].radius);
      }
    }

    drawLayer.removeChildren();

    circlePack.vectors = Array.from(Array(12)).map(() => RabbitEar.vector(0, 0));
    const pos_neg = [0, 0];
    let global_negative = 0;
    for (let i = 0; i < 12; i += 1) {
      for (let v = 0; v < 12; v += 1) {
        let vec = [0, 0];
        const d = matrix[v][i] || matrix[i][v];
        if (d != null) {
          if (d < 0) {
            global_negative += d;
          }
          pos_neg[((d < 0) ? 0 : 1)] += 1;
          const amp = (d < 0)
            ? d * 0.001
            : d * 0; //0.000001;
          vec = [
            (circles[i].origin[0] - circles[v].origin[0]),
            (circles[i].origin[1] - circles[v].origin[1])
          ];
          vec[0] *= amp;
          vec[1] *= amp;
        }
        circlePack.vectors[v][0] += vec[0];
        circlePack.vectors[v][1] += vec[1];
        circlePack.vectors[i][0] -= vec[0];
        circlePack.vectors[i][1] -= vec[1];
      }
    }
    // let moving = circlePack.vectors.map(a => a[0] !== 0 || a[1] !== 0);
    const stillCount = circlePack.vectors
      .map(a => a[0] === 0 && a[1] === 0)
      .map(a => (a === true ? 1 : 0))
      .reduce((a, b) => a + b, 0);

    // console.log(stillCount);
    // console.log(global_negative);

    circles.forEach((c, i) => {
      c.origin[0] += circlePack.vectors[i][0];
      c.origin[1] += circlePack.vectors[i][1];
    });

    circles.forEach((c, i) => {
      if (c.origin[0] < 0) { c.origin[0] = 0; }
      if (c.origin[1] < 0) { c.origin[1] = 0; }
      if (c.origin[0] > 500) { c.origin[0] = 500; }
      if (c.origin[1] > 500) { c.origin[1] = 500; }
    });


    for (let i = 0; i < 12; i += 1) {
      for (let v = 0; v < 12; v += 1) {
        const d = matrix[v][i] || matrix[i][v];
        if (d != null && d < 5) {
          let opacity = (d - 5) / 5;
          if (opacity < 0) { opacity = 0; }
          let stroke_width = 3 - 3 * Math.pow(((d - 5) / 5), 1);
          if (stroke_width < 0) { stroke_width = 0; }
          drawLayer.line(
            circles[v].origin[0],
            circles[v].origin[1],
            circles[i].origin[0],
            circles[i].origin[1]
          ).stroke("#fb3").strokeWidth(stroke_width).strokeLinecap("round");
        }
      }
    }

    return { magnitude: global_negative, stillCount };
  };

  circlePack.mousePressed = boot;

  circlePack.increment = function () {
    circles.forEach((c) => { c.radius += 1; });
    circlePack.update();
  };
  circlePack.decrement = function () {
    circles.forEach((c) => { c.radius -= 1; });
    circlePack.update();
  };

  circlePack.update = function () {
    circles.forEach(c => c.svg.setAttribute("cx", c.origin[0]));
    circles.forEach(c => c.svg.setAttribute("cy", c.origin[1]));
    circles.forEach(c => c.svg.setAttribute("r", c.radius));
  };
});
