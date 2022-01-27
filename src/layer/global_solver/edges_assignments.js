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
    if (faces.length === 1) { edges_assignment[e] = "B"; }
    if (faces.length === 2) {
      const windings = faces.map(f => faces_winding[f]);
      if (windings[0] === windings[1]) { return "F"; }
      const layers = faces.map(f => faces_layer[f]);
      const local_dir = layers[0] < layers[1];
      const global_dir = windings[0] ? local_dir : !local_dir;
      edges_assignment[e] = global_dir ? "V" : "M";
    }
  });  
  return edges_assignment;
};


// export const layer_conditions_to_edges_assignments = (graph, conditions) => {
//   const edges_assignment = [];
//   const faces_winding = make_faces_winding(graph);
//   // set boundary creases
//   const edges_faces = graph.edges_faces
//     ? graph.edges_faces
//     : make_edges_faces(graph);
//  
//   return edges_assignment;
// };
