/**
 * Rabbit Ear (c) Kraft
 */
import math from "../math";
import GraphProto from "./graph";
import flatFold from "../graph/flatFold/index";
/**
 * @name Origami
 * @description A model of an origami paper. Empty parameter initialization will
 * create a single-face graph with a unit square boundary.
 * @prototype Graph
 * @param {FOLD} [graph] an optional FOLD object
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
