/**
 * Rabbit Ear (c) Robby Kraft
 */

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

/**
 * key values used so many times in this library, for minification
 * it's helpful to reference a variable instead of a string literal.
 */
export const FOLDED_FORM = "foldedForm";
export const CREASE_PATTERN = "creasePattern";
export const VERTICES = "vertices";
export const EDGES = "edges";
export const FACES = "faces";
export const VERTICES_COORDS = "vertices_coords";
export const EDGES_ASSIGNMENT = "edges_assignment";
export const EDGES_FOLDANGLE = "edges_foldAngle";
export const EDGES_FACES = "edges_faces";

export const singularize = {
  vertices: "vertex",
  edges: "edge",
  faces: "face",
};
