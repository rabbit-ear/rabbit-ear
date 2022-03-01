/**
 * Rabbit Ear (c) Robby Kraft
 */
import * as S from "../general/strings";
import {
  make_vertices_edges_unsorted,
  make_vertices_vertices,
  make_vertices_edges,
  make_vertices_faces,
} from "./make";
import {
  get_graph_keys_with_suffix,
} from "../fold/spec";
import remove from "./remove";
import replace from "./replace";

// export const get_undefined_edges = ({ edges_vertices }) => {
//   const bad = [];
//   for (let i = 0; i < edges_vertices.length; i += 1) {
//     if (edges_vertices[i][0] === undefined
//       || edges_vertices[i][1] === undefined
//       || edges_vertices[i][0] === null
//       || edges_vertices[i][1] === null) {
//       bad.push(i);
//     }
//   }
//   return bad;
// };
/**
 * @description get the indices of all circular edges. circular edges are
 * edges where both of its edges_vertices is the same vertex.
 * @param {object} a FOLD graph
 * @returns {number[]} array of indices of circular edges. empty array if none.
 */
export const get_circular_edges = ({ edges_vertices }) => {
  const circular = [];
  for (let i = 0; i < edges_vertices.length; i += 1) {
    if (edges_vertices[i][0] === edges_vertices[i][1]) {
      circular.push(i);
    }
  }
  return circular;
};
/**
 * @description get the indices of all duplicate edges by marking the
 * second/third/... as duplicate (not the first of the duplicates).
 * The result is given as an array with holes, where:
 * - the indices are the indices of the duplicate edges.
 * - the values are the indices of the first occurence of the duplicate.
 * Under this system, many edges can be duplicates of the same edge.
 * Order is not important. [5,9] and [9,5] are still duplicate.
 * @param {object} a FOLD object
 * @returns {number[]} an array where the redundant edges are the indices,
 * and the values are the indices of the first occurence of the duplicate.
 * @example {number[]} array, [4:3, 7:5, 8:3, 12:3, 14:9] where indices
 * (3, 4, 8, 12) are all duplicates. (5,7), (9,14) are also duplicates.
 */
export const get_duplicate_edges = ({ edges_vertices }) => {
  if (!edges_vertices) { return []; }
  const duplicates = [];
  const map = {};
  for (let i = 0; i < edges_vertices.length; i += 1) {
    // we need to store both, but only need to test one
    const a = `${edges_vertices[i][0]} ${edges_vertices[i][1]}`;
    const b = `${edges_vertices[i][1]} ${edges_vertices[i][0]}`;
    if (map[a] !== undefined) { // instead of (map[a] || map[b])
      duplicates[i] = map[a];
    } else {
      // only update the map. if an edge exists as two vertices, it will only
      // be set once, this prevents chains of duplicate relationships where
      // A points to B points to C points to D...
      map[a] = i;
      map[b] = i;
    }
  }
  return duplicates;
};
/**
 * @description given a set of graph geometry (vertices/edges/faces) indices,
 * get all the arrays which reference these geometries, (eg: end in _edges),
 * and remove (splice) that entry from the array if it contains a remove value
 * @example removing indices [4, 7] from "edges", then a faces_edges entry
 * which was [15, 13, 4, 9, 2] will become [15, 13, 9, 2].
 */
const splice_remove_values_from_suffixes = (graph, suffix, remove_indices) => {
  const remove_map = {};
  remove_indices.forEach(n => { remove_map[n] = true; });
  get_graph_keys_with_suffix(graph, suffix)
    .forEach(sKey => graph[sKey] // faces_edges or vertices_edges...
      .forEach((elem, i) => { // faces_edges[0], faces_edges[1], ...
        // reverse iterate through array, remove elements with splice
        for (let j = elem.length - 1; j >= 0; j--) {
          if (remove_map[elem[j]] === true) {
            graph[sKey][i].splice(j, 1);
          }
        }
      }));
};
export const remove_circular_edges = (graph, remove_indices) => {
  if (!remove_indices) {
    remove_indices = get_circular_edges(graph);
  }
  if (remove_indices.length) {
    // remove every instance of a circular edge in every _edge array.
    // assumption is we can simply remove them because a face that includes
    // a circular edge is still the same face when you just remove the edge
    splice_remove_values_from_suffixes(graph, S._edges, remove_indices);
    // console.warn("circular edge found. please rebuild");
    // todo: figure out which arrays need to be rebuilt, if it exists.
  }
  return {
    map: remove(graph, S._edges, remove_indices),
    remove: remove_indices,
  };
};
/**
 * @description if an edge is removed, it will mess up the vertices
 * data, so all of the vertices_ arrays will be rebuilt if this
 * method successfully found and removed a duplicate edge.
 */
export const remove_duplicate_edges = (graph, replace_indices) => {
  // index: edge to remove, value: the edge which should replace it.
  if (!replace_indices) {
    replace_indices = get_duplicate_edges(graph);
  }
  const remove = Object.keys(replace_indices).map(n => parseInt(n));
  const map = replace(graph, S._edges, replace_indices);
  // if edges were removed, we need to rebuild vertices_edges and then
  // vertices_vertices since that was built from vertices_edges, and then
  // vertices_faces since that was built from vertices_vertices.
  if (remove.length) {
    // currently we are rebuilding the entire arrays, if possible,
    // update these specific vertices directly:
    // const vertices = remove
    //   .map(edge => graph.edges_vertices[edge])
    //   .reduce((a, b) => a.concat(b), []);
    if (graph.vertices_edges || graph.vertices_vertices || graph.vertices_faces) {
      graph.vertices_edges = make_vertices_edges_unsorted(graph);
      graph.vertices_vertices = make_vertices_vertices(graph);
      graph.vertices_edges = make_vertices_edges(graph);
      graph.vertices_faces = make_vertices_faces(graph);
    }
  }
  return { map, remove };
};
