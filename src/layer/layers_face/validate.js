// /**
//  * Rabbit Ear (c) Kraft
//  */
// import validateTacoTacoFacePairs from "../tacos/validateTacoTacoFacePairs";
// import validate_crossing_edges_face_pairs from "../tacos/validate_crossing_edges_face_pairs";
// import validate_taco_tortilla_pairs from "../tacos/validate_taco_tortilla_pairs";

// const build_layers = (layers_face, faces_pair) => layers_face
// 	.map(f => faces_pair[f])
// 	.filter(a => a !== undefined);

// const valid_check = (graph, layers_face, edge_tacos_face_pairs, crossing_edge_face_pairs, edge_face_overlap_tacos) => {
// 	// taco-taco test
// 	for (let t = 0; t < edge_tacos_face_pairs.length; t++) {
// 		const pair_stack = build_layers(layers_face, edge_tacos_face_pairs[t]);
// 		if (!validateTacoTacoFacePairs(pair_stack)) { return false; }
// 	}
// 	// crossing edges test
// 	for (let e = 0; e < crossing_edge_face_pairs.length; e++) {
// 		const pair_stack = build_layers(layers_face, crossing_edge_face_pairs[e]);
// 		if (!validate_crossing_edges_face_pairs(pair_stack)) {
// 			return false;
// 		}
// 	}
// 	for (let e = 0; e < edge_face_overlap_tacos.length; e++) {
// 		const pair_stack = build_layers(layers_face, edge_face_overlap_tacos[e]);
// 		if (pair_stack.length < 3) { continue; }
// 		if (!validate_taco_tortilla_pairs(pair_stack)) {
// 			return false;
// 		}
// 	}
// 	return true;
// };

// export default valid_check;
