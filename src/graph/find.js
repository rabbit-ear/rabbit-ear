/**
 * Rabbit Ear (c) Robby Kraft
 */
/**
 * @description given an edge, uncover the adjacent faces
 * @param {object} FOLD graph
 * @param {number} index of the edge in the graph
 * {number[]} indices of the two vertices making up the edge
 * @returns {number[]} array of 0, 1, or 2 numbers, the edge's adjacent faces
 */
export const find_adjacent_faces_to_edge = ({ vertices_faces, edges_vertices, edges_faces, faces_edges, faces_vertices }, edge) => {
  if (edges_faces && edges_faces[edge]) {
    return edges_faces[edge];
  }
  // if that doesn't exist, uncover the data by looking at our incident
  // vertices' faces, compare every index against every index, looking
  // for 2 indices that are present in both arrays. there should be 2.
  const vertices = edges_vertices[edge];
  if (vertices_faces !== undefined) {
    const faces = [];
    for (let i = 0; i < vertices_faces[vertices[0]].length; i += 1) {
      for (let j = 0; j < vertices_faces[vertices[1]].length; j += 1) {
        if (vertices_faces[vertices[0]][i] === vertices_faces[vertices[1]][j]) {
          faces.push(vertices_faces[vertices[0]][i]);
        }
      }
    }
    return faces;
  }
  if (faces_edges) {
    let faces = [];
    for (let i = 0; i < faces_edges.length; i += 1) {
      for (let e = 0; e < faces_edges[i].length; e += 1) {
        if (faces_edges[i][e] === edge) { faces.push(i); }
      }
    }
    return faces;
  }
  if (faces_vertices) {
    console.warn("todo: find_adjacent_faces_to_edge");
    // let faces = [];
    // for (let i = 0; i < faces_vertices.length; i += 1) {
    //   for (let v = 0; v < faces_vertices[i].length; v += 1) {
    //   }
    // }
  }
};

export const find_adjacent_faces_to_face = ({ vertices_faces, edges_faces, faces_edges, faces_vertices, faces_faces }, face) => {
  console.log("INSIDE", faces_faces, faces_faces[face]);
  if (faces_faces && faces_faces[face]) {
    return faces_faces[face];
  }
  console.warn("todo: find_adjacent_faces_to_face");
};
