const MouseMoved = function () {
  const { app, RabbitEar } = window;

  if (app.tapLayer == null) { app.tapLayer = app.origami.svg.g(); }
  if (app.dragRect == null) { app.dragRect = []; }

  app.origami.svg.mouseMoved = function (mouse) {
    app.tapLayer.removeChildren();

    // Array.from(app.origami.svg.groups.edges.childNodes)
    //   .forEach(edge => removeClass("selected", edge));
    // Array.from(app.origami.svg.groups.faces.childNodes)
    //   .forEach(face => removeClass("selected", face));

    app.nearest = app.origami.nearest(mouse);

    if (mouse.isPressed) {
      app.dragRect[0] = Math.min(mouse.pressed[0], mouse[0]);
      app.dragRect[1] = Math.min(mouse.pressed[1], mouse[1]);
      app.dragRect[2] = Math.max(mouse.pressed[0], mouse[0]) - app.dragRect[0];
      app.dragRect[3] = Math.max(mouse.pressed[1], mouse[1]) - app.dragRect[1];
    }

    let vecRadians = Math.atan2(mouse.drag[1], mouse.drag[0]);
    while (vecRadians < 0) { vecRadians += Math.PI*2; }
    // console.log("vec radians", vecRadians);
    // double up on 0 and 2pi
    const angles = Array.from(Array(17)).map((_, i) => i * Math.PI / 8);
    const vec22_5_radians = angles
      .map((a, i) => ({i:i, d:Math.abs(vecRadians - a)}))
      .sort((a, b) => a.d - b.d)
      .map(el => angles[el.i])
      .shift();
    const vec22_5 = [Math.cos(vec22_5_radians), Math.sin(vec22_5_radians)];

    if (mouse.isPressed) {
      switch (app.tapMode) {
        case "segment":
          if (app.nearestPressed == null) { break; }
          // app.tapLayer.line(mouse.pressed[0], mouse.pressed[1], mouse[0], mouse[1])
          app.tapLayer.line(app.nearestPressed.vertex.coords[0], app.nearestPressed.vertex.coords[1], mouse[0], mouse[1])
            .stroke("black")
            .strokeWidth(0.005);
          break;
        case "point-to-point":
          if (app.nearestPressed == null) { break; }
          app.tapLayer.arrow(app.nearestPressed.vertex.coords[0], app.nearestPressed.vertex.coords[1], mouse[0], mouse[1])
          // app.tapLayer.arrow(mouse.pressed[0], mouse.pressed[1], mouse[0], mouse[1])
            .stroke("black")
            .fill("black")
            .head({ width: 0.015, height: 0.05 })
            .curve(0.25)
            .strokeWidth(0.005);
          break;
        case "bisect": {
          if (app.nearestPressed == null) { break; }
          const edgeA = app.nearestPressed.edge.index;
          const edgeB = app.nearest.edge.index;
          const g = app.origami;
          const a0 = g.vertices_coords[g.edges_vertices[edgeA][0]];
          const a1 = g.vertices_coords[g.edges_vertices[edgeA][1]];
          const b0 = g.vertices_coords[g.edges_vertices[edgeB][0]];
          const b1 = g.vertices_coords[g.edges_vertices[edgeB][1]];
          const aVec = [a1[0] - a0[0], a1[1] - a0[1]];
          const bVec = [b1[0] - b0[0], b1[1] - b0[1]];
          const nearestA = RabbitEar.math.nearest_point_on_line(
            a0,
            aVec,
            mouse.pressed,
            ((x) => { if (x < 0) return 0; if (x > 1) return 1; return x; })
          );
          const nearestB = RabbitEar.math.nearest_point_on_line(
            b0,
            bVec,
            mouse,
            ((x) => { if (x < 0) return 0; if (x > 1) return 1; return x; })
          );

          const intersection = RabbitEar.math.intersection.line_line(a0, aVec, b0, bVec);
          if (intersection) {
            const vecArc = [nearestB[0] - nearestA[0], nearestB[1] - nearestA[1]];

            const vecIntersec = [intersection[0] - nearestA[0], intersection[1] - nearestA[1]];
            const det = vecIntersec[0] * vecArc[1] - vecIntersec[1] * vecArc[0];
            app.tapLayer.arrow(nearestA[0], nearestA[1], nearestB[0], nearestB[1])
              .stroke("black")
              .fill("black")
              .strokeWidth(0.005)
              .head({ width: 0.01, height: 0.03 })
              .curve(det < 0 ? 0.3 : -0.3);
          } else {
            app.tapLayer.arrow(nearestA[0], nearestA[1], nearestB[0], nearestB[1])
              .head({ width: 0.01, height: 0.03 })
              .stroke("black")
              .fill("black")
              .strokeWidth(0.005);
          }
          // app.tapLayer.line(nearestA[0], nearestA[1], mouse[0], mouse[1]);
        }
          break;
        case "ray":
          if (app.nearestPressed == null) { break; }
          const params = app.shift
            ? [app.nearestPressed.vertex.coords[0],
               app.nearestPressed.vertex.coords[1],
               app.nearestPressed.vertex.coords[0] + 0.2 * vec22_5[0],
               app.nearestPressed.vertex.coords[1] + 0.2 * vec22_5[1]]
            : [app.nearestPressed.vertex.coords[0],
               app.nearestPressed.vertex.coords[1],
               mouse[0],
               mouse[1]];
          // app.tapLayer.line(mouse.pressed[0], mouse.pressed[1], mouse[0], mouse[1])
          app.tapLayer.arrow(...params)
            .stroke("black")
            .fill("black")
            .strokeWidth(0.005)
            .head({ width: 0.01, height: 0.03 });
          break;
        case "line": {
          if (app.nearestPressed == null) { break; }
          const params = app.shift
            ? [app.nearestPressed.vertex.coords[0],
               app.nearestPressed.vertex.coords[1],
               app.nearestPressed.vertex.coords[0] + 0.2 * vec22_5[0],
               app.nearestPressed.vertex.coords[1] + 0.2 * vec22_5[1]]
            : [app.nearestPressed.vertex.coords[0],
               app.nearestPressed.vertex.coords[1],
               mouse[0],
               mouse[1]];
          app.tapLayer.arrow(...params)
            .stroke("black")
            .fill("black")
            .strokeWidth(0.005)
            .head({ width: 0.01, height: 0.03 })
            .tail({ width: 0.01, height: 0.03 });
        }
          break;
        case "pleat": {
          // const normalized = RabbitEar.math.normalize(mouse.drag);
          const start = RabbitEar.vector(mouse.pressed);
          const step = RabbitEar.vector(mouse.drag).scale(1/12);
          const right = RabbitEar.vector(mouse.drag).scale(1/12).rotateZ270();
          const points = Array.from(Array(13))
            .map((_, i) => start.add(step.scale(i)).add(i%2===1 ? right : [0, 0]));
          app.tapLayer.polyline(points)
            .stroke("black")
            .fill("none")
            .strokeWidth(0.01);
        }
          break;
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

          app.tapLayer.line(nearestA[0], nearestA[1], mouse[0], mouse[1])
            .stroke("black")
            .strokeWidth(0.005);
        }
          break;
        case "point-to-line-point": break;
        case "point-to-line-line": break;
        case "rabbit-ear": break;
        case "kawasaki": break;
        case "mountain-valley": break;
        case "mark": break;
        case "cut": break;
        case "remove-crease": {
          // app.tapLayer.rect(...app.dragRect)
          //   .fill("none")
          //   .stroke("black")
          //   .strokeWidth(0.005)
          //   .strokeDasharray("0.02 0.008");
          const edgeA = app.nearestPressed.edge.index;
          const g = app.origami;
          const a0 = g.vertices_coords[g.edges_vertices[edgeA][0]];
          const a1 = g.vertices_coords[g.edges_vertices[edgeA][1]];
          const aVec = [a1[0] - a0[0], a1[1] - a0[1]];
          const nearestA = RabbitEar.math.nearest_point_on_line(
            a0,
            aVec,
            mouse.pressed,
            ((x) => { if (x < 0) return 0; if (x > 1) return 1; return x; })
          );
          //
          const nearestEndpoint = app.nearestPressed.edge.index;
          app.tapLayer.arrow(nearestA[0], nearestA[1], mouse[0], mouse[1])
            .stroke("black")
            .fill("black")
            .head({ width: 0.01, height: 0.03 })
            .strokeWidth(0.005);
        }
          break;
        case "select": break;
        case "view": break;
        case "graph": break;
        case "history": break;
        case "version": break;
        default: console.warn("need to implement " + app.tapMode);
      }
    }
    const numVertices = app.origami.vertices_coords.length;
    const numEdges = app.origami.edges_vertices.length;
    const numFaces = app.origami.faces_vertices.length;
    const nVertexI = app.nearest.vertex ? app.nearest.vertex.index : "";
    const nEdgeI = app.nearest.edge ? app.nearest.edge.index : "";
    const nFaceI = app.nearest.face ? app.nearest.face.index : "";
    const nSectorI = app.nearest.sector ? app.nearest.sector.index : "";
    // document.querySelectorAll(".info-cursor-p")[0].innerHTML = "<b>cursor</b><br>x: "+(mouse.x).toFixed(3)+"<br>y: "+(mouse.y).toFixed(3)+"<br><br><b>nearest</b><br>point: " + nVertexI + " / "+numVertices+"<br>edge: " + nEdgeI + " / "+numEdges+"<br>face: " + nFaceI + " / "+numFaces;

    // if (app.selected.vertices.length || app.selected.edges.length > 1 || app.selected.faces.length) {
      // document.querySelectorAll(".info-cursor-p")[0].innerHTML += "<br><br><b>selected</b><br>vertices: <b>" + app.selected.vertices.length + "</b> / " + app.origami.vertices_coords.length + "<br>edges: <b>" + app.selected.edges.length + "</b> / " + app.origami.edges_vertices.length + "<br>faces: <b>" + app.selected.faces.length + "</b> / " + app.origami.faces_vertices.length;
    // }

    switch (app.tapMode) {
      case "line":
      case "ray":
      case "segment":
      case "point-to-point":
        if (app.nearest.vertex) {
          app.tapLayer.circle(app.nearest.vertex.coords[0], app.nearest.vertex.coords[1], 0.01).fill("#e53");
        }
        break;
      case "rabbit-ear":
      case "kawasaki":
        if (app.nearest.face) {
          app.selected.faces = [app.nearest.face];
        }
        break;
      case "bisect":
      case "pleat":
      case "mountain-valley":
      case "mark":
      case "cut":
        if (app.nearest.edge) {
          app.selected.edges = [app.nearest.edge];
          // app.nearest.edge.svg.setAttribute("style", "stroke:#e53;");
        }
        break;
      case "perpendicular-to":
        if (mouse.isPressed) {
          if (app.nearest.vertex && app.nearestPressed.edge) {
            app.selected.edges = [app.nearestPressed.edge];
            // app.nearestPressed.edge.svg.setAttribute("style", "stroke:#ec3;");
          }
          app.tapLayer.circle(app.nearest.vertex.coords[0], app.nearest.vertex.coords[1], 0.01).fill("#e53");
        } else {
          if (app.nearest.edge) {
            app.selected.edges = [app.nearest.edge];
            // app.nearest.edge.svg.setAttribute("style", "stroke:#ec3;");
          }
        }
        break;
      case "point-to-line-point": break;
      case "point-to-line-line": break;
      case "remove-crease":
        // app.tapLayer.rect(...app.dragRect)
        //   .fill("none")
        //   .stroke("black")
        //   .strokeWidth(0.005)
        //   .strokeDasharray("0.02 0.008");
        if (app.nearest.edge) {
          // app.nearest.edge.svg.setAttribute("style", "stroke:#ec3;");
          app.selected.edges = [app.nearest.edge];
        }
        break;
      case "select":
        app.tapLayer.rect(...app.dragRect)
          .fill("#0001")
          .stroke("black")
          .strokeWidth(0.005)
          .strokeDasharray("0.016 0.008");
        if (app.dragRect.length) {
          const poly = [
            [app.dragRect[0], app.dragRect[1]],
            [app.dragRect[0] + app.dragRect[2], app.dragRect[1]],
            [app.dragRect[0] + app.dragRect[2], app.dragRect[1] + app.dragRect[3]],
            [app.dragRect[0], app.dragRect[1] + app.dragRect[3]]
          ];
          // app.selected.edges = RabbitEar.core.select_edges(app.origami, poly);
          // app.selected.vertices = RabbitEar.core.select_vertices(app.origami, poly);
        }

        break;
      case "view": break;
      case "graph": break;
      case "history": break;
      case "version": break;
      default: console.warn("need to implement " + app.tapMode);
    }

    app.selected.faces.forEach(face => app.tapLayer.polygon(face.coords).fill("#e53").stroke("none"));
    app.selected.edges.forEach(edge => app.tapLayer.line(edge.coords).stroke("#fb3"));
    app.selected.vertices.forEach(vertex => app.tapLayer.circle(vertex.coords).radius(0.01).fill("#e53").stroke("none"));
    // if (nearest.vertex) {
    //   app.tapLayer.circle(nearest.vertex.coords).radius(0.02).fill("black").stroke("none");
    // }

    // draw symmetry stuff
    app.symmetries.forEach((mat) => {
      const pt = mat.transform(mouse);
      app.tapLayer.line(pt[0], pt[1] - 0.015, pt[0], pt[1] + 0.015)
        .stroke("black")
        .strokeWidth(0.002);
      app.tapLayer.line(pt[0] - 0.015, pt[1], pt[0] + 0.015, pt[1])
        .stroke("black")
        .strokeWidth(0.002);
    });
  };
};
