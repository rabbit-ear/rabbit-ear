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

// max is the largest index. array length is +1
const implied_vertices_count = graph => max_num_in_array_in_arrays(
  get_graph_keys_with_suffix(graph, "vertices").map(str => graph[str])
) + 1;

const implied_edges_count = (graph) => {
  // not yet +1
  let max = max_num_in_array_in_arrays(
    get_graph_keys_with_suffix(graph, "edges").map(str => graph[str])
  );
  if (graph.edgeOrders !== undefined) {
    graph.edgeOrders.forEach(eo => {
      // exception. index 2 is orientation, not index
      if (eo[0] > max) { max = eo[0]; }
      if (eo[1] > max) { max = eo[1]; }
    });
  }
  return max + 1;
};

const implied_faces_count = (graph) => {
  // not yet +1
  let max = max_num_in_array_in_arrays(
    get_graph_keys_with_suffix(graph, "faces").map(str => graph[str])
  );
  if (graph.faceOrders !== undefined) {
    graph.faceOrders.forEach(fo => {
      // exception. index 2 is orientation, not index
      if (fo[0] > max) { max = fo[0]; }
      if (fo[1] > max) { max = fo[1]; }
    });
  }
  return max + 1;
};

export default {
  vertices: implied_vertices_count,
  edges: implied_edges_count,
  faces: implied_faces_count,
};
