/**
 * Rabbit Ear (c) Robby Kraft
 */
import validate from "./validate";
import {
  remove_isolated_vertices,
  remove_duplicate_vertices,
} from "./vertices_violations";
import {
  remove_circular_edges,
  remove_duplicate_edges,
} from "./edges_violations";
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
const VEF = ["vertices", "edges", "faces"];

const clean = (graph, epsilon) => {
  const report = validate(graph, epsilon);
  // if keys reference items beyond the length of the item's array,
  // we don't know how to fix it, so let's warn the user.
  // eg: edges_faces contains [4, 13], but there are fewer than 13 faces.
  const refs = VEF.filter(key => report[key].references === false);
  if (refs.length) { console.warn(refs, "clean() reference outside array"); }
  // for everything else, repair
  remove_circular_edges(graph, report.edges.circular);
  remove_duplicate_edges(graph, report.edges.duplicate);
  remove_isolated_vertices(graph, report.vertices.isolated);
  // remove_duplicate_vertices(graph, report.vertices.duplicate);
  remove_duplicate_vertices(graph);
  return graph;
};

// const clean = (graph, options = {}) => {
//   // will skip only if options.edges is false
//   if (typeof options !== "object" || options.edges !== false) {
//     remove_circular_edges(graph);
//     remove_duplicate_edges(graph);
//   }
//   // will execute only if options.vertices is true
//   if (typeof options === "object" && options.vertices === true) {
//     remove_isolated_vertices(graph);
//     // if collinear vertices were found and removed we have to repeat
//     // remove circular and duplicate edges
//     // okay, bring back duplicate vertices only if we can prevent deletion of vertices_vertices, vertices_edges
//     // const res1 = remove_collinear_vertices(graph);
//     // const res2 = remove_duplicate_vertices(graph);
//     // if (res1[res1.length-1] !== 0) {
//     //   remove_circular_edges(graph);
//     //   remove_duplicate_edges(graph);
//     // }
//   }
// };

export default clean;
