/**
 * Rabbit Ear (c) Robby Kraft
 */
import math from "../../math";
import * as S from "../../general/strings";
import {
  get_graph_keys_with_suffix,
  get_graph_keys_with_prefix,
} from "../../fold/spec";
import remove from "../remove";
import { get_isolated_vertices } from "./vertices_isolated";
import get_circular_edges from "./edges_circular";
import get_duplicate_edges from "./edges_duplicate";
import get_duplicate_vertices from "./vertices_duplicate";

// these are simple, removed component have no relationship to persisting components
// if components are removed, these return arrays with holes
export const remove_isolated_vertices = graph => {
  const remove_indices = get_isolated_vertices(graph);
  return {
    map: remove(graph, S._vertices, remove_indices),
    remove: remove_indices,
  };
};

export const remove_circular_edges = graph => {
  const remove_indices = get_circular_edges(graph);
  if (remove_indices.length) {
    // remove every instance of a circular edge in every _edge array.
    // assumption is we can simply remove them because a face that includes
    // a circular edge is still the same face when you just remove the edge
    const quick_lookup = {};
    remove_indices.forEach(n => { quick_lookup[n] = true; });
    get_graph_keys_with_suffix(graph, S._edges)
      .forEach(sKey => graph[sKey] // faces_edges or vertices_edges...
        .forEach((elem, i) => { // faces_edges[0] or faces_edges[1]...
          // reverse iterate through array, remove elements with splice
          for (let j = elem.length - 1; j >= 0; j -= 1) {
            if (quick_lookup[elem[j]] === true) {
              graph[sKey][i].splice(j, 1);
            }
          }
        }));
  }
  return {
    map: remove(graph, S._edges, remove_indices),
    remove: remove_indices,
  };
};

// every index is related to a component that persists in the graph.
// if components are removed, these return arrays WITHOUT holes.
export const remove_duplicate_edges = (graph) => {
  const duplicates = get_duplicate_edges(graph);
  const remove_indices = Object.keys(duplicates);
  const map = remove(graph, S._edges, remove_indices);
  duplicates.forEach((v, i) => { map[i] = v; });
  return {
    map,
    remove: remove_indices,
  };
};

// todo
// export const remove_collinear_vertices = (graph, epsilon = math.core.EPSILON) => {
// };

// const map_to_change_map = indices => indices.map((n, i) => n - i);
/**
 * @description this has the potential to create circular and duplicate edges
 *
 */
export const remove_duplicate_vertices = (graph, epsilon = math.core.EPSILON) => {
  const clusters = get_duplicate_vertices(graph, epsilon);
  // map answers: what is the index of the old vertex in the new graph?
  // [0, 1, 2, 3, 1, 4, 5]  vertex 4 got merged, vertices after it shifted up
  const map = [];
  clusters.forEach((verts, i) => verts.forEach(v => { map[v] = i; }));
  // average all points together for each new vertex
  graph.vertices_coords = clusters
    .map(arr => arr.map(i => graph.vertices_coords[i]))
    .map(arr => math.core.average(...arr));
  // update all "..._vertices" arrays with each vertex's new index.
  // TODO: this was copied from remove.js
  get_graph_keys_with_suffix(graph, S._vertices)
    .forEach(sKey => graph[sKey]
      .forEach((_, i) => graph[sKey][i]
        .forEach((v, j) => { graph[sKey][i][j] = map[v]; })));
  // for keys like "vertices_edges" or "vertices_vertices", we simply
  // cannot carry them over, for example vertices_vertices are intended
  // to be sorted clockwise. it's possible to write this out one day
  // for all the special cases, but for now playing it safe.
  get_graph_keys_with_prefix(graph, S._vertices)
    .filter(a => a !== S._vertices_coords)
    .forEach(key => delete graph[key]);
  // for a shared vertex: [3, 7, 9] we say 7 and 9 are removed.
  // the map reflects this change too, where indices 7 and 9 contain "3"
  const remove_indices = clusters
    .map(cluster => cluster.length > 1 ? cluster.slice(1, cluster.length) : undefined)
    .filter(a => a !== undefined)
    .reduce((a, b) => a.concat(b), []);
  return {
    map,
    remove: remove_indices,
    // change: map_to_change_map(map),
  };
};
