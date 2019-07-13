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
export const vertices_count = function (graph) {
  return max_array_length([], graph.vertices_coords,
    graph.vertices_faces, graph.vertices_vertices);
};

export const edges_count = function (graph) {
  return max_array_length([], graph.edges_vertices, graph.edges_faces);
};

export const faces_count = function (graph) {
  return max_array_length([], graph.faces_vertices, graph.faces_edges);
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
 *
 * todo: improve with space partitioning
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
  // return graph.edges_vertices
  //   .map(e => e.map(ev => graph.vertices_coords[ev]))
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
  const nearest_points = graph.edges_vertices
    .map(e => e.map(ev => graph.vertices_coords[ev]))
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

export const faces_containing_point = function ({ vertices_coords, faces_vertices }, point) {
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

export const bounding_rect = function (graph) {
  if ("vertices_coords" in graph === false
    || graph.vertices_coords.length <= 0) {
    return [0, 0, 0, 0];
  }
  const dimension = graph.vertices_coords[0].length;
  const min = Array(dimension).fill(Infinity);
  const max = Array(dimension).fill(-Infinity);
  graph.vertices_coords.forEach(v => v.forEach((n, i) => {
    if (n < min[i]) { min[i] = n; }
    if (n > max[i]) { max[i] = n; }
  }));
  return (isNaN(min[0]) || isNaN(min[1]) || isNaN(max[0]) || isNaN(max[1])
    ? [0, 0, 0, 0]
    : [min[0], min[1], max[0] - min[0], max[1] - min[1]]);
};

/**
 * get the boundary face defined in vertices and edges by walking boundary
 * edges, defined by edges_assignment. no planar calculations
 */
export const get_boundary = function (graph) {
  const edges_vertices_b = graph.edges_assignment
    .map(a => a === "B" || a === "b");
  const vertices_edges = make_vertices_edges(graph);
  const edge_walk = [];
  const vertex_walk = [];
  let edgeIndex = -1;
  for (let i = 0; i < edges_vertices_b.length; i += 1) {
    if (edges_vertices_b[i]) { edgeIndex = i; break; }
  }
  if (edgeIndex === -1) {
    return { vertices: [], edges: [] };
  }
  edges_vertices_b[edgeIndex] = false;
  edge_walk.push(edgeIndex);
  vertex_walk.push(graph.edges_vertices[edgeIndex][0]);
  let nextVertex = graph.edges_vertices[edgeIndex][1];
  while (vertex_walk[0] !== nextVertex) {
    vertex_walk.push(nextVertex);
    edgeIndex = vertices_edges[nextVertex]
      .filter(v => edges_vertices_b[v])
      .shift();
    if (graph.edges_vertices[edgeIndex][0] === nextVertex) {
      [, nextVertex] = graph.edges_vertices[edgeIndex];
    } else {
      [nextVertex] = graph.edges_vertices[edgeIndex];
    }
    edges_vertices_b[edgeIndex] = false;
    edge_walk.push(edgeIndex);
  }
  return {
    vertices: vertex_walk,
    edges: edge_walk,
  };
};


// const bounding_cube = function (graph) {
// }

/**
 * @returns an array of degree-2 vertices which lie between
 * two parallel edges. typically useful for removing these vertices and
 * merging the two edges into one.
 */
export const get_collinear_vertices = function (graph) {
  const vertices_edges = make_vertices_edges(graph);
  return Array.from(Array(vertices_count(graph)))
    .map((_, i) => i)
    .filter(() => vertices_edges.length === 2)
    .map((vert) => {
      const edges = vertices_edges[vert];
      const a = edges[0][0] === vert ? edges[0][1] : edges[0][0];
      const b = edges[1][0] === vert ? edges[1][1] : edges[1][0];
      const av = math.core.distance2(graph.vertices_coords[a],
        graph.vertices_coords[vert]);
      const bv = math.core.distance2(graph.vertices_coords[b],
        graph.vertices_coords[vert]);
      const ab = math.core.distance2(graph.vertices_coords[a],
        graph.vertices_coords[b]);
      return Math.abs(ab - av - bv) < math.core.EPSILON ? vert : undefined;
    })
    .filter(a => a !== undefined);
};

/**
 * note: for speed, this determines vertex-degree via. edges_vertices
 * this is expecting graphs that define faces also define edges
 */
export const get_isolated_vertices = function (graph) {
  // const vertices_size = vertices_count(graph);
  const vertices_size = graph.vertices_coords.length;
  const isolated = Array(vertices_size).fill(true);
  // early exit when all vertices have been set
  let set_count = vertices_size; // how many vertices we set. counts down
  for (let i = 0; i < graph.edges_vertices.length && set_count > 0; i += 1) {
    for (let e = 0; e < graph.edges_vertices[i].length; e += 1) { // two vertices in each edge
      const v = graph.edges_vertices[i][e];
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

/**
 * this does not return an array of edge indices [4,7,12] like you might expect
 * instead it returns an array whose length matches edges_ array length and is
 * mostly empty (in cases of few duplicates), [ EMPTYx8, 4, EMPTYx9, 12], if
 * an index is filled, that index is duplicate, its contents is the index of
 * its duplicate counterpart, the one which should take its place.
 */
export const get_duplicate_edges = function (graph) {
  const equivalent2 = function (a, b) {
    return (a[0] === b[0] && a[1] === b[1])
        || (a[0] === b[1] && a[1] === b[0]);
  };

  const edges_equivalent = Array.from(Array(edges_count(graph)))
    .map(() => []);
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
