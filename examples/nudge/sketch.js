// example
// split screen: crease pattern and folded form
const { RabbitEar } = window;

const style = `
line.mountain {
  stroke: black;
}
line.valley {
  stroke: black;
}
`;

const div = document.querySelectorAll(".row")[0];
const origami = RabbitEar.Origami(div, RabbitEar.bases.frog, { style, padding: 0.05 });
const folded = RabbitEar.Origami(div, origami.copy(), { style, padding: 0.05 });
folded.fold();
origami.vertices.visible = true;

origami.svg.onMouseMove = function (event) {
  origami.vertices.forEach((v) => { v.svg.style = ""; });
  origami.edges.forEach((e) => { e.svg.style = ""; });
  origami.faces.forEach((f) => { f.svg.style = ""; });
  const nearest = origami.nearest(event);
  if (nearest.vertex) { nearest.vertex.svg.style = "fill:#357;stroke:#357"; }
  if (nearest.edge) { nearest.edge.svg.style = "stroke:#ec3"; }
  if (nearest.face) { nearest.face.svg.style = "fill:#e53"; }

  if (origami.selected) {
    origami.vertices_coords[origami.selected.index] = [event.x, event.y];
    origami.svg.draw();
    folded.load(origami.copy());
    folded.fold();
  }
};

origami.svg.onMouseDown = function (event) {
  origami.selected = origami.nearest(event).vertex;
};

origami.svg.onMouseUp = function () {
  origami.selected = undefined;
};
