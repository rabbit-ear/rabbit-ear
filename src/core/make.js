import math from "../math";

// export const make_vertices_vertices = function (graph) {
// };

export const make_vertices_edges = function ({ edges_vertices }) {
  if (!edges_vertices) { return undefined; }
  const vertices_edges = [];
  edges_vertices.forEach((ev, i) => ev
    .forEach((v) => {
      if (vertices_edges[v] === undefined) {
        vertices_edges[v] = [];
      }
      vertices_edges[v].push(i);
    }));
  return vertices_edges;
};

// todo: make_edges_faces c-clockwise
export const make_edges_vertices = function ({
  edges_vertices, faces_edges
}) {
  if (!edges_vertices || !faces_edges) { return undefined; }
  const edges_faces = Array
    .from(Array(edges_vertices.length))
    .map(() => []);
  // todo: does not arrange counter-clockwise
  faces_edges.forEach((face, f) => {
    const hash = [];
    // use an intermediary hash to handle the case where faces visit one
    // vertex multiple times. otherwise there are redundant indices.
    face.forEach((edge) => { hash[edge] = f; });
    hash.forEach((fa, e) => edges_faces[e].push(fa));
  });
  return edges_faces;
};

// faces_faces is a set of faces edge-adjacent to a face. for every face.
export const make_faces_faces = function ({ faces_vertices }) {
  if (!faces_vertices) { return undefined; }
  const nf = faces_vertices.length;
  const faces_faces = Array.from(Array(nf)).map(() => []);
  const edgeMap = {};
  faces_vertices.forEach((vertices_index, idx1) => {
    if (vertices_index === undefined) { return; } // todo: necessary?
    const n = vertices_index.length;
    vertices_index.forEach((v1, i, vs) => {
      let v2 = vs[(i + 1) % n];
      if (v2 < v1) { [v1, v2] = [v2, v1]; }
      const key = `${v1} ${v2}`;
      if (key in edgeMap) {
        const idx2 = edgeMap[key];
        faces_faces[idx1].push(idx2);
        faces_faces[idx2].push(idx1);
      } else {
        edgeMap[key] = idx1;
      }
    });
  });
  return faces_faces;
};

export const make_edges_edges = function ({
  edges_vertices, vertices_edges
}) {
  if (!edges_vertices || !vertices_edges) { return undefined; }
  return edges_vertices.map((ev, i) => {
    const vert0 = ev[0];
    const vert1 = ev[1];
    const side0 = vertices_edges[vert0].filter(e => e !== i);
    const side1 = vertices_edges[vert1].filter(e => e !== i);
    return side0.concat(side1);
  });
};

// todo: make_edges_faces c-clockwise
export const make_edges_faces = function ({
  edges_vertices, faces_edges
}) {
  if (!edges_vertices || !faces_edges) { return undefined; }
  const edges_faces = Array
    .from(Array(edges_vertices.length))
    .map(() => []);
  // todo: does not arrange counter-clockwise
  faces_edges.forEach((face, f) => {
    const hash = [];
    // use an intermediary hash to handle the case where faces visit one
    // vertex multiple times. otherwise there are redundant indices.
    face.forEach((edge) => { hash[edge] = f; });
    hash.forEach((fa, e) => edges_faces[e].push(fa));
  });
  return edges_faces;
};

export const make_edges_length = function ({ vertices_coords, edges_vertices }) {
  if (!vertices_coords || !edges_vertices) { return undefined; }
  return edges_vertices
    .map(ev => ev.map(v => vertices_coords[v]))
    .map(edge => math.core.distance(...edge));
};

const assignment_angles = {
  M: -180,
  m: -180,
  V: 180,
  v: 180
};

export const make_edges_foldAngle = function ({ edges_assignment }) {
  if (!edges_assignment) { return undefined; }
  return edges_assignment.map(a => assignment_angles[a] || 0);
};

/**
 * for fast backwards lookup, this builds a dictionary with keys as vertices
 * that compose an edge "6 11" always sorted smallest to largest, with a space.
 * the value is the index of the edge.
 */
export const make_vertex_pair_to_edge_map = function ({ edges_vertices }) {
  if (!edges_vertices) { return {}; } // todo, should this return undefined?
  const map = {};
  edges_vertices
    .map(ev => ev.sort((a, b) => a - b).join(" "))
    .forEach((key, i) => { map[key] = i; });
  return map;
};

/**
 * build vertices_faces from faces_vertices
 */
