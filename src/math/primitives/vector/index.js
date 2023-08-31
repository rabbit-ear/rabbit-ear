/**
 * Math (c) Kraft
 */
/** n-dimensional vector, with some 3D and 2D-specific operations */
import A from "./args.js";
import G from "./getters.js";
import M from "./methods.js";
import S from "./static.js";

export default {
	vector: {
		P: Array.prototype, // vector is a special case, it's an instance of an Array
		A,
		G,
		M,
		S,
	},
};
