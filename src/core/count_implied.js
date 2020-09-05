import { get_graph_keys_with_suffix } from "./keys";
/*
 * Get the number of vertices, edges, or faces in the graph.
 *
 * This will fail in the case of abstract graphs, for example where no vertices
 * are defined in any vertex_ array but only exist as mentions in faces_vertices.
 * In that case, use the implied count method.
 * (todo: where is the implied count method?)
 *
 * @returns {number} number of geometry elements
 */

/* Get the number of vertices, edges, faces by searching their relative arrays
 * useful for abstract graphs where "vertices" aren't defined but still exist
 * @returns {number} number of geometry elements
 */
const max_num_in_array_in_arrays = (arrays) => {
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

const max_num_in_orders = (array) => {
  let max = -1; // will become 0 if nothing is found
  array.forEach(el => {
    // exception. index 2 is orientation, not index. check only 0, 1
    if (el[0] > max) { max = el[0]; }
    if (el[1] > max) { max = el[1]; }
  });
  return max;
}

const implied_count = (graph, key, ordersKey) => Math.max(
  // return the maximum value between (1/2):
  // 1. a found geometry in another geometry's array ("vertex" in "faces_vertices")
  max_num_in_array_in_arrays(
    get_graph_keys_with_suffix(graph, key).map(str => graph[str])
  ),
  // 2. a found geometry in a faceOrders or edgeOrders type of array (special case)
  graph[ordersKey] ? max_num_in_orders(graph[ordersKey]) : -1,
) + 1;

export default {
  vertices: graph => implied_count(graph, "vertices"),
  edges: graph => implied_count(graph, "edges", "edgeOrders"),
  faces: graph => implied_count(graph, "faces", "faceOrders"),
};
