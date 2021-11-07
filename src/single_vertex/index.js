/**
 * Rabbit Ear (c) Robby Kraft
 */
// import math from "../math";
// single vertex
import maekawa_assignments from "./maekawa_assignments"
// import sectors_layer from "./sectors_layer";
import faces_layer from "./faces_layer/index";
import sectors_layer from "./sectors_layer/index";
import layer_solver from "./layer_solver"
import fold_angles4 from "./fold_angles4";
import * as kawasaki from "./kawasaki";
import * as fold_assignments from "./sectors_layer/fold_assignments";

export default Object.assign(Object.create(null), {
	maekawa_assignments,
	faces_layer,
	sectors_layer,
	layer_solver,
	fold_angles4,
},
	kawasaki,
	fold_assignments,
);

