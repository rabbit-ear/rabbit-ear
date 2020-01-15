const kite = {
  vertices_coords: [[0, 0], [0.4142, 0], [1, 0], [1, 0.5857], [1, 1], [0, 1]],
  edges_vertices: [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [5, 1], [3, 5], [5, 2]
  ],
  edges_assignment: ["B", "B", "B", "B", "B", "B", "V", "V", "F"],
};

const origami = RabbitEar.origami(kite);
origami.preferences.debug = true;

origami.onMouseDown = function (mouse) {
  const nearest = origami.nearest(mouse);

  let d = RabbitEar.core.split_edge_run(origami.cp, mouse.x, mouse.y, nearest.edge.index);
  RabbitEar.core.apply_run(origami.cp, d);
  // console.log(origami.cp);
  origami.draw();
};
