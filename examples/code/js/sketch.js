document.addEventListener("DOMContentLoaded", function () {
  var app = LiveCode(document.querySelector("#app"));

  var origami = RabbitEar.Origami(document.querySelectorAll(".canvas-container")[0], {
    padding: 0.05
  });

  app.didPause = function (paused) { };
  app.didUpdate = function () { };
  app.reset = function () {
    origami.clear();
  };

  window.app = app;
  window.origami = origami;
});
