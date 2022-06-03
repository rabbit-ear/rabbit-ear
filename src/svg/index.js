/**
 * Rabbit Ear (c) Kraft
 */
import * as S from "../general/strings";
import DrawGroups from "./draw/index";
import fold_classes from "./classes";
import linker from "./linker";
// get the SVG library from its binding to the root of the library
import root from "../root";

const example = {
	vertices: false,
	edges: {},
	faces: {},
	boundaries: {},
	strokeWidth: 0.01,
	viewBox: true,
	radius: 0.2,
};

/**
 * @description get a bounding box from a FOLD graph by inspecting its vertices.
 * @param {object} FOLD object with vertices_coords
 * @returns {number[] | undefined} bounding box as [x, y, width, height]
 *  or undefined if no vertices_coords exist.
 */
const get_bounding_rect = ({ vertices_coords }) => {
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
	const viewBox = get_bounding_rect(graph);
	return viewBox === undefined
		? ""
		: viewBox.join(" ");
};
// const makeViewBox = function (x, y, width, height, padding = 0) {
//   const scale = 1.0;
//   const d = (width / scale) - width;
//   const X = (x - d) - padding;
//   const Y = (y - d) - padding;
//   const W = (width + d * 2) + padding * 2;
//   const H = (height + d * 2) + padding * 2;
//   return [X, Y, W, H].join(" ");
// };
/**
 * @description extract the relevant information from a FOLD graph and create
 * an object with keys and values for attributes for an SVG.
 * @param {object} FOLD object
 * @returns {object} svg attributes as keys and values.
 */
// const make_svg_attributes = (graph, options, setViewBox = true) => {
// 	const attributes = {
// 		overflow: "visible",
// 	};
// 	if (!graph) { return attributes; }
// 	// get the dimensions of the graph (if they exist) and set two attributes:
// 	// viewBox, stroke-width
// 	const viewBox = get_bounding_rect(graph);
// 	if (viewBox && setViewBox) {
// 		attributes.viewBox = viewBox.join(" ");
// 		const vmax = Math.max(viewBox[2], viewBox[3]);
// 		attributes[S._stroke_width] = vmax / 100;
// 		attributes.width = viewBox[2];
// 		attributes.height = viewBox[3];
// 	}
// 	// add top level classes, "graph" and anything from the FOLD like "foldedForm"
// 	attributes[S._class] = ["origami"].concat(fold_classes(graph)).join(" ");
// 	return attributes;
// };
/**
 * set the attribute "r" (radius) on all child elements in this group
 */
const setR = (group, radius) => {
	for (let i = 0; i < group.childNodes.length; i++) {
		group.childNodes[i].setAttributeNS(null, "r", radius);
	}
};
/**
 * @description renders a FOLD object into an SVG, ensuring visibility by
 *  setting the viewBox and the stroke-width attributes on the SVG.
 * @param {SVGElement} an already initialized SVG DOM element.
 * @param {object} FOLD object
 * @param {object} options (optional)
 * @returns {SVGElement} the same SVG parameter object.
 */
// const drawInto = (element, graph, ...args) => {
// 	const options = args.filter(el => typeof el === S._object).shift() || {};
// 	const setViewBox = args.filter(el => typeof el === S._boolean).shift();
// 	const attrs = make_svg_attributes(graph, options, setViewBox);
// 	Object.keys(attrs)
// 		.forEach(attr => element.setAttributeNS(null, attr, attrs[attr]));
// 	const groups = DrawGroups(graph, options);
// 	groups.filter(group => group.childNodes.length > 0)
// 		.forEach(group => element.appendChild(group));
// 	// give vertices special treatment. set their radius a factor of stroke-width
// 	// DrawGroups() is hard-coded to return 4 elements, the last is vertices
// 	if (attrs[S._stroke_width]) { setR(groups[3], attrs[S._stroke_width] * 2); }
// 	// set custom getters on the <svg> element to grab the component groups
// 	Object.keys(DrawGroups).forEach((key, i) =>
// 		Object.defineProperty(element, key, { get: () => groups[i] }));
// 	return element;
// };
const findSVGInParents = (element) => {
	if ((element.nodeName || "").toUpperCase() === "SVG") { return element; }
	return element.parentNode ? findSVGInParents(element.parentNode) : undefined;
};
/**
 * 
 */
const applyTopLevelOptions = (element, groups, graph, options) => {
	if (!(options.strokeWidth || options.viewBox || groups[3].length)) { return; }
	const bounds = get_bounding_rect(graph);
	const vmax = Math.max(bounds[2], bounds[3]);
	const svgElement = findSVGInParents(element);
	if (svgElement && options.viewBox) {
		const viewBoxValue = bounds ? bounds.join(" ") : "";
		svgElement.setAttributeNS(null, "viewBox", viewBoxValue);
	}
	if (options.strokeWidth || options["stroke-width"]) {
		const strokeWidth = options.strokeWidth ? options.strokeWidth : options["stroke-width"];
		const strokeWidthValue = typeof strokeWidth === "number"
			? vmax * strokeWidth
			: vmax / 100;
		element.setAttributeNS(null, "stroke-width", strokeWidthValue);
	}
	if (groups[3].length) {
		const radius = typeof options.radius === "number"
			? vmax * options.radius
			: vmax / 50;
		setR(groups[3], radius);
	}
};
/**
 * 
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
 * @param {object} options (optional)
 * @param {boolean} tell the draw method to resize the viewbox/stroke
 * @returns {SVGElement} SVG element, containing the rendering of the origami.
 */
// const FOLDtoSVG = (graph, options, setViewBox) => (
// 	drawInto(root.svg(), graph, options, setViewBox)
// );
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
