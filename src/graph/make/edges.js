/**
 * Rabbit Ear (c) Kraft
 */
import {
	subtract,
	magnitude,
} from "../../math/vector.js";
import {
	boundingBox,
} from "../../math/polygon.js";

/**
 * @description map vertices_coords onto edges_vertices so that the result
 * is an edge array where each edge contains its two points. Each point being
 * the 2D or 3D coordinate as an array of numbers.
 * @param {FOLD} graph a FOLD graph with vertices and edges
 * @returns {number[][][]} an array of array of points (which are arrays of numbers)
 * @linkcode Origami ./src/graph/make.js 639
 */
export const makeEdgesCoords = ({ vertices_coords, edges_vertices }) => (
	edges_vertices.map(ev => ev.map(v => vertices_coords[v]))
);

/**
 * @description Turn every edge into a vector, basing the direction on the order of
 * the pair of vertices in each edges_vertices entry.
 * @param {FOLD} graph a FOLD graph, with vertices_coords, edges_vertices
 * @returns {number[][]} each entry relates to an edge, each array contains a 2D vector
 * @linkcode Origami ./src/graph/make.js 648
 */
export const makeEdgesVector = ({ vertices_coords, edges_vertices }) => (
	makeEdgesCoords({
		vertices_coords, edges_vertices,
	}).map(verts => subtract(verts[1], verts[0]))
);

/**
 * @description For every edge, find the length between the edges pair of vertices.
 * @param {FOLD} graph a FOLD graph, with vertices_coords, edges_vertices
 * @returns {number[]} the distance between each edge's pair of vertices
 * @linkcode Origami ./src/graph/make.js 657
 */
export const makeEdgesLength = ({ vertices_coords, edges_vertices }) => (
	makeEdgesVector({ vertices_coords, edges_vertices }).map(magnitude)
);

/**
 * @description Make an array of axis-aligned bounding boxes, one for each edge,
 * that encloses the edge, and will work in n-dimensions. Intended for
 * fast line-sweep algorithms.
 * @param {FOLD} graph a FOLD graph with vertices and edges.
 * @returns {object[]} an array of boxes, length matching the number of edges
 * @linkcode Origami ./src/graph/make.js 668
 */
export const makeEdgesBoundingBox = ({
	vertices_coords, edges_vertices, edges_coords,
}, epsilon) => {
	if (!edges_coords) {
		edges_coords = makeEdgesCoords({ vertices_coords, edges_vertices });
	}
	return edges_coords.map(coords => boundingBox(coords, epsilon));
};
