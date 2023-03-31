/**
 * Rabbit Ear (c) Kraft
 */
import makeEpsilon from "../general/makeEpsilon.js";
import planarizeGraph from "../general/planarizeGraph.js";
import svgEdgeGraph from "./svgEdgeGraph.js";
import { planarBoundary } from "../../graph/boundary.js";
import { findEpsilonInObject } from "../general/options.js";
import * as edgeParsers from "./edges.js";
/**
 * @description Convert an SVG to a FOLD object. This only works
 * with SVGs of crease patterns, this will not work
 * with an SVG of a folded form.
 * @param {string | SVGElement} svg the SVG element as a
 * document element node, or as a string
 * @param {number | object} options an options object or an epsilon number
 * @returns {FOLD} a FOLD representation of the SVG
 */
const svgToFold = (svg, options) => {
	const graph = svgEdgeGraph(svg, options);
	const epsilon = findEpsilonInObject(graph, options);
	const planarGraph = planarizeGraph(graph, epsilon);
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
	svgEdgeGraph,
	makeEpsilon,
	planarizeGraph,
});

export default svgToFold;
