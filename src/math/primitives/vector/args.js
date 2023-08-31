/**
 * Math (c) Kraft
 */
import { getVector } from "../../general/get.js";

const VectorArgs = function () {
	this.push(...getVector(arguments));
};

export default VectorArgs;
