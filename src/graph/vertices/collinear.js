/**
 * Rabbit Ear (c) Kraft
 */
import { EPSILON } from "../../math/general/constant.js";
import { collinearBetween } from "../../math/geometry/line.js";
import { makeVerticesEdgesUnsorted } from "../make.js";
import { getOtherVerticesInEdges } from "../edges/general.js";
/**
 * @description determine if a vertex exists between two and only two edges, and
 * those edges are both parallel and on opposite ends of the vertex. In a lot of
 * cases, this vertex can be removed and the graph would function the same.
 * @param {FOLD} graph a FOLD object
 * @param {number} vertex an index of a vertex in the graph
 * @returns {boolean} true if the vertex is collinear and can be removed.
 * @linkcode Origami ./src/graph/verticesCollinear.js 19
 * @bigO O(1) if vertices_edges exists, if not, O(n) where n=edges
 */
export const isVertexCollinear = ({
	vertices_coords, vertices_edges, edges_vertices,
}, vertex, epsilon = EPSILON) => {
	if (!vertices_coords || !edges_vertices) { return false; }
	if (!vertices_edges) {
		vertices_edges = makeVerticesEdgesUnsorted({ edges_vertices });
	}
	const edges = vertices_edges[vertex];
	if (edges === undefined || edges.length !== 2) { return false; }
	// don't just check if they are parallel, use the direction of the vertex
	// to make sure the center vertex is inbetween, instead of the odd
	// case where the two edges are on top of one another with
	// a leaf-like vertex.
	const vertices = getOtherVerticesInEdges({ edges_vertices }, vertex, edges);
	const points = [vertices[0], vertex, vertices[1]]
		.map(v => vertices_coords[v]);
	return collinearBetween(...points, false, epsilon);
};
/**
 * @description this is located in planarize.js. see if we can generalize
 * it and bring it out here.
 */
// export const removeCollinearVertex = ({ edges_vertices, vertices_edges }, vertex) => {};
