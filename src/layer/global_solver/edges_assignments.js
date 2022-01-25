import { make_faces_winding } from "../../graph/faces_winding";
import { make_edges_faces } from "../../graph/make";
import { invert_map } from "../../graph/maps";

export const faces_layer_to_edges_assignments = (graph, faces_layer) => {
  const edges_assignment = [];
  const faces_winding = make_faces_winding(graph);
  // set boundary creases
  const edges_faces = graph.edges_faces
    ? graph.edges_faces
    : make_edges_faces(graph);
  edges_faces.forEach((faces, e) => {
    edges_assignment[e] = faces.length > 1 ? "U" : "B";
  });
  const layers_face = invert_map(faces_layer);
  return edges_assignment;
};
