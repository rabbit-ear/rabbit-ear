import math from "../../include/math";
import populate from "./populate";
import { fold_keys } from "./keys";

/**
 * re-construct a graph up from the most basic components
 * vertices_coords and edges_vertices. and if it exists, edges_assignment.
 */
const rebuild = function (graph, epsilon = math.core.EPSILON) {
  // remove old data
  fold_keys.orders.forEach(key => delete graph[key]);
  fold_keys.graph
    .filter(key => key !== "vertices_coords")
    .filter(key => key !== "edges_vertices")
    .filter(key => key !== "edges_assignment")
    .filter(key => key !== "edges_foldAngle")
    .forEach(key => delete graph[key]);
  Object.keys(graph)
    .filter(s => s.includes("re:"))
    .forEach(key => delete graph[key]);
  // leave only one of these to imply the other. todo: which takes precedence?
  if (graph.edges_assignment != null && graph.edges_foldAngle != null) {
    delete graph.edges_foldAngle;
  }
  // populate new data
  populate(graph);
};

export default rebuild;
