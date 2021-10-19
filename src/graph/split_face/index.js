/**
 * Rabbit Ear (c) Robby Kraft
 */
import rebuild_edge from "./rebuild_edge";
import build_faces from "./build_faces";
import split_at_intersections from "./split_at_intersections";
import {
  update_vertices_vertices,
  update_vertices_edges,
  update_vertices_faces,
  update_edges_faces,
  update_faces_faces,
} from "./update";
import { intersect_convex_face_line } from "../intersect_faces";
import remove from "../remove";
import { FACES } from "../fold_keys";
/**
 * @description divide a CONVEX face into two polygons with a straight line cut.
 * if the line ends exactly along existing vertices, they will be
 * used, otherwise, new vertices will be added (splitting edges).
 * @param {object} FOLD object, modified in place
 * @param {number} index of face to split
 * @param {number[]} the vector component describing the cutting line
 * @param {number[]} the point component describing the cutting line
 * @returns {object | undefined} a summary of changes to the FOLD object,
 *  or undefined if no change (no intersection).
 */
const split_convex_face = (graph, face, vector, point, epsilon) => {
  // survey face for any intersections which cross directly over a vertex
  const intersect = intersect_convex_face_line(graph, face, vector, point, epsilon);
  // if no intersection exists, return undefined.
  if (intersect === undefined) { return undefined; }
  // this result will be appended to (vertices, edges) and returned by this method.
  const result = split_at_intersections(graph, intersect);
  // this modifies the graph by only adding an edge between existing vertices
  result.edges.new = rebuild_edge(graph, face, result.vertices)
  // update all changes to vertices and edges (anything other than faces).
  update_vertices_vertices(graph, result.edges.new);
  update_vertices_edges(graph, result.edges.new);
  // done: vertices_coords, vertices_edges, vertices_vertices, edges_vertices
  // at this point the graph is once again technically valid, except
  // the face data is a little weird as one face is ignoring the newly-added
  // edge that cuts through it.
  const faces = build_faces(graph, face, result.vertices);
  // update all arrays having to do with face data
  update_vertices_faces(graph, face, faces);
  update_edges_faces(graph, face, result.edges.new, faces);
  update_faces_faces(graph, face, faces);
  // remove old data
  const faces_map = remove(graph, FACES, [face]);
  // the graph is now complete, however our return object needs updating.
  // shift our new face indices since these relate to the graph before remove().
  faces.forEach((_, i) => { faces[i] = faces_map[faces[i]]; });
  // we had to run "remove" with the new faces added. to return the change info,
  // we need to adjust the map to exclude these faces.
  faces_map.splice(-2);
  // replace the "undefined" in the map with the two new edge indices.
  faces_map[face] = faces;
  result.faces = {
    map: faces_map,
    new: faces,
    remove: face,
  };
  return result;
};

export default split_convex_face;
