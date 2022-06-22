/**
 * Rabbit Ear (c) Kraft
 */
import math from "../math";
import GraphProto from "./graph";
import flatFold from "../graph/flatFold/index";
/**
 * Origami - a model of an origami paper
 * prototype is Graph
 */
const Origami = {};
Origami.prototype = Object.create(GraphProto);
Origami.prototype.constructor = Origami;

Origami.prototype.flatFold = function () {
	const line = math.core.getLine(arguments);
	const changes = flatFold(this, line.vector, line.origin);
	return this;
};

export default Origami.prototype;
