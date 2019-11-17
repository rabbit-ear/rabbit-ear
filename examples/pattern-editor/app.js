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

  app.tapModes = ["segment", "point-to-point", "bisect", "pleat", "rabbit-ear", "mountain-valley", "mark", "cut", "remove-crease"];

  // defaults
  app.options.snap = true;
  app.tapMode = "segment";

  const setTapMode = function (newMode) {
    app.tapMode = newMode;
    removeClass("active", document.querySelectorAll(".button-tap-mode-segment")[0]);
    removeClass("active", document.querySelectorAll(".button-tap-mode-point-to-point")[0]);
    removeClass("active", document.querySelectorAll(".button-tap-mode-bisect")[0]);
    removeClass("active", document.querySelectorAll(".button-tap-mode-pleat")[0]);
    removeClass("active", document.querySelectorAll(".button-tap-mode-rabbit-ear")[0]);
    removeClass("active", document.querySelectorAll(".button-tap-mode-kawasaki")[0]);
    removeClass("active", document.querySelectorAll(".button-tap-mode-remove-crease")[0]);
    removeClass("active", document.querySelectorAll(".button-tap-mode-mountain-valley")[0]);
    removeClass("active", document.querySelectorAll(".button-tap-mode-mark")[0]);
    removeClass("active", document.querySelectorAll(".button-tap-mode-cut")[0]);

    addClass("active", document.querySelectorAll(`.button-tap-mode-${newMode}`)[0]);
  };

  document.querySelectorAll(".button-tap-mode-segment")[0]
    .onclick = function () { setTapMode("segment"); };
  document.querySelectorAll(".button-tap-mode-point-to-point")[0]
    .onclick = function () { setTapMode("point-to-point"); };
  document.querySelectorAll(".button-tap-mode-bisect")[0]
    .onclick = function () { setTapMode("bisect"); };
  document.querySelectorAll(".button-tap-mode-pleat")[0]
    .onclick = function () { setTapMode("pleat"); };
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

  return app;
};

window.onload = function () {
  $(".ui.accordion").accordion();
  $(".ui.dropdown").dropdown({show: false});
  $(".ui.toggle.button.toggle-snap").state({
    text: { inactive: "snap", active: "snapping" }
  });
  $(".ui.toggle.button.toggle-zoom-swipe").state({
    text: { inactive: "zoom off", active: "zoom swipe" }
  });

  window.app = App();
  Mouse();
};
