/**
 * Rabbit Ear (c) Kraft
 */
import * as arrayMethods from "./array.js";
import * as clusterMethods from "./cluster.js";
// import * as getMethods from "./get.js";
import * as numberMethods from "./number.js";
import * as sortMethods from "./sort.js";
import * as stringMethods from "./string.js";

export default {
	...arrayMethods,
	...clusterMethods,
	// ...getMethods,
	...numberMethods,
	...sortMethods,
	...stringMethods,
};
