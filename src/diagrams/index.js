/**
 * Rabbit Ear (c) Kraft
 */
// import * as arrows from "./arrows";
import axiom_arrows from "./axiom_arrows.js";
import simple_arrow from "./simple_arrow.js";
/**
 * @description A collection of methods for drawing origami diagrams.
 */
export default Object.assign(
	Object.create(null),
	// arrows, {
	{
		axiom_arrows,
		simple_arrow,
	},
);
