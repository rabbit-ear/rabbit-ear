
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
  .concat(keys_types.orders));

// export const CREASE_NAMES = Object.freeze({
//  "B": "boundary", "b": "boundary",
//  "M": "mountain", "m": "mountain",
//  "V": "valley",   "v": "valley",
//  "F": "mark",     "f": "mark",
//  "U": "mark",     "u": "mark"
// });

const assignment_angles = {
  M: -180,
  m: -180,
  V: 180,
  v: 180
};

export const edge_assignment_to_foldAngle = function (assignment) {
  return assignment_angles[assignment] || 0;
};
