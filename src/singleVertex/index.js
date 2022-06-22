/**
 * Rabbit Ear (c) Kraft
 */
// single vertex
import maekawaAssignments from "./maekawaAssignments"
import foldAngles4 from "./foldAngles4";
import * as kawasakiMath from "./kawasakiMath";
import * as kawasakiGraph from "./kawasakiGraph";
import * as validateSingleVertex from "./validate";
/**
 * @description A collection of operations done on single vertices
 * (one vertex in a graph typically surrounded by edges).
 */

export default Object.assign(Object.create(null), {
	maekawaAssignments,
	foldAngles4,
},
	kawasakiMath,
	kawasakiGraph,
	validateSingleVertex,
);

