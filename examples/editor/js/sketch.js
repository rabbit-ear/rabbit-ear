const getClassList = function (xmlNode) {
  const currentClass = xmlNode.getAttribute("class");
  return (currentClass == null
    ? []
    : currentClass.split(" ").filter(s => s !== ""));
};

const addClass = function (newClass, xmlNode) {
  if (xmlNode == null) {
    return xmlNode;
  }
  const classes = getClassList(xmlNode)
    .filter(c => c !== newClass);
  classes.push(newClass);
  xmlNode.setAttributeNS(null, "class", classes.join(" "));
  return xmlNode;
};

const removeClass = function (removedClass, xmlNode) {
  if (xmlNode == null) {
    return xmlNode;
  }
  const classes = getClassList(xmlNode)
    .filter(c => c !== removedClass);
  xmlNode.setAttributeNS(null, "class", classes.join(" "));
  return xmlNode;
};

const download64 = function (base64, filename) {
  const a = document.createElement("a");
  a.href = base64;
  a.download = filename;
  a.click();
};

const download = function (text, filename, mimeType) {
  const blob = new Blob([text], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  download64(url, filename);
};

const toggleElementDisplay = function (el) {
  const curr = getComputedStyle(el).display || el.style.display;
  el.style.display = curr === "none" ? "block" : "none";
};

const planarMinify = function (graph) {
  const keep = ["vertices_coords", "edges_vertices", "edges_foldAngle", "edges_assignment"];
  RabbitEar.core.fold_keys.graph.filter(key => !keep.includes(key))
    .forEach(key => delete graph[key]);
};

const removeAllMarks = function (graph) {
  const markIndices = graph.edges_assignment
    .map((a, i) => a === "f" || a === "F" ? i : undefined)
    .filter(a => a !== undefined);
  graph.changed.pause = true;
  RabbitEar.core.remove(graph, "edges", markIndices);
  planarMinify(graph);
  graph.fragment();
  graph.populate();
  // graph.clean({collinear: true});
  graph.changed.pause = false;
};

const App = function (options = {}) {
  const canvas_container = document.querySelectorAll(".canvas-container")[0];
  const origami = RabbitEar.origami(canvas_container, {
    padding: 0.025,
    attributes: {
      boundaries: { fill: "#fffbf8" },
      edges: {
        mountain: { stroke: "#e53" },
        valley: { stroke: "#158" },
        mark: { stroke: "lightgray" }
      },
    }
  });

  const folded_container = document.querySelectorAll(".pip-view")[0];
  const folded = RabbitEar.origami(folded_container, {
    boundaries: false,
    attributes: {
      faces: { fill: "#fff2" },
      edges: {
        mountain: { stroke: "#fff"},
        valley: { stroke: "#fff" },
        mark: { stroke: "#fff4" },
        boundary: { stroke: "#fff" },
      }
    }
  });
  folded.svg.setAttribute("style", "margin:auto");
  let pipShowingFolded = true;

  const app = {};

  app.options = options;
  app.origami = origami;
  app.folded = folded;
  app.history = [];
  app.symmetries = [];
  app.selected = {
    vertices: [],
    edges: [],
    faces: []
  };

  // app.symmetries.push(RabbitEar.matrix2.makeReflection([1, 1], [0, 0]));

  let cacheCount = 0;
  app.cache = function (historyTextRecord) {
    app.history.push(app.origami.copy());
    const el = document.querySelectorAll(".info-history-pre")[0];
    el.innerHTML += ("00" + cacheCount).slice(-3) + " " + historyTextRecord;
    cacheCount += 1;
  };

  app.undo = function () {
    const lastStep = app.history.pop();
    if (lastStep === undefined) { return; }
    app.origami.load(lastStep);
  };

  app.cutSelected = function () {
    app.cache("cut selection\n");
    // app.selected.vertices.forEach(v => {});
    RabbitEar.core.remove(app.origami, "edges", app.selected.edges);
    app.origami.clean();
    app.origami.svg.draw();
    app.update();
  };

  // app.tapModes = ["segment", "point-to-point", "bisect", "pleat", "rabbit-ear", "mountain-valley", "mark", "cut", "remove-crease"];

  // defaults
  app.options.snap = true;
  app.tapMode = "bisect";

  app.update = function () {
    // todo, make load() trigger an unfold
    // app.folded.unfold();
    app.folded.load(origami);
    app.folded.fold();
  };

  app.load = function (blob, filename, fileExtension) {
    app.cache(`load ${filename}.${fileExtension}`);
    // lastFileLoaded = { blob, filename, fileExtension };
    origami.load(blob);
    app.update();

    const title = origami.file_title || filename || "";
    const author = origami.file_author || "";
    const description = origami.file_description || "";

    document.querySelectorAll(".input-title")[0].value = title;
    document.querySelectorAll(".input-author")[0].value = author;
    document.querySelectorAll(".input-description")[0].value = description;

    app.dragRect = [];
    setTapMode(app.tapMode);
    // jsonPanel.load(origami.export.json());
    // filePanel.load(origami, filename, fileExtension);
  };

  const filename = function () {
    const title = origami.file_title != null
      ? origami.file_title.replace(/ /g, "-")
      : "origami";
    const author = origami.file_author != null
      ? origami.file_author.replace(/ /g, "-")
      : "";
    // const description = origami.file_description || ""
    const d = new Date();
    const datestring = d.getFullYear()
      + "-" + ("0" + (d.getMonth() + 1)).slice(-2)
      + "-" + ("0" + d.getDate()).slice(-2)
      + "-" + ("0" + d.getHours()).slice(-2)
      + "-" + ("0" + d.getMinutes()).slice(-2)
      + "-" + ("0" + d.getSeconds()).slice(-2);
    return author === ""
      ? `${title}-${datestring}`
      : `${author}-${title}-${datestring}`;
  };

  const setTapMode = function (newMode) {
    const oldMode = app.tapMode;
    app.tapMode = newMode;

    [".button-tap-mode-line",
      ".button-tap-mode-ray",
      ".button-tap-mode-segment",
      ".button-tap-mode-line",
      ".button-tap-mode-point-to-point",
      ".button-tap-mode-bisect",
      ".button-tap-mode-pleat",
      ".button-tap-mode-perpendicular-to",
      ".button-tap-mode-point-to-line-point",
      ".button-tap-mode-point-to-line-line",
      ".button-tap-mode-rabbit-ear",
      ".button-tap-mode-kawasaki",
      ".button-tap-mode-remove-crease",
      ".button-tap-mode-mountain-valley",
      ".button-tap-mode-mark",
      ".button-tap-mode-select",
      ".button-tap-mode-view",
      ".button-tap-mode-graph",
      ".button-tap-mode-history",
      ".button-tap-mode-version"
    ].map(a => document.querySelectorAll(a)[0])
      .forEach(a => removeClass("active", a));

    addClass("active", document.querySelectorAll(`.button-tap-mode-${newMode}`)[0]);

    app.selected.vertices = [];
    app.selected.edges = [];
    app.selected.faces = [];

    switch (app.tapMode) {
      case "view": break;
      case "graph": {
        document.querySelectorAll(".canvas-container")[0].style.display = "none";
        document.querySelectorAll(".code-container")[0].style.display = "block";
        const json = JSON.stringify(JSON.parse(app.origami.export.fold()), null, 2);
        app.editor.clear();
        app.editor.injectCode(json);
        document.body.style.backgroundColor = "#272822";
        document.body.style.backgroundImage = "initial";
      }
        break;
      case "history": {
        document.querySelectorAll(".canvas-container")[0].style.display = "none";
        document.querySelectorAll(".code-container")[0].style.display = "block";
        const json = JSON.stringify(JSON.parse(app.origami.export.fold()), null, 2);
        app.editor.clear();
        app.editor.injectCode(json);
        // document.body.style.backgroundColor = "#272822";
        // document.body.style.backgroundImage = "initial";
      }
        break;
      case "version": break;
      default: break;
    }
  };

  ["line",
    "ray",
    "segment",
    "line",
    "point-to-point",
    "bisect",
    "pleat",
    "perpendicular-to",
    // "point-to-line-point",
    // "point-to-line-line",
    // "rabbit-ear",
    // "kawasaki",
    "remove-crease",
    "mountain-valley",
    "mark",
    "select"].forEach(str => {
    document.querySelectorAll(".button-tap-mode-" + str)[0]
      .onclick = function () { setTapMode(str); };
  });

  // document.querySelectorAll(".toggle-snap")[0]
    // .onclick = function () { app.options.snap = !app.options.snap; };
  // document.querySelectorAll(".toggle-zoom-swipe")[0]
  //   .onclick = function () { app.options.zoomSwipe = !app.options.zoomSwipe; };

  document.querySelectorAll(".button-info")[0].onclick = function () {
    toggleElementDisplay(document.querySelectorAll(".info-cursor")[0]);
  };
  document.querySelectorAll(".button-history")[0].onclick = function () {
    toggleElementDisplay(document.querySelectorAll(".info-history")[0]);
  };
  // document.querySelectorAll(".button-symmetry")[0].onclick = function () {
    // toggleElementDisplay(document.querySelectorAll(".info-symmetry")[0]);
  // };

  document.querySelectorAll(".input-title")[0]
    .oninput = function (e) { origami.file_title = e.srcElement.value; };
  document.querySelectorAll(".input-author")[0]
    .oninput = function (e) { origami.file_author = e.srcElement.value; };
  document.querySelectorAll(".input-description")[0]
    .oninput = function (e) { origami.file_description = e.srcElement.value; };

  // document.querySelectorAll(".switch-cp-folded")[0].onclick = function () {
  //   const origamiParent = origami.svg.parentNode;
  //   const foldedParent = folded.svg.parentNode;
  //   origami.svg.remove();
  //   folded.svg.remove();
  //   origamiParent.appendChild(folded.svg);
  //   foldedParent.appendChild(origami.svg);
  //   pipShowingFolded = !pipShowingFolded;
  // };

  document.querySelectorAll(".menu-new")[0]
    .onclick = function () {
      app.load(RabbitEar.bases.square);
    };
  document.querySelectorAll(".menu-export-fold")[0].onclick = function () {
    const main = pipShowingFolded ? app.origami : app.folded;
    download(main.export.fold(), filename() + ".fold", "application/json");
  };
  document.querySelectorAll(".menu-export-svg")[0].onclick = function () {
    const main = pipShowingFolded ? app.origami : app.folded;
    download(main.export.svg(), filename() + ".svg", "image/svg+xml");
  };
  document.querySelectorAll(".menu-export-png")[0].onclick = function () {
    const canvas = document.createElement("canvas");
    canvas.setAttribute("width", "2048");
    canvas.setAttribute("height", "2048");
    const ctx = canvas.getContext("2d");
    const DOMURL = (window.URL || window.webkitURL);
    const main = pipShowingFolded ? app.origami : app.folded;
    const svgString = new XMLSerializer().serializeToString(main.svg);
    const svg = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const img = new Image();
    const url = DOMURL.createObjectURL(svg);
    img.onload = function () {
      ctx.drawImage(img, 0, 0);
      const png = canvas.toDataURL("image/png");
      download64(png, filename() + ".png");
      DOMURL.revokeObjectURL(png);
    };
    img.src = url;
  };
  // document.querySelectorAll(".menu-export-oripa")[0].onclick = function () { };
  // document.querySelectorAll(".menu-export-obj")[0].onclick = function () { };
  // document.querySelectorAll(".menu-open")[0].onclick = function () { };

  document.body.onkeydown = function (e) {
    if (e.keyCode === 8) { // backspace
      app.cutSelected();
    }
    if (e.ctrlKey === true && e.key === "z") {
      app.undo();
    }
    if (e.ctrlKey === true && e.key === "x") {
      app.cutSelected();
    }
    if (e.key === "s") { setTapMode("select"); }
    if (e.key === "1") { setTapMode("line"); }
    if (e.key === "2") { setTapMode("point-to-point"); }
    if (e.key === "3") { setTapMode("bisect"); }
    if (e.key === "4") { setTapMode("perpendicular-to"); }
    if (e.key === "5") { setTapMode("point-to-line-point"); }
    if (e.key === "6") { console.log("axiom 6"); }
    if (e.key === "7") { setTapMode("point-to-line-line"); }
  };

  return app;
};

window.onload = function () {
  window.app = App();
  MousePressed();
  MouseMoved();
  MouseReleased();
  window.app.repl = CodeEditor(document.querySelectorAll(".code-console")[0]);
  window.app.repl.didPressReturn = function () {
    const code = window.app.repl.code;
    console.log(code);
    window.app.repl.clear();
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
    // const func = new Function(code);
    // func(2, 6);
  };
};

function fileDidLoad(blob, mimeType, filename, fileExtension) {
  app.load(blob, filename, fileExtension);
};
