/**
 * Rabbit Ear (c) Robby Kraft
 */
import math from "../../math";
import { invert_map } from "../../graph/maps";
import { make_faces_center } from "../../graph/make";
import validate_taco_taco_face_pairs from "../tacos/validate_taco_taco_face_pairs";
import matrix_to_layers from "./matrix_to_layers";
import make_edges_tacos from "../tacos/make_edges_tacos";
/**
 * @param object with keys: left, right, both, where left and right are
 * tacos that face to a side, and both is a flat taco (tortilla).
 * where the value of each is an array of edges
 */
const edge_tacos_to_face_pairs = (graph, tacos) => {
  const faces_taco_pair = [];
  let offset = 0;
  let count = 0;
  const fn = (face, pair) => { faces_taco_pair[face] = pair + offset; count++; };
  [tacos.left, tacos.right, tacos.both]
  	.forEach(stack => {
  		stack.map(edge => graph.edges_faces[edge]).forEach((el, i) => el
		    .forEach(f => { faces_taco_pair[f] = i + offset; count++; }));
		  offset += count;
  	});
  return faces_taco_pair;
};
/**
 * @description convert a shared-edge taco stack (a list of edge indices)
 * into the faces adjacent to those edges, into a flat-array.
 */
const edge_tacos_to_faces_flat = (graph, tacos) => {
	return [tacos.left, tacos.right, tacos.both]
		.map(side => side.map(edge => graph.edges_faces[edge])
			.reduce((a, b) => a.concat(b), []))
		.reduce((a, b) => a.concat(b), []);
};
/**
 * 
 */
const make_edges_tacos_layers_faces = (graph, matrix, epsilon = 0.001) => {
	// the next few arrays will match in length.
	const edges_tacos = make_edges_tacos(graph, epsilon);
	// for each common overlapping edge, this array contains a map where
	// each face (index) is given a pair number (value)
  const tacos_face_pairs = edges_tacos
    .map(taco => edge_tacos_to_face_pairs(graph, taco));
  const validate_func = tacos_face_pairs
  	.map(pairs => (layers_face) => {
  		const pair_stack = layers_face
	      .map(face => pairs[face])
	      .filter(a => a !== undefined);
  		return validate_taco_taco_face_pairs(pair_stack);
  	});
  return edges_tacos
    .map(tacos => edge_tacos_to_faces_flat(graph, tacos))
  	.map((faces, i) => matrix_to_layers(matrix, faces, [], validate_func[i]));
};

export default make_edges_tacos_layers_faces;
