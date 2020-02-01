const MouseReleased = function () {
  const { app } = window;
  const { RabbitEar } = window;

  if (app.tapLayer == null) { app.tapLayer = app.origami.svg.group(); }
  if (app.dragRect == null) { app.dragRect = []; }

  app.origami.svg.mouseReleased = function (mouse) {
    app.tapLayer.removeChildren();

    app.dragRect = [];

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
        app.cache("crease segment\n");
        app.origami.segment(start[0], start[1], end[0], end[1]);
        app.symmetries.forEach((mat) => {
          const pt0 = mat.transform(start);
          const pt1 = mat.transform(end);
          app.origami.segment(pt0[0], pt0[1], pt1[0], pt1[1]);
        });
        app.origami.fragment();
        app.origami.clean({ collinear: true, isolated: true });
        app.origami.populate();
        break;
      case "line": break;
      case "point-to-point":
        app.cache("crease point to point\n");
        RabbitEar.axiom(2, start[0], start[1], end[0], end[1])
          .solutions
          .forEach(s => app.origami.fold(s[0][0], s[0][1], s[1][0], s[1][1]));
        app.origami.fragment();
        app.origami.clean({ collinear: true, isolated: true });
        app.origami.populate();
        break;
      case "bisect": {
        const edgeA = app.nearestPressed.edge.index;
        const edgeB = app.nearest.edge.index;
        if (edgeA !== edgeB) {
          const g = app.origami;
          const a0 = g.vertices_coords[g.edges_vertices[edgeA][0]];
          const a1 = g.vertices_coords[g.edges_vertices[edgeA][1]];
          const b0 = g.vertices_coords[g.edges_vertices[edgeB][0]];
          const b1 = g.vertices_coords[g.edges_vertices[edgeB][1]];
          const aVec = [a1[0] - a0[0], a1[1] - a0[1]];
          const bVec = [b1[0] - b0[0], b1[1] - b0[1]];

          app.cache("crease angle bisector\n");
          RabbitEar.axiom(3, a0[0], a0[1], aVec[0], aVec[1], b0[0], b0[1], bVec[0], bVec[1])
            .solutions
            .forEach(s => app.origami.fold(s[0][0], s[0][1], s[1][0], s[1][1]));
          app.origami.fragment();
          app.origami.clean({ collinear: true, isolated: true });
          app.origami.populate();
        }
      }
        break;
      case "pleat": break;
      case "perpendicular-to": {
        const nearEdge = app.nearestPressed.edge.index;
        const g = app.origami;
        const nearEdgeV0 = g.vertices_coords[g.edges_vertices[nearEdge][0]];
        const nearEdgeV1 = g.vertices_coords[g.edges_vertices[nearEdge][1]];
        const nearEdgeVec = [
          nearEdgeV1[0] - nearEdgeV0[0],
          nearEdgeV1[1] - nearEdgeV0[1]
        ];
        const nearestA = RabbitEar.math.nearest_point_on_line(
          nearEdgeV0,
          nearEdgeVec,
          mouse,
          (x => x)
        );

        // app.tapLayer.line(nearestA[0], nearestA[1], mouse[0], mouse[1])
        //   .stroke("black")
        //   .strokeWidth(0.01);

        app.cache("crease perpendicular through a point\n");

        RabbitEar.axiom(4, nearestA, nearEdgeVec, end)
          .solutions
          .forEach(s => app.origami.fold(s[0][0], s[0][1], s[1][0], s[1][1]));
        app.origami.fragment();
        app.origami.clean({ collinear: true, isolated: true });
        app.origami.populate();
      }
        break;
      case "point-to-line-point": break;
      case "point-to-line-line": break;
      case "rabbit-ear": break;
      case "kawasaki": break;
      case "mountain-valley": break;
      case "mark": break;
      case "cut": break;
      case "remove-crease":
        if (app.nearest.edge) {
          if (app.nearest.edge.assignment === "B" || app.nearest.edge.assignment === "b") { break; }
          app.cache("remove crease\n");
          RabbitEar.core.remove(app.origami, "edges", [app.nearest.edge.index]);
          app.origami.clean({ collinear: true, isolated: true });
          app.origami.populate();
          app.origami.draw();
        }
        // app.tapLayer.rect(...app.dragRect)
        //   .fill("none")
        //   .stroke("black")
        //   .strokeWidth(0.005)
        //   .strokeDasharray("0.02 0.008");
        break;
      case "select": break;
      case "view": break;
      case "graph": break;
      case "history": break;
      case "version": break;
      default: console.warn("need to implement " + app.tapMode);
    }

    app.update();
  };
};
