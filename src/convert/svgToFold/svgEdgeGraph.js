/**
 * Rabbit Ear (c) Kraft
 */
import { isNode } from "../../environment/detect.js";
import window from "../../environment/window.js";
import Messages from "../../environment/messages.js";
import {
	getRootParent,
	xmlStringToElement,
	flattenDomTree,
} from "../../svg/general/dom.js";
import { cleanNumber } from "../../math/general/number.js";
import { getEdgesAttributes } from "./edges.js";
import invisibleParent from "./invisibleParent.js";
import flatSegments from "./flatSegments.js";
/**
 *
 */
const containsStylesheet = (svgElement) => flattenDomTree(svgElement)
	.map(el => el.nodeName === "style")
	.reduce((a, b) => a || b, false);
/**
 * @description ensure the element is a child of the HTML document by
 * creating an invisible parent element and append this element.
 * If the element is already a child of the HTML document, do nothing.
 * @returns {Element | undefined} the parent element in the case
 * of a parent being created, or nothing if not.
 */
const appendToDocumentIfNeeded = (element) => (
	getRootParent(element) === window().document
		? undefined
		: invisibleParent(element)
);
/**
 * @description This method will handle all of the SVG parsing
 * and result in a very simple graph representation basically
 * only containing line segments and their assignment/foldAngle.
 * The graph will not be planar (edges will overlap), no faces
 * will exist, and duplicate vertices will exist and need to
 * be merged
 * @param {Element | string} svg an SVG image as a DOM element
 * or a string.
 * @returns {FOLD} a FOLD representation of the SVG image.
 */
const svgEdgeGraph = (svg, options) => {
	const svgElement = typeof svg === "string"
		? xmlStringToElement(svg, "image/svg+xml")
		: svg;

	if (containsStylesheet(svgElement) && isNode) {
		console.warn(Messages.backendStylesheet);
	}

	const segments = flatSegments(svgElement);

	// ensure the svg is a child of the DOM so we can call getComputedStyle
	// if this was unnecessary, "parent" will be undefined
	const parent = appendToDocumentIfNeeded(svgElement);

	const {
		edges_assignment,
		edges_foldAngle,
	} = getEdgesAttributes(segments, options);

	// we no longer need computed style, remove invisible svg from DOM.
	if (parent && parent.parentNode) {
		parent.parentNode.removeChild(parent);
	}
	// by default the parser will change numbers 15.000000000001 into 15.
	// to turn this off, options.fast = true
	const fixNumber = options && options.fast ? n => n : cleanNumber;
	const vertices_coords = segments
		.flatMap(el => el.segment)
		.map(coord => coord.map(n => fixNumber(n, 12)));
	const edges_vertices = segments.map((_, i) => [i * 2, i * 2 + 1]);
	return {
		vertices_coords,
		edges_vertices,
		edges_assignment,
		edges_foldAngle,
	};
};

export default svgEdgeGraph;
