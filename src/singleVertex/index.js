/**
 * Rabbit Ear (c) Kraft
 */
// single vertex
import foldAngles4 from "./foldAngles4.js";
import * as kawasakiMath from "./kawasakiMath.js";
import * as kawasakiGraph from "./kawasakiGraph.js";
import * as maekawa from "./maekawa.js";
import * as validateSingleVertex from "./validate.js";
/**
 * @description A collection of operations done on single vertices
 * (one vertex in a graph typically surrounded by edges).
 */
export default Object.assign(
	Object.create(null),
	{
		foldAngles4,
	},
	kawasakiMath,
	kawasakiGraph,
	maekawa,
	validateSingleVertex,
);
