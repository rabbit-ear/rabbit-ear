import math from "../../include/math";

/* Get the number of vertices, edges, faces in the graph sourcing only their
 * primary key arrays. in the case of abstract graphs, use "implied" functions
 * @returns {number} number of geometry elements
 */
export const vertices_count = function (graph) {
  return Math.max(...(
    [[], graph.vertices_coords, graph.vertices_faces, graph.vertices_vertices]
      .filter(el => el !== undefined)
      .map(el => el.length)
  ));
};

export const edges_count = function (graph) {
  return Math.max(...(
    [[], graph.edges_vertices, graph.edges_faces]
      .filter(el => el !== undefined)
      .map(el => el.length)
  ));
};

export const faces_count = function (graph) {
  return Math.max(...(
    [[], graph.faces_vertices, graph.faces_edges]
      .filter(el => el !== undefined)
      .map(el => el.length)
  ));
};

/* Get the number of vertices, edges, faces by searching their relative arrays
 * useful for abstract graphs where "vertices" aren't defined but still exist
 * @returns {number} number of geometry elements
 */
export const implied_vertices_count = function (graph) {
  let max = 0;
  [graph.faces_vertices, graph.edges_vertices]
    .filter(a => a !== undefined)
    .forEach(arr => arr
      .forEach(el => el
        .forEach((e) => {
          if (e > max) { max = e; }
        })));
  return max;
};

export const implied_edges_count = function (graph) {
  let max = 0;
  [graph.faces_edges, graph.vertices_edges]
    .filter(a => a !== undefined)
    .forEach(arr => arr
      .forEach(el => el
        .forEach((e) => {
          if (e > max) { max = e; }
        })));
  if (graph.edgeOrders !== undefined) {
    graph.edgeOrders.forEach(eo => eo.forEach((e, i) => {
      // exception. index 2 is orientation, not index
      if (i !== 2 && e > max) { max = e; }
    }));
  }
  return max;
};

export const implied_faces_count = function (graph) {
  let max = 0;
  [graph.vertices_faces, graph.edges_faces]
    .filter(a => a !== undefined)
    .forEach(arr => arr
      .forEach(el => el
        .forEach((f) => {
          if (f > max) { max = f; }
        })));
  if (graph.facesOrders !== undefined) {
    graph.facesOrders.forEach(fo => fo.forEach((f, i) => {
      // exception. index 2 is orientation, not index
      if (i !== 2 && f > max) { max = f; }
    }));
  }
  return max;
};

/**
 * @returns index of nearest vertex in vertices_ arrays or
 * this is the only one of the nearest_ functions that works in 3-dimensions
 */
export const nearest_vertex = function (graph, point) {
  if (graph.vertices_coords === undefined
    || graph.vertices_coords.length === 0) {
    return undefined;
  }
  const p = [...point];
  if (p[2] == null) { p[2] = 0; }
  return graph.vertices_coords
    .map(v => v
      .map((n, i) => (n - p[i]) ** 2)
      .reduce((a, b) => a + b, 0))
    .map((n, i) => ({ d: Math.sqrt(n), i }))
    .sort((a, b) => a.d - b.d)
    .shift()
    .i;
};

/**
 * returns index of nearest edge in edges_ arrays or
 *  undefined if there are no vertices_coords or edges_vertices
 */
export const nearest_edge = function (graph, point) {
  if (graph.vertices_coords == null || graph.vertices_coords.length === 0
    || graph.edges_vertices == null || graph.edges_vertices.length === 0) {
    return undefined;
  }
  // todo, z is not included in the calculation
  return graph.edges_vertices
    .map(e => e.map(ev => graph.vertices_coords[ev]))
    .map(e => math.edge(e))
    .map((e, i) => ({ e, i, d: e.nearestPoint(point).distanceTo(point) }))
    .sort((a, b) => a.d - b.d)
    .shift()
    .i;
};

/**
 * someday this will implement facesOrders. right now just faces_re:layer
 * leave faces_options empty to search all faces
 */
export const topmost_face = function (graph, faces_options) {
  if (faces_options == null) {
    faces_options = Array.from(Array(faces_count(graph)))
      .map((_, i) => i);
  }
  if (faces_options.length === 0) { return undefined; }
  if (faces_options.length === 1) { return faces_options[0]; }
  // top to bottom
  const faces_in_order = graph["faces_re:layer"]
    .map((layer, i) => ({ layer, i }))
    .sort((a, b) => b.layer - a.layer)
    .map(el => el.i);
  for (let i = 0; i < faces_in_order.length; i += 1) {
    if (faces_options.includes(faces_in_order[i])) {
      return faces_in_order[i];
    }
  }
  return undefined;
};

