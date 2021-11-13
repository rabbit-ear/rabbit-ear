/**
 * Rabbit Ear (c) Robby Kraft
 */
// single vertex
import maekawa_assignments from "./maekawa_assignments"
// import sectors_layer from "./sectors_layer";
import vertex_faces_layer from "./vertex_faces_layer";
import vertices_faces_layer from "./vertices_faces_layer";
// todo: bring this back, mark it different than just layer_solver
// since it solves the crease assignments, too.
// import faces_layer_solver from "./faces_layer_solver"
import fold_angles4 from "./fold_angles4";
import * as kawasaki from "./kawasaki";
import layer_solver from "./layer_solver/index";
import self_intersect from "./layer_solver/self_intersect";
import * as fold_assignments from "./layer_solver/fold_assignments";

export default Object.assign(Object.create(null), {
	maekawa_assignments,
	vertex_faces_layer,
	vertices_faces_layer,
	layer_solver,
	// faces_layer_solver,
	self_intersect,
	fold_angles4,
},
	kawasaki,
	fold_assignments,
);

