/**
 * Rabbit Ear (c) Robby Kraft
 */

/**
 * key values used so many times in this library, for minification
 * it's helpful to reference a variable instead of a string literal.
 */
export const VERTICES = "vertices";
export const VERTICES_COORDS = "vertices_coords";
export const EDGES = "edges";
export const EDGES_ASSIGNMENT = "edges_assignment";
export const EDGES_FOLDANGLE = "edges_foldAngle";
export const EDGES_FACES = "edges_faces";
export const FACES = "faces";
export const FOLDED_FORM = "foldedForm";
export const CREASE_PATTERN = "creasePattern";

// export const coords = "coords";
// export const vertices = "vertices";
// export const edges = "edges";
// export const faces = "faces";
// export const boundaries = "boundaries";
// export const frame = "frame";
// export const file = "file";
// export const boundary = "boundary";
// export const mountain = "mountain";
// export const valley = "valley";
// export const mark = "mark";
// export const unassigned = "unassigned";
// export const creasePattern = "creasePattern";
// export const front = "front";
// export const back = "back";
// export const svg = "svg";
// export const _class = "class";
// export const index = "index";
// export const object = "object";
// export const string = "string";
// export const number = "number";
// export const _function = "function";
// export const _undefined = "undefined";
// export const black = "black";
// export const white = "white";
// export const lightgray = "lightgray";
// export const stroke_width = "stroke-width";
// export const createElementNS = "createElementNS";
// export const setAttributeNS = "setAttributeNS";
// export const appendChild = "appendChild";
// export const vertices_coords = "vertices_coords";
// export const vertices_edges = "vertices_edges";
// export const edges_vertices = "edges_vertices";
// export const faces_vertices = "faces_vertices";
// export const faces_edges = "faces_edges";
// export const edges_assignment = "edges_assignment";
// export const faces_re_coloring = "faces_re:coloring";
// export const faces_re_matrix = "faces_re:matrix";
// export const faces_re_layer = "faces_re:layer";
// export const frame_parent = "frame_parent";
// export const frame_inherit = "frame_inherit";
// export const frame_classes = "frame_classes";
// export const file_frames = "file_frames";
// export const file_classes = "file_classes";
// export const foldedForm = "foldedForm";
/**
 * top-level keys and values to be included in exported FOLD objects
 */
export const file_spec = 1.1;
export const file_creator = "Rabbit Ear";
/**
 * top-level keys from the FOLD specification, sorted into usage categories.
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
    // as of now, these are not described in the spec, but their behavior
    // can be inferred, except faces_faces which could be edge-adjacent or
    // face-adjacent. this library uses as EDGE-ADJACENT.
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
 * top-level keys from the FOLD specification without sorting by category;
 * simply arranged as strings in an array.
 */
export const keys = Object.freeze([]
  .concat(fold_keys.file)
  .concat(fold_keys.frame)
  .concat(fold_keys.graph)
  .concat(fold_keys.orders));
// used by this library, created by populate(), but not official
export const non_spec_keys = Object.freeze([
  "edges_vector",
  "vertices_sectors",
  "faces_angles",
  "faces_matrix"
]);

/**
 * keys from outside the official FOLD specification.
 */
// export const ear_spec = {
//   FACES_MATRIX: "faces_ear:matrix",
//   FACES_LAYER: "faces_ear:layer",
//   SECTORS_VERTICES: "ear:sectors_vertices",
//   SECTORS_EDGES: "ear:sectors_edges",
//   SECTORS_ANGLES: "ear:sectors_angles",
//   VERTICES_SECTORS_VERTICES: "vertices_ear:sectors_vertices",
// };
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
export const singularize = {
  vertices: "vertex",
  edges: "edge",
  faces: "face",
};
