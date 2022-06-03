/**
 * Rabbit Ear (c) Kraft
 */
// top level
// import flip_faces_layer from "./flip_faces_layer";
import make_faces_layer from "./make_faces_layer";
import make_faces_layers from "./make_faces_layers";
import flip_faces_layer from "./flip_faces_layer";
// global layer solver
import table from "./global_solver/table"
import * as global_layer_solvers from "./global_solver/index"
import * as general_global_solver from "./global_solver/general"
import * as edges_assignments from "./global_solver/edges_assignments"
import dividing_axis from "./global_solver/dividing_axis"
import topological_order from "./global_solver/topological_order";
import make_conditions from "./global_solver/make_conditions";
import conditions_to_matrix from "./global_solver/conditions_to_matrix";
// tacos
import make_tacos_tortillas from "./tacos/make_tacos_tortillas";
import make_folded_strip_tacos from "./tacos/make_folded_strip_tacos"
import make_transitivity_trios from "./tacos/make_transitivity_trios";
import * as tortilla_tortilla from "./tacos/tortilla_tortilla";
// single-vertex layer solver
import assignment_solver from "./single_vertex_solver/assignment_solver";
import single_vertex_solver from "./single_vertex_solver/index";
import validate_layer_solver from "./single_vertex_solver/validate_layer_solver";
import validate_taco_taco_face_pairs from "./single_vertex_solver/validate_taco_taco_face_pairs";
import validate_taco_tortilla_strip from "./single_vertex_solver/validate_taco_tortilla_strip";
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

// non-default level exports
import * as fold_assignments from "./single_vertex_solver/fold_assignments";
// import * as edges_crossing from "./matrix/edges_crossing";
// import * as relationships from "./matrix/relationships";
// import * as pleat_paths from "./matrix/pleat_paths";

export default Object.assign(Object.create(null), {
	make_faces_layer,
	make_faces_layers,
	flip_faces_layer,

	assignment_solver,
	single_vertex_solver,
	validate_layer_solver,
	validate_taco_taco_face_pairs,
	validate_taco_tortilla_strip,

	table,
	make_conditions,
	dividing_axis,
	topological_order,
	conditions_to_matrix,

	make_tacos_tortillas,
	make_folded_strip_tacos,
	make_transitivity_trios,
},
	global_layer_solvers,
	general_global_solver,
	edges_assignments,
	tortilla_tortilla,
	fold_assignments,
);
