const origami = RabbitEar.origami(document.querySelectorAll(".canvas")[0], {
  diagrams: true,
  padding: 0.1,
  attributes: {
    edges: {
      valley: {stroke: "#158", "stroke-dasharray": "0.02 0.01" }
    }
  }
});

const folded = RabbitEar.origami(document.querySelectorAll(".canvas")[0], {
  padding: 0.1,
  autofit: false
});

let axiom = 2;
let controls = origami.svg.controls(0);

const controlLayer = origami.svg.group().setClass("controls");
const drawLayer = origami.svg.group().setClass("controls");
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
    .forEach(line => origami.boundaries[0].clipLine(line)
      .filter(s => s != null)
      .forEach(s => drawLayer.line(s[0][0], s[0][1], s[1][0], s[1][1])
        .strokeWidth(0.01)
        .stroke("#fb4")));
};

const rebuild = function () {
  controls.removeAll();
  controls = origami.svg.controls(axiomControlCount[axiom])
    .svg(() => controlLayer.circle().radius(0.02).fill("#fb4").stroke("none"))
    .position(() => [Math.random(), Math.random()])
    .onChange((points) => {
      const params = toAxiomParams(points);
      const result = RabbitEar.axiom(axiom, params);
      drawParams(params);
      origami.load(RabbitEar.bases.square);
      if (result.solutions.length) {
        origami.fold(result.solutions[0]);
        result.solutions.shift();
        result.solutions.forEach(line => origami.boundaries[0].clipLine(line)
          .filter(s => s != null)
          .forEach(s => drawLayer.line(s[0][0], s[0][1], s[1][0], s[1][1])
            .strokeWidth(0.005)
            .stroke("#ddd")));
        folded.load(origami);
        folded.fold();
      }
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
