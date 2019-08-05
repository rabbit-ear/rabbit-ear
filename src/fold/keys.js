
// keys in the .FOLD version 1.1
export const keys_types = {
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
    "faces_edges"
  ],
  orders: [
    "edgeOrders",
    "faceOrders"
  ],
  rabbitEar: [
    "vertices_re:foldedCoords",
    "vertices_re:unfoldedCoords",
    "faces_re:matrix",
    "faces_re:layer",
  ]
};

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

export const keys = Object.freeze([]
  .concat(keys_types.file)
  .concat(keys_types.frame)
  .concat(keys_types.graph)
  .concat(keys_types.orders)
  .concat(keys_types.rabbitEar));

export const edges_assignment_names = {
  en: {
    B: "boundary",
    b: "boundary",
    M: "mountain",
    m: "mountain",
    V: "valley",
    v: "valley",
    F: "mark",
    f: "mark",
    U: "unassigned",
    u: "unassigned"
  }
};

export const edges_assignment_values = [
  "B", "b", "M", "m", "V", "v", "F", "f", "U", "u"
];

const assignment_angles = {
  M: -180,
  m: -180,
  V: 180,
  v: 180
};

export const edge_assignment_to_foldAngle = function (assignment) {
  return assignment_angles[assignment] || 0;
};

export const get_geometry_keys_with_prefix = function (graph, key) {
  const prefix = `${key}_`;
  return Object.keys(graph)
    .map(str => (str.substring(0, prefix.length) === prefix ? str : undefined))
    .filter(str => str !== undefined);
};

export const get_geometry_keys_with_suffix = function (graph, key) {
  const suffix = `_${key}`;
  return Object.keys(graph)
    .map(s => (s.substring(s.length - suffix.length, s.length) === suffix
      ? s : undefined))
    .filter(str => str !== undefined);
};

export const get_keys_with_ending = function (graph, string) {
  return Object.keys(graph)
    .map(s => (s.substring(s.length - string.length, s.length) === string
      ? s : undefined))
    .filter(str => str !== undefined);
};

/**
 * this takes in a geometry_key (vectors, edges, faces), and flattens
 * across all related arrays, creating 1 array of objects with the keys
 */
export const transpose_geometry_arrays = function (graph, geometry_key) {
  const matching_keys = get_geometry_keys_with_prefix(graph, geometry_key);
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
export const transpose_geometry_array_at_index = function (
  graph,
  geometry_key,
  index
) {
  const matching_keys = get_geometry_keys_with_prefix(graph, geometry_key);
  if (matching_keys.length === 0) { return []; }
  const geometry = {};
  matching_keys
    .map(k => ({ long: k, short: k.substring(geometry_key.length + 1) }))
    .forEach((key) => { geometry[key.short] = graph[key.long][index]; });
  return geometry;
};
