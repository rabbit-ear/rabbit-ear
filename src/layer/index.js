/**
 * Rabbit Ear (c) Robby Kraft
 */
// top level
import flip_faces_layer from "./flip_faces_layer";
import single_vertex_assignment_solver from "./single_vertex_assignment_solver";
// strip solver
import strip_solver from "./strip_solver/index";
import taco_test from "./strip_solver/taco_test";
// layers relationships
import common_relationships from "./relationship/common_relationships";
import faces_layer_to_relationships from "./relationship/faces_layer_to_relationships";
import get_layer_violations from "./relationship/get_layer_violations";
import get_splice_indices from "./relationship/get_splice_indices";
import make_face_layer_matrix from "./relationship/make_face_layer_matrix";
import make_layers_face from "./relationship/make_layers_face";
import make_layers_face_permutations from "./relationship/make_layers_face_permutations";
import matrix_to_layers from "./relationship/matrix_to_layers";

import * as fold_assignments from "./fold_assignments";
import * as make_relationships from "./relationship/make_relationships";
import * as pleat_paths from "./relationship/pleat_paths";

export default Object.assign(Object.create(null), {
	flip_faces_layer,
	single_vertex_assignment_solver,

	strip_solver,
	taco_test,

	common_relationships,
	faces_layer_to_relationships,
	get_layer_violations,
	get_splice_indices,
	make_face_layer_matrix,
	make_layers_face,
	make_layers_face_permutations,
	matrix_to_layers,
},
	fold_assignments,
	make_relationships,
	pleat_paths,
);
