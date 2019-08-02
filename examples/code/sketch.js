
window.onload = function () {
  const origami = OrigamiCodeEditor("origami-container", "editor", "console");

  // todo, bring these back into the work flow.
  // make an origami method that "draws" these into the crease pattern as marks.

  ["arc", "arcArrow", "bezier", "circle", "ellipse", "line",
    "polygon", "polyline", "rect", "regularPolygon", "straightArrow",
    "text", "wedge", "group"].forEach((name) => {
    window[name] = function (...args) {
      const element = RabbitEar.draw.svg[name](...args);
      origami.svg.appendChild(element);
      return element;
    };
  });
};
