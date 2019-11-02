import { clone } from "./object";
import FOLDConvert from "../../include/fold/convert";
import {
  make_vertices_faces,
  make_edges_faces,
} from "./make";

export const copy_without_marks = function (graph) {
  const edges_vertices = graph.edges_vertices
    .filter((_, i) => graph.edges_assignment[i] !== "F"
      && graph.edges_assignment[i] !== "f");
  const edges_assignment = graph.edges_assignment
    .filter(ea => ea !== "F" && ea !== "f");

  const copy = clone(graph);
  Object.keys(copy).filter(key => key.substring(0, 9) === "vertices_")
    .forEach(key => delete copy[key]);
  Object.keys(copy).filter(key => key.substring(0, 6) === "edges_")
    .forEach(key => delete copy[key]);
  Object.keys(copy).filter(key => key.substring(0, 6) === "faces_")
    .forEach(key => delete copy[key]);
  const rebuilt = Object.assign(copy, {
    vertices_coords: graph.vertices_coords,
    edges_vertices,
    edges_assignment
  });

  // copy from rebuild
  FOLDConvert.edges_vertices_to_vertices_vertices_sorted(rebuilt);
  FOLDConvert.vertices_vertices_to_faces_vertices(rebuilt);
  FOLDConvert.faces_vertices_to_faces_edges(rebuilt);
  rebuilt.edges_faces = make_edges_faces(rebuilt);
  rebuilt.vertices_faces = make_vertices_faces(rebuilt);
  return rebuilt;
};
