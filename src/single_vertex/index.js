/**
 * Rabbit Ear (c) Robby Kraft
 */
// single vertex
import maekawa_assignments from "./maekawa_assignments"
import fold_angles4 from "./fold_angles4";
import * as kawasaki_math from "./kawasaki_math";
import * as kawasaki_graph from "./kawasaki_graph";
import * as validate from "./validate";

export default Object.assign(Object.create(null), {
	maekawa_assignments,
	fold_angles4,
},
	kawasaki_math,
	kawasaki_graph,
	validate,
);

