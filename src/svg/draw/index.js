/**
 * Rabbit Ear (c) Kraft
 */
import * as S from "../../general/strings";
import { vertices_circle } from "./vertices";
import { edges_paths, draw_edges } from "./edges";
import {
	faces_vertices_polygon,
	faces_edges_polygon,
} from "./faces";
import { boundaries_polygon } from "./boundaries";
import root from "../../root";

// preference for using faces_vertices over faces_edges, it runs faster
const faces_draw_function = (graph, options) => (
	graph != null && graph[S._faces_vertices] != null
		? faces_vertices_polygon(graph, options)
		: faces_edges_polygon(graph, options));

const svg_draw_func = {
	vertices: vertices_circle,
	edges: draw_edges, // edges_paths
	faces: faces_draw_function,
	boundaries: boundaries_polygon
};

/**
 * @param {string} key will be either "vertices", "edges", "faces", "boundaries"
 */
const draw_group = (key, graph, options) => {
	const group = options === false ? (root.svg.g()) : svg_draw_func[key](graph, options);
	group.setAttributeNS(null, S._class, key);
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
	S._vertices].map(key => draw_group(key, graph, options[key]));

// static style draw methods for individual components
[S._boundaries,
	S._faces,
	S._edges,
	S._vertices,
].forEach(key => {
	DrawGroups[key] = function (graph, options = {}) {
		return draw_group(key, graph, options[key]);
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
