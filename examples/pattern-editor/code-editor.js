var CodeEditor = function CodeEditor(container) {
  var ace = window.ace;
  var app = {};

  if (document.readyState === "loading") {
    console.warn("CodeEditor(): please initialize using DOMContentLoaded");
  }

  var editorDidUpdate = function editorDidUpdate() {
    // compileAndRun();
  };

  var injectCode = function injectCode(text) {
    app.editor.session.insert({
      row: app.editor.session.getLength(),
      column: 0
    }, text);
  };

  var getCode = function getCode() {
    return app.editor.getValue();
  };

  var setCode = function setCode(value) {
    app.editor.setValue(value);
  };

  var clear = function clear() {
    app.editor.setValue("");
  };

  try {
    app.editor = ace.edit(container);
  } catch (err) {
    throw new Error("Bad internet connection, cannot load Ace editor");
  }

  app.code = app.editor.container;
  app.editor.setTheme("ace/theme/monokai");
  app.editor.setKeyboardHandler("ace/keyboard/sublime");
  app.editor.session.setMode("ace/mode/javascript");
  app.editor.session.on("change", editorDidUpdate);
  // app.editor.focus();

  Object.defineProperty(app, "clear", { value: clear });
  Object.defineProperty(app, "injectCode", { value: injectCode });
  Object.defineProperty(app, "code", { get: getCode, set: setCode });

  // allow these to be overwritten. these are async methods
  app.didUpdate = function () {}; // callback. after code runs
  app.didPause = function () {}; // callback. after "paused" is modified
  app.reset = function () {}; // this is called at the beginning of every execution cycle

  return app;
};
