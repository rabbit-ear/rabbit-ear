import math from "../../include/math";
import { make_vertices_edges } from "./make";



/**
 * provide arrays as arguments, this will filter out anything undefined
 * @returns {number} length of the longest array
 */
const max_array_length = function (...arrays) {
  return Math.max(...(arrays
    .filter(el => el !== undefined)
    .map(el => el.length)));
};

/* Get the number of vertices, edges, faces in the graph sourcing only their
 * primary key arrays. in the case of abstract graphs, use "implied" functions
 * @returns {number} number of geometry elements
 */
export const vertices_count = function ({
  vertices_coords, vertices_faces, vertices_vertices
}) {
  return max_array_length([], vertices_coords,
    vertices_faces, vertices_vertices);
};

export const edges_count = function ({
  edges_vertices, edges_faces
}) {
  return max_array_length([], edges_vertices, edges_faces);
};

export const faces_count = function ({
  faces_vertices, faces_edges
}) {
  return max_array_length([], faces_vertices, faces_edges);
};

/* Get the number of vertices, edges, faces by searching their relative arrays
 * useful for abstract graphs where "vertices" aren't defined but still exist
 * @returns {number} number of geometry elements
 */
export const implied_vertices_count = function ({
  faces_vertices, edges_vertices
}) {
  let max = 0;
  [faces_vertices, edges_vertices]
    .filter(a => a !== undefined)
    .forEach(arr => arr
      .forEach(el => el
        .forEach((e) => {
          if (e > max) { max = e; }
        })));
  return max;
};

export const implied_edges_count = function ({
  faces_edges, vertices_edges, edgeOrders
}) {
  let max = 0;
  [faces_edges, vertices_edges]
    .filter(a => a !== undefined)
    .forEach(arr => arr
      .forEach(el => el
        .forEach((e) => {
          if (e > max) { max = e; }
        })));
  if (edgeOrders !== undefined) {
    edgeOrders.forEach(eo => eo.forEach((e, i) => {
      // exception. index 2 is orientation, not index
      if (i !== 2 && e > max) { max = e; }
    }));
  }
  return max;
};

export const implied_faces_count = function ({
  vertices_faces, edges_faces, facesOrders
}) {
  let max = 0;
  [vertices_faces, edges_faces]
    .filter(a => a !== undefined)
    .forEach(arr => arr
      .forEach(el => el
        .forEach((f) => {
          if (f > max) { max = f; }
        })));
  if (facesOrders !== undefined) {
    facesOrders.forEach(fo => fo.forEach((f, i) => {
      // exception. index 2 is orientation, not index
      if (i !== 2 && f > max) { max = f; }
    }));
  }
  return max;
};

/**
 * @returns index of nearest vertex in vertices_ arrays or
 * this is the only one of the nearest_ functions that works in 3-dimensions
 *
 * todo: improve with space partitioning
 */
