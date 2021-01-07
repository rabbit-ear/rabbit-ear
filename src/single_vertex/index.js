// import math from "../math";
// single vertex
import maekawa_assignments from "./maekawa_assignments"
import sectors_layer from "./sectors_layer";
import layer_solver from "./layer_solver"
import fold_angles4 from "./fold_angles4";
import * as kawasaki from "./kawasaki";

export default Object.assign(Object.create(null), {
	maekawa_assignments,
	sectors_layer,
	layer_solver,
	fold_angles4,
},
	kawasaki,
);

