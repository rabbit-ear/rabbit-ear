/**
 * Rabbit Ear (c) Kraft
 */
import math from "../math";
import GraphProto from "./graph";
import flat_fold from "../graph/flat_fold/index";
/**
 * Origami - a model of an origami paper
 * prototype is Graph
 */
const Origami = {};
Origami.prototype = Object.create(GraphProto);
Origami.prototype.constructor = Origami;

Origami.prototype.flatFold = function () {
	const line = math.core.get_line(arguments);
	const changes = flat_fold(this, line.vector, line.origin);
	return this;
};

export default Origami.prototype;
