/**
 * Rabbit Ear (c) Robby Kraft
 */
// single vertex
import maekawa_assignments from "./maekawa_assignments"
import fold_angles4 from "./fold_angles4";
import * as kawasaki from "./kawasaki";
import layer_solver from "./layer_solver/index";
import layer_assignment_solver from "./layer_assignment_solver";
// folded-state layer solver helper methods
import self_intersect from "./layer_solver/self_intersect";
import * as fold_assignments from "./layer_solver/fold_assignments";

export default Object.assign(Object.create(null), {
	maekawa_assignments,
	fold_angles4,
	layer_solver,
	layer_assignment_solver,
	self_intersect,
},
	kawasaki,
	fold_assignments,
);

