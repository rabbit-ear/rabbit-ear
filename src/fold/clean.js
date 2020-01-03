import remove from "./remove";

const removeCircularEdges = function (graph) {
  const circular = graph.edges_vertices
    .map((ev, i) => (ev[0] === ev[1] ? i : undefined))
    .filter(a => a !== undefined);
  remove(graph, "edges", circular);
};

const edges_similar = function (graph, e0, e1) {
  return ((graph.edges_vertices[e0][0] === graph.edges_vertices[e1][0]
    && graph.edges_vertices[e0][1] === graph.edges_vertices[e1][1])
    || (graph.edges_vertices[e0][0] === graph.edges_vertices[e1][1]
    && graph.edges_vertices[e0][1] === graph.edges_vertices[e1][0]));
};

const removeDuplicateEdges = function (graph) {
  const duplicates = graph.edges_vertices.map((ev, i) => {
    for (let j = i + 1; j < graph.edges_vertices - 1 - i; j += 1) {
      if (edges_similar(graph, i, j)) { return j; }
    }
    return undefined;
  });
  remove(graph, "edges", duplicates);
};

const clean = function (graph) {
  removeCircularEdges(graph);
  removeDuplicateEdges(graph);

  // if (Collinear.remove_all_collinear_vertices(this)) {
  //   const cleaned2 = clean(this);
  //   Object.keys(cleaned2).forEach((key) => { this[key] = cleaned2[key]; });
  // }
  // remove(this, "vertices", Isolated.find_isolated_vertices(this));
};

export default clean;
