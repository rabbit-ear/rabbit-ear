/**
 * Rabbit Ear (c) Kraft
 */
import * as degree4 from "./degree4.js";
import * as flatFoldable from "./flatFoldable.js";
import * as foldable from "./foldable.js";
import * as kawasaki from "./kawasaki.js";
import * as maekawa from "./maekawa.js";

/**
 * @description A collection of operations done on single vertices
 * (one vertex in a graph typically surrounded by edges).
 */
export default {
	...degree4,
	...flatFoldable,
	...foldable,
	...kawasaki,
	...maekawa,
};
