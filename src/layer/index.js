/**
 * Rabbit Ear (c) Robby Kraft
 */
// top level
// import flip_faces_layer from "./flip_faces_layer";
// single-vertex layer solver
import assignment_solver from "./single_vertex_solver/assignment_solver";
import single_vertex_solver from "./single_vertex_solver/index";
import validate_layer_solver from "./single_vertex_solver/validate_layer_solver";
// layers_face
// import make_layers_face from "./layers_face/make_layers_face";
// import make_layers_faces from "./layers_face/make_layers_faces";
// layer relationship matrix
// import get_layer_violations from "./matrix/get_layer_violations";
// import get_splice_indices from "./matrix/get_splice_indices";
// import make_edges_tacos_layers_faces from "./matrix/make_edges_tacos_layers_faces";
// import make_face_layer_matrix from "./matrix/make_face_layer_matrix";
// import matrix_to_layers_face from "./matrix/matrix_to_layers_face";
// import matrix_to_layers from "./matrix/matrix_to_layers";

// global layer solver
import table from "./global_solver/table"
import * as global_layer_solvers from "./global_solver/index"

// tacos
import make_tacos_tortillas from "./tacos/make_tacos_tortillas";
import make_folded_strip_tacos from "./tacos/make_folded_strip_tacos"
import make_transitivity_trios from "./tacos/make_transitivity_trios";
import * as tortilla_tortilla from "./tacos/tortilla_tortilla";
// import validate_crossing_edges_face_pairs from "./tacos/validate_crossing_edges_face_pairs"
// import validate_taco_taco_face_pairs from "./tacos/validate_taco_taco_face_pairs"
// import validate_taco_tortilla_pairs from "./tacos/validate_taco_tortilla_pairs"
// import validate_taco_tortilla_strip from "./tacos/validate_taco_tortilla_strip"
// non-default level exports
import * as fold_assignments from "./single_vertex_solver/fold_assignments";
// import * as edges_crossing from "./matrix/edges_crossing";
// import * as relationships from "./matrix/relationships";
// import * as pleat_paths from "./matrix/pleat_paths";

export default Object.assign(Object.create(null), {
	// flip_faces_layer,

	assignment_solver,
	single_vertex_solver,
	validate_layer_solver,

	// make_layers_face,
	// make_layers_faces,

	// get_layer_violations,
	// get_splice_indices,
	// make_edges_tacos_layers_faces,
	// make_face_layer_matrix,
	// matrix_to_layers_face,
	// matrix_to_layers,

	table,
	// make_edges_tacos,
	make_tacos_tortillas,
	make_folded_strip_tacos,
	make_transitivity_trios,
	// validate_crossing_edges_face_pairs,
	// validate_taco_taco_face_pairs,
	// validate_taco_tortilla_pairs,
	// validate_taco_tortilla_strip,
},
	global_layer_solvers,
	fold_assignments,
	tortilla_tortilla,
	// edges_crossing,
	// relationships,
	// pleat_paths,
);
