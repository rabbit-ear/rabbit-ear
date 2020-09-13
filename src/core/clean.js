import remove from "./remove";
// import { remove_all_collinear_vertices } from "./vertices_collinear";
import { get_isolated_vertices } from "./vertices_isolated";
import get_circular_edges from "./edges_circular";
import get_duplicate_edges from "./edges_duplicate";
import { VERTICES, EDGES } from "./keys";

// options = {
//   circular: true,
//   duplicate: true,
//   collinear: false,
//   isolated: false
// };

const removeCircularEdges = g => remove(g, EDGES, get_circular_edges(g));
const removeDuplicateEdges = g => remove(g, EDGES, get_duplicate_edges(g));
// const removeCollinearVertices = g => remove(g, VERTICES, get_collinear_vertices(g));

const clean = function (graph, options = {}) {
  removeCircularEdges(graph);
  removeDuplicateEdges(graph);
  if (options.collinear) {
    // if collinear vertices were found and removed we have to repeat
    // remove circular and duplicate edges
    const collinearMap = removeCollinearVertices(graph);
    if (collinearMap[collinearMap.length-1] !== 0) {
      removeCircularEdges(graph);
      removeDuplicateEdges(graph);
    }
  }
  if (options.isolated) {
    remove(graph, VERTICES, get_isolated_vertices(graph));
  }
  // if (options.collinear === true) {
  //   // collinear vertices needs to re-run circular and duplicate edges.
  //   if (options.circular === true) { remove(graph, "edges", get_circular_edges(graph)); }
  //   if (options.duplicate === true) { removeDuplicateEdges(graph); }
  // }
  // if (options.isolated === true) {
  //   remove(graph, "vertices", find_isolated_vertices(graph));
  // }
};

export default clean;
