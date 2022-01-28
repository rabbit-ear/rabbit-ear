/**
 * Rabbit Ear (c) Robby Kraft
 */
import { make_edges_edges_crossing } from "../../graph/edges_edges";
import { invert_map } from "../../graph/maps";
import {
  boolean_matrix_to_indexed_array,
  boolean_matrix_to_unique_index_pairs,
} from "../../general/arrays";
import get_splice_indices from "../matrix/get_splice_indices";
import make_edges_tacos from "../tacos/make_edges_tacos";
import make_edges_faces_overlap from "../../graph/make_edges_faces_overlap";
import validate from "./validate";

const layers_face_solver = (graph, matrix, epsilon = 0.001) => {
  const knowns = matrix.map(row => row
    .reduce((a, b) => a + (b === undefined ? 0 : 1)));
  const faces_sorted = matrix
    .map((_, i) => i)
    .sort((a, b) => knowns[b] - knowns[a]);
  // taco-taco
  // for every folded edge location, grab the left and right tacos only,
  // flatten them up to the top level. tortillas will be tested later.
  const edges_faces_tacos_pairs = make_edges_tacos(graph, epsilon)
    .map(taco => [taco.left, taco.right]
      .map(arr => arr.map(e => graph.edges_faces[e]))
      .map(invert_map)
      .filter(arr => arr.length > 1))
    .reduce((a, b) => a.concat(b), []);
  // taco-tortillas overlap
  const edges_faces_overlap = make_edges_faces_overlap(graph, epsilon);
  const edges_with_two_adjacent_faces = graph.edges_faces
    .map(faces => faces.length > 1);
  const edges_overlap_faces = boolean_matrix_to_indexed_array(edges_faces_overlap)
    .map((faces, e) => edges_with_two_adjacent_faces[e] ? faces : []);
  const edge_face_overlap_tacos = edges_overlap_faces.map((faces, e) => {
    const e_f = graph.edges_faces[e];
    return faces.map(face => invert_map([e_f, [face]]));
  }).reduce((a, b) => a.concat(b), []);
  // crossing edges
  const edges_edges_crossing = make_edges_edges_crossing(graph);
  const crossing_edge_pairs = boolean_matrix_to_unique_index_pairs(edges_edges_crossing);
  const crossing_edge_face_pairs = crossing_edge_pairs
    .map(edges => edges
      .map(e => graph.edges_faces[e])
      .filter(faces => faces.length > 1))
    .filter(pairs => pairs.length > 1)
    .map(invert_map);
  // console.log("edge_tacos", edge_tacos);
  // console.log("edges_faces_tacos_pairs", edges_faces_tacos_pairs);
  // console.log("edges_edges_crossing", edges_edges_crossing);
  // console.log("crossing_edge_pairs", crossing_edge_pairs);
  // console.log("crossing_edge_face_pairs", crossing_edge_face_pairs);
  // console.log("edges_faces_overlap", edges_faces_overlap);
  // console.log("edges_overlap_faces", edges_overlap_faces);
  // console.log("edge_face_overlap_tacos", edge_face_overlap_tacos);
  const recurse = (faces, layers_face = []) => {
    if (!faces.length) { return [{layers_face}]; }
    const next_faces = faces.slice();
    const face = next_faces.shift();
    const layers_face_relative = layers_face.map(f => matrix[face][f]);
    const splice_indices = get_splice_indices(layers_face_relative);
    return splice_indices.map(splice_index => {
      const next_layers_face = layers_face.slice();
      next_layers_face.splice(splice_index, 0, face);
      if (!validate(graph, next_layers_face, edges_faces_tacos_pairs, crossing_edge_face_pairs, edge_face_overlap_tacos)) {
        return undefined;
      }
      return recurse(next_faces, next_layers_face)
        .reduce((a, b) => a.concat(b), [])
    });
  };
  return recurse(faces_sorted)
    .shift()
    .filter(a => a !== undefined)
    .map(el => el.layers_face);
};

export default layers_face_solver;
