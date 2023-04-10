import { EPSILON } from "../math/general/constant.js";
import { epsilonEqual } from "../math/general/function.js";
import { clusterScalars } from "../general/arrays.js";
import { makeVerticesEdgesUnsorted } from "./make.js";
/**
 * @description Perform a line sweep through the vertices of a graph,
 * the line is hard-coded to sweep along the +X axis.
 * This method will sort the vertices along the sweep direction and
 * group those which have a similar value within an epsilon.
 * @param {FOLD} graph a FOLD graph
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {object[]} an array of event objects, where each event contains
 * a list of vertices at that moment, and the position along the +X axis.
 */
export const sweepVertices = ({ vertices_coords }, epsilon = EPSILON) => (
	clusterScalars(vertices_coords.map(p => p[0]), epsilon)
		.map(vertices => ({
			vertices,
			x: vertices.reduce((p, c) => p + vertices_coords[c][0], 0) / vertices.length,
			// min: Math.min(...vertices.map(i => vertices_coords[i][0])),
			// max: Math.max(...vertices.map(i => vertices_coords[i][0])),
		}))
);
/**
 * @description Perform a line sweep through the edges of a graph,
 * the line is hard-coded to sweep along the +X axis.
 * This method will create an array of events, each event will either
 * "add" edges or "remove" edges, and for those edges which are vertical
 * they will be present inside both "add" and "remove" inside of one event.
 * @param {FOLD} graph a FOLD graph
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {object[]} an array of event objects, each event contains the
 * place along the +X axis, the vertices at that location, and two arrays:
 * "add" and "remove" each with indices of edges which begin or end at the event.
 */
export const sweepEdges = (
	{ vertices_coords, edges_vertices, vertices_edges },
	epsilon = EPSILON,
) => {
	if (!vertices_edges) {
		vertices_edges = makeVerticesEdgesUnsorted({ edges_vertices });
	}
	// is the edge vertical (both points have similar X values)?
	const edgesSimilarX = edges_vertices.map(([v1, v2]) => epsilonEqual(
		vertices_coords[v1][0],
		vertices_coords[v2][0],
		epsilon,
	));
	// which vertex comes first along the +X axis?
	const edgesDirection = edges_vertices
		.map(([v1, v2]) => Math.sign(vertices_coords[v1][0] - vertices_coords[v2][0]));
	// for each edge, for each of its two vertices, is the vertex +1, 0, -1?
	// -1: first point's X is smaller
	//  0: Xs are same (within an epsilon)
	// +1: second point's X is smaller
	const edgesVertexSide = edges_vertices
		.map(([v1, v2], i) => (edgesSimilarX[i]
			? { [v1]: 0, [v2]: 0 }
			: { [v1]: edgesDirection[i], [v2]: -edgesDirection[i] }));
	// sort along the +X axis
	const sweep = sweepVertices({ vertices_coords }, epsilon);
	sweep.forEach(event => {
		// for an edge, at this moment, we have the vertex. what we need is a dictionary
		// where we can plug in the edge and the vertex and get out a "end" or "start"
		const edgeTable = {};
		event.vertices
			.map(v => vertices_edges[v])
			.forEach((edges, i) => edges.forEach(edge => {
				edgeTable[edge] = edgesVertexSide[edge][event.vertices[i]];
			}));
		const edgeIndices = Object.keys(edgeTable).map(n => parseInt(n, 10));
		// zero (vertical edges) will be included in both "add" and "remove"
		event.add = edgeIndices.filter(i => edgeTable[i] <= 0);
		event.remove = edgeIndices.filter(i => edgeTable[i] >= 0);
	});
	return sweep;
};
