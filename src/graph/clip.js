/**
 * Rabbit Ear (c) Robby Kraft
 */
import math from "../math";
import { get_boundary } from "./boundary";

const prepare_clip_func_params = (object, type) => {
  switch (type) {
    case "line":
    case "ray": return [object.vector, object.origin];
    case "segment": return [object[0], object[1]];
    default: return [];
  }
};

// convex poly only!
//
// "line" meaning line or ray or segment
// const clip_line = (graph, line) => {
export const clip_line = function (
  {vertices_coords, vertices_edges, edges_vertices, edges_assignment, boundaries_vertices},
  line) {
  const type = math.typeof(line);
  const func = math.core[`clip_${type}_in_convex_poly_exclusive`];
  if (func) {
    if (!boundaries_vertices) {
      boundaries_vertices = get_boundary({
        vertices_edges, edges_vertices, edges_assignment
      }).vertices;
    }
    const polygon = boundaries_vertices.map(v => vertices_coords[v]);
    return func(polygon, ...prepare_clip_func_params(line, type));
  }
};
