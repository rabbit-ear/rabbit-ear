/**
 * Rabbit Ear (c) Robby Kraft
 */
import count from "./count";
import { unique_sorted_integers } from "../general/arrays";
import {
  get_graph_keys_with_suffix,
  get_graph_keys_with_prefix
} from "../fold/spec";
/**
 * Removes vertices, edges, or faces (or anything really)
 * remove elements from inside arrays, shift up remaining components,
 * and updates all relevant references across other arrays due to shifting.
 *
 * for example: removing index 5 from a 10-long vertices list will shift all
 * indices > 5 up by one, and then will look through all other arrays like
 * edges_vertices, faces_vertices and update any reference to indices 6-9
 * to match their new positions 5-8.
 *
 * this can handle removing multiple indices at once; and is faster than
 * otherwise calling this multiple times with only one or a few removals.
 *
 * @param {object} a FOLD object
 * @param {string} like "vertices", the prefix of the arrays
 * @param {number[]} an array of vertex indices, like [1,9,25]
 * @returns {number[]} an array resembling something like [0,0,-1,-1,-1,-2,-2,-2]
 *   indicating the relative shift of the position of each index in the array.
 * @example remove(foldObject, "vertices", [2,6,11,15]);
 */
// given removeIndices: [4, 6, 7];
// given a geometry array: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
// map becomes (_=undefined): [0, 1, 2, 3, _, 4, _, _, 5, 6];
const remove_geometry_indices = (graph, key, removeIndices) => {
  const geometry_array_size = count(graph, key);
  const removes = unique_sorted_integers(removeIndices);
  const index_map = [];
  let i, j, walk;
  for (i = 0, j = 0, walk = 0; i < geometry_array_size; i += 1, j += 1) {
    while (i === removes[walk]) {
      // this prevents arrays with holes
			index_map[i] = undefined;
      i += 1;
      walk += 1;
    }
    if (i < geometry_array_size) { index_map[i] = j; }
  }
	// update every component that points to vertices_coords
  // these arrays do not change their size, only their contents
  get_graph_keys_with_suffix(graph, key)
    .forEach(sKey => graph[sKey]
      .forEach((_, i) => graph[sKey][i]
        .forEach((v, j) => { graph[sKey][i][j] = index_map[v]; })));
  // update every array with a 1:1 relationship to vertices_ arrays
  // these arrays do change their size, their contents are untouched
  removes.reverse();
  get_graph_keys_with_prefix(graph, key)
    .forEach((prefix_key) => removes
      .forEach(index => graph[prefix_key]
        .splice(index, 1)));
  return index_map;
};

export default remove_geometry_indices;
