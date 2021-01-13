/**
 * Rabbit Ear (c) Robby Kraft
 */
import { keys } from "./fold_keys";

export const edges_assignment_degrees = {
  M: -180,
  m: -180,
  V: 180,
  v: 180,
  B: 0,
  b: 0,
  F: 0,
  f: 0,
  U: 0,
  u: 0
};
export const edges_assignment_names = {
  M: "mountain",
  m: "mountain",
  V: "valley",
  v: "valley",
  B: "boundary",
  b: "boundary",
  F: "mark",
  f: "mark",
  U: "unassigned",
  u: "unassigned"
};
/**
 * @param {string} one edge assignment letter, any case: M V B F U
 * @returns {number} fold angle in degrees. M/V are assumed to be flat-folded.
 */
export const edge_assignment_to_foldAngle = assignment =>
  edges_assignment_degrees[assignment] || 0;
/**
 * @param {number} fold angle in degrees.
 * @returns {string} one edge assignment letter: M V or U, no boundary detection.
 *
 * todo: what should be the behavior for 0, undefined, null?
 */
export const edge_foldAngle_to_assignment = (a) => {
  if (a > 0) { return "V"; }
  if (a < 0) { return "M"; }
  // if (a === 0) { return "F"; }
  return "U";
};
/**
 * @param {object} any object
 * @param {string} a suffix to match against the keys
 * @returns {string[]} array of keys that end with the string param
 */
export const filter_keys_with_suffix = (graph, suffix) => Object
  .keys(graph)
  .map(s => (s.substring(s.length - suffix.length, s.length) === suffix
    ? s : undefined))
  .filter(str => str !== undefined);
/**
 * @param {object} any object
 * @param {string} a prefix to match against the keys
 * @returns {string[]} array of keys that start with the string param
 */
export const filter_keys_with_prefix = (graph, prefix) => Object
  .keys(graph)
  .map(str => (str.substring(0, prefix.length) === prefix
    ? str : undefined))
  .filter(str => str !== undefined);
/**
 * return a list of keys from a FOLD object that match a provided
 * string such that the key STARTS WITH this string followed by a _.
 *
 * for example: "vertices" will return:
 * vertices_coords, vertices_faces,
 * but not edges_vertices, or verticesCoords (must end with _)
 */
export const get_graph_keys_with_prefix = (graph, key) =>
  filter_keys_with_prefix(graph, `${key}_`);
/**
 * return a list of keys from a FOLD object that match a provided
 * string such that the key ENDS WITH this string, preceded by _.
 *
 * for example: "vertices" will return:
 * edges_vertices, faces_vertices,
 * but not vertices_coords, or edgesvertices (must prefix with _)
 */
export const get_graph_keys_with_suffix = (graph, key) =>
  filter_keys_with_suffix(graph, `_${key}`);

/**
 * this takes in a geometry_key (vectors, edges, faces), and flattens
 * across all related arrays, creating 1 array of objects with the keys
 */
export const transpose_graph_arrays = (graph, geometry_key) => {
  const matching_keys = get_graph_keys_with_prefix(graph, geometry_key);
  if (matching_keys.length === 0) { return []; }
  const len = Math.max(...matching_keys.map(arr => graph[arr].length));
  const geometry = Array.from(Array(len))
    .map(() => ({}));
  // approach 1: this removes the geometry name from the geometry key
  // since it should be implied
  // matching_keys
  //   .map(k => ({ long: k, short: k.substring(geometry_key.length + 1) }))
  //   .forEach(key => geometry
  //     .forEach((o, i) => { geometry[i][key.short] = graph[key.long][i]; }));
  // approach 2: preserve geometry key
  matching_keys
    .forEach(key => geometry
      .forEach((o, i) => { geometry[i][key] = graph[key][i]; }));
  return geometry;
};

/**
 * this takes in a geometry_key (vectors, edges, faces), and flattens
 * across all related arrays, creating 1 array of objects with the keys
 */
export const transpose_graph_array_at_index = function (
  graph,
  geometry_key,
  index
) {
  const matching_keys = get_graph_keys_with_prefix(graph, geometry_key);
  if (matching_keys.length === 0) { return undefined; }
  const geometry = {};
  // matching_keys
  //   .map(k => ({ long: k, short: k.substring(geometry_key.length + 1) }))
  //   .forEach((key) => { geometry[key.short] = graph[key.long][index]; });
  matching_keys.forEach((key) => { geometry[key] = graph[key][index]; });
  return geometry;
};

export const fold_object_certainty = (object) => {
  if (typeof object !== "object" || object === null) { return 0; }
  return keys.filter(key => object[key]).length;
};

