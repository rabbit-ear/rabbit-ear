import math from "../math";
import implied from "./count_implied";

// export const make_vertices_vertices = function (graph) {
// };

/**
 * @param {object} FOLD object, with entry "edges_vertices"
 * @returns {number[][]} array of array of numbers. each index is a vertex with
 *   the content an array of numbers, edge indices this vertex is adjacent.
 */
export const make_vertices_edges = ({ edges_vertices }) => {
  // if (!edges_vertices) { return undefined; }
  const vertices_edges = [];
  // iterate over edges_vertices and swap the index for each of the contents
  // each edge (index 0: [3, 4]) will be converted into (index 3: [0], index 4: [0])
  // repeat. append to each array.
  edges_vertices.forEach((ev, i) => ev
    .forEach((v) => {
      if (vertices_edges[v] === undefined) {
        vertices_edges[v] = [];
      }
      vertices_edges[v].push(i);
    }));
  return vertices_edges;
};
/**
 * build vertices_faces from faces_vertices
 */
export const make_vertices_faces = ({ faces_vertices }) => {
  // if (!faces_vertices) { return undefined; }
  // instead of initializing the array ahead of time (we would need to know
  // the length of something like vertices_coords)
  const vertices_faces = Array
    .from(Array(implied.vertices({ faces_vertices })))
    .map(() => []);
  // iterate over every face, then iterate over each of the face's vertices
  faces_vertices.forEach((face, f) => {
    // in the case that one face visits the same vertex multiple times,
    // this hash acts as an intermediary, basically functioning like a set,
    // and only allow one occurence of each vertex index.
    const hash = [];
    face.forEach((vertex) => { hash[vertex] = f; });
    hash.forEach((fa, v) => vertices_faces[v].push(fa));
  });
  return vertices_faces;
};
/**
 * for fast backwards lookup, this builds a dictionary with keys as vertices
 * that compose an edge "6 11" always sorted smallest to largest, with a space.
 * the value is the index of the edge.
 */
export const make_vertex_pair_to_edge_map = ({ edges_vertices }) => {
  // if (!edges_vertices) { return {}; } // todo, should this return undefined?
  const map = {};
  edges_vertices
    .map(ev => ev.sort((a, b) => a - b).join(" "))
    .forEach((key, i) => { map[key] = i; });
  return map;
};
/**
 * @param {object} FOLD object, with entries "edges_vertices", "vertices_edges".
 * @returns {number[][]} each entry relates to an edge, each array contains indices
 *   of other edges that are vertex-adjacent.
 * @description edges_edges are vertex-adjacent edges. make sure to call
 *   make_vertices_edges before calling this.
 */
export const make_edges_edges = ({ edges_vertices, vertices_edges }) =>
  edges_vertices.map((verts, i) => {
    const side0 = vertices_edges[verts[0]].filter(e => e !== i);
    const side1 = vertices_edges[verts[1]].filter(e => e !== i);
    return side0.concat(side1);
  });
  // if (!edges_vertices || !vertices_edges) { return undefined; }

// todo: make_edges_faces c-clockwise
export const make_edges_faces = ({ edges_vertices, faces_edges }) => {
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

const assignment_angles = { M: -180, m: -180, V: 180, v: 180 };

export const make_edges_foldAngle = ({ edges_assignment }) => edges_assignment
  .map(a => assignment_angles[a] || 0);
//  if (!edges_assignment) { return undefined; }

/**
 * @param {object} FOLD object, with "vertices_coords", "edges_vertices"
 * @returns {number[]} the Euclidean distance between each edge's vertices.
 */
export const make_edges_length = ({ vertices_coords, edges_vertices }) =>
  edges_vertices
    .map(ev => ev.map(v => vertices_coords[v]))
    .map(edge => math.core.distance(...edge));
  // if (!vertices_coords || !edges_vertices) { return undefined; }
/**
 * @param {object} FOLD object, with entry "faces_vertices"
 * @returns {number[][]} each index relates to a face, each entry is an array
 *   of numbers, each number is an index of an edge-adjacent face to this face.
 * @description faces_faces is a list of edge-adjacent face indices for each face.
 */
export const make_faces_faces = ({ faces_vertices }) => {
  // if (!faces_vertices) { return undefined; }
  const faces_faces = faces_vertices.map(() => []);
  // create a map where each key is a string of the vertices of an edge,
  // like "3 4"
  // and each value is an array of faces adjacent to this edge. 
  const edgeMap = {};
  faces_vertices.forEach((vertices_index, idx1) => {
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

// const face_face_shared_vertices = (graph, face0, face1) => graph
//   .faces_vertices[face0]
//   .filter(v => graph.faces_vertices[face1].indexOf(v) !== -1)

/**
 * @param {number[]}, list of vertex indices. one entry from faces_vertices
 * @param {number[]}, list of vertex indices. one entry from faces_vertices
 * @returns {number[]}, indices of vertices that are shared between faces
 *  and keep the vertices in the same order as the winding order of face a.
 */
export const face_face_shared_vertices = (face_a_vertices, face_b_vertices) => {
  // build a quick lookup table: T/F is a vertex in face B
  const hash = {};
  face_b_vertices.forEach((v) => { hash[v] = true; });
  // make a copy of face A containing T/F, if the vertex is shared in face B
  const match = face_a_vertices.map((v, i) => ({i, m: hash[v]}));
  // filter and keep only the shared vertices.
  // before we filter the array we just need to cover the special case that
  // the shared edge starts near the end of the array and wraps around
  let no = match.length - 1;
  while (no > -1 && match[no].m === true) { no -= 1; }
  if (no === -1) { return face_a_vertices; } // all face A vertices are in B
  // "no" is the index of a not-shared vertex. split the array here,
  // move the end to the front, filter out the non-shared vertices.
  return match.slice(no + 1, match.length)
    .concat(match.slice(0, no))
    .filter(el => el.m)
    .map(el => face_a_vertices[el.i]);
};

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
        const edge_vertices = face_face_shared_vertices(
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
  const faces_matrix = graph.faces_vertices.map(() => math.core.identity3x4);
  make_face_walk_tree(graph, root_face).forEach((level) => {
    level.filter(entry => entry.parent != null).forEach((entry) => {
      const verts = entry.edge_vertices.map(v => graph.vertices_coords[v]);
      const local_matrix = math.core.make_matrix3_rotate(
        graph.edges_foldAngle[entry.edge] / 180 * Math.PI, // rotation angle
        math.core.subtract(verts[1], verts[0]), // line-vector
        verts[0], // line-origin
      );
      faces_matrix[entry.face] = math.core
        .multiply_matrices3(faces_matrix[entry.parent], local_matrix);
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
export const make_faces_matrix_2d_inv = function (graph, root_face) {
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
