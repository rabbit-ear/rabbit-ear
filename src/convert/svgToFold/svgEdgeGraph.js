/**
 * Rabbit Ear (c) Kraft
 */
import window from "../../environment/window.js";
import { isNode } from "../../environment/detect.js";
import Messages from "../../environment/messages.js";
import svgNS from "../../svg/spec/namespace.js";
import {
	xmlStringToDOM,
	flattenDomTreeWithStyle,
} from "../../svg/general/dom.js";
import { transformStringToMatrix } from "../../svg/general/transforms.js";
import { cleanNumber } from "../../math/general/number.js";
import { multiplyMatrix2Vector2 } from "../../math/algebra/matrix2.js";
import parsers from "./parsers/index.js";
import {
	getEdgeAssignment,
	getEdgeFoldAngle,
} from "./edges.js";

const transformSegment = (segment, transform) => {
	const seg = [[segment[0], segment[1]], [segment[2], segment[3]]];
	if (!transform) { return seg; }
	const matrix = transformStringToMatrix(transform);
	return matrix
		? seg.map(p => multiplyMatrix2Vector2(matrix, p))
		: seg;
};
/**
 * @description This method will handle all of the SVG parsing
 * and result in a very simple graph representation basically
 * only containing line segments and their assignment/foldAngle.
 * The graph will not be planar (edges will overlap), no faces
 * will exist, and duplicate vertices will exist and need to
 * be merged
 * @param {Element|string} svg an SVG image as a DOM element
 * or a string.
 * @returns {FOLD} a FOLD representation of the SVG image.
 */
const svgEdgeGraph = (svg) => {
	const typeString = typeof svg === "string";
	const xml = typeString ? xmlStringToDOM(svg, "image/svg+xml") : svg;
	// get a flat array of all elements in the tree, with all
	// styles also flattened (nested transformed computed, for example)
	const elements = flattenDomTreeWithStyle(xml);

	// convert all elements <path> <rect> etc into arrays of line segments
	const segments = elements
		.filter(el => parsers[el.element.nodeName])
		.flatMap(el => parsers[el.element.nodeName](el.element)
			.map(segment => transformSegment(segment, el.attributes.transform))
			.map(segment => ({ ...el, segment })));

	// create an invisible SVG element, add the edges, then getComputedStyle
	const invisible = window().document.createElementNS(svgNS, "svg");
	// visibility: hidden causes the DOM window layout to resize
	invisible.setAttribute("display", "none");
	// invisible.setAttribute("visibility", "hidden");
	window().document.body.appendChild(invisible);
	invisible.appendChild(xml);

	const stylesheets = elements.filter(el => el.element.nodeName === "style");
	if (stylesheets.length && isNode) {
		console.warn(Messages.backendStylesheet);
	}

	// console.log("segments", segments);
	// const computedStyles = segments
	// 	.map(el => window().getComputedStyle(el.element));
	// const computedOpacities = computedStyles.map(style => style.opacity);
	// console.log("computedStyles", computedStyles);
	// console.log("computedOpacities", computedOpacities);
	// console.log("xml.parentNode", xml.parentNode);
	const edges_assignment = segments
		.map(el => getEdgeAssignment(el.element, el.attributes));
	const edges_foldAngle = segments.map((el, i) => getEdgeFoldAngle(
		el.element,
		el.attributes,
		edges_assignment[i],
	));
	// we no longer need computed style, remove invisible svg from DOM.
	invisible.parentNode.removeChild(invisible);
	const vertices_coords = segments
		.flatMap(el => el.segment)
		.map(coord => coord.map(n => cleanNumber(n, 14)));
	const edges_vertices = segments.map((_, i) => [i * 2, i * 2 + 1]);
	return {
		vertices_coords,
		edges_vertices,
		edges_assignment,
		edges_foldAngle,
	};
};

export default svgEdgeGraph;
