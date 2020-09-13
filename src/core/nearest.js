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
export const nearest_edge = function ({
  vertices_coords, edges_vertices
}, point) {
  if (vertices_coords == null || vertices_coords.length === 0
    || edges_vertices == null || edges_vertices.length === 0) {
    return undefined;
  }
  // todo, z is not included in the calculation
  // return edges_vertices
  //   .map(e => e.map(ev => vertices_coords[ev]))
  //   .map(e => math.edge(e))
  //   .map((e, i) => ({ i, d: e.nearestPoint(point).distanceTo(point) }))
  //   .sort((a, b) => a.d - b.d)
  //   .shift()
  //   .i;
  const edge_limit = (dist) => {
    if (dist < -math.core.EPSILON) { return 0; }
    if (dist > 1 + math.core.EPSILON) { return 1; }
    return dist;
  };
  const nearest_points = edges_vertices
    .map(e => e.map(ev => vertices_coords[ev]))
    .map(e => [[e[1][0] - e[0][0], e[1][1] - e[0][1]], e[0]])
    .map(line => math.core.nearest_point_on_line(line[0], line[1], point, edge_limit))
    .map((p, i) => ({ p, i, d: math.core.distance2(point, p) }));
  let shortest_index;
  let shortest_distance = Infinity;
  for (let i = 0; i < nearest_points.length; i += 1) {
    if (nearest_points[i].d < shortest_distance) {
      shortest_index = i;
      shortest_distance = nearest_points[i].d;
    }
  }
  return shortest_index;
};

export const face_containing_point = function ({
  vertices_coords, faces_vertices
}, point) {
  if (vertices_coords == null || vertices_coords.length === 0
    || faces_vertices == null || faces_vertices.length === 0) {
    return undefined;
  }
  const face = faces_vertices
    .map((fv, i) => ({ face: fv.map(v => vertices_coords[v]), i }))
    .filter(f => math.core.point_in_poly(point, f.face))
    .shift();
  return (face == null ? undefined : face.i);
};
