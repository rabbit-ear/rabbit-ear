/**
 * Rabbit Ear (c) Kraft
 */
import makeEpsilon from "../general/makeEpsilon.js";
import planarizeGraph from "../general/planarizeGraph.js";
import svgEdgeGraph from "./svgEdgeGraph.js";
import { planarBoundary } from "../../graph/boundary.js";
/**
 * @description Convert an SVG to a FOLD object. This only works
 * with SVGs of crease patterns, this will not work
 * with an SVG of a folded form.
 * @param {string | SVGElement} svg the SVG element as a
 * document element node, or as a string
 * @returns {FOLD} a FOLD representation of the SVG
 */
const svgToFold = (svg, epsilon) => {
	const graph = svgEdgeGraph(svg);
	const eps = typeof epsilon === "number"
		? epsilon
		: makeEpsilon(graph);
	const planarGraph = planarizeGraph(graph, eps);
	// optionally, discover the boundary by walking.
	const { edges } = planarBoundary(planarGraph);
	edges.forEach(e => { planarGraph.edges_assignment[e] = "B"; });
	return {
		file_spec: 1.1,
		file_creator: "Rabbit Ear",
		frame_classes: ["creasePattern"],
		...planarGraph,
	};
};

Object.assign(svgToFold, {
	svgEdgeGraph,
	makeEpsilon,
	planarizeGraph,
});

export default svgToFold;
