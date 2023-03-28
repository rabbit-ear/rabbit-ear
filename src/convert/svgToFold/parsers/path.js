/**
 * Rabbit Ear (c) Kraft
 */
import {
	epsilonEqualVectors,
} from "../../../math/general/function.js";
import {
	parsePathCommandsWithEndpoints,
} from "../../../svg/general/path.js";

const straightPathLines = {
	L: true, V: true, H: true, Z: true,
};

const PathToSegments = (path) => (
	parsePathCommandsWithEndpoints(path.getAttribute("d") || "")
		.filter(command => straightPathLines[command.command.toUpperCase()])
		.map(el => [el.start, el.end])
		.filter(seg => !epsilonEqualVectors(...seg))
		.map(seg => seg.flat())
);

export default PathToSegments;
