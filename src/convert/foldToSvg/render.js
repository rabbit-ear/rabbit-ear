/**
 * Rabbit Ear (c) Kraft
 */
import SVG from "../../svg/index.js";
import * as S from "../../general/strings.js";
import {
	findElementTypeInParents,
	addClass,
} from "../../general/dom.js";
import { boundingBox } from "../../graph/boundary.js";
import {
	boundingBoxToViewBox,
	getStrokeWidth,
} from "./general.js";
import draw from "./draw/index.js";
/**
 *
 */
const DEFAULT_CIRCLE_RADIUS = 1 / 50;
const unitBounds = { min: [0, 0], span: [1, 1] };
const groupNames = [S._boundaries, S._faces, S._edges, S._vertices];
/**
 * @description given a group assumed to contain only circle elements,
 * set the "r" attribute on all circles.
 */
const setR = (group, radius) => {
	for (let i = 0; i < group.childNodes.length; i += 1) {
		group.childNodes[i].setAttributeNS(null, "r", radius);
	}
};
/**
 * @description a subroutine of render(). there are style properties which
 * are impossible to set universally, because they are dependent upon the input
 * FOLD object (imagine, FOLD within 1x1 square, and FOLD within 600x600).
 * this includes:
 * - "viewBox": calculate the viewBox to fit the 2D bounds of the graph.
 * - "padding": padding incorporated into the viewBox, as a scale of the vmax.
 * - "stroke-width": as a scale of the vmax.
 * - "radius": the radius of the vertices (circles), as a scale of the vmax.
 */
const applyTopLevelOptions = (element, groups, graph, options) => {
	const hasVertices = groups[3] && groups[3].childNodes.length;
	if (!(options.strokeWidth || options.viewBox || hasVertices)) { return; }
	const box = boundingBox(graph) || unitBounds;
	const vmax = Math.max(...box.span);
	const svgElement = findElementTypeInParents(element, "svg");
	if (svgElement && options.viewBox) {
		const viewBoxValue = boundingBoxToViewBox(box);
		svgElement.setAttributeNS(null, "viewBox", viewBoxValue);
	}
	if (svgElement && options.padding) {
		const viewBoxString = svgElement.getAttribute("viewBox");
		if (viewBoxString != null) {
			const pad = options.padding * vmax;
			const viewBox = viewBoxString.split(" ").map(n => parseFloat(n));
			const newViewBox = [-pad, -pad, pad * 2, pad * 2]
				.map((nudge, i) => viewBox[i] + nudge)
				.join(" ");
			svgElement.setAttributeNS(null, "viewBox", newViewBox);
		}
	}
	if (options.strokeWidth || options["stroke-width"]) {
		const strokeWidth = options.strokeWidth
			? options.strokeWidth
			: options["stroke-width"];
		const strokeWidthValue = typeof strokeWidth === "number"
			? vmax * strokeWidth
			: getStrokeWidth(graph);
		element.setAttributeNS(null, "stroke-width", strokeWidthValue);
	}
	if (hasVertices) {
		const userRadius = options.vertices && options.vertices.radius != null
			? options.vertices.radius
			: options.radius;
		const radius = typeof userRadius === "string" ? parseFloat(userRadius) : userRadius;
		const r = typeof radius === "number" && !Number.isNaN(radius)
			? vmax * radius
			: vmax * DEFAULT_CIRCLE_RADIUS;
		setR(groups[3], r);
	}
};
/**
 * @description renders a FOLD object into SVG elements, sorted into groups.
 * @param {object} FOLD object
 * @param {object} options (optional)
 * @returns {SVGElement[]} An array of four <g> elements: boundaries, faces,
 *  edges, vertices, each of the graph components drawn into an SVG group.
 */
const DrawGroups = (graph, options = {}) => groupNames
	.map(key => (options[key] === false ? (SVG.g()) : draw[key](graph, options)))
	.map((group, i) => {
		addClass(group, groupNames[i]);
		return group;
	});
/**
 * @name render
 * @memberof graph
 * @description renders a FOLD object into an SVG, ensuring visibility by
 * setting the viewBox and the stroke-width attributes on the SVG.
 * @param {SVGElement} element an already initialized SVG DOM element.
 * @param {FOLD} graph a FOLD object
 * @param {object} options an optional options object to style the rendering
 * @returns {SVGElement} the first SVG parameter object.
 * @linkcode Origami ./src/svg/index.js 161
 */
const render = (graph, element, options = {}) => {
	const groups = DrawGroups(graph, options);
	groups.filter(group => group.childNodes.length > 0)
		.forEach(group => element.appendChild(group));
	// apply top level options to the SVG (or group) itself
	applyTopLevelOptions(element, groups, graph, options);
	// add classes from the FOLD graph to the top level element
	addClass(
		element,
		...[graph.file_classes || [], graph.frame_classes || []].flat(),
		// ...["FOLD", graph.file_classes || [], graph.frame_classes || []].flat(),
	);
	// set custom getters on the element to grab the component groups
	// groupNames.filter(key => !element[key]).forEach(key => {
	// 	Object.defineProperty(element, key, {
	// 		get: () => element.getElementsByClassName(key)[0],
	// 	});
	// });
	return element;
};
export default render;
