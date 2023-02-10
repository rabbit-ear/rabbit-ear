/**
 * Rabbit Ear (c) Kraft
 */
import math from "../math.js";
import GraphProto from "./graph.js";
import flatFold from "../graph/flatFold/index.js";
/**
 * @name Origami
 * @description A model of an origami paper. Empty parameter initialization
 * will create a single-face graph with a unit square boundary.
 * @prototype Graph
 * @param {FOLD} [graph] an optional FOLD object
 * @linkcode Origami ./src/classes/origami.js 13
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
