document.addEventListener("DOMContentLoaded", function () {
  var app = LiveCode(document.querySelector("#app"));

  var origami = RabbitEar.origami(app.dom.canvas, {
    padding: 0.05
  });

  app.didPause = function (paused) { };
  app.didUpdate = function () { };
  app.reset = function () {
    origami.load(RabbitEar.bases.square);
  };

  var pts = [];

  origami.svg.mouseMoved = function (mouse) {
    var nearest = origami.nearest(mouse);
    console.log(nearest);

  };

  origami.svg.mousePressed = function (mouse) {
    pts.push(mouse);
    if (pts.length === 2) {
      var param = [pts[0][0], pts[0][1], pts[1][0], pts[1][1]].map(n => n.toFixed(5)).join(", ");
      app.injectCode(`origami.segment(${param});\n`);
      // origami.segment(pts);
      pts = [];
    }
  };

  window.app = app;
  window.origami = origami;
});
