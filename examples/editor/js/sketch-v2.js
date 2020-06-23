
const origami = RabbitEar.origami("origami", { padding: 0.1 });
origami.arrowLayer = origami.g();
origami.vertices.visible = true;
origami.touchHistory = [];
origami.mode = "mode-axiom-3";

const folding = RabbitEar.origami("folding", { padding: 0.1 });

origami.touchGroup = origami.g();
origami.drawHistory = [];
origami.dragEndpoints = [];

origami.update = function () {
  folding.cp = origami.cp.copy();
  folding.fold();
};

origami.onMouseMove = function (mouse) {
  const nearestEnd = origami.nearest(mouse.position);
  origami.vertices
    .map(a => a.svg)
    .filter(a => a != null)
    .forEach((circle) => { circle.style = ""; });
  origami.edges.map(a => a.svg).forEach((line) => { line.style = ""; });
  // origami.faces.map(a => a.svg).forEach(poly => poly.style = "");
  // origami.touchHistory.forEach((near) => {
  //   if (near.vertex) { near.vertex.svg.style = "fill:#e53;stroke:#e53"; }
  //   if (near.edge) { near.edge.svg.style = "stroke:#e53"; }
  // });
  // if (nearest.vertex) { nearest.vertex.svg.style = "fill:#ec3;stroke:#ec3"; }
  // if (nearest.edge) { nearest.edge.svg.style = "stroke:#ec3"; }
  // if (nearest.face) { nearest.face.svg.style = "fill:#ec3"; }
  if (nearestEnd.vertex) {
    nearestEnd.vertex.svg.style = "fill:#ec3;stroke:#ec3";
  }
  if (nearestEnd.edge) {
    nearestEnd.edge.svg.style = "stroke:#ec3";
  }
  if (nearestEnd.face) {
    // nearestEnd.face.svg.style = "fill:#ec3";
  }
  if (mouse.isPressed) {
    const nearestStart = origami.nearest(mouse.pressed);
    if (nearestStart.vertex) {
      nearestStart.vertex.svg.style = "fill:#e53;stroke:#e53";
    }
    if (nearestStart.edge) {
      nearestStart.edge.svg.style = "stroke:#e53";
    }
    if (nearestStart.face) {
      // nearestStart.face.svg.style = "fill:#e53";
    }

    origami.decorate(nearestEnd);
  }


  if (mouse.isPressed) {
    // origami.touchGroup.straightArrow(mouse.pressed, mouse.position, {
    //   strokeWidth: 0.04,
    //   length: 0.09,
    //   width: 0.03,
    //   color: "black",
    //   end: false,
    //   strokeStyle: "",
    //   fillStyle: "",
    //   highlight: 0.03,
    //   highlightStrokeStyle: "stroke-dasharray:0.02 0.04;stroke:#ec3",
    //   highlightFillStyle: "",
    // });
  }
};

origami.anticipateNextSteps = function () {

};

origami.onMouseUp = function () {
  origami.disableTimer();
  origami.touchGroup.removeChildren();
  origami.update();
};

origami.onMouseDown = function (mouse) {
  origami.touchHistory.push(origami.nearest(mouse));
  origami.perform();
  origami.enableTimer();
};

origami.enableTimer = function () {
  origami.drawHistory = [];
  if (origami.drawHistoryId !== undefined) {
    clearInterval(origami.drawHistoryId);
  }
  origami.drawHistoryId = setInterval(() => {
    origami.touchGroup.removeChildren();
    origami.drawHistory.push(origami.mouse);
    origami.updatePenPath();
  }, 5);
};

