const { RabbitEar } = window;
const markSegment = RabbitEar.Origami();
markSegment.vertices.visible = true;

markSegment.svg.onMouseUp = function (mouse) {
  markSegment.mark(mouse.pressed, mouse.position, "V");
};

const highlightStyle = {
  vertex: "fill:#357;stroke:#357",
  edge: "stroke:#ec3",
  face: "fill:#e53",
};

markSegment.svg.onMouseMove = function (event) {
  /** highlight */
  markSegment.vertices.filter(a => a.svg).forEach((v) => { v.svg.style = ""; });
  markSegment.edges.filter(a => a.svg).forEach((e) => { e.svg.style = ""; });
  markSegment.faces.filter(a => a.svg).forEach((f) => { f.svg.style = ""; });
  const nearest = markSegment.nearest(event);
  ["vertex", "edge", "face"].filter(key => nearest[key] && nearest[key].svg)
    .forEach((key) => { nearest[key].svg.style = highlightStyle[key]; });
  /** highlight end */
};
