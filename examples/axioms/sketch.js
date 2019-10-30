const { RabbitEar } = window;
const patternStyle = ".creasePattern .valley { stroke: black; }";
const origami = RabbitEar.Origami("origami-cp", { padding: 0.05, diagram: true, style: patternStyle });
const folded = RabbitEar.Origami("origami-fold", { padding: 0.05 }); // ,shadows:true});

folded.fold();

const languages = ["ar", "de", "en", "es", "fr", "hi", "jp", "ko", "ms", "pt", "ru", "tr", "zh"];
let language = languages.indexOf("en");

origami.markLayer = origami.svg.group().pointerEvents("none");
origami.controls = origami.svg.controls(0);

// console.log(origami.controls);

origami.axiom = undefined;
origami.subSelect = 0; // some axioms have 2 or 3 results
origami.polygonBoundary = RabbitEar.polygon(origami.boundaries[0].vertices
  .map(v => origami.vertices_coords[v]));

// a lookup for expected parameters in axiom() func. is param a point or line?
origami.paramIsLine = [null,
  [false, false],
  [false, false],
  [true, true, true, true],
  [true, true, false],
  [true, true, false, false],
  [true, true, true, true, false, false],
  [true, true, true, true, false]
];

// 1: hard reset, axiom has changed
origami.setAxiom = function (axiom) {
  if (axiom < 1 || axiom > 7) { return; }
  // axiom number buttons
  document.querySelectorAll("[id^=btn-axiom]")
    .forEach((b) => { b.className = "button"; });
  document.querySelector(`#btn-axiom-${axiom}`).className = "button red";
  // sub options buttons
  const optionsCountArray = [null, 0, 0, 2, 0, 2, 3, 0];
  const optionCount = optionsCountArray[axiom];
  document.querySelectorAll("[id^=btn-option]")
    .forEach((b, i) => { b.style.opacity = (i < optionCount ? 1 : 0); });
  origami.setSubSel(0, false);

  const axiomNumControlsArray = [null, 2, 2, 4, 3, 4, 6, 5];
  origami.controls.removeAll();
  Array.from(Array(axiomNumControlsArray[axiom]))
    .map(() => [Math.random(), Math.random()])
    .map((p, i) => ({
      position: p,
      radius: origami.paramIsLine[axiom][i] ? 0.01 : 0.02,
      stroke: origami.paramIsLine[axiom][i] ? "#eb3" : "black",
      fill: origami.paramIsLine[axiom][i] ? "#eb3" : "#eb3"
    })).forEach(options => origami.controls.add(options));
  origami.controls.svg((i) => RabbitEar.svg.circle(0, 0, origami.paramIsLine[axiom][i] ? 0.01 : 0.02));
  origami.axiom = axiom;
  origami.update();
};

origami.setSubSel = function (s, updateOptional) {
  document.querySelectorAll("[id^=btn-option]")
    .forEach((b) => { b.className = "button"; });
  document.querySelector(`#btn-option-${s}`).className = "button yellow";

  origami.subSelect = s;
  if (updateOptional !== false) { origami.update(); }
};

origami.cannotFold = function () {
  document.querySelectorAll("[id^=btn-option]")
    .forEach((b) => { b.style.opacity = 0; });
};

origami.drawGhostMark = function (point) {
  const circle = origami.markLayer.circle(point[0], point[1], 0.02);
  circle.setAttribute("style", "stroke: black; fill: none; opacity:0.5");
};

origami.drawAxiomHelperLines = function (color) {
  if (color == null) { color = "#eb3"; }
  // draw axiom helper lines
  origami.markLayer.removeChildren();
  const lines = origami.control_points_to_lines();
  lines.map(l => origami.boundaries.clipLine(l))
    .filter(a => a !== undefined)
    .map(clipLines => clipLines
      .map(l => origami.markLayer.line(l[0][0], l[0][1], l[1][0], l[1][1]))
      .forEach(l => l.setAttribute("style",
        `stroke:${color};stroke-width:0.01;`)));

  const options = {
    color,
    strokeWidth: 0.01,
    width: 0.025,
    length: 0.06,
    padding: 0.013,
  };
  lines.map(l => [l[0], [l[0][0] + l[1][0], l[0][1] + l[1][1]]])
    .map(pts => origami.markLayer.arrow(pts[0], pts[1], options)
      .head({ width: 0.025, height: 0.06, padding: 0.013 })
      .fill(color)
      .stroke(color));
};

origami.control_points_to_lines = function () {
  const p = origami.controls;
  switch (origami.axiom) {
    case 3:
    case 6:
    case 7:
      return [
        [p[0], [p[2][0] - p[0][0], p[2][1] - p[0][1]]],
        [p[1], [p[3][0] - p[1][0], p[3][1] - p[1][1]]]
      ];
    case 4:
    case 5:
      return [
        [p[0], [p[1][0] - p[0][0], p[1][1] - p[0][1]]]
      ];
    default:
      return [];
  }
};

