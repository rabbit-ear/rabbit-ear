/**
 * Rabbit Ear (c) Kraft
 */
import window from "../../environment/window.js";
import Messages from "../../environment/messages.js";
import { isNode } from "../../environment/detect.js";
import {
	getRootParent,
	xmlStringToElement,
	flattenDomTree,
} from "../../svg/general/dom.js";
import {
	getEdgeStroke,
	getEdgeOpacity,
} from "./edges.js";
import flatSegments from "./flatSegments.js";
import invisibleParent from "./invisibleParent.js";
/**
 * @description does an Element contain a <style> as a child somewhere?
 * @returns {boolean}
 */
const containsStylesheet = (svgElement) => flattenDomTree(svgElement)
	.map(el => el.nodeName === "style")
	.reduce((a, b) => a || b, false);
/**
 * @description Given an SVG element (as a string or Element object),
 * Extract all straight lines from the SVG, including those inside of
 * complex path objects. Return the straight lines as a flat array with
 * additional attribute information.
 * @param {Element | string} svg an SVG image as a DOM element
 * or a string.
 * @returns {object[]} array of objects, one for each straight line segment
 * with these values:
 * - .element a pointer to the element that this segment comes from.
 * - .attributes the attributes of the element as a Javascript object.
 *    this includes those which were inherited from its parents
 * - .segment a pair of vertices, the endpoints of the segment.
 * - .data two "data-" attributes representing assignment and foldAngle.
 * - .stroke the stroke attribute taken from getComputedStyle if possible.
 * - .opacity the opacity attribute taken from getComputedStyle if possible.
 */
const svgSegments = (svg) => {
	const svgElement = typeof svg === "string"
		? xmlStringToElement(svg, "image/svg+xml")
		: svg;

	if (containsStylesheet(svgElement) && isNode) {
		console.warn(Messages.backendStylesheet);
	}
	// ensure the svg is a child of the DOM so we can call getComputedStyle.
	// If the element is already a child of the HTML document, do nothing.
	const parent = getRootParent(svgElement) === window().document
		? undefined
		: invisibleParent(svgElement);

	const segments = flatSegments(svgElement);
	segments.map(el => ({
		data: {
			assignment: el.attributes["data-assignment"],
			foldAngle: el.attributes["data-foldAngle"],
		},
		stroke: getEdgeStroke(el.element, el.attributes),
		opacity: getEdgeOpacity(el.element, el.attributes),
	})).forEach((addition, i) => {
		segments[i] = {
			...segments[i],
			...addition,
		};
	});

	// we no longer need computed style, remove invisible svg from DOM.
	if (parent && parent.parentNode) {
		parent.parentNode.removeChild(parent);
	}

	return segments;
};

export default svgSegments;
