/**
 * Rabbit Ear (c) Robby Kraft
 */
import math from "../../math";
import { get_boundary } from "../boundary";

const prepare_clip_func_params = (object, type) => {
  switch (type) {
    case "line":
    case "ray": return [object.vector, object.origin];
    case "segment": return [object[0], object[1]];
    default: return [];
  }
};

// "line" meaning line or ray or segment
const clip_line = (graph, line) => {
  const type = math.typeof(line);
  const func = math.core[`clip_${type}_in_convex_poly_exclusive`];
  if (func) {
    // const polygon = graph.boundaries && graph.boundaries[0]
    //   ? graph.boundaries[0]
    //   : get_boundary(graph).vertices;
    const boundaries_vertices = get_boundary(graph).vertices;
    const polygon = boundaries_vertices.map(v => graph.vertices_coords[v]);
    return func(polygon, ...prepare_clip_func_params(line, type));
  }
};

export default clip_line;