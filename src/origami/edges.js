
const Edges = function (graph, edges) {
  // const edges = []; // array of indices. matching "edges_" arrays in graph.

  // change all to valley / mountain / mark
  const valley = function () {
    edges.forEach((i) => { graph.edges_assignment[i] = "V"; });
    return edges;
  };
  const mountain = function () {
    edges.forEach((i) => { graph.edges_assignment[i] = "M"; });
    return edges;
  };
  const mark = function () {
    edges.forEach((i) => { graph.edges_assignment[i] = "F"; });
    return edges;
  };

  // Object.defineProperty(edges, "valley", { value: valley, get: valley });
  // Object.defineProperty(edges, "mountain", { value: mountain, get: mountain });
  // Object.defineProperty(edges, "mark", { value: mark, get: mark });
  Object.defineProperty(edges, "valley", { value: valley });
  Object.defineProperty(edges, "mountain", { value: mountain });
  Object.defineProperty(edges, "mark", { value: mark });

  return edges;
};

export default Edges;
