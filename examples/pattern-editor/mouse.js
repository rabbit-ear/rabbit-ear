const Mouse = function () {
  const { app } = window;

  const layer = app.origami.svg.group();

  let dragRect = [];
  let nearest;
  let pressedNearest;

  app.origami.svg.mousePressed = function (mouse) {
    nearest = app.origami.nearest(mouse);
    pressedNearest = nearest;
    switch (app.tapMode) {
      case "segment": break;
      case "point-to-point": break;
      case "bisect": break;
      case "pleat": break;
      case "rabbit-ear": break;
      case "kawasaki": break;
      case "mountain-valley":
        if (nearest.edge) {
          switch (nearest.edge.assignment) {
            case "B":
            case "b": break;
            case "M":
            case "m":
              app.origami.edges_assignment[nearest.edge.index] = "V";
              break;
            case "F":
            case "f":
            case "V":
            case "v":
            default:
              app.origami.edges_assignment[nearest.edge.index] = "M";
              break;
          }
          app.origami.svg.draw();
        }
        break;
      case "mark": break;
      case "cut": break;
      case "remove-crease": break;
      default: console.warn("need to implement " + app.tapMode);
    }
  };

  app.origami.svg.mouseMoved = function (mouse) {
    layer.removeChildren();
    Array.from(app.origami.svg.groups.edges.childNodes).forEach(edge => edge.removeAttribute("style"));
    Array.from(app.origami.svg.groups.faces.childNodes).forEach(face => face.removeAttribute("style"));

    nearest = app.origami.nearest(mouse);

    if (mouse.isPressed) {
      dragRect[0] = Math.min(mouse.pressed[0], mouse[0]);
      dragRect[1] = Math.min(mouse.pressed[1], mouse[1]);
      dragRect[2] = Math.max(mouse.pressed[0], mouse[0]) - dragRect[0];
      dragRect[3] = Math.max(mouse.pressed[1], mouse[1]) - dragRect[1];
    }

    if (mouse.isPressed) {
      switch (app.tapMode) {
        case "segment":
          layer.line(mouse.pressed[0], mouse.pressed[1], mouse[0], mouse[1])
            .stroke("black")
            .strokeWidth(0.005);
          break;
        case "point-to-point":
          layer.arrow(mouse.pressed[0], mouse.pressed[1], mouse[0], mouse[1])
            .stroke("black")
            .fill("black")
            .head({ width: 0.015, height: 0.05 })
            .curve(0.25)
            .strokeWidth(0.01);
          break;
        case "bisect": {
          const edgeA = pressedNearest.edge.index;
          const edgeB = nearest.edge.index;
          const g = app.origami;
          const a0 = g.vertices_coords[g.edges_vertices[edgeA][0]];
          const a1 = g.vertices_coords[g.edges_vertices[edgeA][1]];
          const b0 = g.vertices_coords[g.edges_vertices[edgeB][0]];
          const b1 = g.vertices_coords[g.edges_vertices[edgeB][1]];
          const aVec = [a1[0] - a0[0], a1[1] - a0[1]];
          const bVec = [b1[0] - b0[0], b1[1] - b0[1]];
          const nearestA = RabbitEar.math.nearest_point_on_line(
            [a0[0], a0[1]],
            aVec,
            mouse.pressed,
            ((x) => { if (x < 0) return 0; if (x > 1) return 1; return x; })
          );
          const nearestB = RabbitEar.math.nearest_point_on_line(
            [b0[0], b0[1]],
            bVec,
            mouse,
            ((x) => { if (x < 0) return 0; if (x > 1) return 1; return x; })
          );

          const intersection = RabbitEar.math.intersection.line_line(a0, aVec, b0, bVec);
          if (intersection) {
            const vecArc = [nearestB[0] - nearestA[0], nearestB[1] - nearestA[1]];

            const vecIntersec = [intersection[0] - nearestA[0], intersection[1] - nearestA[1]];
            const det = vecIntersec[0] * vecArc[1] - vecIntersec[1] * vecArc[0];
            layer.arrow(nearestA[0], nearestA[1], nearestB[0], nearestB[1])
              .stroke("black")
              .strokeWidth(0.01)
              .curve(det < 0 ? 0.3 : -0.3);
          } else {
            layer.line(nearestA[0], nearestA[1], nearestB[0], nearestB[1])
              .stroke("black")
              .strokeWidth(0.01);
          }
          // layer.line(nearestA[0], nearestA[1], mouse[0], mouse[1]);
        }
          break;
        case "pleat": {
          // const normalized = RabbitEar.math.normalize(mouse.drag);
          const start = RabbitEar.vector(mouse.pressed);
          const step = RabbitEar.vector(mouse.drag).scale(1/12);
          const right = RabbitEar.vector(mouse.drag).scale(1/12).rotateZ270();
          const points = Array.from(Array(13))
            .map((_, i) => start.add(step.scale(i)).add(i%2===1 ? right : [0, 0]));
          layer.polyline(points)
            .stroke("black")
            .fill("none")
            .strokeWidth(0.01);
        }
          break;
        case "rabbit-ear": break;
        case "kawasaki": break;
        case "mountain-valley": break;
        case "mark": break;
        case "cut": break;
        case "remove-crease":
          layer.rect(...dragRect)
            .fill("none")
            .stroke("black")
            .strokeWidth(0.005)
            .strokeDasharray("0.02 0.008");
          break;
        default: console.warn("need to implement " + app.tapMode);
      }
    }
    const nVertexI = nearest.vertex ? nearest.vertex.index : "";
    const nEdgeI = nearest.edge ? nearest.edge.index : "";
    const nFaceI = nearest.face ? nearest.face.index : "";
    const nSectorI = nearest.sector ? nearest.sector.index : "";
    document.querySelectorAll(".app-info-p")[0].innerHTML = "<b>nearest</b><br>point [" + nVertexI + "]<br>edge [" + nEdgeI + "]<br>face [" + nFaceI + "]<br>sector [" + nSectorI + "]";


    switch (app.tapMode) {
      case "segment":
      case "point-to-point":
        if (nearest.vertex) {
          layer.circle(nearest.vertex.coords[0], nearest.vertex.coords[1], 0.01).fill("#e53");
        }
        break;
      case "rabbit-ear":
      case "kawasaki":
        if (nearest.face && nearest.face.svg) {
          nearest.face.svg.setAttribute("style", "fill:#ec3;");
        }
        break;
      case "bisect":
      case "pleat":
      case "mountain-valley":
      case "mark":
      case "cut":
        if (nearest.edge && nearest.edge.svg) {
          nearest.edge.svg.setAttribute("style", "stroke:#ec3;");
        }
        break;
      case "remove-crease":
        layer.rect(...dragRect)
          .fill("none")
          .stroke("black")
          .strokeWidth(0.005)
          .strokeDasharray("0.02 0.008");
        if (nearest.edge && nearest.edge.svg) {
          nearest.edge.svg.setAttribute("style", "stroke:#ec3;");
        }
        break;
      default: console.warn("need to implement " + app.tapMode);
    }
  };

  app.origami.svg.mouseReleased = function (mouse) {
    layer.removeChildren();

    dragRect = [];

    // clip mouse if necessary
    let start = mouse.pressed;
    let end = mouse;
    if (app.options.snap) {
      const startNearest = app.origami.nearest(start);
      const endNearest = app.origami.nearest(end);
      if (startNearest.vertex) {
        start = app.origami.vertices_coords[startNearest.vertex.index];
      }
      if (endNearest.vertex) {
        end = app.origami.vertices_coords[endNearest.vertex.index];
      }
    }

    switch (app.tapMode) {
      case "segment":
        app.origami.segment(start[0], start[1], end[0], end[1]);
        app.origami.fragment();
        app.origami.clean();
        break;
      case "point-to-point":
        RabbitEar.axiom(2, start[0], start[1], end[0], end[1])
          .solutions
          .forEach(s => app.origami.line(s[0][0], s[0][1], s[1][0], s[1][1]));
        app.origami.fragment();
        app.origami.clean();
        break;
      case "bisect": {
        const edgeA = pressedNearest.edge.index;
        const edgeB = nearest.edge.index;
        if (edgeA !== edgeB) {
          const g = app.origami;
          const a0 = g.vertices_coords[g.edges_vertices[edgeA][0]];
          const a1 = g.vertices_coords[g.edges_vertices[edgeA][1]];
          const b0 = g.vertices_coords[g.edges_vertices[edgeB][0]];
          const b1 = g.vertices_coords[g.edges_vertices[edgeB][1]];
          const aVec = [a1[0] - a0[0], a1[1] - a0[1]];
          const bVec = [b1[0] - b0[0], b1[1] - b0[1]];
          RabbitEar.axiom(3, a0[0], a0[1], aVec[0], aVec[1], b0[0], b0[1], bVec[0], bVec[1])
            .solutions
            .forEach(s => app.origami.line(s[0][0], s[0][1], s[1][0], s[1][1]));
          app.origami.fragment();
          app.origami.clean();
        }
      }
        break;
      case "pleat": break;
      case "rabbit-ear": break;
      case "kawasaki": break;
      case "mountain-valley": break;
      case "mark": break;
      case "cut": break;
      case "remove-crease":
        layer.rect(...dragRect)
          .fill("none")
          .stroke("black")
          .strokeWidth(0.005)
          .strokeDasharray("0.02 0.008");
        break;
      default: console.warn("need to implement " + app.tapMode);
    }
  };
};