export const make_vertices_faces = function ({
  vertices_coords, faces_vertices
}) {
  if (!vertices_coords || !faces_vertices) { return undefined; }
  const vertices_faces = Array.from(Array(vertices_coords.length))
    .map(() => []);
  faces_vertices.forEach((face, f) => {
    const hash = [];
    // use an intermediary hash to handle the case where faces visit one
    // vertex multiple times. otherwise there are redundant indices.
    face.forEach((vertex) => { hash[vertex] = f; });
    hash.forEach((fa, v) => vertices_faces[v].push(fa));
  });
  return vertices_faces;
};


// const faces_common_vertices = (graph, face0, face1) => graph
//   .faces_vertices[face0]
//   .filter(v => graph.faces_vertices[face1].indexOf(v) !== -1)

/**
 * get a pair of common vertices between faces.
 * but, maintain the order, according to face 1
 */
const faces_common_vertices = (face_a_vertices, face_b_vertices) => {
  const map = {};
  face_b_vertices.forEach((v) => { map[v] = true; });
  const match = face_a_vertices.map((v, i) => map[v]);
  if (match[0] && match[match.length-1]) {
    let start = match.length - 1;
    let end = 0;
    for (; start > 0; start -= 1) { if (!match[start]) { break; } }
    for (; end < match.length - 1; end += 1) { if (!match[end]) { break; } }
    // we have a situation where the vertices in common wrap around to index 0.
    // weird that every single vertex is in common, but avoid crashing anyway.
    if (start < end) { return face_a_vertices; }
    return face_a_vertices.slice(start + 1, face_a_vertices.length)
      .concat(face_a_vertices.slice(0, end));
  }
  return face_a_vertices.filter((_, i) => match[i]);
};
// test: faces_common_vertices([1,5,6,9,13], [16,9,6,4,2])
// should be [6, 9]

// root_face will become the root node
export const make_face_walk_tree = function (graph, root_face = 0) {
  const edge_map = make_vertex_pair_to_edge_map(graph);
  // console.log("edge_map", edge_map)
  const new_faces_faces = graph.faces_faces
    ? graph.faces_faces
    : make_faces_faces(graph);
  if (new_faces_faces.length <= 0) {
    return [];
  }
  let visited = [root_face];
  const list = [[{
    face: root_face,
    parent: undefined,
    edge: undefined,
    // level: 0,
  }]];
  // let current_level = 0;
  do {
    // current_level += 1;
    list[list.length] = list[list.length - 1].map((current) => {
      const unique_faces = new_faces_faces[current.face]
        .filter(f => visited.indexOf(f) === -1);
      visited = visited.concat(unique_faces);
      return unique_faces.map((f) => {
        const edge_vertices = faces_common_vertices(
          graph.faces_vertices[current.face],
          graph.faces_vertices[f]
        );
        // we cannot depend on faces being convex and only sharing 2 vertices in common. if there are more than 2 edges, let's hope they are collinear. either way, grab the first 2 vertices if there are more.
        const edge_key = edge_vertices
          .slice(0, 2)
          .sort((a, b) => a - b)
          .join(" ");
        const edge = edge_map[edge_key];
        return {
          face: f,
          parent: current.face,
          // level: current_level,
          edge,
          edge_vertices,
        };
      });
    }).reduce((prev, curr) => prev.concat(curr), []);
  } while (list[list.length - 1].length > 0);
  if (list.length > 0 && list[list.length - 1].length === 0) { list.pop(); }
  return list;
};

// /////////////////////////////////////////////
// MATRICES
// /////////////////////////////////////////////

const is_mark = (a => a === "f" || a === "F" || a === "u" || a === "U");

/**
 * This traverses an face-adjacency tree (edge-adjacent faces),
 * and recursively applies the affine transform that represents a fold
 * across the edge between the faces
 *
 * Flat/Mark creases are ignored!
 * the difference between the matrices of two faces separated by
 * a mark crease is the identity matrix.
 */
