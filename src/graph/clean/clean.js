/**
 * Rabbit Ear (c) Robby Kraft
 */
import {
  remove_circular_edges,
  remove_duplicate_edges,
  remove_isolated_vertices,
  remove_duplicate_vertices,
} from "./index";
/**
 * @description clean will remove bad graph data. by default it removes
 *  circular and duplicate edges. by request it will remove isolated,
 *  collinear, and duplicate vertices.
 * @param {object} FOLD object
 * @param {object} options with keys "edges", "vertices" and boolean values
 *  default {
 *   edges: true,
 *   vertices: false,
 * }
 */
const clean = (graph, options = {}) => {
  // will skip only if options.edges is false
  if (typeof options !== "object" || options.edges !== false) {
    remove_circular_edges(graph);
    remove_duplicate_edges(graph);
  }
  // will execute only if options.vertices is true
  if (typeof options === "object" && options.vertices === true) {
    remove_isolated_vertices(graph);
    // if collinear vertices were found and removed we have to repeat
    // remove circular and duplicate edges
    // okay, bring back duplicate vertices only if we can prevent deletion of vertices_vertices, vertices_edges
    // const res1 = remove_collinear_vertices(graph);
    // const res2 = remove_duplicate_vertices(graph);
    // if (res1[res1.length-1] !== 0) {
    //   remove_circular_edges(graph);
    //   remove_duplicate_edges(graph);
    // }
  }
  return graph;
};

export default clean;
