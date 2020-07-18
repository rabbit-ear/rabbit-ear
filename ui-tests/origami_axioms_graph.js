var axiomSketchCallback;

var windowAspect = window.innerWidth / window.innerHeight;
var VecTw = window.innerWidth > window.innerHeight ? windowAspect * 2.8 : 2.0;
var VecTh = window.innerWidth > window.innerHeight ? 2.8 : 2.0 / (windowAspect);

RabbitEar.svg(document.querySelector("#canvas-axioms-graph"), -VecTw / 2, -VecTh / 2, VecTw, VecTh, (svg) => {
  const { RabbitEar } = window;

  const strokeWidth = 0.04;
  const GRIDS = 8;
  // const bounds = RabbitEar.rect(-VecTw / 2, -VecTh / 2, VecTw, VecTh);
  const bounds = RabbitEar.rect(-50, -50, 100, 100);
  console.log(bounds);
  const colors = ["#158", "#e53", "#fb3"];

  const gridLayer = svg.g()
    .fill("lightgray")
    .stroke("lightgray")
    .strokeLinecap("round")
    .strokeWidth(strokeWidth);

  let controls = svg.controls(0);
  const drawLayer = svg.g().setClass("controls")
    .fill("none")
    .strokeWidth(strokeWidth);
  const controlLayer = svg.g().setClass("controls");

  // grid lines
  for (let i = -GRIDS; i <= GRIDS; i += 1) {
    gridLayer.line(i, -GRIDS, i, GRIDS);
    gridLayer.line(-GRIDS, i, GRIDS, i);
  }
  gridLayer.line(0, -GRIDS, 0, GRIDS).stroke("black");
  gridLayer.line(-GRIDS, 0, GRIDS, 0).stroke("black");

  let axiom = 2;
  const axiomControlCount = [null, 2, 2, 4, 3, 4, 6, 5];
  const axiomPointCount = [null, 2, 2, 0, 1, 2, 2, 1];
  const axiomLineCount = [null, 0, 0, 2, 1, 1, 2, 2];

  const toAxiomParams = function (points) {
    const numPoints = axiomPointCount[axiom];
    const numLines = axiomLineCount[axiom];
    return {
      points: points.slice().splice(numLines*2),
      lines: Array.from(Array(numLines))
        .map((_, i) => [ points[i*2+0], [
          points[i*2+1][0] - points[i*2+0][0],
          points[i*2+1][1] - points[i*2+0][1]]
        ])
    };
  }

  const drawParams = function (params) {
    drawLayer.removeChildren();
    if (!params.lines) { return; }
    params.lines
      .map(line => bounds.clipLine(line))
      .filter(s => s != null)
      .forEach(s => drawLayer.line(s[0][0], s[0][1], s[1][0], s[1][1])
        .strokeWidth(strokeWidth)
        .stroke("#fb3"));
  };

  const rebuild = function () {
    controls.removeAll();
    controls = svg.controls(axiomControlCount[axiom])
      .svg(() => controlLayer.circle().radius(strokeWidth*2).fill("#fb3").stroke("none"))
      .position(() => [Math.random(), Math.random()])
      .onChange((points) => {
        const params = toAxiomParams(points);
        const result = RabbitEar.axiom(axiom, params);
        if (typeof axiomSketchCallback === "function") {
          axiomSketchCallback(JSON.parse(JSON.stringify(result)));
        }
        drawParams(params);

        result.solutions
          .map(line => bounds.clipLine(line))
          .filter(s => s != null)
          .forEach((s, i) => drawLayer.line(s[0][0], s[0][1], s[1][0], s[1][1])
            .strokeWidth(strokeWidth)
            .strokeDasharray(strokeWidth*2 + " " + strokeWidth*2)
            .strokeLinecap("round")
            .stroke(colors[i]));
      }, true);
  };

  const setAxiom = function (event, i) {
    document.querySelectorAll("[id^=button-axiom]")
      .forEach(b => b.setAttribute("class", "button"));
    event.target.setAttribute("class", "button red");
    axiom = i;
    rebuild();
  }

  document.querySelectorAll("[id^=button-axiom]")
    .forEach((a, i) => a.onclick = (event) => setAxiom(event, i + 1));

  // start
  rebuild();
});
