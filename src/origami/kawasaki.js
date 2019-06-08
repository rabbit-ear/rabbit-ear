import math from "../../include/math";
import split_convex_polygon from "../graph/split_face";

const vertex_adjacent_vectors = function (graph, vertex) {
  const adjacent = graph.vertices_vertices[vertex];
  return adjacent.map(v => [
    graph.vertices_coords[v][0] - graph.vertices_coords[vertex][0],
    graph.vertices_coords[v][1] - graph.vertices_coords[vertex][1]
  ]);
};

export function kawasaki_solutions(graph, vertex) {
  return math.core.kawasaki_solutions(...vertex_adjacent_vectors(graph, vertex));
}

export function kawasaki_collapse(graph, vertex, face, crease_direction = "F") {
  const kawasakis = kawasaki_solutions(graph, vertex);
  const origin = graph.vertices_coords[vertex];
  split_convex_polygon(graph, face, origin, kawasakis[face], crease_direction);
}
