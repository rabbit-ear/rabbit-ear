const CodeOrigamiSimulator = function (origamiID, codeID, consoleID) {
  const creasePattern = re.svg.image(origamiID, 1, 1, { padding: 0.05 });
  const consoleDiv = document.querySelector(`#${consoleID}`);
  const container = document.querySelector("#simulator-container");
  const simulator = OrigamiSimulator({
    backgroundColor: "158",
    color1: "e64e1e",
    append: container
  });

  let editor;
  let simulator_update_timeout;
  const app = {};

  const prop = {
    svg: undefined,
    image: undefined,
    autoUpdate: true,
  };

  const editorDidUpdate = function () {
    try {
      reset();
      eval(editor.getValue());
      // origami.draw();
      consoleDiv.innerHTML = "";
      triggerSimulatorUpdate();
      if (app.codeDidUpdate !== undefined) { app.codeDidUpdate(); }
    } catch (err) {
      consoleDiv.innerHTML = `<p>${err}</p>`;
    }
  };
  const reset = function () {
    creasePattern.removeChildren();
  };
  const injectCode = function (text) {
    editor.session.insert({
      row: editor.session.getLength(),
      column: 0
    }, text);
  };

  try {
    editor = ace.edit(codeID);
    editor.setShowPrintMargin(false);
  } catch (err) {
    throw new Error("bad internet connection. or Ace CDN moved-see index.html");
  }
  editor.setTheme("ace/theme/monokai");
  editor.setKeyboardHandler("ace/keyboard/sublime");
  editor.session.setMode("ace/mode/javascript");
  editor.session.on("change", editorDidUpdate);

  // creasePattern.onMouseDown = function (mouse) {
  //   const nearest = origami.nearest(mouse);
  //   const keys = Object.keys(nearest);
  //   const consoleString = keys
  //     .filter(key => nearest[key] != null)
  //     .map(key => `origami.cp.${key}[${nearest[key].index}]`)
  //     .map((objStr, i) => keys[i]
  //       + ": <a href='#' onclick='origami.injectCode(\""
  //       + objStr + "\")'>" + objStr + "</a><br>")
  //     .reduce((a, b) => a + b, "");
  //   consoleDiv.innerHTML = `<p>${consoleString}</p>`;
  // };

  // origami simulator
  const updateSimulator = function () {
    // origami.simulator.threeView.resetModel();
    simulator.pattern.loadSVG(creasePattern);
  };

  // const updateSimulator = function () {
  //   simulator.threeView.resetModel();
  //   const svg = document.querySelector("#load-this");
  //   if (svg == null) { return; }
  //   simulator.pattern.setFoldData(twoFold);
  // };

  // const twoFold = {
  //   "file_spec": 1.1,
  //   "file_creator": "Rabbit Ear",
  //   "file_author": "Robby Kraft",
  //   "file_classes": ["singleModel"],
  //   "frame_attributes": ["2D"],
  //   "frame_title": "two crease",
  //   "frame_classes": ["creasePattern"],
  //   "vertices_coords": [
  //     [0, 0],
  //     [1, 0],
  //     [1, 1],
  //     [0, 1],
  //     [1, 0.21920709774914],
  //     [0, 0.75329794695316],
  //     [0.091252597315993, 1],
  //     [0, 0.908747401653116]
  //   ],
  //   "edges_vertices": [[0,1], [1,4], [4,5], [0,5], [6,7], [5,7], [2,4], [2,6], [3,6], [3,7]],
  //   "edges_assignment": ["B","B","V","B","M","B","B","B","B","B"],
  //   "edges_foldAngle": [null,null,3.1415,null,-3.1415,null,null,null,null,null],
  //   "faces_vertices": [[0,1,4,5], [6,7,5,4,2], [6,3,7]],
  //   "faces_edges": [[0,1,2,3], [4,5,2,6,7], [8,9,4]],
  //   // "faces_vertices": [[0,1,4,5], [2,4,5,7,6], [6,3,7]],
  //   // "faces_edges": [[0,1,2,3], [7,6,2,5,4], [8,9,4]],
  //   "faces_re:layer": [0,1,2]
  // };


  const triggerSimulatorUpdate = function () {
    if (prop.autoUpdate === false) { return; }
    if (simulator_update_timeout !== undefined) {
      clearTimeout(simulator_update_timeout);
    }
    simulator_update_timeout = setTimeout(function () {
      updateSimulator();
      simulator_update_timeout = undefined;
    }, 1000);
  };

  const codeDidUpdate = function () {
    triggerSimulatorUpdate();
  };


  // bind draw methods, insert an appendChild to our one svg
  ["arc", "arcArrow", "bezier", "circle", "ellipse", "line",
    "polygon", "polyline", "rect", "regularPolygon", "straightArrow",
    "text", "wedge", "group"].forEach((name) => {
    window[name] = function (...args) {
      const element = re.svg[name](...args);
      creasePattern.appendChild(element);
      return element;
    };
  });

  // bind other methods
  ["controls"].forEach((name) => {
    window[name] = function (...args) {
      const returnValue = re.svg[name](creasePattern, ...args);
      return returnValue;
    };
  });

  Object.defineProperty(app, "injectCode", { value: injectCode });
  app.reset = reset; // allow it to be overwritten
  app.codeDidUpdate = undefined; // to be called on non-error text change
  app.update = editorDidUpdate;
  app.simulator = simulator;
  app.prop = prop;
  return app;
};

const origami = CodeOrigamiSimulator("origami", "editor", "console");

window.onload = function () {
  origami.update();
  // origami.draw();
};
document.getElementById("fold-percent-slider").oninput = function (e) {
  origami.simulator.foldPercent = parseInt(e.target.value, 10) / 100.0;
  document.querySelector("#fold-percent-label").innerHTML = e.target.value;
};
document.getElementById("button-pause").onclick = function (e) {
  origami.simulator.simulationRunning = !origami.simulator.simulationRunning;
  e.target.setAttribute("class", origami.simulator.simulationRunning ? "button" : "button red");
  e.target.innerHTML = origami.simulator.simulationRunning ? "on" : "paused";
};
document.getElementById("button-material-strain").onclick = function (e) {
  origami.simulator.strain = !origami.simulator.strain;
  e.target.setAttribute("class", origami.simulator.strain ? "button red" : "button");
};
// document.getElementById("button-control-grab").onclick = function (e) {
//   origami.simulator.grab = !origami.simulator.grab;
//   e.target.setAttribute("class", origami.simulator.grab ? "button red" : "button");
// };
