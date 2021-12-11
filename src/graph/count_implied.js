/**
 * Rabbit Ear (c) Robby Kraft
 */
import * as S from "../general/strings";
import { get_graph_keys_with_suffix } from "../fold/spec";
/**
 * @description Search inside arrays inside arrays and return
 * the largest number.
 * @returns {number} largest number in array in arrays.
 */
const array_in_array_max_number = (arrays) => {
  let max = -1; // will become 0 if nothing is found
  arrays
    .filter(a => a !== undefined)
    .forEach(arr => arr
      .forEach(el => el
        .forEach((e) => {
          if (e > max) { max = e; }
        })));
  return max;
};
/**
 * @description Search inside arrays inside arrays and return
 * the largest number by only checking indices 0 and 1 in the
 * inner arrays.
 * @returns {number} largest number in indices 0 or 1 of array in arrays.
 */
const max_num_in_orders = (array) => {
  let max = -1; // will become 0 if nothing is found
  array.forEach(el => {
    // exception. index 2 is orientation, not index. check only 0, 1
    if (el[0] > max) { max = el[0]; }
    if (el[1] > max) { max = el[1]; }
  });
  return max;
}
const ordersArrayNames = {
  edges: "edgeOrders",
  faces: "faceOrders",
};
/**
 * @description Get the number of vertices, edges, or faces in the graph, as
 * evidenced by their appearance in other arrays; ie: searching faces_vertices
 * for the largest vertex index, and inferring number of vertices is that long.
 * @param {object} a FOLD graph
 * @param {string} the prefix for a key, eg: "vertices" 
 * @returns {number} the number of vertices, edges, or faces in the graph.
 */
const implied_count = (graph, key) => Math.max(
  // return the maximum value between (1/2):
  // 1. a found geometry in another geometry's array ("vertex" in "faces_vertices")
  array_in_array_max_number(
    get_graph_keys_with_suffix(graph, key).map(str => graph[str])
  ),
  // 2. a found geometry in a faceOrders or edgeOrders type of array (special case)
  graph[ordersArrayNames[key]]
    ? max_num_in_orders(graph[ordersArrayNames[key]])
    : -1,
) + 1;

// standard graph components names
implied_count.vertices = graph => implied_count(graph, S._vertices);
implied_count.edges = graph => implied_count(graph, S._edges);
implied_count.faces = graph => implied_count(graph, S._faces);

export default implied_count;
