import FOLDConvert from "../../include/fold/convert";
import {
  make_faces_matrix,
  make_vertices_edges,
  make_vertices_faces,
  make_edges_faces,
  make_edges_length,
  make_edges_foldAngle,
  make_faces_faces,
} from "./make";

const need = function (graph, ...keys) {
  return keys.map((key) => {
    switch (key) {
      case "vertices_coords":
      case "edges_vertices":
        return graph[key] != null;
      case "vertices_vertices":
        FOLDConvert.edges_vertices_to_vertices_vertices_sorted(graph);
        return true;
      case "vertices_edges":
        graph.vertices_edges = make_vertices_edges(graph);
        return true;
      default: return false;
    }
  }).reduce((a, b) => a && b, true);
};

export default need;
