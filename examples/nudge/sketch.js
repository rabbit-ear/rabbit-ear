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
origami.populate();
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
    origami.screenUpdate();
  }
};

origami.screenUpdate = function () {
  origami.svg.draw();
  folded.load(origami.copy());
  folded.fold();
};

origami.svg.onMouseDown = function (event) {
  origami.selected = origami.nearest(event).vertex;
};

origami.svg.onMouseUp = function () {
  origami.selected = undefined;
};

let LOOP_TIMER;
const stopLoop = function () {
  clearInterval(LOOP_TIMER);
  LOOP_TIMER = undefined;
};
const startLoop = function () {
  stopLoop();
  LOOP_TIMER = window.setInterval(() => {
    const nomarks = RabbitEar.core.copy_without_marks(origami);
    const vertices_nudge = RabbitEar.core.make_vertices_nudge(nomarks);
    vertices_nudge.forEach((nudge, i) => {
      const nudgeVec = RabbitEar.vector(nudge).scale(0.01);
      const vec = RabbitEar.vector(origami.vertices_coords[i]).add(nudgeVec);
      origami.vertices_coords[i] = [vec[0], vec[1]];
    });
    origami.screenUpdate();
  }, 1000 / 60);
};

document.querySelectorAll(".button-nudge").forEach((b) => {
  b.onclick = function (e) {
    if (e.target.getAttribute("pressed") === "true") {
      e.target.setAttribute("pressed", "false");
      stopLoop();
    } else {
      e.target.setAttribute("pressed", "true");
      startLoop();
    }
    // origami.nudge();
  };
});
