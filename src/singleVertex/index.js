/**
 * Rabbit Ear (c) Kraft
 */
// single vertex
import * as degree4 from "./degree4.js";
import * as foldable from "./foldable.js";
import * as kawasaki from "./kawasaki.js";
import * as maekawa from "./maekawa.js";
import * as validateSingleVertex from "./validate.js";
/**
 * @description A collection of operations done on single vertices
 * (one vertex in a graph typically surrounded by edges).
 */
export default {
	...degree4,
	...foldable,
	...kawasaki,
	...maekawa,
	...validateSingleVertex,
};
