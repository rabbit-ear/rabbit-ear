import { Delaunay, Voronoi } from "../../include/delaunay/index";

export const make_delaunay_vertices = function (graph) {
  if (graph.vertices_coords == null) { return undefined; }
  return new Delaunay.from(graph.vertices_coords);
};

export const make_voronoi_vertices = function (graph) {
  if (graph.vertices_coords == null) { return undefined; }
  return new Voronoi(new Delaunay.from(graph.vertices_coords));
};

export const get_delaunay_faces_vertices = function (graph) {
  const t = graph["re:delaunay_vertices"].triangles;
  const l = t.length;
  return Array.from(Array(l / 3))
    .map((_, i) => [t[i * 3 + 0], t[i * 3 + 1], t[i * 3 + 2]]);
};
