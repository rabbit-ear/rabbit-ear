/**
 * Rabbit Ear (c) Kraft
 */
import {
	epsilonEqualVectors,
} from "../../../math/compare.js";
import {
	parsePathCommandsWithEndpoints,
} from "../../../svg/general/path.js";

const straightPathLines = {
	L: true, V: true, H: true, Z: true,
};

/**
 * @description convert an SVG path into segments
 * @param {Element} path an SVG path element
 * @returns {[number, number, number, number][]} a list of segments
 * in the form of 4 numbers (x1, y1, x2, y2)
 */
const PathToSegments = (path) => (
	parsePathCommandsWithEndpoints(path.getAttribute("d") || "")
		.filter(command => straightPathLines[command.command.toUpperCase()])
		.map(el => [el.start, el.end])
		.filter(([a, b]) => !epsilonEqualVectors(a, b))
		.map(([a, b]) => [a[0], a[1], b[0], b[1]])
);

export default PathToSegments;
