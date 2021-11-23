import math from "../math";
import { make_faces_center } from "../graph/make";

// this honestly should be avoided until a lot more testing.
// it makes a lot of assumptions.
// assumes that all of the faces on either side of the symmetry line
// in the crease pattern remain on their side of the symmetry line
// in the folded form.

const get_face_symmetry_side = (graph, symmetry_line) => {
  return make_faces_center(graph)
    .map(center => math.core.subtract(center, symmetry_line.origin))
    .map(center => math.core.cross2(center, symmetry_line.vector))
    .map(side => side < 0 ? 1 : -1);
};

const flat_layer_order_symmetry_line = (graph, matrix, symmetry_line, face = 0) => {
	// todo, get which side the face is in, make that the -1 or 1 todo also
	// figure out which of those

  const faces_side = get_face_symmetry_side(graph, symmetry_line);
  // console.log("faces_side", faces_side);
  for (let i = 0; i < faces_side.length; i++) {
    for (let j = 0; j < faces_side.length; j++) {
      if (i === j) { continue; }
      if (faces_side[i] !== faces_side[j]) {
        matrix[i][j] = faces_side[i];
        matrix[j][i] = faces_side[j];
      }
    }
  }
};

export default flat_layer_order_symmetry_line;
