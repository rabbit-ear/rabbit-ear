/** Removes vertices, edges, or faces (or anything really)
 * and updates all relevant array indices
 *
 * @param {fold_file} a FOLD object
 * @param {geometry_key} a string, like "vertices", the prefix of the arrays
 * @param {number[]} an array of vertex indices
 * @example remove(fold_file, "vertices", [2,6,11,15]);
 */

/**
 * provide arrays as arguments, this will filter out anything undefined
 * @returns {number} length of the longest array
 */
const max_array_length = function (...arrays) {
  return Math.max(...(arrays
    .filter(el => el !== undefined)
    .map(el => el.length)));
};

/* Get the number of vertices, edges, faces in the graph sourcing only their
 * primary key arrays. in the case of abstract graphs, use "implied" functions
 * @returns {number} number of geometry elements
 */
const vertices_count = function ({
  vertices_coords, vertices_faces, vertices_vertices
}) {
  return max_array_length([], vertices_coords,
    vertices_faces, vertices_vertices);
};

const edges_count = function ({
  edges_vertices, edges_faces
}) {
  return max_array_length([], edges_vertices, edges_faces);
};

const faces_count = function ({
  faces_vertices, faces_edges
}) {
  return max_array_length([], faces_vertices, faces_edges);
};

const get_geometry_length = {
  vertices: vertices_count,
  edges: edges_count,
  faces: faces_count
};

/**
 * the generalized method for removing vertices, edges, faces.
 * updates both suffix and prefix arrays (vertices_... and ..._vertices).
 * array indices shift after removal, this updates all relevant arrays.
 *
 * @param key is a string, like "vertices"
 * @param removeIndices, array of numbers, like [1,9,25]
 */
const remove_geometry_key_indices = function (graph, key, removeIndices) {
  const geometry_array_size = get_geometry_length[key](graph);
  const removes = Array(geometry_array_size).fill(false);
  removeIndices.forEach((v) => { removes[v] = true; });
  let s = 0;
  // index_map length is the original length of the geometry (vertices_faces)
  const index_map = removes.map(remove => (remove ? --s : s));
  if (removeIndices.length === 0) { return index_map; }

  // these comments are written as if "vertices" was provided as the key
  const prefix = `${key}_`;
  const suffix = `_${key}`;
  // get all keys like vertices_coords
  const graph_keys = Object.keys(graph);
  const prefixKeys = graph_keys
    .map(str => (str.substring(0, prefix.length) === prefix ? str : undefined))
    .filter(str => str !== undefined);
  // keys like faces_vertices, vertices_vertices (that one counts in both)
  const suffixKeys = graph_keys
    .map(str => (str.substring(str.length - suffix.length, str.length) === suffix
      ? str
      : undefined))
    .filter(str => str !== undefined);
  // update every component that points to vertices_coords
  // these arrays do not change their size, only their contents
  suffixKeys
    .forEach(sKey => graph[sKey]
      .forEach((_, i) => graph[sKey][i]
        .forEach((v, j) => { graph[sKey][i][j] += index_map[v]; })));
  // update every array with a 1:1 relationship to vertices_ arrays
  // these arrays change their size, their contents are untouched
  prefixKeys.forEach((pKey) => {
    graph[pKey] = graph[pKey]
      .filter((_, i) => !removes[i]);
  });
  return index_map;
};

export default remove_geometry_key_indices;
