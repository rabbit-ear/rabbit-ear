const { RabbitEar } = window;
const languages = ["ar", "de", "en", "es", "fr", "hi", "jp", "ko", "ms", "pt", "ru", "tr", "zh"];

const axiomPointsToLines = function (axiom, points) {
  switch (axiom) {
    case 3: case 6: case 7: return [
      [points[0], [points[2][0] - points[0][0], points[2][1] - points[0][1]]],
      [points[1], [points[3][0] - points[1][0], points[3][1] - points[1][1]]]
    ];
    case 4: case 5: return [
      [points[0], [points[1][0] - points[0][0], points[1][1] - points[0][1]]]
    ];
    default: return [];
  }
};

const pointsToAxiomFunctionArguments = function (axiom, points) {
  // convert the input-control-points into marks and lines,
  // the proper arguments for axiom method calls
  const lines = axiomPointsToLines(axiom, points);
  switch (axiom) {
    case 1: case 2: return [
      points[0][0], points[0][1], points[1][0], points[1][1]
    ];
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

const drawOptions = function (valid) {
  return {
    padding: 0.05,
    diagrams: true,
    attributes: {
      boundaries: {
        "fill": "linen"
      },
      edges: { 
        "stroke-width": 0.01,
        "stroke-linecap": "round",
        valley: {
          stroke: valid ? "black" : "#e53",
          "stroke-dasharray": "0.01 0.02"
        },
        mountain: { stroke: "black"}
      },
      diagrams: {
        lines: {
          valley: { stroke: "transparent" },
          mountain: { stroke: "transparent"}
        },
        arrows: {
          padding: 0.5,
          fill: valid ? "black" : "#e53",
          stroke: valid ? "black" : "#e53"
        }
      }
    }
  }
};


RabbitEar.origami("origami-cp", drawOptions(true), function(origami) {
  // async. origami has been loaded
  const folded = RabbitEar.origami("origami-fold", {
    padding: 0.05,
    edges: false,
    diagrams: false,
    attributes: {
      faces: {
        front: { fill: "linen", stroke: "none" },
        back: { fill: "peru", stroke: "none" },
      }
    }
    // , shadows:true
  }).fold(); 

  const app = {};
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
  const optionsCountArray = [null, 0, 0, 2, 0, 2, 3, 0];
  const axiomNumControlsArray = [null, 2, 2, 4, 3, 4, 6, 5];

  app.setSubSel = function (s, updateOptional) {
    if (s == null) { return; }
    document.querySelectorAll("[id^=btn-option]")
      .forEach((b) => { b.setAttribute("class", "button"); });
    document.querySelector(`#btn-option-${s}`).setAttribute("class", "button yellow");
    app.subSelect = s;
    if (updateOptional !== false) { app.update(); }
  };

  app.cannotFold = function () {
    document.querySelectorAll("[id^=btn-option]")
      .forEach((b) => { b.style.opacity = 0; });
  };

  app.drawGhostMark = function (point) {
    app.markLayer.circle(point[0], point[1], 0.02)
      .stroke("black")
      .fill("none")
      .opacity(0.5);
  };

  app.drawAxiomHelperLines = function (color) {
    if (color == null) { color = "#fb3"; }
    // draw axiom helper lines
    app.markLayer.removeChildren();
    const lines = axiomPointsToLines(app.axiom, app.controls);
    lines.map(l => origami.boundaries[0].clipLine(l))
      .filter(a => a !== undefined)
      .map(l => app.markLayer
        .line(l[0][0], l[0][1], l[1][0], l[1][1])
        .stroke(color)
        .strokeWidth(0.01));
    lines.map(l => [l[0], [l[0][0] + l[1][0], l[0][1] + l[1][1]]])
      .map(pts => app.markLayer.arrow(pts[0], pts[1])
        .head({ width: 0.025, height: 0.06, padding: 0.2 })
        .fill(color)
        .stroke(color));
  };

  // if the current sub selection is now invalid, search for a new valid one
  const findNewSubSelection = function (axiomFrame) {
    app.setSubSel(axiomFrame.valid_solutions
      .map((a, i) => (a === true ? i : undefined))
      .filter(a => a !== undefined)
      .shift(), false);
  };

  // 2: soft reset, axiom params updated
  app.update = function () {
    // clear and re-fold axiom
    origami.load(RabbitEar.bases.square);
    delete origami["faces_re:matrix"];
    delete origami["faces_re:layer"];

    const axiomFrame = RabbitEar
      .axiom(app.axiom, ...pointsToAxiomFunctionArguments(app.axiom, app.controls))
      .apply(origami.boundaries[0].coords);

    axiomFrame.valid_solutions.forEach((a, i) => {
      document.querySelectorAll("[id^=btn-option]")[i].style.opacity = a ? 1 : 0;
    });

    if (axiomFrame.valid_solutions[app.subSelect] === false) {
      findNewSubSelection(axiomFrame);
    }

    app.drawAxiomHelperLines(axiomFrame.valid ? "#fb3" : "#e53");

    if (axiomFrame.valid === false) {
      app.cannotFold();
    }

    // helper indicators for passing / failing a test
    if (axiomFrame.test !== undefined) {
      const refPts = axiomFrame.test.points_reflected;
      if (refPts !== undefined) {
        refPts.forEach(p => app.drawGhostMark(p));
      }
    }

    const passFailColor = axiomFrame.valid ? "#fb3" : "#e53";
    app.controls
      .filter((_, i) => paramIsLine[app.axiom][i])
      .forEach(c => {
        c.svg.setAttribute("stroke", passFailColor);
        c.svg.setAttribute("fill", passFailColor);
      });
    app.controls
      .filter((_, i) => !paramIsLine[app.axiom][i])
      .forEach(c => c.svg.setAttribute("fill", passFailColor));

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
    origami.draw(drawOptions(axiomFrame.valid));
    const diagramLayer = Array.from(origami.svg.childNodes)
      .filter(a => a.getAttribute("class") === "diagrams")
      .shift();
    origami.svg.removeChild(app.markLayer);
    origami.svg.insertBefore(app.markLayer, diagramLayer);
    folded.load(origami.copy());
    folded.fold();
  };

  // 1: hard reset, axiom has changed
  app.setAxiom = function (axiom) {
    if (axiom < 1 || axiom > 7) { return; }
    app.axiom = axiom;
    // axiom number buttons
    document.querySelectorAll("[id^=btn-axiom]")
      .forEach((b) => { b.className = "button"; });
    document.querySelector(`#btn-axiom-${app.axiom}`).className = "button red";
    // sub options buttons
    const optionCount = optionsCountArray[app.axiom];
    document.querySelectorAll("[id^=btn-option]")
      .forEach((b, i) => { b.style.opacity = (i < optionCount ? 1 : 0); });
    app.setSubSel(0, false);

    app.controls.removeAll();
    Array.from(Array(axiomNumControlsArray[app.axiom]))
      .map(() => [Math.random(), Math.random()])
      .map((position, i) => ({
        position: position,
        radius: paramIsLine[app.axiom][i] ? 0.01 : 0.02,
        stroke: paramIsLine[app.axiom][i] ? "#fb3" : "black",
        fill: paramIsLine[app.axiom][i] ? "#fb3" : "#fb3"
      })).forEach(options => app.controls.add(options));
    app.controls.svg((i) => (origami.svg).circle(0, 0, paramIsLine[app.axiom][i] ? 0.01 : 0.02));
    app.update();
  };

  origami.svg.mouseMoved = function () {
    if (!origami.svg.mouse.isPressed) { return; }
    app.update();
  };

  document.querySelectorAll("[id^=btn-axiom]").forEach((b) => {
    b.onclick = function (e) {
      app.setAxiom(parseInt(e.target.id.substring(10, 11), 10));
    };
  });

  document.querySelectorAll("[id^=btn-option]").forEach((b) => {
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
