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


const download = function (text, filename, mimeType) {
  const blob = new Blob([text], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
};


const stylesheet = `
.edges {
  stroke-width: 0.005
}
.edges .valley {
  stroke-dasharray: 0.02 0.01
}
.edges .mark {
  stroke-width: 0.003
}
`;

const App = function (options = {}) {
  const canvas_container = document.querySelectorAll(".canvas-container")[0];
  const origami = RabbitEar.Origami(canvas_container, {
    style: stylesheet,
    padding: 0.1
  });
  const app = {};

  app.options = options;
  app.origami = origami;
  app.history = [];

  app.cache = function () {
    app.history.push(app.origami.copy());
  };

  app.undo = function () {
    const lastStep = app.history.pop();
    if (lastStep === undefined) { return; }
    app.origami.load(lastStep);
  };

  app.tapModes = ["segment", "point-to-point", "bisect", "pleat", "rabbit-ear", "mountain-valley", "mark", "cut", "remove-crease"];

  // defaults
  app.options.snap = true;
  app.tapMode = "bisect";


  app.load = function (blob, filename, fileExtension) {
    // lastFileLoaded = { blob, filename, fileExtension };
    origami.load(blob);
    // folded.load(origami);
    // folded.fold();
    // jsonPanel.load(origami.export.json());
    // filePanel.load(origami, filename, fileExtension);
  };


  const setTapMode = function (newMode) {
    const oldMode = app.tapMode;
    app.tapMode = newMode;

    [".button-tap-mode-segment",
      ".button-tap-mode-point-to-point",
      ".button-tap-mode-bisect",
      ".button-tap-mode-pleat",
      ".button-tap-mode-perpendicular-to",
      ".button-tap-mode-rabbit-ear",
      ".button-tap-mode-kawasaki",
      ".button-tap-mode-remove-crease",
      ".button-tap-mode-mountain-valley",
      ".button-tap-mode-mark",
      ".button-tap-mode-cut",
      ".button-tap-mode-select",
      ".button-tap-mode-view",
      ".button-tap-mode-graph",
      ".button-tap-mode-history",
      ".button-tap-mode-version"
    ].map(a => document.querySelectorAll(a)[0])
      .forEach(a => removeClass("active", a));

    addClass("active", document.querySelectorAll(`.button-tap-mode-${newMode}`)[0]);

    if (oldMode === "graph" || oldMode === "history" || oldMode === "version") {
      document.querySelectorAll(".canvas-container")[0].style.display = "block";
      document.querySelectorAll(".code-container")[0].style.display = "none";
      document.body.style.backgroundColor = "initial";
      document.body.style.backgroundImage = "url(squares.png)";
    }

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
        document.body.style.backgroundColor = "#272822";
        document.body.style.backgroundImage = "initial";
      }
        break;
      case "version": break;
      default: break;
    }
  };

  document.querySelectorAll(".button-tap-mode-segment")[0]
    .onclick = function () { setTapMode("segment"); };
  document.querySelectorAll(".button-tap-mode-point-to-point")[0]
    .onclick = function () { setTapMode("point-to-point"); };
  document.querySelectorAll(".button-tap-mode-bisect")[0]
    .onclick = function () { setTapMode("bisect"); };
  document.querySelectorAll(".button-tap-mode-pleat")[0]
    .onclick = function () { setTapMode("pleat"); };
  document.querySelectorAll(".button-tap-mode-perpendicular-to")[0]
    .onclick = function () { setTapMode("perpendicular-to"); };
  document.querySelectorAll(".button-tap-mode-rabbit-ear")[0]
    .onclick = function () { setTapMode("rabbit-ear"); };
  document.querySelectorAll(".button-tap-mode-kawasaki")[0]
    .onclick = function () { setTapMode("kawasaki"); };

  document.querySelectorAll(".button-tap-mode-mountain-valley")[0]
    .onclick = function () { setTapMode("mountain-valley"); };
  document.querySelectorAll(".button-tap-mode-mark")[0]
    .onclick = function () { setTapMode("mark"); };
  document.querySelectorAll(".button-tap-mode-cut")[0]
    .onclick = function () { setTapMode("cut"); };

  document.querySelectorAll(".button-tap-mode-remove-crease")[0]
    .onclick = function () { setTapMode("remove-crease"); };
  document.querySelectorAll(".toggle-snap")[0]
    .onclick = function () { app.options.snap = !app.options.snap; };
  document.querySelectorAll(".toggle-zoom-swipe")[0]
    .onclick = function () { app.options.zoomSwipe = !app.options.zoomSwipe; };

  document.querySelectorAll(".button-tap-mode-select")[0]
    .onclick = function () { setTapMode("select"); };
  document.querySelectorAll(".button-tap-mode-view")[0]
    .onclick = function () { setTapMode("view"); };
  document.querySelectorAll(".button-tap-mode-graph")[0]
    .onclick = function () { setTapMode("graph"); };
  document.querySelectorAll(".button-tap-mode-history")[0]
    .onclick = function () { setTapMode("history"); };
  document.querySelectorAll(".button-tap-mode-version")[0]
    .onclick = function () { setTapMode("version"); };

  document.querySelectorAll(".menu-new")[0].onclick = function () { };
  document.querySelectorAll(".menu-open")[0].onclick = function () {

  };
  document.querySelectorAll(".menu-save")[0].onclick = function () { };
  document.querySelectorAll(".menu-export-fold")[0].onclick = function () {
    download(app.origami.export.fold(), "origami.fold", "application/json");
  };
  document.querySelectorAll(".menu-export-oripa")[0].onclick = function () { };
  document.querySelectorAll(".menu-export-obj")[0].onclick = function () { };
  document.querySelectorAll(".menu-export-svg")[0].onclick = function () {
    download(app.origami.export.svg(), "origami.svg", "image/svg+xml");
  };
  document.querySelectorAll(".menu-export-png")[0].onclick = function () { };

  document.body.onkeydown = function (e) {
    if (e.ctrlKey === true && e.key === "z") {
      app.undo();
    }
  };

  return app;
};

window.onload = function () {
  $(".ui.accordion").accordion();
  $(".ui.dropdown").dropdown();
  $(".ui.toggle.button.toggle-snap").state({
    text: { inactive: "snap", active: "snapping" }
  });
  $(".ui.toggle.button.toggle-zoom-swipe").state({
    text: { inactive: "zoom off", active: "zoom swipe" }
  });

  window.app = App();
  MousePressed();
  MouseMoved();
  MouseReleased();
  window.app.editor = CodeEditor(document.querySelectorAll(".text-editor-container")[0]);
};

function fileDidLoad(blob, mimeType, filename, fileExtension) {
  app.load(blob, filename, fileExtension);
};
