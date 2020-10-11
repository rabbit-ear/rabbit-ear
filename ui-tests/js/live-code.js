var LiveCode = function LiveCode(container) {
  var ace = window.ace;
  var app = {};
  var isPaused = false;
  var darkMode = true;
  var zoom = false;

  if (document.readyState === "loading") {
    console.warn("LiveCode(): please initialize using DOMContentLoaded");
  }

  var initDOM = function initDOM(appContainer) {
    var codeContainer = document.createElement("div");
    var canvasContainer = document.createElement("div");
    var consoleContainer = document.createElement("div");
    var playPauseButton = document.createElement("div");
    var darkModeButton = document.createElement("div");
    var fontSizeButton = document.createElement("div");
    codeContainer.setAttribute("class", "code-editor");
    canvasContainer.setAttribute("class", "code-canvas");
    consoleContainer.setAttribute("class", "code-console");
    playPauseButton.setAttribute("class", "play-pause-button play");
    darkModeButton.setAttribute("class", "dark-mode-button");
    fontSizeButton.setAttribute("class", "font-size-button");
    playPauseButton.setAttribute("title", "Auto-compile");
    darkModeButton.setAttribute("title", "Dark mode");
    fontSizeButton.setAttribute("title", "Large / small text");
    appContainer.appendChild(codeContainer);
    appContainer.appendChild(canvasContainer);
    appContainer.appendChild(consoleContainer);
    appContainer.appendChild(playPauseButton);
    appContainer.appendChild(darkModeButton);
    appContainer.appendChild(fontSizeButton);
    return {
      code: codeContainer,
      canvas: canvasContainer,
      console: consoleContainer,
      playPause: playPauseButton,
      darkMode: darkModeButton,
      fontSize: fontSizeButton
    };
  };

  var compileAndRun = function compileAndRun() {
    try {
      if (typeof app.didBeginUpdate === "function") {
        app.didBeginUpdate();
      }
      eval(app.editor.getValue());
      app.dom.console.innerHTML = "";
    } catch (err) {
      app.dom.console.innerHTML = "<p>" + err + "</p>";
    }
    if (typeof app.didUpdate === "function") {
      app.didUpdate();
    }
  };

  var detectLoop = function detectLoop() {
    var position = app.editor.getCursorPosition();
    var token = app.editor.session.getTokenAt(position.row, position.column);
    if (token) {
      if (token.type === "keyword") {
        if (token.value === "for") { return true; }
        if (token.value === "while") { return true; }
        if (token.value === "do") { return true; }
      }
    }
    return false;
  };

  var flashTimeout;
  var flashAutoPause = function flashAutoPause() {
    if (flashTimeout != null) { clearInterval(flashTimeout); }
    var blurAmount = 3;
    flashTimeout = setInterval(function () {
      document.querySelector("#app").setAttribute("style", `filter: blur(${blurAmount}px);`);
      blurAmount -= 0.3;
      if (blurAmount <= 0) {
        document.querySelector("#app").setAttribute("style", "");
        clearInterval(flashTimeout);
      }
    }, 40);
  };

  var editorDidUpdate = function editorDidUpdate() {
    if (detectLoop() && !app.paused) {
      app.paused = true;
      flashAutoPause();
    }

    if (!isPaused) {
      compileAndRun();
    }
  };

  var injectCode = function injectCode(text) {
    app.editor.session.insert({
      row: app.editor.session.getLength(),
      column: 0
    }, text);
  };

  var getPaused = function getPaused() {
    return isPaused;
  };

  var setPaused = function setPaused(value) {
    if (value !== isPaused) {
      // remove syntax highlighting if paused
      setTimeout(function () {
        app.editor.session.setMode(value ? null : "ace/mode/javascript");
      }, 50);
    }
    isPaused = value;
    if (!isPaused) { compileAndRun(); }
    else { app.dom.console.innerHTML = ""; }
    // update icon
    app.dom.playPause.setAttribute("class", isPaused
      ? "play-pause-button pause"
      : "play-pause-button play");
    if (typeof app.didPause === "function") {
      app.didPause(isPaused);
    }
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

  // init app
  app.dom = initDOM(container);

  try {
    app.editor = ace.edit(app.dom.code);
  } catch (err) {
    throw new Error("Bad internet connection, cannot load Ace editor");
  }

  app.editor.setTheme("ace/theme/monokai");
  app.editor.setKeyboardHandler("ace/keyboard/sublime");
  app.editor.session.setMode("ace/mode/javascript");
  app.editor.session.on("change", editorDidUpdate);
  app.editor.session.setTabSize(2);
  app.editor.setOptions({ fontSize: "11pt" });
  app.editor.focus();

  app.dom.playPause.onclick = function () {
    setPaused(!isPaused);
    app.editor.focus();
  };
  app.dom.darkMode.onclick = function () {
    setDarkMode(!darkMode);
    app.editor.focus();
  };
  app.dom.fontSize.onclick = function () {
    zoom = !zoom;
    app.editor.setOptions({ fontSize: (zoom ? "18pt" : "11pt") });
    app.editor.focus();
  };

  Object.defineProperty(app, "clear", { value: clear });
  Object.defineProperty(app, "injectCode", { value: injectCode });
  Object.defineProperty(app, "code", { get: getCode, set: setCode });
  Object.defineProperty(app, "paused", { get: getPaused, set: setPaused });
  Object.defineProperty(app, "darkMode", { get: getDarkMode, set: setDarkMode });

  // allow these to be overwritten. these are async methods
  app.didUpdate = function () {}; // callback. after code runs
  app.didPause = function () {}; // callback. after "paused" is modified
  app.didBeginUpdate = function () {}; // this is called at the beginning of every execution cycle

  compileAndRun();
  return app;
};
