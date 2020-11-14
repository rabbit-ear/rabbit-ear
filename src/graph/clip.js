/**
 * Rabbit Ear (c) Robby Kraft
 */
import math from "../math";
import { get_boundary } from "./boundary";

// convex poly only!
export const clip_line_in_boundary = ({ vertices_coords, vertices_edges, edges_vertices, edges_assignment, boundaries_vertices }, vector, origin) => {
  if (!boundaries_vertices) {
    boundaries_vertices = get_boundary({
      vertices_edges, edges_vertices, edges_assignment
    }).vertices;
  }
  const poly = boundaries_vertices.map(v => vertices_coords[v]);
  return math.core.clip_line_in_convex_poly_exclusive(poly, vector, origin);
};
