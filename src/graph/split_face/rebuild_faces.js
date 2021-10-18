import remove from "../remove";
import {
  make_vertices_to_edge_bidirectional,
} from "../make";
import { split_circular_array } from "../arrays";
import { FACES } from "../fold_keys";

/**
 * this must be done AFTER edges_vertices has been updated with the new edge.
 *
 * @param {object} FOLD graph
 * @param {number} the face that will be replaced by these 2 new
 * @param {number[]} vertices (in the face) that split the face into 2 sides
 */
const make_faces = ({ edges_vertices, faces_vertices, faces_faces }, face, vertices) => {
  // table to build faces_edges
  const vertices_to_edge = make_vertices_to_edge_bidirectional({ edges_vertices });
  // inside our face's faces_vertices, get index location of our new vertices
  // this helps us build both faces_vertices and faces_edges arrays
  // update: now only to build faces_vertices. edges comes from a lookup table
  const indices = vertices
    .map(el => faces_vertices[face].indexOf(el));
  return split_circular_array(faces_vertices[face], indices)
    .map(face_vertices => ({
      faces_vertices: face_vertices,
      faces_edges: face_vertices
        .map((fv, i, arr) => `${fv} ${arr[(i + 1) % arr.length]}`)
        .map(key => vertices_to_edge[key])
    }));
};
/**
 * 
 */
const rebuild_faces = (graph, face, vertices) => {
  // new face indices at the end of the list are preemptively off by -1
  // to compensate for the old face which will soon be removed.
  const faces = [0, 1].map(i => graph.faces_vertices.length + i - 1);
  // construct data for our new geometry: 2 faces (faces_vertices, faces_edges)
  const new_faces = make_faces(graph, face, vertices);
  // calling remove() on "faces" will delete this entry (this face is
  // the face being removed), we need to cache it by making a deep copy
  const face_faces_before_remove = graph.faces_faces
    ? JSON.parse(JSON.stringify(graph.faces_faces[face]))
    : undefined;
  // remove our face before we add any new faces to the graph so that the
  // face map reflects the state of the graph before faces were added
  const faces_map = remove(graph, FACES, [face]);
  faces_map[face] = faces;
  // update the faces_faces entry from earlier to their current indices.
  const face_faces = face_faces_before_remove.map(f => faces_map[f]);
  // add the 2 new faces to the graph, their faces_vertices and faces_edges,
  // skipping any key that isn't already a part of the graph.
  new_faces.forEach((new_face, i) => Object.keys(new_face)
    .filter(key => graph[key] !== undefined)
    .forEach((key) => { graph[key][faces[i]] = new_face[key]; }));
  return {
    map: faces_map,
    new: faces,
    remove: face,
  };
};

export default rebuild_faces;
