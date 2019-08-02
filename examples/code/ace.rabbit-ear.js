const { RabbitEar, ace } = window;

const OrigamiCodeEditor = function (origamiID, codeID, consoleID) {
  const origami = RabbitEar.Origami(origamiID, { padding: 0.05 });
  const consoleDiv = document.querySelector(`#${consoleID}`);
  let editor;

  const reset = function () {
    origami.load(RabbitEar.bases.square);
  };
  const compileAndRun = function () {
    try {
      reset();
      eval(editor.getValue());
      origami.svg.draw();
      consoleDiv.innerHTML = "";
    } catch (err) {
      consoleDiv.innerHTML = `<p>${err}</p>`;
    }
  };
  const editorDidUpdate = function (delta) {
    compileAndRun();
    origami.didUpdate.filter(a => typeof a === "function").forEach(a => a());
  };
  const injectCode = function (text) {
    editor.session.insert({
      row: editor.session.getLength(),
      column: 0
    }, text);
  };

  try {
    editor = ace.edit(codeID);
  } catch (err) {
    throw new Error("bad internet connection. or Ace CDN moved-see index.html");
  }
  editor.setTheme("ace/theme/monokai");
  editor.setKeyboardHandler("ace/keyboard/sublime");
  editor.session.setMode("ace/mode/javascript");
  editor.session.on("change", editorDidUpdate);

  origami.onMouseDown = function (mouse) {
    const nearest = origami.nearest(mouse);
    const keys = Object.keys(nearest);
    const consoleString = keys
      .filter(key => nearest[key] != null)
      .map(key => `origami.cp.${key}[${nearest[key].index}]`)
      .map((objStr, i) => keys[i]
        + ": <a href='#' onclick='origami.injectCode(\""
        + objStr + "\")'>" + objStr + "</a><br>")
      .reduce((a, b) => a + b, "");
    consoleDiv.innerHTML = `<p>${consoleString}</p>`;
  };

  Object.defineProperty(origami, "injectCode", { value: injectCode });
  Object.defineProperty(origami, "reset", { value: reset });
  origami.didUpdate = [];
  // origami.reset = reset; // allow it to be overwritten
  // origami.codeDidUpdate = undefined; // to be called on non-error text change


  const downloadInBrowser = function (filename, contentsAsString) {
    const blob = new window.Blob([contentsAsString], { type: "text/plain" });
    const a = document.createElement("a");
    a.setAttribute("href", window.URL.createObjectURL(blob));
    a.setAttribute("download", filename);
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  document.querySelector("#button-crease").onclick = function () {
    injectCode("origami.crease( point, vector )");
  };
  document.querySelector("#button-axiom").onclick = function () {
    injectCode("RabbitEar.axiom( axiom_number , parameters )");
  };
  document.querySelector("#button-fold").onclick = function () {
    injectCode("origami.fold();");
  };
  document.querySelector("#button-save-SVG").onclick = function () {
    downloadInBrowser("origami.svg", origami.export.svg());
  };
  document.querySelector("#button-save-FOLD").onclick = function () {
    downloadInBrowser("origami.fold", origami.export.fold());
  };

  compileAndRun();

  return origami;
};
