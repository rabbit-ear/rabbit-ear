const origami = re.Origami("origami-cp", { padding: 0.05, diagram: true });
const folded = re.Origami("origami-fold", { padding: 0.05 }); //,shadows:true});

const languages = ["ar", "bn", "de", "el", "en", "es", "fa", "fi", "fr", "hi", "in", "is", "it", "iw", "jp", "ko", "ms", "nl", "pa", "pt", "ru", "sw", "th", "tr", "ur", "vi", "zh"];
let language = 4;

origami.markLayer = re.svg.group();
origami.insertBefore(origami.markLayer,
  origami.querySelectorAll(".boundaries")[0].nextSibling);
origami.controls = re.svg.controls(origami, 0);
origami.axiom = undefined;
origami.subSelect = 0; // some axioms have 2 or 3 results

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
  const optionCount = [null, 0, 0, 2, 0, 2, 3, 0][axiom];
  document.querySelectorAll("[id^=btn-option")
    .forEach((b, i) => { b.style.opacity = i < optionCount ? 1 : 0; });
  origami.setSubSel(0, false);

  origami.controls.removeAll();
  Array.from(Array([null, 2, 2, 4, 3, 4, 6, 5][axiom]))
    .map(() => [Math.random(), Math.random()])
    .map((p, i) => ({
      position: p,
      radius: origami.paramIsLine[axiom][i] ? 0.01 : 0.02,
      stroke: origami.paramIsLine[axiom][i] ? "#eb3" : "black",
      fill: origami.paramIsLine[axiom][i] ? "#eb3" : "#d42"
    })).forEach(options => origami.controls.add(options));

  origami.axiom = axiom;
  origami.update();
};

origami.setSubSel = function (s, updateOptional) {
  document.querySelectorAll("[id^=btn-option")
    .forEach((b) => { b.className = "button"; });
  document.querySelector(`#btn-option-${s}`).className = "button red";

  origami.subSelect = s;
  if (updateOptional !== false) { origami.update(); }
};

origami.cannotFold = function () {
  document.querySelectorAll("[id^=btn-option")
    .forEach((b) => { b.style.opacity = 0; });
  folded.cp = origami.cp;
  folded.fold();
  console.log(origami.paramIsLine);
  console.log(origami.axiom);
  origami.controls.forEach((p, i) => {
    if (origami.paramIsLine[origami.axiom][i]) {
      p.circle.setAttribute("style", "stroke:#d42;fill:#d42");
    }
  });
};

origami.drawGhostMark = function (point) {
  const circle = origami.markLayer.circle(point[0], point[1], 0.02);
  circle.setAttribute("style", "stroke: black; fill: #d42; opacity:0.5");
};

origami.drawAxiomHelperLines = function (lines, color) {
  if (color == null) { color = "#eb3"; }
  // draw axiom helper lines
  origami.markLayer.removeChildren();
  lines.map(l => origami.cp.boundary.clipLine(l))
    .filter(a => a !== undefined)
    .map(l => origami.markLayer.line(l[0][0], l[0][1], l[1][0], l[1][1]))
    .forEach(l => l.setAttribute("style",
      `stroke:${color};stroke-width:0.01;`));

  const options = {
    color,
    strokeWidth: 0.01,
    width: 0.025,
    length: 0.06,
    padding: 0.013,
  };
  lines.map(l => [l.point, l.point.add(l.vector)])
    .map(pts => origami.markLayer.straightArrow(pts[0], pts[1], options));
};