export const nearest_vertex = function ({ vertices_coords }, point) {
  if (vertices_coords === undefined
    || vertices_coords.length === 0) {
    return undefined;
  }
  const p = [...point];
  if (p[2] == null) { p[2] = 0; }
  return vertices_coords
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
    .map(e => [e[0], [e[1][0] - e[0][0], e[1][1] - e[0][1]]])
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

export const folded_faces_containing_point = function ({
  vertices_coords, faces_vertices
}, point, faces_matrix) {
  const transformed_points = faces_matrix
    .map(m => math.core.multiply_matrix2_vector2(m, point));
  return faces_vertices
    .map((fv, i) => ({ face: fv.map(v => vertices_coords[v]), i }))
    .filter((f, i) => math.core.intersection
      .point_in_poly(transformed_points[i], f.face))
    .map(f => f.i);
};

// export const faces_containing_point = function (graph, point) {
//   if (graph.vertices_coords == null || graph.vertices_coords.length === 0
//     || graph.faces_vertices == null || graph.faces_vertices.length === 0) {
//     return undefined;
//   }
//   return graph.faces_vertices
//     .map((fv, i) => ({ face: fv.map(v => graph.vertices_coords[v]), i }))
//     .filter(f => math.core.point_in_poly(point, f.face))
//     .map(f => f.i);
// };

export const faces_containing_point = function ({
  vertices_coords, faces_vertices
}, point) {
  return faces_vertices
    .map((fv, i) => ({ face: fv.map(v => vertices_coords[v]), i }))
    .filter(f => math.core.point_in_poly(point, f.face))
    .map(f => f.i);
};

/**
 * someday this will implement facesOrders. right now just faces_re:layer
 * leave faces_options empty to search all faces
 *
 * faces is an array of indices: [1, 6, 9, 15]
 */
export const topmost_face = function (graph, faces) {
  if (faces == null) {
    faces = Array.from(Array(faces_count(graph)))
      .map((_, i) => i);
  }
  if (faces.length === 0) { return undefined; }
  if (faces.length === 1) { return faces[0]; }
  // top to bottom
  const faces_in_order = graph["faces_re:layer"]
    .map((layer, i) => ({ layer, i }))
    .sort((a, b) => b.layer - a.layer)
    .map(el => el.i);
  for (let i = 0; i < faces_in_order.length; i += 1) {
    if (faces.includes(faces_in_order[i])) {
      return faces_in_order[i];
    }
  }
  return undefined;
};

/**
 * @returns an array of degree-2 vertices which lie between
 * two parallel edges. typically useful for removing these vertices and
 * merging the two edges into one.
 */
// @param graph {edges_vertices, vertices_coords}
export const get_collinear_vertices = function ({
  edges_vertices, vertices_coords
}) {
  const vertices_edges = make_vertices_edges({ edges_vertices });
  return Array.from(Array(vertices_coords.length))
    .map((_, i) => i)
    .filter(() => vertices_edges.length === 2)
    .map((v) => {
      const edges = vertices_edges[v];
      const a = edges[0][0] === v ? edges[0][1] : edges[0][0];
      const b = edges[1][0] === v ? edges[1][1] : edges[1][0];
      const av = math.core.distance2(vertices_coords[a], vertices_coords[v]);
      const bv = math.core.distance2(vertices_coords[b], vertices_coords[v]);
      const ab = math.core.distance2(vertices_coords[a], vertices_coords[b]);
      return Math.abs(ab - av - bv) < math.core.EPSILON ? v : undefined;
    })
    .filter(a => a !== undefined);
};

/**
 * note: for speed, this determines vertex-degree via. edges_vertices
 * this is expecting graphs that define faces also define edges
 */
export const get_isolated_vertices = function ({
  edges_vertices, vertices_coords
}) {
  // const vertices_size = vertices_count(graph);
  const vertices_size = vertices_coords.length;
  const isolated = Array(vertices_size).fill(true);
  // early exit when all vertices have been set
  let set_count = vertices_size; // how many vertices we set. counts down
  for (let i = 0; i < edges_vertices.length && set_count > 0; i += 1) {
    for (let e = 0; e < edges_vertices[i].length; e += 1) { // two vertices in each edge
      const v = edges_vertices[i][e];
      if (isolated[v]) {
        set_count -= 1;
        isolated[v] = false;
      }
    }
  }
  if (set_count === 0) { return []; }
  return isolated
    .map((el, i) => (el ? i : undefined))
    .filter(el => el !== undefined);
};

export const get_duplicate_vertices = function ({ vertices_coords }) {
  const vertices_equivalent = Array.from(Array(vertices_coords.length))
    .map(() => []);
  for (let i = 0; i < vertices_coords.length - 1; i += 1) {
    for (let j = i + 1; j < vertices_coords.length; j += 1) {
      vertices_equivalent[i][j] = math.core.equivalent_vectors(
        vertices_coords[i],
        vertices_coords[j]
      );
    }
  }
  // for every duplicate edge, get the index of the other edge, and in the
  // case of many in common duplicates, go as far back (lowest index)
  const vertices_map = vertices_coords.map(() => undefined);
  vertices_equivalent
    .forEach((row, i) => row
      .forEach((eq, j) => {
        if (eq) {
          vertices_map[j] = vertices_map[i] === undefined ? i : vertices_map[i];
        }
      }));
  const vertices_remove = vertices_map.map(m => m !== undefined);
  vertices_map.forEach((map, i) => {
    if (map === undefined) { vertices_map[i] = i; }
  });

  return vertices_remove
    .map((rm, i) => (rm ? i : undefined))
    .filter(i => i !== undefined);
};

/**
 * this does not return an array of edge indices [4,7,12] like you might expect
 * instead it returns an array whose length matches edges_ array length and is
 * mostly empty (in cases of few duplicates), [ EMPTYx8, 4, EMPTYx9, 12], if
 * an index is filled, that index is duplicate, its contents is the index of
 * its duplicate counterpart, the one which should take its place.
 */
export const get_duplicate_edges = function ({ edges_vertices }) {
  const equivalent2 = function (a, b) {
    return (a[0] === b[0] && a[1] === b[1])
        || (a[0] === b[1] && a[1] === b[0]);
  };
  const edges_equivalent = Array.from(Array(edges_vertices.length))
    .map(() => []);
  for (let i = 0; i < edges_vertices.length - 1; i += 1) {
    for (let j = i + 1; j < edges_vertices.length; j += 1) {
      edges_equivalent[i][j] = equivalent2(
        edges_vertices[i],
        edges_vertices[j]
      );
    }
  }
  // for every duplicate edge, get the index of the other edge, and in the
  // case of many in common duplicates, go as far back (lowest index)
  const edges_map = [];
  edges_equivalent
    .forEach((row, i) => row
      .forEach((eq, j) => {
        if (eq) {
          edges_map[j] = edges_map[i] === undefined ? i : edges_map[i];
        }
      }));
  return edges_map;
};

// this one does work the way you'd expect
export const get_duplicate_edges_old = function (graph) {
  const equivalent2 = function (a, b) {
    return (a[0] === b[0] && a[1] === b[1])
        || (a[0] === b[1] && a[1] === b[0]);
  };
  const edges_equivalent = Array
    .from(Array(graph.edges_vertices.length)).map(() => []);
  for (let i = 0; i < graph.edges_vertices.length - 1; i += 1) {
    for (let j = i + 1; j < graph.edges_vertices.length; j += 1) {
      edges_equivalent[i][j] = equivalent2(
        graph.edges_vertices[i],
        graph.edges_vertices[j],
      );
    }
  }
  // for every duplicate edge, get the index of the other edge, and in the
  // case of many in common duplicates, go as far back (lowest index)
  const edges_map = graph.edges_vertices.map(() => undefined);
  edges_equivalent
    .forEach((row, i) => row
      .forEach((eq, j) => {
        if (eq) {
          edges_map[j] = edges_map[i] === undefined ? i : edges_map[i];
        }
      }));
  const edges_remove = edges_map.map(m => m !== undefined);
  edges_map.forEach((map, i) => {
    if (map === undefined) { edges_map[i] = i; }
  });

  return edges_remove
    .map((rm, i) => (rm ? i : undefined))
    .filter(i => i !== undefined);
};


/**
 * when an edge sits inside a face with its endpoints collinear to face edges,
 *  find those 2 face edges.
 * @param [[x, y], [x, y]] edge
 * @param [a, b, c, d, e] face_vertices. just 1 face. not .fold array
 * @param vertices_coords from .fold
 * @return [[a,b], [c,d]] vertices indices of the collinear face edges.
 *         1:1 index relation to edge endpoints.
 */
export const find_collinear_face_edges = function (edge, face_vertices,
  vertices_coords) {
  const face_edge_geometry = face_vertices
    .map(v => vertices_coords[v])
    .map((v, i, arr) => [v, arr[(i + 1) % arr.length]]);
  return edge.map((endPt) => {
    // filter collinear edges to each endpoint, return first one
    // as an edge array index, which == face vertex array between i, i+1
    const i = face_edge_geometry
      .map((edgeVerts, edgeI) => ({ index: edgeI, edge: edgeVerts }))
      .filter(e => math.core.intersection
        .point_on_edge(e.edge[0], e.edge[1], endPt))
      .shift()
      .index;
    return [face_vertices[i], face_vertices[(i + 1) % face_vertices.length]]
      .sort((a, b) => a - b);
  });
};
