/**
 * Rabbit Ear (c) Robby Kraft
 */
import {
  make_edges_edges_parallel,
  make_edges_edges_crossing,
} from "../../graph/edges_edges";
import make_groups_edges from "../../graph/make_groups_edges";
import { invert_map } from "../../graph/maps";
import {
  boolean_matrix_to_indexed_array,
  boolean_matrix_to_unique_index_pairs,
} from "../../general/arrays";
import matrix_to_layers_face from "../matrix/matrix_to_layers_face";
import get_splice_indices from "../matrix/get_splice_indices";
import make_edges_tacos from "../tacos/make_edges_tacos";
import make_edges_faces_overlap from "../../graph/make_edges_faces_overlap";
import validate from "./validate";

const make_layers_face = (graph, matrix, faces, epsilon = 0.001) => {
  const knowns = matrix.map(row => row
    .reduce((a, b) => a + (b === undefined ? 0 : 1)));
  const faces_sorted = matrix
    .map((_, i) => i)
    .sort((a, b) => knowns[b] - knowns[a]);
  // taco edges
  const edges_faces_tacos_pairs = make_edges_tacos(graph, epsilon)
    .map(taco => ({
      left: taco.left.map(e => graph.edges_faces[e]),
      right: taco.right.map(e => graph.edges_faces[e]),
      both: taco.both.map(e => graph.edges_faces[e]),
    }))
    .map(taco => [taco.left, taco.right]
      .map(invert_map)
      .filter(arr => arr.length > 1))
    .reduce((a, b) => a.concat(b), []);
  // crossing edges
  const edges_edges_crossing = make_edges_edges_crossing(graph);
  const crossing_edge_pairs = boolean_matrix_to_unique_index_pairs(edges_edges_crossing);
  const crossing_edge_face_pairs = crossing_edge_pairs
    .map(edges => edges
      .map(e => graph.edges_faces[e])
      .filter(faces => faces.length > 1))
    .filter(pairs => pairs.length > 1)
    .map(invert_map);
  const edges_faces_overlap = make_edges_faces_overlap(graph, epsilon);
  const edges_with_two_adjacent_faces = graph.edges_faces
    .map(faces => faces.length > 1);
  const edges_overlap_faces = boolean_matrix_to_indexed_array(edges_faces_overlap)
    .map((faces, e) => edges_with_two_adjacent_faces[e] ? faces : []);
  const edge_face_overlap_tacos = edges_overlap_faces.map((faces, e) => {
    const e_f = graph.edges_faces[e];
    return faces.map(face => invert_map([e_f, [face]]));
  }).reduce((a, b) => a.concat(b), []);
  // console.log("edge_tacos", edge_tacos);
  // console.log("edges_faces_tacos_pairs", edges_faces_tacos_pairs);
  // console.log("edges_edges_crossing", edges_edges_crossing);
  // console.log("crossing_edge_pairs", crossing_edge_pairs);
  // console.log("crossing_edge_face_pairs", crossing_edge_face_pairs);
  // console.log("edges_faces_overlap", edges_faces_overlap);
  // console.log("edges_overlap_faces", edges_overlap_faces);
  // console.log("edge_face_overlap_tacos", edge_face_overlap_tacos);

  const recurse = (faces, layers_face = []) => {
    if (!faces.length) { return layers_face; }
    const next_faces = faces.slice();
    const face = next_faces.shift();
    const layers_face_relative = layers_face.map(f => matrix[face][f]);
    const splice_indices = get_splice_indices(layers_face_relative);
    do {
      // const to_splice = splice_indices.shift();
      const to_splice = splice_indices
        .splice(Math.floor(splice_indices.length / 2), 1);
      // const to_splice = splice_indices[Math.floor(splice_indices.length / 2)];
      if (to_splice === undefined) { return undefined; }
      const next_layers_face = layers_face.slice();
      next_layers_face.splice(to_splice, 0, face);
      if (!validate(graph, next_layers_face, edges_faces_tacos_pairs, crossing_edge_face_pairs, edge_face_overlap_tacos)) {
        continue;
      }
      const res = recurse(next_faces, next_layers_face);
      if (res !== undefined) { return res; }
    } while (splice_indices.length);
    return undefined;
  };
  return recurse(faces_sorted);
};

export default make_layers_face;
