/**
 * Rabbit Ear (c) Robby Kraft
 */
/**
 * lists of keys and values involved in the FOLD file format spec
 * https://github.com/edemaine/FOLD/
 */
export const file_spec = 1.1;
// specific to this software
export const file_creator = "Rabbit Ear";
/**
 * top-level keys in a FOLD object, sorted into usage categories.
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
 * top-level keys from a FOLD object in one flat array
 */
export const keys = Object.freeze([]
  .concat(fold_keys.file)
  .concat(fold_keys.frame)
  .concat(fold_keys.graph)
  .concat(fold_keys.orders));
/**
 * top-level keys from a FOLD object used by this library,
 * not in the official spec. made when calling populate().
 */
export const non_spec_keys = Object.freeze([
  "edges_vector",
  "vertices_sectors",
  "faces_sectors",
  "faces_matrix"
]);
// "faces_ear:matrix",
// "faces_ear:layer",
// "ear:sectors_vertices",
// "ear:sectors_edges",
// "ear:sectors_angles",
// "vertices_ear:sectors_vertices",
/**
 * values from the official spec, grouped by the key under which they appear.
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
/**
 * array of single characers, the values of an edge assignment
 */
export const edges_assignment_values = Array.from("MmVvBbFfUu");
