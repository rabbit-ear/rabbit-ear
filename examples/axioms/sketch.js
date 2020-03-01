const origami = RabbitEar.origami(document.querySelectorAll(".canvas")[0], {
  diagrams: true,
  padding: 0.1,
  attributes: {
    edges: { valley: { stroke: "#158", "stroke-dasharray": "0.02 0.01" } }
  }
});

const folded = RabbitEar.origami(document.querySelectorAll(".canvas")[0], {
  padding: 0.1,
  autofit: false,
  attributes: {
    faces: { front: { fill: "white" }, back: { fill: "#fb4" } }
  }
});

let lang = "en";
let axiom;  // number 1 through 7
let controls = origami.svg.controls(0);
let result; // solutions to current axiom
let axiomSolutionIndex; // which solution 0,1,2 is being shown

const controlLayer = origami.svg.group().setClass("controls");
const drawLayer = origami.svg.group().setClass("controls");
const axiomControlCount = [null, 2, 2, 4, 3, 4, 6, 5];
const axiomPointCount = [null, 2, 2, 0, 1, 2, 2, 1];
const axiomLineCount = [null, 0, 0, 2, 1, 1, 2, 2];
const languages = {
  "ar": "عربى", "de": "Deusch", "en": "English", "es": "Español", "fr": "Français",
  "hi": "हिंदी", "jp": "日本語", "ko": "한국어", "ms": "Malay", "pt": "Português",
  "ru": "Pусский", "tr": "Türkçe", "vi": "Tiếng Việt", "zh": "中文"
};

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

const updateDescription = function () {
  document.querySelectorAll(".description")[0].innerHTML = RabbitEar.text.axioms[lang][axiom];
};

const drawParams = function (params) {
  drawLayer.removeChildren();
  if (!params.lines) { return; }
  params.lines
    .forEach(line => origami.boundaries[0].clipLine(line)
      .filter(s => s != null)
      .forEach(s => drawLayer.line(s[0][0], s[0][1], s[1][0], s[1][1])
        .strokeWidth(0.01)
        .stroke("#fb3")));
};

const controlsOnChange = function (points) {
  const params = toAxiomParams(points);
  result = RabbitEar.axiom(axiom, params);
  drawParams(params);
  origami.load(RabbitEar.bases.square);
  if (result.solutions.length) {
    const solutions = Array.from(result.solutions);
    origami.fold(...solutions.splice(axiomSolutionIndex, 1));
    solutions.forEach(line => origami.boundaries[0].clipLine(line)
      .filter(s => s != null)
      .forEach(s => drawLayer.line(s[0][0], s[0][1], s[1][0], s[1][1])
        .strokeWidth(0.005)
        .stroke("#ddd")));
    folded.load(origami);
    folded.fold();
  }
};

const rebuild = function () {
  controls.removeAll();
  controls = origami.svg.controls(axiomControlCount[axiom])
    .svg(() => controlLayer.circle().radius(0.02).fill("#fb3").stroke("none"))
    .position(() => [Math.random(), Math.random()])
    .onChange(controlsOnChange, true);
};

const setAxiom = function (event, i) {
  document.querySelectorAll("[id^=button-axiom]")
    .forEach(b => b.setAttribute("class", "button"));
  event.target.setAttribute("class", "button red");
  axiom = i;
  axiomSolutionIndex = 0;
  updateDescription();
  rebuild();
};

origami.svg.mouseReleased = function (mouse) {
  if (mouse.drag.x === 0 && mouse.drag.y === 0) {
    axiomSolutionIndex = result.solutions
      .map(line => line.nearestPoint(mouse))
      .map(point => point.distanceTo(mouse))
      .map((d, i) => ({d:d, i:i}))
      .sort((a, b) => a.d - b.d)
      .shift().i;
    controlsOnChange(controls);
  }
}

document.querySelectorAll("[id^=button-axiom]")
  .forEach((a, i) => a.onclick = (event) => setAxiom(event, i + 1));

document.querySelectorAll(".description")[0].onclick = function () {
  const languageList = Object.keys(RabbitEar.text.axioms);
  const newIndex = (languageList.indexOf(lang) + 1) % languageList.length;
  lang = languageList[newIndex];
  const languageCover = document.querySelectorAll(".language")[0];
  languageCover.remove();
  languageCover.childNodes[0].innerHTML = languages[lang];
  document.body.appendChild(languageCover);
  updateDescription();
};

window.addEventListener("load", function () {
  // start
  setAxiom({ target: document.querySelector("#button-axiom-2") }, 2);
});
