import { EPSILON } from "../math/general/constant.js";
import { epsilonEqual } from "../math/general/function.js";
import {
	uniqueElements,
	clusterScalars,
} from "../general/arrays.js";
import { makeVerticesEdgesUnsorted } from "./make.js";
/**
 * @description Perform a line sweep through the vertices of a graph,
 * the default direction is to sweep along the +X axis.
 * This method will sort the vertices along the sweep direction and
 * group those which have a similar value within an epsilon.
 * @param {FOLD} graph a FOLD graph
 * @param {number} [axis=0] which axis to sweep along
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {object[]} an array of event objects, each event contains:
 * - t: the position along the axis
 * - vertices: the vertices (one or more) at this event along the axis
 */
export const sweepVertices = ({ vertices_coords }, axis = 0, epsilon = EPSILON) => (
	clusterScalars(vertices_coords.map(p => p[axis]), epsilon)
		.map(vertices => ({
			vertices,
			t: vertices.reduce((p, c) => p + vertices_coords[c][axis], 0) / vertices.length,
		}))
);
/**
 * @description This is the sweep method used by sweepEdges and sweepFaces.
 * @param {number[]} values an array of scalars constructed from the
 * vertices_coords array where for each coord, only the relevant value is taken
 * @param {number[][]} edges_vertices an array of pairs of indices to the
 * values array. note: the sweepFaces constructs new edges that span the entire
 * face, so this has no relation to the graph's original edges_vertices.
 * @param {number} [epsilon=1e-6] an optional epsilon
 */
const sweep = (values, { edges_vertices, vertices_edges }, epsilon = EPSILON) => {
	if (!vertices_edges) {
		vertices_edges = makeVerticesEdgesUnsorted({ edges_vertices });
	}
	const edgesValues = edges_vertices.map(edge => edge.map(e => values[e]));
	// is the span degenerate? (both values are an epsilon away from each other)
	const isDegenerate = edgesValues.map(pair => epsilonEqual(...pair, epsilon));
	// which vertex comes first along the sweep axis
	const edgesDirection = edges_vertices
		.map(edge => edge.map(e => values[e]))
		.map(([a, b]) => Math.sign(a - b));
	// for each edge, for each of its two vertices, is the vertex +1, 0, -1?
	// -1: first point's coordinate is smaller
	//  0: coordinates are same (within an epsilon)
	// +1: second point's coordinate is smaller
	const edgesVertexSide = edges_vertices
		.map(([v1, v2], i) => (isDegenerate[i]
			? { [v1]: 0, [v2]: 0 }
			: { [v1]: edgesDirection[i], [v2]: -edgesDirection[i] }));
	return clusterScalars(values, epsilon)
		// ensure that every vertex is used in the graph, filter out any vertices
		// which aren't found in vertices_edges, and if this creates empty clusters
		// with no vertices, filter out these clusters
		.map(vertices => vertices.filter(v => vertices_edges[v]))
		.filter(vertices => vertices.length)
		.map(vertices => ({
			vertices,
			t: vertices.reduce((p, c) => p + values[c], 0) / vertices.length,
			start: uniqueElements(vertices.flatMap(v => vertices_edges[v]
				.filter(edge => edgesVertexSide[edge][v] <= 0))),
			end: uniqueElements(vertices.flatMap(v => vertices_edges[v]
				.filter(edge => edgesVertexSide[edge][v] >= 0))),
		}));
};
/**
 * @description Perform a line sweep through the edges of a graph,
 * This method will create an array of events, each event will either
 * "start" edges or "end" edges, and for those edges which are orthogonal
 * to the sweep axis within an epsilon, they will only exist inside one
 * event and be present in both the "start" and the "end" arrays.
 * @param {FOLD} graph a FOLD graph
 * @param {number} [axis=0] which axis to sweep along
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {object[]} an array of event objects, each event contains:
 * - t: the position along the axis
 * - vertices: the vertices (one or more) at this event along the axis
 * - start: the edges which begin at this event in the sweep
 * - end: the edges which end at this event in the sweep
 */
export const sweepEdges = ({
	vertices_coords, edges_vertices, vertices_edges,
}, axis = 0, epsilon = EPSILON) => (
	sweep(vertices_coords.map(p => p[axis]), { edges_vertices, vertices_edges }, epsilon)
);
/**
 * @description Perform a line sweep through the faces of a graph,
 * This method will create an array of events, each event will either
 * "start" faces or "end" faces. In the case of degenerate faces whose
 * vertices all lie on a line and that line is orthogonal to the sweep
 * axis, within an epsilon, these faces will only exist inside one
 * event and be present in both the "start" and the "end" arrays.
 * @param {FOLD} graph a FOLD graph
 * @param {number} [axis=0] which axis to sweep along
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {object[]} an array of event objects, each event contains:
 * - t: the position along the axis
 * - vertices: the vertices (one or more) at this event along the axis
 * - start: the faces which begin at this event in the sweep
 * - end: the faces which end at this event in the sweep
 */
export const sweepFaces = ({
	vertices_coords, faces_vertices,
}, axis = 0, epsilon = EPSILON) => sweep(
	vertices_coords.map(p => p[axis]),
	// get the min/max vertex for each face along the sweep axis.
	// this will serve as the "edge" that spans the breadth of the face
	{ edges_vertices: faces_vertices.map(vertices => [
		vertices
			.reduce((a, b) => (vertices_coords[a][axis] < vertices_coords[b][axis] ? a : b)),
		vertices
			.reduce((a, b) => (vertices_coords[a][axis] > vertices_coords[b][axis] ? a : b)),
	]) },
	epsilon,
);
