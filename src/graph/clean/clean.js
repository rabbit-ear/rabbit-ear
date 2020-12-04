/**
 * Rabbit Ear (c) Robby Kraft
 */
import {
  remove_circular_edges,
  remove_isolated_vertices,
  remove_duplicate_edges,
  remove_duplicate_vertices,
} from "./index";

// options = {
//   circular: true,
//   duplicate: true,
//   collinear: false,
//   isolated: false
// };

const clean = function (graph, options = {}) {
  // remove_duplicate_vertices(graph);
  remove_circular_edges(graph);
  remove_duplicate_edges(graph);
  // if (options.collinear) {
  //   // if collinear vertices were found and removed we have to repeat
  //   // remove circular and duplicate edges
  //   const collinearMap = removeCollinearVertices(graph);
  //   if (collinearMap[collinearMap.length-1] !== 0) {
  //     remove_circular_edges(graph);
  //     remove_duplicate_edges(graph);
  //   }
  // }
  if (options.isolated) { remove_isolated_vertices(graph); }
};

export default clean;
