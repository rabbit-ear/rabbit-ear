/**
 * Rabbit Ear (c) Robby Kraft
 */
import { make_vertices_to_edge_bidirectional } from "../make";
import { split_circular_array } from "../arrays";
/**
 * this must be done AFTER edges_vertices has been updated with the new edge.
 *
 * @param {object} FOLD graph
 * @param {number} the face that will be replaced by these 2 new
 * @param {number[]} vertices (in the face) that split the face into 2 sides
 */
const make_faces = ({ edges_vertices, faces_vertices, faces_edges, faces_faces }, face, vertices) => {
  // the indices of the two vertices inside the face_vertices array.
  // this is where we will split the face into two.
  const indices = vertices.map(el => faces_vertices[face].indexOf(el));
  const faces = split_circular_array(faces_vertices[face], indices)
    .map(fv => ({ faces_vertices: fv }));
  if (faces_edges) {
    // table to build faces_edges
    const vertices_to_edge = make_vertices_to_edge_bidirectional({ edges_vertices });
    faces.map(face => face.faces_vertices
        .map((fv, i, arr) => `${fv} ${arr[(i + 1) % arr.length]}`)
        .map(key => vertices_to_edge[key]))
      .forEach((face_edges, i) => { faces[i].faces_edges = face_edges; });
  }
  return faces;
};
/**
 * 
 */
const build_faces = (graph, face, vertices) => {
  // new face indices at the end of the list
  const faces = [0, 1].map(i => graph.faces_vertices.length + i);
  // construct new face data for faces_vertices, faces_edges
  // add them to the graph
  make_faces(graph, face, vertices)
    .forEach((face, i) => Object.keys(face)
      .forEach((key) => { graph[key][faces[i]] = face[key]; }));
  return faces;
};

export default build_faces;
