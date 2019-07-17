import {
  make_faces_matrix
} from "./make";

import {
  // vertices_count,
  // edges_count,
  faces_count
} from "./query";

export const clean = function (fold) {
  // const verticesCount = vertices_count(fold);
  // const edgesCount = edges_count(fold);
  const facesCount = faces_count(fold);
  if (facesCount > 0) {
    if (fold["faces_re:matrix"] == null) {
      fold["faces_re:matrix"] = make_faces_matrix(fold);
    } else if (fold["faces_re:matrix"].length !== facesCount) {
      fold["faces_re:matrix"] = make_faces_matrix(fold);
    }

    if (fold["faces_re:layer:"] == null) {
      // fold["faces_re:layer"] = []
    }
  }
};

export const check = function () {
  return 5;
};
