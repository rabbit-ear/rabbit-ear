const { RabbitEar } = window;

const languages = ["ar", "de", "en", "es", "fr", "hi", "jp", "ko", "ms", "pt", "ru", "tr", "zh"];

RabbitEar.origami("origami-cp", {
  padding: 0.05,
  diagrams: true,
  attributes: {
    edges: { valley: { stroke: "black"}, mountain: { stroke: "black"}},
    diagrams: {
      lines: {
        valley: { stroke: "transparent" },
        mountain: { stroke: "transparent"}
      },
      arrows: {
        padding: 0.5
      }
    }   
  }
}, function(origami) {
  // async. origami has been loaded

  const folded = RabbitEar.origami("origami-fold", {
    padding: 0.05,
    edges: false,
    diagrams: false,
    // , shadows:true
  }).fold(); 

  let app = {};
  window.app = app;
  app.origami = origami;
  app.folded = folded;
  app.language = languages.indexOf("en");

  app.markLayer = origami.svg.group().pointerEvents("none");
  app.controls = origami.svg.controls(0);

  app.axiom = undefined;
  app.subSelect = 0; // some axioms have 2 or 3 results
  // this is currently unused
  origami.polygonBoundary = RabbitEar.polygon(origami.boundaries[0].coords);

  // a lookup for expected parameters in axiom() function.
  // is the input parameter a line (or point, if false)?
  const paramIsLine = [null,
    [false, false],
    [false, false],
    [true, true, true, true],
    [true, true, false],
    [true, true, false, false],
    [true, true, true, true, false, false],
    [true, true, true, true, false]
  ];

  // 1: hard reset, axiom has changed
  app.setAxiom = function (axiom) {
    if (axiom < 1 || axiom > 7) { return; }
    app.axiom = axiom;
    // axiom number buttons
    document.querySelectorAll("[id^=btn-axiom]")
      .forEach((b) => { b.className = "button"; });
    document.querySelector(`#btn-axiom-${app.axiom}`).className = "button red";
    // sub options buttons
    const optionsCountArray = [null, 0, 0, 2, 0, 2, 3, 0];
    const optionCount = optionsCountArray[app.axiom];
    document.querySelectorAll("[id^=btn-option]")
      .forEach((b, i) => { b.style.opacity = (i < optionCount ? 1 : 0); });
    app.setSubSel(0, false);

    const axiomNumControlsArray = [null, 2, 2, 4, 3, 4, 6, 5];
    app.controls.removeAll();
    Array.from(Array(axiomNumControlsArray[app.axiom]))
      .map(() => [Math.random(), Math.random()])
      .map((p, i) => ({
        position: p,
        radius: paramIsLine[app.axiom][i] ? 0.01 : 0.02,
        stroke: paramIsLine[app.axiom][i] ? "#eb3" : "black",
        fill: paramIsLine[app.axiom][i] ? "#eb3" : "#eb3"
      })).forEach(options => app.controls.add(options));
    app.controls.svg((i) => RabbitEar.svg.circle(0, 0, paramIsLine[app.axiom][i] ? 0.01 : 0.02));
    app.update();
  };

  app.setSubSel = function (s, updateOptional) {
    document.querySelectorAll("[id^=btn-option]")
      .forEach((b) => { b.className = "button"; });
    document.querySelector(`#btn-option-${s}`).className = "button yellow";

    app.subSelect = s;
    if (updateOptional !== false) { app.update(); }
  };

  app.cannotFold = function () {
    document.querySelectorAll("[id^=btn-option]")
      .forEach((b) => { b.style.opacity = 0; });
  };

  app.drawGhostMark = function (point) {
    const circle = app.markLayer.circle(point[0], point[1], 0.02);
    circle.setAttribute("style", "stroke: black; fill: none; opacity:0.5");
  };

  app.drawAxiomHelperLines = function (color) {
    if (color == null) { color = "#eb3"; }
    // draw axiom helper lines
    app.markLayer.removeChildren();
    const lines = app.control_points_to_lines();
    lines.map(l => origami.boundaries[0].clipLine(l))
      .filter(a => a !== undefined)
      .map(l => app.markLayer.line(l[0][0], l[0][1], l[1][0], l[1][1]))
      .forEach(l => l.setAttribute("style",// `stroke:#F08;stroke-width:0.01;`));
        `stroke:${color};stroke-width:0.01;`));

    const options = {
      color,
      strokeWidth: 0.01,
      width: 0.0125,
      length: 0.06,
      padding: 0.013,
    };
    lines.map(l => [l[0], [l[0][0] + l[1][0], l[0][1] + l[1][1]]])
      .map(pts => app.markLayer.arrow(pts[0], pts[1], options)
        .head({ width: 0.0125, height: 0.06, padding: 0.013 })
        .fill(color)
        .stroke(color));
  };

  app.control_points_to_lines = function () {
    const p = app.controls;
    switch (app.axiom) {
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

  app.controls_to_axiom_args = function () {
    // convert the input-control-points into marks and lines,
    // the proper arguments for axiom method calls
    const points = app.controls;
    const lines = app.control_points_to_lines();
    switch (app.axiom) {
      case 1:
      // case 2: return [...points];
      case 2: return [points[0][0], points[0][1], points[1][0], points[1][1]];
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

  app.findNewSubSelection = function (axiomFrame) {
    // if the current sub selection is now invalid, search for a new valid one
    const anyValidSubSel = axiomFrame.valid_solutions
      .map((a, i) => (a === true ? i : undefined))
      .filter(a => a !== undefined)
      .shift();
    if (anyValidSubSel === undefined) { return; }
    app.setSubSel(anyValidSubSel, false);
  };

  // 2: soft reset, axiom params updated
  app.update = function () {
    // clear and re-fold axiom
    origami.load(RabbitEar.bases.square);
    delete origami["faces_re:matrix"];
    delete origami["faces_re:layer"];

    const axiomFrame = RabbitEar
      .axiom(app.axiom, ...app.controls_to_axiom_args())
      .apply(origami.boundaries[0].coords);

    axiomFrame.valid_solutions.forEach((a, i) => {
      document.querySelectorAll("[id^=btn-option]")[i].style.opacity = a ? 1 : 0;
    });

    if (axiomFrame.valid_solutions[app.subSelect] === false) {
      app.findNewSubSelection(axiomFrame);
    }

    app.drawAxiomHelperLines(axiomFrame.valid ? "#eb3" : "#d42");
    // todo diagram style
    // origami.options.arrowColor = axiomFrame.valid ? "black" : "#d42";

    if (axiomFrame.valid === false) {
      app.cannotFold();
    } // else { }

    // todo diagram style
    // origami.options.styleSheet = (axiomFrame.valid
    //   ? undefined
    //   : `.valley { stroke: ${"#d42"}; }`);

    // helper indicators for passing / failing a test
    if (axiomFrame.test !== undefined) {
      const refPts = axiomFrame.test.points_reflected;
      if (refPts !== undefined) {
        // console.log(refPts);
        refPts.forEach(p => app.drawGhostMark(p));
      }
    }

    const passFailColor = axiomFrame.valid ? "#eb3" : "#d42";
    app.controls
      .filter((_, i) => paramIsLine[app.axiom][i])
      .forEach(c => c.svg.setAttribute("style", `stroke:${passFailColor};fill:${passFailColor};pointer-events:none;`));
    app.controls
      .filter((_, i) => !paramIsLine[app.axiom][i])
      .forEach(c => c.svg.setAttribute("style", `fill:${passFailColor};pointer-events:none;`));

    // if a valid solution exists, valley fold the solution
    // if (axiomFrame.valid) {
    if (axiomFrame.solutions[app.subSelect] != null) {

      // this will not carry over. this is a bug.
      const controls = app.controls;

      // first put mark creases in for all the other valid solutions
      axiomFrame.solutions
        .filter((s, i) => i !== app.subSelect
          && axiomFrame.valid_solutions[i] != null)
        .map(m => origami.fold(m[0], m[1], "F"));

      origami.fold(axiomFrame.solutions[app.subSelect]);
      app.controls = controls;
      Object.assign(origami["re:construction"], axiomFrame);
      const diagram = RabbitEar.core.build_diagram_frame(origami);
      origami["re:diagrams"] = [diagram];
      const instruction = diagram["re:diagram_instructions"][languages[app.language]] || "";
      document.querySelector("#instructions-p").innerHTML = instruction;
    }

    origami.draw();
    folded.load(origami.copy());
    folded.fold();
  };

  origami.svg.mouseMoved = function () {
    if (!origami.svg.mouse.isPressed) { return; }
    app.update();
  };

  document.querySelectorAll("[id^=btn-axiom]")
    .forEach((b) => {
      b.onclick = function (e) {
        app.setAxiom(parseInt(e.target.id.substring(10, 11), 10));
      };
    });

  document.querySelectorAll("[id^=btn-option]")
    .forEach((b) => {
      b.onclick = function (e) {
        app.setSubSel(parseInt(e.target.id.substring(11, 12), 10));
      };
    });

  document.querySelector("#language-back").onclick = function () {
    app.language = (app.language + languages.length - 1) % languages.length;
    app.update();
    const prev = (app.language + languages.length - 1) % languages.length;
    const next = (app.language + 1) % languages.length;
    document.querySelector("#language-back").innerHTML = `← ${languages[prev]}`;
    document.querySelector("#language-next").innerHTML = `${languages[next]} →`;
  };

  document.querySelector("#language-next").onclick = function () {
    app.language = (app.language + 1) % languages.length;
    app.update();
    const prev = (app.language + languages.length - 1) % languages.length;
    const next = (app.language + 1) % languages.length;
    document.querySelector("#language-back").innerHTML = `← ${languages[prev]}`;
    document.querySelector("#language-next").innerHTML = `${languages[next]} →`;
  };

  app.setAxiom(1);
});
