const Mouse = function () {
  const { app } = window;

  const layer = app.origami.svg.group();

  let dragRect = [];
  let nearest;

  app.origami.svg.mousePressed = function (mouse) {
    switch (app.tapMode) {
      case "segment": break;
      case "point-to-point": break;
      case "bisect": break;
      case "pleat": break;
      case "rabbit-ear": break;
      case "kawasaki": break;
      case "mountain-valley":
        if (nearest.edge) {
          console.log(nearest.edge);
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
      case "remove": break;
      default: console.warn("need to implement " + app.tapMode);
    }
    // pts.push(mouse);
    // if (pts.length === 2) {
    //   app.origami.segment(pts);
    //   app.origami.fragment();
    //   app.origami.clean();
    //   pts = [];
    // }
  };

  app.origami.svg.mouseReleased = function (mouse) {
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
      case "point-to-point": break;
      case "bisect": break;
      case "pleat": break;
      case "rabbit-ear": break;
      case "kawasaki": break;
      case "mountain-valley": break;
      case "mark": break;
      case "cut": break;
      case "remove":
        layer.rect(...dragRect)
          .fill("none")
          .stroke("black")
          .strokeWidth(0.005)
          .strokeDasharray("0.02 0.008");
        break;
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

    switch (app.tapMode) {
      case "segment": break;
      case "point-to-point": break;
      case "bisect": break;
      case "pleat": break;
      case "rabbit-ear": break;
      case "kawasaki": break;
      case "mountain-valley": break;
      case "mark": break;
      case "cut": break;
      case "remove":
        layer.rect(...dragRect)
          .fill("none")
          .stroke("black")
          .strokeWidth(0.005)
          .strokeDasharray("0.02 0.008");
        break;
      default: console.warn("need to implement " + app.tapMode);
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
          layer.circle(nearest.vertex.coords[0], nearest.vertex.coords[1], 0.02).fill("#e53");
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
      case "remove":
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
};
