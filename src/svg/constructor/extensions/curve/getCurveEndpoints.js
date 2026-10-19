/* SVG (c) Kraft */
import { parsePathCommands } from "../../../general/path.js";

/**
 * Rabbit Ear (c) Kraft
 */

/**
 * @description Get the start and end points of a curve, the first point
 * of the first move command, and the last point of the first curve command.
 * @param {string} d the "d" attribute of a path
 * @returns {number[]} four numbers, the start and end points of the curve
 */
const getCurveEndpoints = (d) => {
	// get only the first Move and Curve commands
	const commands = parsePathCommands(d || "");
	const move = commands.find(({ command }) => command === "M" || command === "m");
	const curve = commands.find(({ command }) => command === "C" || command === "c");
	const start =
		move && move.values.length >= 2
			? [move.values[move.values.length - 2], move.values[move.values.length - 1]]
			: [0, 0];
	const end =
		curve && curve.values.length >= 2
			? [curve.values[curve.values.length - 2], curve.values[curve.values.length - 1]]
			: [0, 0];
	return [...start, ...end];
};

export { getCurveEndpoints as default };
