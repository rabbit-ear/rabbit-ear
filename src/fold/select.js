import math from "../../include/math";

export const select_vertices = function (graph, poly_points) {
  const polygon = math.convexPolygon(poly_points);
  const contains = graph.vertices_coords.map(v => polygon.contains(v));
  return graph.vertices_coords.map((_, i) => i).filter(i => contains[i]);
};

export const select_edges = function (graph, poly_points) {
  const segments = graph.edges_vertices.map(ev => ev.map(v => graph.vertices_coords[v]));
  const polygon = math.convexPolygon(poly_points);
  const overlaps = segments.map(s => polygon.overlaps(s));
  return segments.map((_, i) => i).filter(i => overlaps[i]);
};
