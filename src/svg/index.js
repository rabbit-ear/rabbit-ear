/**
 * Rabbit Ear (c) Kraft
 */
import * as S from "../general/strings";
import DrawGroups from "./draw/index";
// import fold_classes from "./classes";
import linker from "./linker";
import { addClassToClassList } from "./classes";
import { makeEdgesLength } from "../graph/make";
// get the SVG library from its binding to the root of the library
import root from "../root";

const DEFAULT_STROKE_WIDTH = 1 / 100;
const DEFAULT_CIRCLE_RADIUS = 1 / 50;
/**
 * @description get a bounding box from a FOLD graph by inspecting its vertices.
 * @param {object} FOLD object with vertices_coords
 * @returns {number[] | undefined} bounding box as [x, y, width, height]
 *  or undefined if no vertices_coords exist.
 */
const getBoundingRect = ({ vertices_coords }) => {
	if (vertices_coords == null || vertices_coords.length === 0) {
		return undefined;
	}
	const min = Array(2).fill(Infinity);
	const max = Array(2).fill(-Infinity);
	vertices_coords.forEach(v => {
		if (v[0] < min[0]) { min[0] = v[0]; }
		if (v[0] > max[0]) { max[0] = v[0]; }
		if (v[1] < min[1]) { min[1] = v[1]; }
		if (v[1] > max[1]) { max[1] = v[1]; }
	});
	const invalid = Number.isNaN(min[0])
		|| Number.isNaN(min[1])
		|| Number.isNaN(max[0])
		|| Number.isNaN(max[1]);
	return (invalid
		? undefined
		: [min[0], min[1], max[0] - min[0], max[1] - min[1]]);
};
const getViewBox = (graph) => {
	const viewBox = getBoundingRect(graph);
	return viewBox === undefined
		? ""
		: viewBox.join(" ");
};
/**
 * @description given a group assumed to contain only circle elements,
 * set the "r" attribute on all circles.
 */
const setR = (group, radius) => {
	for (let i = 0; i < group.childNodes.length; i += 1) {
		group.childNodes[i].setAttributeNS(null, "r", radius);
	}
};

// this sorts all edge lengths to find the 10% shortest length, to ignore outliers
const getTenthPercentLength = ({ vertices_coords, edges_vertices, edges_length }) => {
	if (!vertices_coords || !edges_vertices) {
		return undefined;
	}
	if (!edges_length) {
		edges_length = makeEdgesLength({ vertices_coords, edges_vertices });
	}
	const sortedLengths = edges_length
		.slice()
		.sort((a, b) => a - b);
	const index_tenth_percent = Math.floor(sortedLengths.length * 0.1);
	return sortedLengths[index_tenth_percent];
};
/**
 * @description search up the parent-chain until we find an <svg>, or return undefined
 */
const findSVGInParents = (element) => {
	if ((element.nodeName || "").toUpperCase() === "SVG") { return element; }
	return element.parentNode ? findSVGInParents(element.parentNode) : undefined;
};
/**
 * @description a subroutine of drawInto(). there are style properties which
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
	const bounds = getBoundingRect(graph);
	const vmax = bounds ? Math.max(bounds[2], bounds[3]) : 1;
	const svgElement = findSVGInParents(element);
	if (svgElement && options.viewBox) {
		const viewBoxValue = bounds ? bounds.join(" ") : "0 0 1 1";
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
		const lengthBased = getTenthPercentLength(graph);
		let strokeWidthValue;
		if (lengthBased) {
			strokeWidthValue = typeof strokeWidth === "number"
				? 10 * lengthBased * strokeWidth
				: 10 * lengthBased * DEFAULT_STROKE_WIDTH;
		} else {
			strokeWidthValue = typeof strokeWidth === "number"
				? vmax * strokeWidth
				: vmax * DEFAULT_STROKE_WIDTH;
		}
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
 * @description Inspect the FOLD object for its classes, which will be
 * in "file_classes" and "frame_classes", and set these as classes on
 * the top level element.
 */
const applyTopLevelClasses = (element, graph) => {
	const newClasses = [
		graph.file_classes || [],
		graph.frame_classes || [],
	].flat();
	if (newClasses.length) {
		addClassToClassList(element, ...newClasses);
		// element.classList.add(...newClasses);
	}
};
/**
 * @name drawInto
 * @memberof graph
 * @description renders a FOLD object into an SVG, ensuring visibility by
 * setting the viewBox and the stroke-width attributes on the SVG.
 * @param {SVGElement} element an already initialized SVG DOM element.
 * @param {FOLD} graph a FOLD object
 * @param {object} options an optional options object to style the rendering
 * @returns {SVGElement} the first SVG parameter object.
 * @linkcode Origami ./src/svg/index.js 122
 */
const drawInto = (element, graph, options = {}) => {
	const groups = DrawGroups(graph, options);
	groups.filter(group => group.childNodes.length > 0)
		.forEach(group => element.appendChild(group));
	applyTopLevelOptions(element, groups, graph, options);
	applyTopLevelClasses(element, graph);
	// set custom getters on the element to grab the component groups
	Object.keys(DrawGroups)
		.map((key, i) => ({ key, i }))
		.filter(el => element[el.key] == null)
		.forEach(el => Object.defineProperty(element, el.key, { get: () => groups[el.i] }));
	return element;
};
/**
 * @name svg
 * @memberof graph
 * @description renders a FOLD object as an SVG, ensuring visibility by
 * setting the viewBox and the stroke-width attributes on the SVG.
 * @param {object} graph a FOLD object
 * @param {object?} options optional options object to style components
 * @param {boolean} tell the draw method to resize the viewbox/stroke
 * @returns {SVGElement} SVG element, containing the rendering of the origami.
 * @linkcode Origami ./src/svg/index.js 145
 */
const FOLDtoSVG = (graph, options) => drawInto(root.svg(), graph, options);
/**
 * @description adding static-like methods to the main function, four for
 *  drawing the individual elements, and one drawInto for pre-initialized svgs.
 */
Object.keys(DrawGroups).forEach(key => { FOLDtoSVG[key] = DrawGroups[key]; });
FOLDtoSVG.drawInto = drawInto;
FOLDtoSVG.getViewBox = getViewBox;

// .use() to link library to Rabbit Ear, and optionally build without this.
Object.defineProperty(FOLDtoSVG, "linker", {
	enumerable: false,
	value: linker.bind(FOLDtoSVG),
});

export default FOLDtoSVG;
