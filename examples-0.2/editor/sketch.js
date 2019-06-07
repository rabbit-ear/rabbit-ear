
const origami = re.Origami("origami", { padding: 0.1, autofit: false });
origami.arrowLayer = origami.group();
origami.vertices.visible = true;
origami.touchHistory = [];
origami.mouseSnap = {
  down: undefined,
  up: undefined,
  position: undefined
};
origami.mode = "mode-axiom-3";
origami.touchGroup = origami.group();
origami.snapPoints = JSON.parse(JSON.stringify(origami.cp.vertices_coords));
origami.snapPointGroup = origami.group();

const folding = re.Origami("folding");

origami.update = function () {
  folding.cp = origami.cp.copy();
  folding.fold();
  origami.recalculate();
};

origami.setSnapPoints = function (points) {
  origami.snapPoints = points;
  origami.snapPointGroup.removeChildren();
  origami.snapPoints.forEach(point => origami.snapPointGroup.circle(point[0], point[1], 0.01));
};

const unique_points2 = function (points, epsilon = re.math.EPSILON) {
  const horizSort = function (a, b) { return a[0] - b[0]; };
  const vertSort = function (a, b) { return a[1] - b[1]; };
  const equivalent = function (a, b) {
    for (let i = 0; i < a.length; i += 1) {
      if (Math.abs(a[i] - b[i]) > epsilon) {
        return false;
      }
    }
    return true;
  };

  const vertices_equivalent = Array
    .from(Array(points.length)).map(() => []);

  for (let i = 0; i < points.length - 1; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      vertices_equivalent[i][j] = equivalent(points[i], points[j]);
    }
  }

  const vertices_map = Array(points.length).fill(undefined);
  vertices_equivalent
    .forEach((row, i) => row
      .forEach((eq, j) => {
        if (eq) {
          vertices_map[j] = vertices_map[i] === undefined
            ? i
            : vertices_map[i];
        }
      }));

  return points.filter((_, i) => vertices_map[i] === undefined);
};

origami.recalculate = function () {
  const graph = origami.cp;
  const edges = graph.edges_vertices
    .map(ev => ev.map(v => graph.vertices_coords[v]));
  const p_v_edges = edges
    .map(e => [e[0], [e[1][0] - e[0][0], e[1][1] - e[0][1]]]);
  const solutions = [];
  for (let i = 0; i < graph.vertices_coords.length - 1; i += 1) {
    for (let j = i + 1; j < graph.vertices_coords.length; j += 1) {
      let solution1 = re.axiom(1, graph.vertices_coords[i], graph.vertices_coords[j]).solutions[0];
      solutions.push(solution1);
      let solution2 = re.axiom(2, graph.vertices_coords[i], graph.vertices_coords[j]).solutions[0];
      solutions.push(solution2);
    }
  }
  for (let i = 0; i < p_v_edges.length - 1; i += 1) {
    for (let j = 0; j < p_v_edges.length; j += 1) {
      let solution3 = re.axiom(3, p_v_edges[i][0], p_v_edges[i][1], p_v_edges[j][0], p_v_edges[j][1]).solutions;
      solutions.push(...solution3);
    }
  }
  let all_points = solutions
    .map(line => edges
      .map(edge => re.math.intersection
        .line_edge_exclusive(line[0], line[1], edge[0], edge[1]))
      .filter(a => a !== undefined))
    .reduce((a, b) => a.concat(b), []);
  // we have to also consider the points that already exist in the graph
  all_points = all_points.concat(origami.cp.vertices_coords);
  origami.setSnapPoints(unique_points2(all_points));
};

origami.onMouseUp = function (mouse) {
  const nearestPt = re.math.nearest_point2(mouse.position, origami.snapPoints);
  if (nearestPt !== undefined) {
    origami.mouseSnap.up = nearestPt;
  }

  // const near = origami.nearest(mouse);
  // if (near.vertex && near.vertex.index) {
  //   origami.mouseSnap.up = origami.cp.vertices_coords[near.vertex.index];
  // }
  if (!re.math.equivalent(origami.mouseSnap.up, origami.mouseSnap.down)) {
    let result = re.core.add_edge(origami.cp, origami.mouseSnap.up, origami.mouseSnap.down);
    console.log(result);
    result.new.edges[0].edges_assignment = "V";
    re.core.apply_run(origami.cp, result);
    console.log(JSON.parse(JSON.stringify(origami.cp)));
    origami.cp.clean();
    origami.draw();
  }
  origami.touchGroup.removeChildren();
  origami.update();
};

origami.onMouseDown = function (mouse) {
  const nearestPt = re.math.nearest_point2(mouse.position, origami.snapPoints);
  // const near = origami.nearest(mouse);
  // if (near.vertex !== undefined && near.vertex.index !== undefined) {
  //   origami.mouseSnap.down = origami.cp.vertices_coords[near.vertex.index];
  //   origami.mouseSnap.position = origami.cp.vertices_coords[near.vertex.index];
  // }
  if (nearestPt !== undefined) {
    origami.mouseSnap.down = nearestPt;
    origami.mouseSnap.position = nearestPt;
  }
  // origami.touchHistory.push(origami.nearest(mouse));
  origami.perform();
};

origami.onMouseMove = function (mouse) {
  const nearestPt = re.math.nearest_point2(mouse.position, origami.snapPoints);
  if (nearestPt !== undefined) {
    origami.mouseSnap.position = nearestPt;
  }

  // const near = origami.nearest(mouse);

  // if (near.vertex && near.vertex.index) {
  //   origami.mouseSnap.position = origami.cp.vertices_coords[near.vertex.index];
  // }
  // origami.vertices
  //   .map(a => a.svg)
  //   .filter(a => a != null)
  //   .forEach((circle) => { circle.style = ""; });
  // origami.edges.map(a => a.svg).forEach((line) => { line.style = ""; });

  // if (near.vertex) {
  //   near.vertex.svg.style = "fill:#ec3;stroke:#ec3";
  // }
  // if (near.edge) {
  //   near.edge.svg.style = "stroke:#ec3";
  // }
  // if (near.face) {
  //   // near.face.svg.style = "fill:#ec3";
  // }
  if (mouse.isPressed) {
    // origami.decorate(near);
    origami.touchGroup.removeChildren();
    const l = origami.touchGroup.line(
      origami.mouseSnap.down[0],
      origami.mouseSnap.down[1],
      origami.mouse.position[0],
      origami.mouse.position[1]
    );
    // l.setAttribute("stroke", "#ec3");
    // l.setAttribute("stroke-width", 0.01);
    // l.setAttribute("stroke-linecap", "round");
    l.setAttribute("style", "stroke-width:0.01;stroke:#ec3;stroke-linecap:round;");
    // const l2 = origami.touchGroup.line(
    //   origami.mouseSnap.down[0],
    //   origami.mouseSnap.down[1],
    //   origami.mouseSnap.position[0],
    //   origami.mouseSnap.position[1]
    // );
    // l2.setAttribute("style", "stroke-width:0.01;stroke-dasharray:0.02 0.04;stroke-linecap:round;");
  }
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
    re.core.remove_edges(origami.cp, [edgeIndex]);
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

  origami.update();
};
