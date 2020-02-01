import remove from "./remove";
import { remove_all_collinear_vertices } from "./collinear";
import { find_isolated_vertices } from "./isolated";

const DEFAULTS = Object.freeze({
  circular: true,
  duplicate: true,
  // collinear: false,
  // isolated: false
});

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

const clean = function (graph, options) {
  // options
  if (typeof options !== "object") { options = {}; }
  Object.keys(DEFAULTS)
    .filter(key => !(key in options))
    .forEach((key) => { options[key] = DEFAULTS[key]; });
  // clean
  if (options.circular === true) { removeCircularEdges(graph); }
  if (options.duplicate === true) { removeDuplicateEdges(graph); }
  if (options.collinear === true) {
    console.log("collinear is true");
    // collinear vertices needs to re-run circular and duplicate edges.
    remove_all_collinear_vertices(graph);
    if (options.circular === true) { removeCircularEdges(graph); }
    if (options.duplicate === true) { removeDuplicateEdges(graph); }    
  }
  if (options.isolated === true) { remove(graph, "vertices", find_isolated_vertices(graph)); }
};

export default clean;
