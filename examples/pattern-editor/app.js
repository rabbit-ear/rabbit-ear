
const App = function (options = {}) {
  const canvas_container = document.querySelectorAll(".canvas")[0];
  const origami = RabbitEar.Origami(canvas_container, { padding: 0.1 });
  const app = {};

  app.options = options;
  app.origami = origami;

  app.tapModes = ["segment", "point-to-point", "bisect", "pleat", "rabbit-ear", "mountain-valley", "mark", "cut", "remove"];

  // defaults
  app.options.snap = true;
  app.tapMode = "segment";

  document.querySelectorAll(".button-tap-mode-segment")[0]
    .onclick = function () { app.tapMode = "segment"; };
  document.querySelectorAll(".button-tap-mode-point-to-point")[0]
    .onclick = function () { app.tapMode = "point-to-point"; };
  document.querySelectorAll(".button-tap-mode-bisect")[0]
    .onclick = function () { app.tapMode = "bisect"; };
  document.querySelectorAll(".button-tap-mode-pleat")[0]
    .onclick = function () { app.tapMode = "pleat"; };
  document.querySelectorAll(".button-tap-mode-rabbit-ear")[0]
    .onclick = function () { app.tapMode = "rabbit-ear"; };
  document.querySelectorAll(".button-tap-mode-kawasaki")[0]
    .onclick = function () { app.tapMode = "kawasaki"; };

  document.querySelectorAll(".button-tap-mode-mountain-valley")[0]
    .onclick = function () { app.tapMode = "mountain-valley"; };
  document.querySelectorAll(".button-tap-mode-mark")[0]
    .onclick = function () { app.tapMode = "mark"; };
  document.querySelectorAll(".button-tap-mode-cut")[0]
    .onclick = function () { app.tapMode = "cut"; };

  document.querySelectorAll(".button-tap-mode-remove")[0]
    .onclick = function () { app.tapMode = "remove"; };
  document.querySelectorAll(".toggle-snap")[0]
    .onclick = function () { app.options.snap = !app.options.snap; };

  return app;
};

window.onload = function () {
  $(".ui.accordion").accordion();
  $(".ui.dropdown").dropdown();
  $(".ui.toggle.button").state({
    text: { inactive: "Snap", active: "Snapping" }
  });

  window.app = App();
  Mouse();
};