export const face_containing_point = function (graph, point) {
  if (graph.vertices_coords == null || graph.vertices_coords.length === 0
    || graph.faces_vertices == null || graph.faces_vertices.length === 0) {
    return undefined;
  }
  const face = graph.faces_vertices
    .map((fv, i) => ({ face: fv.map(v => graph.vertices_coords[v]), i }))
    .filter(f => math.core.point_in_poly(point, f.face))
    .shift();
  return (face == null ? undefined : face.i);
};

export const folded_faces_containing_point = function (graph, point, faces_matrix) {
  const transformed_points = faces_matrix
    .map(m => math.core.multiply_vector2_matrix2(point, m));
  return graph.faces_vertices
    .map((fv, i) => ({ face: fv.map(v => graph.vertices_coords[v]), i }))
    .filter((f, i) => math.core.intersection
      .point_in_poly(transformed_points[i], f.face))
    .map(f => f.i);
};

export const faces_containing_point = function (graph, point) {
  if (graph.vertices_coords == null || graph.vertices_coords.length === 0
    || graph.faces_vertices == null || graph.faces_vertices.length === 0) {
    return undefined;
  }
  return graph.faces_vertices
    .map((fv, i) => ({ face: fv.map(v => graph.vertices_coords[v]), i }))
    .filter(f => math.core.point_in_poly(point, f.face))
    .map(f => f.i);
};

/**
 * quick bounding box approach to find the two furthest points in a collection
 *
 */
export const two_furthest_points = function (points) {
  let top = [0, -Infinity];
  let left = [Infinity, 0];
  let right = [-Infinity, 0];
  let bottom = [0, Infinity];
  points.forEach((p) => {
    if (p[0] < left[0]) { left = p; }
    if (p[0] > right[0]) { right = p; }
    if (p[1] < bottom[1]) { bottom = p; }
    if (p[1] > top[1]) { top = p; }
  });
  // handle vertical and horizontal lines cases
  const t_to_b = Math.abs(top[1] - bottom[1]);
  const l_to_r = Math.abs(right[0] - left[0]);
  return t_to_b > l_to_r ? [bottom, top] : [left, right];
};


export const bounding_rect = function (graph) {
  if ("vertices_coords" in graph === false
    || graph.vertices_coords.length <= 0) {
    return [0, 0, 0, 0];
  }
  const dimension = graph.vertices_coords[0].length;
  const smallest = Array.from(Array(dimension)).map(() => Infinity);
  const largest = Array.from(Array(dimension)).map(() => -Infinity);
  graph.vertices_coords.forEach(v => v.forEach((n, i) => {
    if (n < smallest[i]) { smallest[i] = n; }
    if (n > largest[i]) { largest[i] = n; }
  }));
  const x = smallest[0];
  const y = smallest[1];
  const w = largest[0] - smallest[0];
  const h = largest[1] - smallest[1];
  return (isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h)
    ? [0, 0, 0, 0]
    : [x, y, w, h]);
};

// const bounding_cube = function (graph) {
// }

export const vertices_collinear = function (graph, vertices) {
  if (vertices == null) {
    vertices = Array.from(Array(graph.vertices_coords.length));
  }
  // returns n-sized array matching vertices_ length
  // T/F is a 2-degree vertex stuck between two collinear edges.
  return vertices.filter((vert) => {
    const edges = graph.edges_vertices
      .filter(ev => ev[0] === vert || ev[1] === vert);
    if (edges.length !== 2) { return false; }
    const a = edges[0][0] === vert ? edges[0][1] : edges[0][0];
    const b = edges[1][0] === vert ? edges[1][1] : edges[1][0];
    const av = math.core.distance2(graph.vertices_coords[a],
      graph.vertices_coords[vert]);
    const bv = math.core.distance2(graph.vertices_coords[b],
      graph.vertices_coords[vert]);
    const ab = math.core.distance2(graph.vertices_coords[a],
      graph.vertices_coords[b]);
    return Math.abs(ab - av - bv) < math.core.EPSILON;
  });
};
