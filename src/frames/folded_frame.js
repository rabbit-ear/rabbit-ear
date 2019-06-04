

export function build_folded_frame(graph, face_stationary) {
  if (face_stationary == null) {
    face_stationary = 0;
    console.warn("build_folded_frame was not supplied a stationary face");
  }
  // console.log("build_folded_frame", graph, face_stationary);
  let faces_matrix = make_faces_matrix(graph, face_stationary);
  let vertices_coords = fold_vertices_coords(graph, face_stationary, faces_matrix);
  return {
    vertices_coords,
    frame_classes: ["foldedForm"],
    frame_inherit: true,
    frame_parent: 0, // this is not always the case. maybe shouldn't imply this here.
    // "face_re:stationary": face_stationary,
    "faces_re:matrix": faces_matrix
  };
}
