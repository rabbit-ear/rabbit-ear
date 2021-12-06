/**
 * Rabbit Ear (c) Robby Kraft
 */
import math from "../../math";
import { invert_map } from "../../graph/maps";
import { make_faces_center } from "../../graph/make";
import validate_taco_pair_stack from "../validate_taco_pair_stack";
import matrix_to_layers from "./matrix_to_layers";

const edge_stack_layer_solver = ({
  vertices_coords, edges_vertices, edges_faces, faces_vertices
}, edges, matrix) => {
  // const folded_vertices_coords = make_vertices_coords_folded(graph, 0);
  const faces_center = make_faces_center({ vertices_coords, faces_vertices });
  // all edges should lie on top of one another, though, the vectors will
  // differ. get one edge for comparing sidedness (vector doesn't matter)
  const similar_edge_vertices = edges_vertices[edges[0]]
    .map(vertex => vertices_coords[vertex]);
  const edge_origin = similar_edge_vertices[0];
  const edge_vector = math.core
    .subtract(similar_edge_vertices[1], similar_edge_vertices[0]);

  const folded_edges_faces_pair_side = edges
    .map(edge => edges_faces[edge])
    .map(pair => pair
      .map(face => math.core
        .subtract(faces_center[face], edge_origin))
      .map(point => math.core.cross2(point, edge_vector))
      .map(side => side < 0 ? 1 : -1));

  const faces_pair = invert_map(edges
    .map(edge => edges_faces[edge]));

  const edges_objects = edges
    .map((edge, e) => {
      const sides = folded_edges_faces_pair_side[e];
      const taco = sides[0] === sides[1];
      return {
        edge,
        pair: e,
        faces: edges_faces[edge],
        left_taco: taco && sides[0] > 0,
        right_taco: taco && sides[0] <= 0,
        tortilla: !taco,
      };
    });

  // flat top level list of all faces involved
  const all_faces = edges
    .map(edge => edges_faces[edge])
    .reduce((a, b) => a.concat(b), []);

  const left_tacos = edges_objects.filter(el => el.left_taco);
  const right_tacos = edges_objects.filter(el => el.right_taco);
  const tortillas = edges_objects.filter(el => el.tortillas);
  const faces_left_taco = invert_map(left_tacos
      .map(el => el.faces)
      .reduce((a, b) => a.concat(b), []))
    .map(val => true);
  const faces_right_taco = invert_map(right_tacos
      .map(el => el.faces)
      .reduce((a, b) => a.concat(b), []))
    .map(val => true);

  // console.log("M: faces_pair", faces_pair);
  // console.log("M: folded_edges_faces_pair_side", folded_edges_faces_pair_side);
  // console.log("M: edges_objects", edges_objects);
  // console.log("M: left_tacos", left_tacos);
  // console.log("M: right_tacos", right_tacos);
  // console.log("M: tortillas", tortillas);
  // console.log("M: faces_left_taco", faces_left_taco);
  // console.log("M: faces_right_taco", faces_right_taco);
  // console.log("M: all_faces", all_faces);

  const validate_layers = (layers_face) => {
    const layers_right_tacos = layers_face
      .filter(face => faces_right_taco[face]);
    const layers_left_tacos = layers_face
      .filter(face => faces_left_taco[face]);
    const layers_pair = layers_face.map(face => faces_pair[face]);
    const right_taco_faces_pair = layers_right_tacos.map(face => faces_pair[face]);
    const left_taco_faces_pair = layers_left_tacos.map(face => faces_pair[face]);
    // console.log("right, left_taco_faces_pair", right_taco_faces_pair, left_taco_faces_pair);
    return validate_taco_pair_stack(right_taco_faces_pair)
      && validate_taco_pair_stack(left_taco_faces_pair);
  };

  // return recurse(matrix, all_faces);
  return matrix_to_layers(matrix, all_faces, [], validate_layers);
};

export default edge_stack_layer_solver;
