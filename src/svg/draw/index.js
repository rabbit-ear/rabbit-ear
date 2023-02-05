/**
 * Rabbit Ear (c) Kraft
 */
import * as S from "../../general/strings.js";
import { verticesCircle } from "./vertices.js";
import { edgesPaths, drawEdges } from "./edges.js";
import {
	facesVerticesPolygon,
	facesEdgesPolygon,
} from "./faces.js";
import { boundariesPolygon } from "./boundaries.js";
import { addClassToClassList } from "../classes.js";
import root from "../../root.js";

const facesDrawFunction = (graph, options) => {
	if (graph && graph[S._faces_vertices]) {
		return facesVerticesPolygon(graph, options);
	}
	if (graph && graph[S._faces_edges]) {
		return facesEdgesPolygon(graph, options);
	}
	return root.svg.g();
};

const svg_draw_func = {
	vertices: verticesCircle,
	edges: drawEdges, // edgesPaths
	faces: facesDrawFunction,
	boundaries: boundariesPolygon,
};

/**
 * @param {string} key will be either "vertices", "edges", "faces", "boundaries"
 */
const drawGroup = (key, graph, options) => {
	const group = options === false ? (root.svg.g()) : svg_draw_func[key](graph, options);
	// group.classList.add(key);
	addClassToClassList(group, key);
	// group.setAttributeNS(null, S._class, key);
	return group;
};
/**
 * @description renders a FOLD object into SVG elements, sorted into groups.
 * @param {object} FOLD object
 * @param {object} options (optional)
 * @returns {SVGElement[]} An array of four <g> elements: boundaries, faces,
 *  edges, vertices, each of the graph components drawn into an SVG group.
 */
const DrawGroups = (graph, options = {}) => [
	S._boundaries,
	S._faces,
	S._edges,
	S._vertices].map(key => drawGroup(key, graph, options[key]));

// static style draw methods for individual components
[S._boundaries,
	S._faces,
	S._edges,
	S._vertices,
].forEach(key => {
	DrawGroups[key] = function (graph, options = {}) {
		return drawGroup(key, graph, options[key]);
	};
});

/**
 * @description DrawGroups has two functionalities, the primary function
 * call, and "static" methods.
 * - DrawGroups() will render all components of a graph, returning an array
 * - DrawGroups.vertices(), DrawGroups.faces(), etc.. does the same but only
 *   with one component, returning one SVG group.
 */
export default DrawGroups;
