var CodeEditor = function CodeEditor(container) {
  var ace = window.ace;
  var app = {};
  var darkMode = false;

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

  var getDarkMode = function getDarkMode() {
    return darkMode;
  };

  var setDarkMode = function setDarkMode(value) {
    darkMode = value;
    app.editor.setTheme(darkMode ? "ace/theme/monokai" : "ace/theme/xcode");
  };

  try {
    app.editor = ace.edit(container);
  } catch (err) {
    throw new Error("Bad internet connection, cannot load Ace editor");
  }

  app.code = app.editor.container;
  app.editor.session.on("change", editorDidUpdate);
  app.editor.setOptions({
    theme: "ace/theme/xcode",
    keyboardHandler: "ace/keyboard/sublime",
    mode: "ace/mode/javascript",
    fontSize: "12pt",
    showLineNumbers: false,
    tabSize: 2
  });
  // app.editor.focus();
  app.editor.commands.addCommand({
    name: "execute",
    // bindKey: { mac: "cmd-shift-enter", win: "ctrl-shift-enter" },
    bindKey: { mac: "enter", win: "enter" },
    exec: function (editor) {
      if (typeof app.didPressReturn === "function") {
        app.didPressReturn();
      }
    },
    readOnly: true // false if this command should not apply in readOnly mode
  });

  Object.defineProperty(app, "clear", { value: clear });
  Object.defineProperty(app, "injectCode", { value: injectCode });
  Object.defineProperty(app, "code", { get: getCode, set: setCode });
  Object.defineProperty(app, "darkMode", { get: getDarkMode, set: setDarkMode });

  // allow these to be overwritten. these are async methods
  app.didUpdate = function () {}; // callback. after code runs
  app.didPressReturn = function () {}; // callback. when return key is pressed
  app.didPause = function () {}; // callback. after "paused" is modified
  app.reset = function () {}; // this is called at the beginning of every execution cycle

  return app;
};
