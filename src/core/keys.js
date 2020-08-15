/**
 * this contains two types of methods.
 * 1. methods that are mostly references, including lists of keys
 *    that match the FOLD 1.1 specification (anytime FOLD is updated
 *    we need to update here too.)
 * 2. methods that operate on a FOLD object, searching and gathering
 *    and re-arranging keys or values based on key queries.
 */

/**
 * top-level keys and values that are intended to be inside EVERY
 * fold object that this library touches.
 */
export const file_spec = 1.1;
export const file_creator = "Rabbit Ear";
/**
 * top-level keys from the FOLD specification, sorted into categories
 * generally by their usage.
 */
export const fold_keys = {
  file: [
    "file_spec",
    "file_creator",
    "file_author",
    "file_title",
    "file_description",
    "file_classes",
    "file_frames"
  ],
  frame: [
    "frame_author",
    "frame_title",
    "frame_description",
    "frame_attributes",
    "frame_classes",
    "frame_unit",
    "frame_parent", // inside file_frames only
    "frame_inherit", // inside file_frames only
  ],
  graph: [
    "vertices_coords",
    "vertices_vertices",
    "vertices_faces",
    "edges_vertices",
    "edges_faces",
    "edges_assignment",
    "edges_foldAngle",
    "edges_length",
    "faces_vertices",
    "faces_edges",
    // as of now, these are not described in the spec, but their
    // behavior can be absolutely inferred,
    // except faces_faces which we are using as EDGE-ADJACENT FACES
    "vertices_edges",
    "edges_edges",
    "faces_faces"
  ],
  orders: [
    "edgeOrders",
    "faceOrders"
  ],
};
/**
 * top-level keys from the FOLD specification without sorting by
 * category; simply arranged as strings in an array.
 */
export const keys = Object.freeze([]
  .concat(fold_keys.file)
  .concat(fold_keys.frame)
  .concat(fold_keys.graph)
  .concat(fold_keys.orders));
/**
 * keys from outside the official FOLD specification.
 */
export const ear_spec = {
  FACES_MATRIX: "faces_ear:matrix",
  FACES_LAYER: "faces_ear:layer",
  SECTORS_VERTICES: "ear:sectors_vertices",
  SECTORS_EDGES: "ear:sectors_edges",
  SECTORS_ANGLES: "ear:sectors_angles",
  VERTICES_SECTORS_VERTICES: "vertices_ear:sectors_vertices",
};
/**
 * lists of official values that are intended to be under these keys,
 * the keys match the variable name of the array.
 */
export const file_classes = [
  "singleModel",
  "multiModel",
  "animation",
  "diagrams"
];
export const frame_classes = [
  "creasePattern",
  "foldedForm",
  "graph",
  "linkage"
];
export const frame_attributes = [
  "2D",
  "3D",
  "abstract",
  "manifold",
  "nonManifold",
  "orientable",
  "nonOrientable",
  "selfTouching",
  "nonSelfTouching",
  "selfIntersecting",
  "nonSelfIntersecting"
];
export const edges_assignment_values = [
  "M", "m", "V", "v", "B", "b", "F", "f", "U", "u"
];
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
const assignment_angles = {
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
/**
 * key values used so many times in this library, for minification
 * it's helpful to reference a variable instead of a string literal.
 */
export const FOLDED_FORM = "foldedForm";
export const CREASE_PATTERN = "creasePattern";

export const edge_assignment_to_foldAngle = assignment =>
  assignment_angles[assignment] || 0;
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
  matching_keys
    .map(k => ({ long: k, short: k.substring(geometry_key.length + 1) }))
    .forEach(key => geometry
      .forEach((o, i) => { geometry[i][key.short] = graph[key.long][i]; }));
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
  matching_keys
    .map(k => ({ long: k, short: k.substring(geometry_key.length + 1) }))
    .forEach((key) => { geometry[key.short] = graph[key.long][index]; });
  return geometry;
};
