/**
 * Rabbit Ear (c) Kraft
 */
import { getLine } from "../general/get.js";
import GraphProto from "./graph.js";
import flatFold from "../graph/flatFold/index.js";
/**
 * @name Origami
 * @description A model of an origami paper with the intended functionality
 * to be used like an origami paper folding a traditional-style origami model,
 * where the piece is often in a flat-folded state.
 * Structurally, this is a FOLD object that manages the data and extends the
 * spec in a couple ways:
 * - the vertex data will be stored in unfolded (crease pattern) form,
 * from which the vertices in the folded form can be calculated
 * - frame_classes: will contain "foldedForm" and never contain "creasePattern"
 * - frame_attributes: will contain "2D"
 * - faces_matrix: every face has a 3x2 orientation matrix which describes
 * the location of the face's vertices in the foldedForm representation.
 * - faces_layer: a linear topological sorting of the layers in the +Z direction.
 *
 * The resulting data model is backwards compatible with the official FOLD spec.
 * @prototype Graph
 * @param {FOLD} [graph] an optional FOLD object
 * @linkcode Origami ./src/classes/origami.js 13
 */
const Origami = {};
Origami.prototype = Object.create(GraphProto);
Origami.prototype.constructor = Origami;

Origami.prototype.flatFold = function () {
	const changes = flatFold(this, getLine(arguments));
	return this;
};

export default Origami.prototype;
