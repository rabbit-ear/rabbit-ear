/**
 * Rabbit Ear (c) Robby Kraft
 */
import {
  remove_isolated_vertices,
  remove_duplicate_vertices,
} from "./vertices_violations";
import {
  remove_circular_edges,
  remove_duplicate_edges,
} from "./edges_violations";
import {
  merge_simple_nextmaps,
  invert_simple_map,
} from "./maps";
/**
 * @description clean will remove bad graph data. this includes:
 * - duplicate (Euclidean distance) and isolated vertices
 * - circular and duplicate edges.
 * @param {object} FOLD object
 * @returns {object} summary of changes, a nextmap and the indices removed.
 */
const clean = (graph, epsilon) => {
  // duplicate vertices has to be done first as it's possible that
  // this will create circular/duplicate edges.
  const change_v1 = remove_duplicate_vertices(graph);
  const change_e1 = remove_circular_edges(graph);
  const change_e2 = remove_duplicate_edges(graph);
  // isolated vertices is last. removing edges can create isolated vertices
  const change_v2 = remove_isolated_vertices(graph);
  // return a summary of changes.
  // use the maps to update the removed indices from the second step
  // to their previous index before change 1 occurred.
  const change_v1_backmap = invert_simple_map(change_v1.map);
  const change_v2_remove = change_v2.remove.map(e => change_v1_backmap[e]);
  const change_e1_backmap = invert_simple_map(change_e1.map);
  const change_e2_remove = change_e2.remove.map(e => change_e1_backmap[e]);
  return {
    vertices: {
      map: merge_simple_nextmaps(change_v1.map, change_v2.map),
      remove: change_v1.remove.concat(change_v2_remove),
    },
    edges: {
      map: merge_simple_nextmaps(change_e1.map, change_e2.map),
      remove: change_e1.remove.concat(change_e2_remove),
    },
  }
};

export default clean;