// 2: soft reset, axiom params updated
origami.update = function () {
  // clear and re-fold axiom
  origami.cp = re.bases.square;

  // convert the input-control-points into marks and lines,
  // the proper arguments for axiom method calls
  const pts = origami.controls.map(p => p.position);
  let lines = [];
  switch (origami.axiom) {
    case 3: case 6: case 7:
      lines = [
        re.line(pts[0], [pts[2][0] - pts[0][0], pts[2][1] - pts[0][1]]),
        re.line(pts[1], [pts[3][0] - pts[1][0], pts[3][1] - pts[1][1]])
      ];
      break;
    case 4: case 5:
      lines = [
        re.line(pts[0], [pts[1][0] - pts[0][0], pts[1][1] - pts[0][1]])
      ];
      break;
    default: break;
  }

  // axiom to get a crease line
  let axiomInfo;
  switch (origami.axiom) {
    case 1:
    case 2: axiomInfo = re.axiom(origami.axiom, ...pts);
      break;
    case 3: axiomInfo = re.axiom(origami.axiom,
      lines[0].point, lines[0].vector,
      lines[1].point, lines[1].vector);
      break;
    case 4: axiomInfo = re.axiom(origami.axiom,
      lines[0].point, lines[0].vector,
      pts[2]);
      break;
    case 5: axiomInfo = re.axiom(origami.axiom,
      lines[0].point, lines[0].vector,
      pts[2], pts[3]);
      break;
    case 6: axiomInfo = re.axiom(origami.axiom,
      lines[0].point, lines[0].vector,
      lines[1].point, lines[1].vector,
      pts[4], pts[5]);
      break;
    case 7: axiomInfo = re.axiom(origami.axiom,
      lines[0].point, lines[0].vector,
      lines[1].point, lines[1].vector,
      pts[4]);
      break;
    default: break;
  }

  if (axiomInfo === undefined) {
    origami.drawAxiomHelperLines(lines, "#d42");
    return origami.cannotFold();
  }
  // axiom 3, 5, and 6 give us back multiple solutions inside an array
  // if (axiomInfo.constructor === Array) {
  //  axiomInfo = axiomInfo[origami.subSelect];
  //  if (axiomInfo === undefined) { return; }
  // }

  const valid = re.core.test_axiom(axiomInfo, origami.cp.boundary.points);
  const solutionPassed = valid.map(a => a != null);

  const optionButtons = document.querySelectorAll("[id^=btn-option]");
  switch (origami.axiom) {
    case 3:
    case 5:
    case 6:
      solutionPassed
        .forEach((a, i) => { optionButtons[i].style.opacity = a ? 1 : 0; });
      break;
    default: break;
  }

  if (!solutionPassed[origami.subSelect]) {
    // try to find a state that passed
    for (let i = 0; i < solutionPassed.length; i += 1) {
      if (solutionPassed[i]) {
        origami.setSubSel(i, false);
        break;
      }
    }
  }
  if (axiomInfo.solutions[origami.subSelect] == null) {
    origami.drawAxiomHelperLines(lines, "#d42");
    return origami.cannotFold();
  }

  const passFail = solutionPassed[origami.subSelect];

  // origami.preferences.styleSheet = valid[origami.subSelect] == null
  //  ? ".valley  { stroke: red; }"
  //  : undefined;

  origami.drawAxiomHelperLines(lines, passFail ? "#eb3" : "#d42");
  origami.preferences.arrowColor = passFail ? "black" : "#d42";
  origami.preferences.styleSheet = solutionPassed[origami.subSelect]
    ? undefined
    : ".valley { stroke: #d42; }";
  if (axiomInfo.test !== undefined) {
    const refPts = axiomInfo.test.points_reflected;
    if (refPts !== undefined) {
      refPts.forEach(p => origami.drawGhostMark(p));
    }
  }

  origami.controls.forEach((p, i) => {
    if (origami.paramIsLine[origami.axiom][i]) {
      // p.circle.setAttribute("stroke", passFail ? "black" : "#eb3");
      // p.circle.setAttribute("fill", passFail ? "#d42" : "#eb3");
      const color = (passFail ? "#eb3" : "#d42");
      p.circle.setAttribute("style", `stroke:${color};fill:${color}`);
    }
  });

  // put marks in for the rest of the solutions
  const otherValidSolutions = axiomInfo.solutions
    .filter((s, i) => i !== origami.subSelect && solutionPassed[i]);
  otherValidSolutions
    .map(m => origami.cp.markFold(m[0], m[1]));

  // console.log(axiomInfo);
  // console.log(axiomInfo.solutions[origami.subSelect]);

  // valley crease the solution
  origami.cp.valleyFold(axiomInfo.solutions[origami.subSelect]);
  origami.cp["re:construction"]["re:axiom"] = axiomInfo;


  const diagram = re.core.build_diagram_frame(origami.cp);
  origami.cp["re:diagrams"] = [diagram];
  origami.draw();

  // console.log(origami.cp["re:construction"]);
  // console.log(diagram["re:instructions"]);

  const instruction = diagram["re:instructions"][languages[language]] || "";
  document.querySelector("#instructions-p").innerHTML = instruction;

  folded.cp = origami.cp;
  folded.fold();
};

origami.onMouseMove = function (event) {
  if (!origami.mouse.isPressed){ return; }
  origami.update();
};

document.querySelectorAll("[id^=btn-axiom]")
  .forEach(b => b.onclick = function (e) {
    origami.setAxiom(parseInt(e.target.id.substring(10,11)));
  });
document.querySelectorAll("[id^=btn-option]")
  .forEach(b => b.onclick = function (e) {
    origami.setSubSel(parseInt(e.target.id.substring(11,12)));
  });

document.querySelector("#language-back").onclick = function (event) {
  language = (language + languages.length - 1) % languages.length;
  origami.update();
};
document.querySelector("#language-next").onclick = function (event) {
  language = (language + 1) % languages.length;
  origami.update();
};

origami.setAxiom(1);
