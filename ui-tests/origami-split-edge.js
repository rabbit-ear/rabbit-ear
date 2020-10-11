const kite = {
  vertices_coords: [[0, 0], [0.4142, 0], [1, 0], [1, 0.5857], [1, 1], [0, 1]],
  edges_vertices: [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [5, 1], [3, 5], [5, 2]
  ],
  edges_assignment: ["B", "B", "B", "B", "B", "B", "V", "V", "F"],
};

const origami = ear.graph(kite);
svg.load(origami.svg());

const splitGraph = (graph, edge, mouse) => {
  ear.core.add_vertex_on_edge_and_rebuild(graph, [mouse.x, mouse.y], edge);
  svg.removeChildren();
  svg.load(graph.svg());
};

svg.onPress = function (mouse) {
  const nearest = origami.nearest(mouse);
  splitGraph(origami, nearest.edge.index, mouse);
};

svg.onMove = (mouse) => {
  const nearest = origami.nearest(mouse);
  const graph = ear.graph( JSON.parse(JSON.stringify(origami)) );
  splitGraph(graph, nearest.edge.index, mouse);
};