origami.updatePenPath = function () {
  const p = origami.touchGroup.polyline(origami.drawHistory);
  const l = origami.touchGroup.line(origami.mouse.pressed[0], origami.mouse.pressed[1], origami.mouse.position[0], origami.mouse.position[1]);
  l.setAttribute("style", "stroke-width:0.01;stroke-linecap:round;");
  p.setAttribute("style", "stroke-width:0.06;stroke-linecap:round;fill:none;stroke:#0003");
  origami.touchGroup.arcArrow(origami.mouse.pressed, origami.mouse.position, {
    color: "#e53",
    strokeWidth: 0.02,
    width: 0.03,
    length: 0.08,
    bend: 0.3,
    padding: 0.5,
    side: false,
  });
  const m0 = re.vector(origami.mouse[0], origami.mouse[1]);
  const m1 = re.vector(origami.mouse.pressed[0], origami.mouse.pressed[1]);
  const perp = m0.subtract(m1).normalize().scale(0.3).rotateZ90();
  const perp1 = m0.midpoint(m1).add(perp);
  const perp2 = m0.midpoint(m1).add(perp.scale(-1));
  origami.touchGroup.arcArrow(perp1, perp2, {
    color: "#000",
    strokeWidth: 0.03,
    width: 0.03,
    length: 0.08,
    bend: 0.5,
    padding: 0.5,
    side: false,
  });
};

origami.disableTimer = function () {
  clearInterval(origami.drawHistoryId);
  origami.drawHistoryId = undefined;
  console.log(origami.drawHistory);
  origami.drawHistory = [];
};

origami.perform = function () {
  if (origami.mode === "mode-flip-crease") {
    origami.touchHistory[0].edge.flip();
  }
  if (origami.mode === "mode-remove-crease") {
    // let edges = [origami.touchHistory[0].edge.index];
    // console.log(edges);
    const edgeIndex = origami.touchHistory[0].edge.index;
    const edge_vertices = origami.cp.edges_vertices[edgeIndex];
    const edge_assignment = origami.cp.edges_assignment[edgeIndex];
    if (edge_assignment === "B" || edge_assignment === "b") {
      return;
    }
    re.core.remove(origami.cp, "edges", [edgeIndex]);
    const collinear = re.core.vertices_collinear(origami.cp, edge_vertices);
    re.core.remove_collinear_vertices(origami.cp, collinear);
    delete origami.cp.edges_length;
    delete origami.cp.edges_faces;
    delete origami.cp.faces_vertices;
    delete origami.cp.faces_edges;
    delete origami.cp.vertices_faces;
    delete origami.cp.vertices_edges;
    delete origami.cp.vertices_vertices;

    origami.cp.clean();
  }
  // axiom fold
  if (origami.mode.substring(0, 11) === "mode-axiom-") {
    if (origami.touchHistory.length < 2) { return; }
    const axiom = parseInt(origami.mode.substring(11, 12), 10);
    // console.log(origami.touchHistory[0], origami.touchHistory[1]);
    let creases;
    switch (axiom) {
      case 1:
      case 2: creases = [re.axiom(axiom, origami.touchHistory[0].vertex,
        origami.touchHistory[1].vertex)];
        break;
      case 3: creases = re.axiom(axiom,
        origami.touchHistory[0].edge.point,
        origami.touchHistory[0].edge.vector,
        origami.touchHistory[1].edge.point,
        origami.touchHistory[1].edge.vector);
        break;
      case 4: creases = [re.axiom(axiom,
        origami.touchHistory[0].edge.point,
        origami.touchHistory[0].edge.vector,
        origami.touchHistory[1].edge.point)];
        break;
      default:
        break;
    }
    console.log(creases);
    // creases.forEach(c => origami.crease(c).valley());
  }
  // cleanup
  origami.touchHistory = [];
  origami.arrowLayer.removeChildren();
  origami.draw();
};

origami.decorate = function (nearest) {
  if (origami.touchHistory.length === 0) { return; }
  // do stuff
  origami.arrowLayer.removeChildren();
  if (nearest.vertex.index === origami.touchHistory[0].vertex.index) {
    return;
  }
};

window.onload = function () {
  document.querySelectorAll("[id^=mode]")
    .forEach((b) => {
      b.onclick = function () {
        origami.mode = b.id;
        document.querySelectorAll("[id^=mode]")
          .forEach((c) => { c.className = "button"; });
        b.className = "button red";
      };
    });

  document.querySelectorAll("[id^=switch-origami]")
    .forEach((b) => {
      b.onclick = function () {
        const path = b.id.substring(15).split("-");
        origami[path[0]][path[1]] = !origami[path[0]][path[1]];
        origami.draw();
        event.target.className = origami[path[0]][path[1]]
          ? "button red" : "button";
      };
    });
};
