/**
 * Rabbit Ear (c) Kraft
 */
import { cleanNumber } from "../../general/number.js";
import {
	findEpsilonInObject,
	invertVertical,
} from "../general/options.js";
import planarizeGraph from "../general/planarizeGraph.js";
import makeEpsilon from "../general/makeEpsilon.js";
import { planarBoundary } from "../../graph/boundary.js";
import svgSegments from "./svgSegments.js";
import svgEdgeGraph from "./svgEdgeGraph.js";
import * as edgeParsers from "./edges.js";
/**
 * @description Convert an SVG to a FOLD object. This only works
 * with SVGs of crease patterns, this will not work
 * with an SVG of a folded form.
 * @param {string | SVGElement} file the SVG element as a
 * document element node, or as a string
 * @param {number | object} options an options object or an epsilon number
 * @returns {FOLD} a FOLD representation of the SVG
 */
const svgToFold = (file, options) => {
	const graph = svgEdgeGraph(file, options);
	const epsilon = findEpsilonInObject(graph, options);
	// if the user chooses, we can flip the y axis numbers.
	if (options && options.invertVertical && graph.vertices_coords) {
		invertVertical(graph.vertices_coords);
	}
	const planarGraph = planarizeGraph(graph, epsilon);
	// by default the parser will change numbers like 15.000000000001 into 15.
	// to turn this off, options.fast = true
	const fixNumber = options && options.fast ? n => n : cleanNumber;
	planarGraph.vertices_coords = planarGraph.vertices_coords
		.map(coord => coord.map(n => fixNumber(n, 12)));
	// optionally, discover the boundary by walking.
	if (typeof options !== "object" || options.boundary !== false) {
		// clear all previous boundary assignments and set them to flat.
		// this is because both flat and boundary were imported as black
		// colors (grayscale), so the assignment should go to the next in line.
		planarGraph.edges_assignment
			.map((_, i) => i)
			.filter(i => planarGraph.edges_assignment[i] === "B"
				|| planarGraph.edges_assignment[i] === "b")
			.forEach(i => { planarGraph.edges_assignment[i] = "F"; });
		const { edges } = planarBoundary(planarGraph);
		edges.forEach(e => { planarGraph.edges_assignment[e] = "B"; });
	}
	return {
		file_spec: 1.1,
		file_creator: "Rabbit Ear",
		frame_classes: ["creasePattern"],
		...planarGraph,
	};
};

Object.assign(svgToFold, {
	...edgeParsers,
	svgSegments,
	svgEdgeGraph,
	planarizeGraph,
	makeEpsilon,
});

export default svgToFold;
