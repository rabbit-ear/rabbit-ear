// import * as layer_matrix_methods from "./methods";
import faces_layer_to_flat_orders from "./faces_layer_to_flat_orders";
import flip_faces_layer from "./flip_faces_layer";
import get_common_orders from "./get_common_orders";
import get_layer_violations from "./get_layer_violations";
import get_splice_indices from "./get_splice_indices";
import layer_assignment_solver from "./layer_assignment_solver";
import layers_face_solver from "./layers_face_solver";
import make_layer_matrix from "./make_layer_matrix";
import make_layers_face from "./make_layers_face";
import self_intersect from "./validate/self_intersect";
import strip_solver from "./strip_solver";
import walk_pleat_path from "./walk_pleat_path";
import * as fold_assignments from "./fold_assignments";

export default Object.assign(Object.create(null), {
	faces_layer_to_flat_orders,
	flip_faces_layer,
	get_common_orders,
	get_layer_violations,
	get_splice_indices,
	layer_assignment_solver,
	layers_face_solver,
	make_layer_matrix,
	make_layers_face,
	self_intersect,
	strip_solver,
	walk_pleat_path,
},
	fold_assignments,
	// layer_matrix_methods,
);
