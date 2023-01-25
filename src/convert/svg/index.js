/**
 * Rabbit Ear (c) Kraft
 */
import {
	xmlStringToDOM,
	flattenDomTree,
} from "./dom";
import getAttributeValue from "./getAttributeValue";
import geometryAttributes from "./geometryAttributes.json";
import getSegments from "./getSegments/index";
import colorToAssignment from "./colors/colorToAssignment";
import { removeDuplicateVertices } from "../../graph/verticesViolations";
import fragment from "../../graph/fragment";
import {
	makeVerticesVertices,
	makePlanarFaces,
} from "../../graph/make";
import { planarBoundary } from "../../graph/boundary";
import parseStyleElement from "./parseStyleElement";

const opacityToFoldAngle = (opacity, assignment) => {
	switch (assignment) {
	case "M": case "m": return -180 * opacity;
	case "V": case "v": return 180 * opacity;
	// "F", "B", "U", "C", opacity value doesn't matter.
	default: return 0;
	}
};

const attribute_list = (element) => Array
	.from(element.attributes)
	.filter(a => !geometryAttributes[element.nodeName][a.nodeName]);

const objectifyAttributeList = function (list) {
	const obj = {};
	list.forEach((a) => { obj[a.nodeName] = a.value; });
	return obj;
};
/**
 * @description Given a flat array of svg drawing elements,
 * filter out all the straight line components and convert
 * them into an array of line segments {number[][]}, each
 * line segment is accompanied by its style attributes in
 * dictionary form.
 * @param {Element[]} elements a flat array of svg drawing elements
 * @returns {object[]} an array of line segement objects, each with
 * "segment" and "attributes" properties.
 */
const segmentize = (elements) => elements
	.filter(el => getSegments[el.tagName])
	.flatMap(el => getSegments[el.tagName](el)
		.map(segment => ({
			nodeName: el.tagName,
			segment,
			attributes: objectifyAttributeList(attribute_list(el)),
		})));
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
const svgToBasicGraph = (svg) => {
	const typeString = typeof svg === "string";
	const xml = typeString ? xmlStringToDOM(svg, "image/svg+xml") : svg;
	const elements = flattenDomTree(xml);
	const stylesheets = elements
		.filter(el => el.nodeName === "style")
		.map(parseStyleElement);
	// console.log("stylesheets", stylesheets);
	const result = segmentize(elements);
	// console.log("segmentize", result);
	const edges_assignment = result
		.map(el => getAttributeValue(
			"stroke",
			el.nodeName,
			el.attributes,
			stylesheets,
		) || "black")
		.map(color => colorToAssignment(color));
	const edges_foldAngle = result
		.map(el => getAttributeValue(
			"opacity",
			el.nodeName,
			el.attributes,
			stylesheets,
		) || "1")
		.map((opacity, i) => opacityToFoldAngle(opacity, edges_assignment[i]));
	const vertices_coords = result
		.map(el => el.segment)
		.flatMap(s => [[s[0], s[1]], [s[2], s[3]]]);
	const edges_vertices = result
		.map((_, i) => [i * 2, i * 2 + 1]);
	return {
		vertices_coords,
		edges_vertices,
		edges_assignment,
		edges_foldAngle,
	};
};
/**
 * @description Resolve all crossing edges, build faces,
 * walk and discover the boundary.
 */
const planarizeGraph = (graph) => {
	const planar = { ...graph };
	removeDuplicateVertices(planar);
	fragment(planar);
	planar.vertices_vertices = makeVerticesVertices(planar);
	const faces = makePlanarFaces(planar);
	planar.faces_vertices = faces.map(el => el.vertices);
	planar.faces_edges = faces.map(el => el.edges);
	const { edges } = planarBoundary(planar);
	edges.forEach(e => { planar.edges_assignment[e] = "B"; });
	return planar;
};
/**
 * @description Convert an SVG to a FOLD graph. This only works
 * with SVGs of crease patterns, this will not work
 * with an SVG of a folded form.
 * @param {string | SVGElement} svg the SVG element as a
 * document element node, or as a string
 * @returns {object} a FOLD representation of the SVG
 */
const svgToFold = (svg) => {
	const graph = svgToBasicGraph(svg);
	const planarGraph = planarizeGraph(graph);
	return {
		file_spec: 1.1,
		file_creator: "Rabbit Ear",
		frame_classes: ["creasePattern"],
		...planarGraph,
	};
};

export default svgToFold;
