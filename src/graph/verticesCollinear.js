/**
 * Rabbit Ear (c) Kraft
 */
import math from "../math.js";
import { getEdgesVerticesOverlappingSpan } from "./span.js";
import { makeVerticesEdgesUnsorted } from "./make.js";
import { getOppositeVertices } from "./general.js";
/**
 * @description determine if a vertex exists between two and only two edges, and
 * those edges are both parallel and on opposite ends of the vertex. In a lot of
 * cases, this vertex can be removed and the graph would function the same.
 * @param {FOLD} graph a FOLD object
 * @param {number} vertex an index of a vertex in the graph
 * @returns {boolean} true if the vertex is collinear and can be removed.
 * @linkcode Origami ./src/graph/verticesCollinear.js 15
 */
export const isVertexCollinear = ({
	vertices_coords, vertices_edges, edges_vertices,
}, vertex, epsilon = math.EPSILON) => {
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
	const vertices = getOppositeVertices({ edges_vertices }, vertex, edges);
	const points = [vertices[0], vertex, vertices[1]]
		.map(v => vertices_coords[v]);
	return math.collinearBetween(...points, false, epsilon);
};
/**
 * check each vertex against each edge, we want to know if a vertex is
 * lying collinear along an edge, the usual intention is to substitute
 * the edge with 2 edges that include the collinear vertex.
 */
/**
 * this DOES NOT return vertices that are already connected
 * between two adjacent and collinear edges, in a valid graph
 *    O------------O------------O
 * for this you want: ___________ method
 */
/**
 * @description Get a list of lists where for every edge there is a
 * list filled with vertices that lies collinear to the edge, where
 * collinearity only counts if the vertex lies between the edge's endpoints,
 * excluding the endpoints themselves.
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][]} size matched to the edges_ arrays, with an empty array
 * unless a vertex lies collinear, the edge's array will contain that vertex's index.
 * @linkcode Origami ./src/graph/verticesCollinear.js 55
 */
export const getVerticesEdgesOverlap = ({
	vertices_coords, edges_vertices, edges_coords,
}, epsilon = math.EPSILON) => {
	if (!edges_coords) {
		edges_coords = edges_vertices.map(ev => ev.map(v => vertices_coords[v]));
	}
	const edges_span_vertices = getEdgesVerticesOverlappingSpan({
		vertices_coords, edges_vertices, edges_coords,
	}, epsilon);
	// todo, consider pushing values into a results array instead of modifying,
	// then filtering the existing one
	for (let e = 0; e < edges_coords.length; e += 1) {
		for (let v = 0; v < vertices_coords.length; v += 1) {
			if (!edges_span_vertices[e][v]) { continue; }
			edges_span_vertices[e][v] = math.overlapLinePoint(
				math.subtract(edges_coords[e][1], edges_coords[e][0]),
				edges_coords[e][0],
				vertices_coords[v],
				math.excludeS,
				epsilon,
			);
		}
	}
	return edges_span_vertices
		.map(verts => verts
			.map((vert, i) => (vert ? i : undefined))
			.filter(i => i !== undefined));
};
