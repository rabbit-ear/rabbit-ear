import strip_solver from "./strip_solver";
import layer_assignment_solver from "./layer_assignment_solver";
import self_intersect from "./validate/self_intersect";
import * as fold_assignments from "./fold_assignments";
// import * as layer_matrix_methods from "./methods";
import get_splice_indices from "./get_splice_indices";
import walk_pleat_path from "./walk_pleat_path";
import flip_faces_layer from "./flip_faces_layer";

export default Object.assign(Object.create(null), {
	strip_solver,
	layer_assignment_solver,
	self_intersect,
	walk_pleat_path,
	flip_faces_layer,
	get_splice_indices,
},
	fold_assignments,
	// layer_matrix_methods,
);