export const make_faces_matrix = function (graph, root_face) {
  // todo: make sure the graph contains necessary data:
  // vertices_coords, edges_foldAngle, edges_vertices, faces_vertices
  const faces_vertices_coords = graph.faces_vertices
    .map(fv => fv.map(v => graph.vertices_coords[v]));
  const faces_centroid = faces_vertices_coords
    .map(face_vertices => math.core.centroid(face_vertices));
  const faces_matrix = graph.faces_vertices.map(() => [1,0,0,0,1,0,0,0,1,0,0,0]);
  make_face_walk_tree(graph, root_face).forEach((level) => {
    level.filter(entry => entry.parent != null).forEach((entry) => {
      // const face_vector = math.core.resize(3, math.core.subtract(
      //   faces_centroid[entry.face],
      //   faces_centroid[entry.parent],
      // ));
      const verts = entry.edge_vertices.map(v => graph.vertices_coords[v]);
      // const edgeVecA = math.core.resize(3, math.core.subtract(verts[1], verts[0]));
      // const edgeVecB = math.core.resize(3, math.core.subtract(verts[0], verts[1]));
      // const vecTo0 = math.core.subtract(verts[0], faces_centroid[entry.parent]);
      // const vecTo1 = math.core.subtract(verts[1], faces_centroid[entry.parent]);
      // console.log("crosses", math.core.cross2(face_vector, vecTo0), math.core.cross2(face_vector, vecTo1));
      // const goodVec = math.core.cross2(face_vector, vecTo0) > 0
      //   ? edgeVecA
      //   : edgeVecB;
      // const goodOrigin = math.core.cross2(face_vector, vecTo0) > 0
      //   ? verts[0]
      //   : verts[1];
      const edge_foldAngle = graph.edges_foldAngle[entry.edge] / 180 * Math.PI;
      const axis_vector = math.core.resize(3, math.core.normalize(math.core.subtract(verts[1], verts[0])));
      const axis_origin = math.core.resize(3, verts[0]);
      // const local = math.core.make_matrix2_reflect(vec, verts[0]);
      const local = math.core.make_matrix3_rotate(
        edge_foldAngle, axis_vector, axis_origin,
      );
      faces_matrix[entry.face] = math.core
        .multiply_matrices3(faces_matrix[entry.parent], local);
    });
  });
  return faces_matrix;
};


export const make_faces_matrix_2D = function (graph, root_face) {
  if (graph.faces_vertices == null || graph.edges_vertices == null) {
    return undefined;
  }
  // if edge_orientations includes marks AND mountains/valleys,
  // then perform folds only along mountains and valleys
  // if edge_orientations doesn't exist, or only includes marks/borders,
  // then perform folds along all marks
  // let edge_fold = graph.edges_vertices.map(_ => true);
  const skip_marks = ("edges_assignment" in graph === true);
  const edge_fold = skip_marks
    ? graph.edges_assignment.map(a => !is_mark(a))
    : graph.edges_vertices.map(() => true);

  const faces_matrix = graph.faces_vertices.map(() => [1, 0, 0, 1, 0, 0]);
  make_face_walk_tree(graph, root_face).forEach((level) => {
    level.filter(entry => entry.parent != null).forEach((entry) => {
      const verts = entry.edge_vertices.map(v => graph.vertices_coords[v]);
      const vec = [verts[1][0] - verts[0][0], verts[1][1] - verts[0][1]];
      // const local = math.core.make_matrix2_reflect(vec, verts[0]);
      const local = edge_fold[entry.edge]
        ? math.core.make_matrix2_reflect(vec, verts[0])
        : [1, 0, 0, 1, 0, 0];
      faces_matrix[entry.face] = math.core
        .multiply_matrices2(faces_matrix[entry.parent], local);
    });
  });
  return faces_matrix;
};

/**
 * this same as make_faces_matrix, but at each step the
 * inverse matrix is taken
 */
export const make_faces_matrix_inv = function (graph, root_face) {
  const edge_fold = ("edges_assignment" in graph === true)
    ? graph.edges_assignment.map(a => !is_mark(a))
    : graph.edges_vertices.map(() => true);

  const faces_matrix = graph.faces_vertices.map(() => [1, 0, 0, 1, 0, 0]);
  make_face_walk_tree(graph, root_face).forEach((level) => {
    level.filter(entry => entry.parent != null).forEach((entry) => {
      const verts = entry.edge_vertices.map(v => graph.vertices_coords[v]);
      const vec = [verts[1][0] - verts[0][0], verts[1][1] - verts[0][1]];
      // const local = math.core.make_matrix2_reflect(vec, verts[0]);
      const local = edge_fold[entry.edge]
        ? math.core.make_matrix2_reflect(vec, verts[0])
        : [1, 0, 0, 1, 0, 0];
      faces_matrix[entry.face] = math.core
        .multiply_matrices2(local, faces_matrix[entry.parent]);
    });
  });
  return faces_matrix;
};

