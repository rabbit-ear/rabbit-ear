const OrigamiCodeEditor = function (origamiID, codeID, consoleID) {
  const origami = re.Origami(origamiID, { padding: 0.05 });
  const consoleDiv = document.querySelector(`#${consoleID}`);

  const compile = function (delta) {
    try {
      origami.reset();
      eval(origami.editor.getValue());
      origami.draw();
      consoleDiv.innerHTML = "";
    } catch (err) {
      consoleDiv.innerHTML = `<p>${err}</p>`;
    }
  };
  const editorDidUpdate = function (delta) {
    compile(delta);
    if (origami.codeDidUpdate !== undefined) { origami.codeDidUpdate(); }
  };
  const reset = function () {
    origami.cp = re.bases.square;
  };
  const injectCode = function (text) {
    origami.editor.session.insert({
      row: origami.editor.session.getLength(),
      column: 0
    }, text);
  };

  try {
    origami.editor = ace.edit(codeID);
  } catch (err) {
    throw new Error("bad internet connection. or Ace CDN moved-see index.html");
  }
  origami.editor.setTheme("ace/theme/monokai");
  origami.editor.setKeyboardHandler("ace/keyboard/sublime");
  origami.editor.session.setMode("ace/mode/javascript");
  origami.editor.session.on("change", editorDidUpdate);

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
  origami.reset = reset; // allow it to be overwritten
  origami.codeDidUpdate = undefined; // to be called on non-error text change
  origami.compile = compile;
  return origami;
};
