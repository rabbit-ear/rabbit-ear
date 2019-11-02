import {
  make_faces_matrix
} from "./make";

import FOLDConvert from "../../include/fold/convert";

import {
  // vertices_count,
  // edges_count,
  faces_count,
  get_boundary,
  get_isolated_vertices
} from "./query";

import remove from "./remove";

// const sort_vertices_vertices = function (fold) {
//   if (fold.vertices_vertices == null) { return; }
//   fold.vertices_vertices.forEach((verts, i) => );
// };

export const clean = function (fold) {
  // const verticesCount = vertices_count(fold);
  // const edgesCount = edges_count(fold);
  if (fold.vertices_coords != null && fold.vertices_vertices != null) {
    FOLDConvert.sort_vertices_vertices(fold);
  }
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

/**
 * this removes all edges except for "B", boundary creases.
 * rebuilds the face, and
 * todo: removes a collinear vertex and merges the 2 boundary edges
 */
export const remove_non_boundary_edges = function (graph) {
  const remove_indices = graph.edges_assignment
    .map(a => !(a === "b" || a === "B"))
    .map((a, i) => (a ? i : undefined))
    .filter(a => a !== undefined);
  const edge_map = remove(graph, "edges", remove_indices);
  const face = get_boundary(graph);
  graph.faces_edges = [face.edges];
  graph.faces_vertices = [face.vertices];
  remove(graph, "vertices", get_isolated_vertices(graph));
};