// todo: see if it's possible to code this without requiring faces_vertices
export const make_vertices_coords_folded = function (graph, face_stationary, faces_matrix) {
  if (graph.vertices_coords == null || graph.faces_vertices == null) { return undefined; }
  if (face_stationary == null) { face_stationary = 0; }
  if (faces_matrix == null) {
    faces_matrix = make_faces_matrix(graph, face_stationary);
  } else {
    // if faces_matrix is old and doesn't match the array lengths
    const face_array = graph.faces_vertices != null
      ? graph.faces_vertices : graph.faces_edges;
    const facesCount = face_array != null ? face_array.length : 0;
    if (faces_matrix.length !== facesCount) {
      faces_matrix = make_faces_matrix(graph, face_stationary);
    }
  }
  const vertex_in_face = graph.vertices_coords.map((v, i) => {
    for (let f = 0; f < graph.faces_vertices.length; f += 1) {
      if (graph.faces_vertices[f].includes(i)) { return f; }
    }
    // return undefined;
    return face_stationary;
  });
  return graph.vertices_coords.map((point, i) => math.core
    .multiply_matrix2_vector2(faces_matrix[vertex_in_face[i]], point)
    .map(n => math.core.clean_number(n)));
};

export const make_vertices_isBoundary = function (graph) {
  const vertices_edges = make_vertices_edges(graph);
  const edges_isBoundary = graph.edges_assignment
    .map(a => a === "b" || a === "B");
  return vertices_edges
    .map(edges => edges.map(e => edges_isBoundary[e])
      .reduce((a, b) => a || b, false));
};

/**
 * this face coloring skips marks joining the two faces separated by it.
 * it relates directly to if a face is flipped or not (determinant > 0)
 */
export const make_faces_coloring_from_faces_matrix = function (faces_matrix) {
  return faces_matrix
    .map(m => m[0] * m[3] - m[1] * m[2])
    .map(c => c >= 0);
};
/**
 * true/false: which face shares color with root face
 * the root face (and any similar-color face) will be marked as true
 */
export const make_faces_coloring = function (graph, root_face = 0) {
  const coloring = [];
  coloring[root_face] = true;
  make_face_walk_tree(graph, root_face)
    .forEach((level, i) => level
      .forEach((entry) => { coloring[entry.face] = (i % 2 === 0); }));
  return coloring;
};

// export const make_boundary_vertices = function (graph) {
//   const edges_vertices_b = graph.edges_vertices
//     .filter((ev, i) => graph.edges_assignment[i] === "B"
//       || graph.edges_assignment[i] === "b")
//     .map(arr => arr.slice());
//   if (edges_vertices_b.length === 0) { return []; }
//   // the index of keys[i] is an edge_vertex from edges_vertices_b
//   //  the [] value is the indices in edges_vertices_b this i appears
//   const keys = Array.from(Array(graph.vertices_coords.length)).map(() => []);
//   edges_vertices_b.forEach((ev, i) => ev.forEach(e => keys[e].push(i)));
//   let edgeIndex = 0;
//   const startVertex = edges_vertices_b[edgeIndex].shift();
//   let nextVertex = edges_vertices_b[edgeIndex].shift();
//   const vertices = [startVertex];
//   while (vertices[0] !== nextVertex) {
//     vertices.push(nextVertex);
//     const whichEdges = keys[nextVertex];
//     const thisKeyIndex = keys[nextVertex].indexOf(edgeIndex);
//     if (thisKeyIndex === -1) { return undefined; }
//     keys[nextVertex].splice(thisKeyIndex, 1);
//     const nextEdgeAndIndex = keys[nextVertex]
//       .map((el, i) => ({ key: el, i }))
//       .filter(el => el.key !== edgeIndex)
//       .shift();
//     if (nextEdgeAndIndex == null) { return undefined; }
//     keys[nextVertex].splice(nextEdgeAndIndex.i, 1);
//     edgeIndex = nextEdgeAndIndex.key;
//     const lastEdgeIndex = edges_vertices_b[edgeIndex].indexOf(nextVertex);
//     if (lastEdgeIndex === -1) { return undefined; }
//     edges_vertices_b[edgeIndex].splice(lastEdgeIndex, 1);
//     nextVertex = edges_vertices_b[edgeIndex].shift();
//   }
//   return vertices;
// };
