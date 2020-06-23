const MousePressed = function () {
  const { app, RabbitEar } = window;

  if (app.tapLayer == null) { app.tapLayer = app.origami.svg.g(); }
  if (app.dragRect == null) { app.dragRect = []; }

  app.origami.svg.mousePressed = function (mouse) {
    app.nearest = app.origami.nearest(mouse);
    app.nearestPressed = app.nearest;

    switch (app.tapMode) {
      case "line": break;
      case "ray": break;
      case "segment": break;
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
              app.origami.edges_foldAngle[app.nearest.edge.index] = -180;
              break;
            case "M":
            case "m":
            case "F":
            case "f":
            default:
              app.origami.edges_assignment[app.nearest.edge.index] = "V";
              app.origami.edges_foldAngle[app.nearest.edge.index] = 180;
              break;
          }
          app.origami.draw();
        }
        break;
      case "mark":
        if (app.nearest.edge) {
          switch (app.nearest.edge.assignment) {
            case "B":
            case "b": break;
            default:
              app.origami.edges_assignment[app.nearest.edge.index] = "F";
              app.origami.edges_foldAngle[app.nearest.edge.index] = 0;
              break;
          }
          app.origami.draw();
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
  };
};
