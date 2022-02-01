import { boolean_matrix_to_unique_index_pairs } from "../../general/arrays";
import { make_faces_faces_overlap } from "../../graph/overlap";
import { make_faces_winding } from "../../graph/faces_winding";
/**
 * @description this is the initial step for building a set of conditions.
 * store the relationships between all adjacent faces, built from
 * the crease assignment of the edge between the pair of faces, taking into
 * consideration if a face has been flipped (clockwise winding).
 * @returns {object} keys are space-separated face pairs, like "3 17".
 * values are layer orientations, 0 (unknown) 1 (a above b) 2 (b above a).
 */
const make_conditions = (graph, overlap_matrix, faces_winding) => {
  if (!faces_winding) {
    faces_winding = make_faces_winding(graph);
  }
  if (!overlap_matrix) {
    overlap_matrix = make_faces_faces_overlap(graph);
  }
  const conditions = {};
  // flip 1 and 2 to be the other, leaving 0 to be 0.
  const flip = { 0:0, 1:2, 2:1 };
  // set all conditions (every pair of overlapping faces) initially to 0
  boolean_matrix_to_unique_index_pairs(overlap_matrix)
    .map(pair => pair.join(" "))
    .forEach(key => { conditions[key] = 0; });
  // neighbor faces determined by crease between them
  const assignment_direction = { M: 1, m: 1, V: 2, v: 2 };
  graph.edges_faces.forEach((faces, edge) => {
    // the crease assignment determines the order between pairs of faces.
    const assignment = graph.edges_assignment[edge];
    const local_order = assignment_direction[assignment];
    // skip boundary edges or edges with confusing assignments.
    if (faces.length < 2 || local_order === undefined) { return; }
    // face[0] is the origin face.
    // the direction of "m" or "v" will be inverted if face[0] is flipped.
    const upright = faces_winding[faces[0]];
    // now we know from a global perspective the order between the face pair.
    const global_order = upright ? local_order : flip[local_order];
    const key1 = `${faces[0]} ${faces[1]}`;
    const key2 = `${faces[1]} ${faces[0]}`;
    if (key1 in conditions) { conditions[key1] = global_order; }
    if (key2 in conditions) { conditions[key2] = flip[global_order]; }
  });
  return conditions;
};

export default make_conditions;
