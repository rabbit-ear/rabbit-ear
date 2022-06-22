/**
 * Rabbit Ear (c) Kraft
 */
import * as S from "../general/strings";
import DrawGroups from "./draw/index";
// import fold_classes from "./classes";
import linker from "./linker";
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
	const invalid = isNaN(min[0]) || isNaN(min[1]) || isNaN(max[0]) || isNaN(max[1]);
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
	for (let i = 0; i < group.childNodes.length; i++) {
		group.childNodes[i].setAttributeNS(null, "r", radius);
	}
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
 * this includes the viewBox, stroke width, and radius of circles.
 */
const applyTopLevelOptions = (element, groups, graph, options) => {
	if (!(options.strokeWidth || options.viewBox || groups[3].length)) { return; }
	const bounds = getBoundingRect(graph);
	const vmax = bounds ? Math.max(bounds[2], bounds[3]) : 1;
	const svgElement = findSVGInParents(element);
	if (svgElement && options.viewBox) {
		const viewBoxValue = bounds ? bounds.join(" ") : "0 0 1 1";
		svgElement.setAttributeNS(null, "viewBox", viewBoxValue);
	}
	if (options.strokeWidth || options["stroke-width"]) {
		const strokeWidth = options.strokeWidth ? options.strokeWidth : options["stroke-width"];
		const strokeWidthValue = typeof strokeWidth === "number"
			? vmax * strokeWidth
			: vmax * DEFAULT_STROKE_WIDTH;
		element.setAttributeNS(null, "stroke-width", strokeWidthValue);
	}
	if (groups[3].length) {
		const radius = typeof options.radius === "number"
			? vmax * options.radius
			: vmax * DEFAULT_CIRCLE_RADIUS;
		setR(groups[3], radius);
	}
};
/**
 * @name svg
 * @memberof graph
 * @description renders a FOLD object into an SVG, ensuring visibility by
 *  setting the viewBox and the stroke-width attributes on the SVG.
 * @param {SVGElement} an already initialized SVG DOM element.
 * @param {object} FOLD object
 * @param {object} options (optional)
 * @returns {SVGElement} the first SVG parameter object.
 */
const drawInto = (element, graph, options = {}) => {
	const groups = DrawGroups(graph, options);
	groups.filter(group => group.childNodes.length > 0)
		.forEach(group => element.appendChild(group));
	applyTopLevelOptions(element, groups, graph, options);
	// set custom getters on the element to grab the component groups
	Object.keys(DrawGroups)
		.filter(key => element[key] == null)
		.forEach((key, i) => Object.defineProperty(element, key, { get: () => groups[i] }));
	return element;
};
/**
 * @description renders a FOLD object as an SVG, ensuring visibility by
 *  setting the viewBox and the stroke-width attributes on the SVG.
 *  The drawInto() method will accept options/setViewBox in any order.
 * @param {object} graph FOLD object
 * @param {object?} options optional options object to style components
 * @param {boolean} tell the draw method to resize the viewbox/stroke
 * @returns {SVGElement} SVG element, containing the rendering of the origami.
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
