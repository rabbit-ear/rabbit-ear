/**
 * Rabbit Ear (c) Robby Kraft
 */
import math from "../math";
import get_vertices_clusters from "./vertices_clusters";
import {
  get_graph_keys_with_suffix,
  get_graph_keys_with_prefix,
} from "../fold/spec";
import * as S from "../general/strings";
import remove from "./remove";
import replace from "./replace";

export const get_duplicate_vertices = (graph, epsilon) => {
	return get_vertices_clusters(graph, epsilon)
		.filter(arr => arr.length > 1);
};

export const get_edge_isolated_vertices = ({ vertices_coords, edges_vertices }) => {
  if (!vertices_coords || !edges_vertices) { return []; }
  let count = vertices_coords.length;
  const seen = Array(count).fill(false);
  edges_vertices.forEach((ev) => {
    ev.filter(v => !seen[v]).forEach((v) => {
      seen[v] = true;
      count -= 1;
    });
  });
  return seen
    .map((s, i) => (s ? undefined : i))
    .filter(a => a !== undefined);
};

export const get_face_isolated_vertices = ({ vertices_coords, faces_vertices }) => {
  if (!vertices_coords || !faces_vertices) { return []; }
  let count = vertices_coords.length;
  const seen = Array(count).fill(false);
  faces_vertices.forEach((fv) => {
    fv.filter(v => !seen[v]).forEach((v) => {
      seen[v] = true;
      count -= 1;
    });
  });
  return seen
    .map((s, i) => (s ? undefined : i))
    .filter(a => a !== undefined);
};

// todo this could be improved. for loop instead of forEach + filter.
// break the loop early.
export const get_isolated_vertices = ({ vertices_coords, edges_vertices, faces_vertices }) => {
  if (!vertices_coords) { return []; }
  let count = vertices_coords.length;
  const seen = Array(count).fill(false);
  if (edges_vertices) {
    edges_vertices.forEach((ev) => {
      ev.filter(v => !seen[v]).forEach((v) => {
        seen[v] = true;
        count -= 1;
      });
    });
  }
  if (faces_vertices) {
    faces_vertices.forEach((fv) => {
      fv.filter(v => !seen[v]).forEach((v) => {
        seen[v] = true;
        count -= 1;
      });
    });
  }
  return seen
    .map((s, i) => (s ? undefined : i))
    .filter(a => a !== undefined);
};
/**
 * @description remove any vertices which are not a part of any edge or
 * face. This will shift up the remaining vertices indices so that the
 * vertices arrays will not have any holes, and, additionally it searches
 * through all _vertices reference arrays and updates the index
 * references for the shifted vertices.
 * @param {object} a FOLD graph
 * @param {number[]} optional. the result of get_isolated_vertices. 
 */
export const remove_isolated_vertices = (graph, remove_indices) => {
  if (!remove_indices) {
    remove_indices = get_isolated_vertices(graph);
  }
  return {
    map: remove(graph, S._vertices, remove_indices),
    remove: remove_indices,
  };
};

// todo
// export const remove_collinear_vertices = (graph, epsilon = math.core.EPSILON) => {
// };

/**
 * @description this will shrink the number of vertices in the graph,
 * if vertices are too close it will keep the first one, find the geometric
 * average of all merging points, and set the one vertex's vertices_coords.
 * 
 * this has the potential to create circular and duplicate edges
 */
export const remove_duplicate_vertices = (graph, epsilon = math.core.EPSILON) => {
  // replaces array will be [index:value] index is the element to delete,
  // value is the index this element will be replaced by.
  const replace_indices = [];
  // "remove" is only needed for the return value summary.
  const remove_indices = [];
  // clusters is array of indices, for example: [ [4, 13, 7], [0, 9] ]
  const clusters = get_vertices_clusters(graph, epsilon)
    .filter(arr => arr.length > 1);
  // for each cluster of n, all indices from [1...n] will be replaced with [0]
  clusters.forEach(cluster => {
    for (let i = 1; i < cluster.length; i++) {
      replace_indices[cluster[i]] = cluster[0];
      remove_indices.push(cluster[i]);
    }
  });
  // for each cluster, average all vertices-to-merge to get their new point.
  // set the vertex at the index[0] (the index to keep) to the new point.
  clusters
    .map(arr => arr.map(i => graph.vertices_coords[i]))
    .map(arr => math.core.average(...arr))
    .forEach((point, i) => { graph.vertices_coords[clusters[i][0]] = point; });
  return {
    map: replace(graph, S._vertices, replace_indices),
    remove: remove_indices,    
  }
};

// export const remove_duplicate_vertices_first = (graph, epsilon = math.core.EPSILON) => {
//   const clusters = get_vertices_clusters(graph, epsilon);
//   // map answers: what is the index of the old vertex in the new graph?
//   // [0, 1, 2, 3, 1, 4, 5]  vertex 4 got merged, vertices after it shifted up
//   const map = [];
//   clusters.forEach((verts, i) => verts.forEach(v => { map[v] = i; }));
//   // average all points together for each new vertex
//   graph.vertices_coords = clusters
//     .map(arr => arr.map(i => graph.vertices_coords[i]))
//     .map(arr => math.core.average(...arr));
//   // update all "..._vertices" arrays with each vertex's new index.
//   // TODO: this was copied from remove.js
//   get_graph_keys_with_suffix(graph, S._vertices)
//     .forEach(sKey => graph[sKey]
//       .forEach((_, i) => graph[sKey][i]
//         .forEach((v, j) => { graph[sKey][i][j] = map[v]; })));
//   // for keys like "vertices_edges" or "vertices_vertices", we simply
//   // cannot carry them over, for example vertices_vertices are intended
//   // to be sorted clockwise. it's possible to write this out one day
//   // for all the special cases, but for now playing it safe.
//   get_graph_keys_with_prefix(graph, S._vertices)
//     .filter(a => a !== S._vertices_coords)
//     .forEach(key => delete graph[key]);
//   // for a shared vertex: [3, 7, 9] we say 7 and 9 are removed.
//   // the map reflects this change too, where indices 7 and 9 contain "3"
//   const remove_indices = clusters
//     .map(cluster => cluster.length > 1 ? cluster.slice(1, cluster.length) : undefined)
//     .filter(a => a !== undefined)
//     .reduce((a, b) => a.concat(b), []);
//   console.log("clusters", clusters);
//   console.log("map", map);
//   return {
//     map,
//     remove: remove_indices,
//   };
// };