origami.controls_to_axiom_args = function () {
  // convert the input-control-points into marks and lines,
  // the proper arguments for axiom method calls
  const points = origami.controls;
  const lines = origami.control_points_to_lines();
  switch (origami.axiom) {
    case 1:
    case 2: return [...points];
    case 3: return [
      lines[0][0], lines[0][1],
      lines[1][0], lines[1][1]
    ];
    case 4: return [lines[0][0], lines[0][1], points[2]];
    case 5: return [lines[0][0], lines[0][1], points[2], points[3]];
    case 6: return [
      lines[0][0], lines[0][1],
      lines[1][0], lines[1][1],
      points[4], points[5]
    ];
    case 7: return [
      lines[0][0], lines[0][1],
      lines[1][0], lines[1][1], points[4]
    ];
    default: return [];
  }
};

origami.findNewSubSelection = function (axiomFrame) {
  // if the current sub selection is now invalid, search for a new valid one
  const anyValidSubSel = axiomFrame.valid_solutions
    .map((a, i) => (a === true ? i : undefined))
    .filter(a => a !== undefined)
    .shift();
  if (anyValidSubSel === undefined) { return; }
  origami.setSubSel(anyValidSubSel, false);
};

// 2: soft reset, axiom params updated
origami.update = function () {
  // clear and re-fold axiom
  origami.load(RabbitEar.bases.square);

  const axiomFrame = RabbitEar
    .axiom(origami.axiom, ...origami.controls_to_axiom_args())
    .apply(origami.boundaries[0].vertices.map(p => origami.vertices_coords[p]));

  axiomFrame.valid_solutions.forEach((a, i) => {
    document.querySelectorAll("[id^=btn-option]")[i].style.opacity = a ? 1 : 0;
  });

  if (axiomFrame.valid_solutions[origami.subSelect] === false) {
    origami.findNewSubSelection(axiomFrame);
  }

  origami.drawAxiomHelperLines(axiomFrame.valid ? "#eb3" : "#d42");
  origami.options.arrowColor = axiomFrame.valid ? "black" : "#d42";
  if (axiomFrame.valid === false) {
    origami.cannotFold();
  } // else { }

  origami.options.styleSheet = (axiomFrame.valid
    ? undefined
    : `.valley { stroke: ${"#d42"}; }`);

  // helper indicators for passing / failing a test
  if (axiomFrame.test !== undefined) {
    const refPts = axiomFrame.test.points_reflected;
    if (refPts !== undefined) {
      // console.log(refPts);
      refPts.forEach(p => origami.drawGhostMark(p));
    }
  }

  const passFailColor = axiomFrame.valid ? "#eb3" : "#d42";
  origami.controls
    .filter((_, i) => origami.paramIsLine[origami.axiom][i])
    .forEach(c => c.svg.setAttribute("style", `stroke:${passFailColor};fill:${passFailColor};pointer-events:none;`));
  origami.controls
    .filter((_, i) => !origami.paramIsLine[origami.axiom][i])
    .forEach(c => c.svg.setAttribute("style", `fill:${passFailColor};pointer-events:none;`));

  // if a valid solution exists, valley fold the solution
  // if (axiomFrame.valid) {
  if (axiomFrame.solutions[origami.subSelect] != null) {

    // this will not carry over. this is a bug.
    const controls = origami.controls;

    // first put mark creases in for all the other valid solutions
    axiomFrame.solutions
      .filter((s, i) => i !== origami.subSelect
        && axiomFrame.valid_solutions[i] != null)
      .map(m => origami.crease(m[0], m[1], "F"));

    origami.crease(axiomFrame.solutions[origami.subSelect]);
    origami.controls = controls;
    Object.assign(origami["re:construction"], axiomFrame);
    const diagram = RabbitEar.core.build_diagram_frame(origami);
    origami["re:diagrams"] = [diagram];
    const instruction = diagram["re:diagram_instructions"][languages[language]] || "";
    document.querySelector("#instructions-p").innerHTML = instruction;
  }

  origami.svg.draw();
  folded.load(origami.copy());
  folded.fold();
};

origami.svg.onMouseMove = function () {
  if (!origami.svg.mouse.isPressed) { return; }
  origami.update();
};

document.querySelectorAll("[id^=btn-axiom]")
  .forEach((b) => {
    b.onclick = function (e) {
      origami.setAxiom(parseInt(e.target.id.substring(10, 11), 10));
    };
  });

document.querySelectorAll("[id^=btn-option]")
  .forEach((b) => {
    b.onclick = function (e) {
      origami.setSubSel(parseInt(e.target.id.substring(11, 12), 10));
    };
  });

document.querySelector("#language-back").onclick = function () {
  language = (language + languages.length - 1) % languages.length;
  origami.update();
  const prev = (language + languages.length - 1) % languages.length;
  const next = (language + 1) % languages.length;
  document.querySelector("#language-back").innerHTML = `← ${languages[prev]}`;
  document.querySelector("#language-next").innerHTML = `${languages[next]} →`;
};

document.querySelector("#language-next").onclick = function () {
  language = (language + 1) % languages.length;
  origami.update();
  const prev = (language + languages.length - 1) % languages.length;
  const next = (language + 1) % languages.length;
  document.querySelector("#language-back").innerHTML = `← ${languages[prev]}`;
  document.querySelector("#language-next").innerHTML = `${languages[next]} →`;
};

origami.setAxiom(1);
