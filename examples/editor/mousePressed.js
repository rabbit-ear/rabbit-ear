const MousePressed = function () {
  const { app } = window;
  const { RabbitEar } = window;

  if (app.tapLayer == null) { app.tapLayer = app.origami.svg.group(); }
  if (app.dragRect == null) { app.dragRect = []; }

  app.origami.svg.mousePressed = function (mouse) {
    app.nearest = app.origami.nearest(mouse);
    app.nearestPressed = app.nearest;

    // Array.from(app.origami.svg.groups.edges.childNodes).forEach(edge => edge.removeAttribute("style"));
    // Array.from(app.origami.svg.groups.faces.childNodes).forEach(face => face.removeAttribute("style"));

    switch (app.tapMode) {
      case "segment": break;
      case "line": break;
      case "point-to-point": break;
      case "bisect": break;
      case "pleat": break;
      case "perpendicular-to": break;
      case "point-to-line-point": break;
      case "point-to-line-line": break;
      case "rabbit-ear": break;
      case "kawasaki": break;
      case "mountain-valley":
        if (app.nearest.edge) {
          switch (app.nearest.edge.assignment) {
            case "B":
            case "b": break;
            case "V":
            case "v":
              app.origami.edges_assignment[app.nearest.edge.index] = "M";
              break;
            case "M":
            case "m":
            case "F":
            case "f":
            default:
              app.origami.edges_assignment[app.nearest.edge.index] = "V";
              break;
          }
          app.origami.svg.draw();
        }
        break;
      case "mark":
        if (app.nearest.edge) {
          switch (app.nearest.edge.assignment) {
            case "B":
            case "b": break;
            default:
              app.origami.edges_assignment[app.nearest.edge.index] = "F";
              break;
          }
          app.origami.svg.draw();
        }
        break;
      case "cut": break;
      case "remove-crease": break;
      case "select":
        app.selected.vertices = [];
        app.selected.edges = [];
        app.selected.faces = [];
        break;
      case "view": break;
      case "graph": break;
      case "history": break;
      case "version": break;
      default: console.warn("need to implement " + app.tapMode);
    }

    // app.selected.edges.forEach(s => app.origami.edges[s].svg.setAttribute("style", "stroke:#ec3;"));
  };
};
