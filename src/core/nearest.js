import math from "../math";
/**
 * @returns index of nearest vertex in vertices_ arrays or
 * this is the only one of the nearest_ functions that works in 3-dimensions
 *
 * todo: improve with space partitioning
 */
export const nearest_vertex = ({ vertices_coords }, point) => {
  // resize our point to be the same dimension as the first vertex
  const p = math.core.resize(vertices_coords[0].length, point);
  // sort by distance, hold onto the original index in vertices_coords
  const nearest = vertices_coords
    .map((v, i) => ({ d: math.core.distance(p, v), i }))
    .sort((a, b) => a.d - b.d)
    .shift();
  // return index, not vertex
  return nearest ? nearest.i : undefined;
};
/**
 * returns index of nearest edge in edges_ arrays or
 *  undefined if there are no vertices_coords or edges_vertices
 */
export const nearest_edge = ({ vertices_coords, edges_vertices }, point) => {
  if (vertices_coords === undefined || vertices_coords.length === 0
    || edges_vertices === undefined || edges_vertices.length === 0) {
    return undefined;
  }
  const nearest_points = edges_vertices
    .map(e => e.map(ev => vertices_coords[ev]))
    .map(e => math.core.nearest_point_on_line(
      math.core.subtract(e[1], e[0]),
      e[0],
      point,
      math.core.segment_limiter));
  return math.core.smallest_comparison_search(point, nearest_points, math.core.distance);
};

export const face_containing_point = ({ vertices_coords, faces_vertices }, point) => {
  if (vertices_coords === undefined || vertices_coords.length === 0
    || faces_vertices === undefined || faces_vertices.length === 0) {
    return undefined;
  }
  const face = faces_vertices
    .map((fv, i) => ({ face: fv.map(v => vertices_coords[v]), i }))
    .filter(f => math.core.point_in_poly(point, f.face))
    .shift();
  return (face === undefined ? undefined : face.i);
};

export const nearest_face = face_containing_point;
