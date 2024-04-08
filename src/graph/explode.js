/**
 * Rabbit Ear (c) Kraft
 */
import { makeFacesEdgesFromVertices } from "./make/facesEdges.js";

/**
 * @description Create a modified graph which contains vertices, edges,
 * and faces, but that for every face, all of its vertices and edges
 * have been duplicated so that faces do not share vertices or edges.
 * Edges are also duplicated so that they do not share vertices.
 * Edge assignments and foldAngles will remain and be correctly re-indexed.
 * Additionally, if you only provide a graph with only vertices_coords and
 * faces_vertices, then a simple face-vertex only graph will be calculated.
 * @param {FOLD} graph a FOLD graph. not modified.
 * @returns {FOLD|undefined} a new FOLD graph with exploded faces,
 * or undefined if no faces_vertices entry exists.
 */
export const explodeFaces = ({
	vertices_coords, edges_vertices, edges_assignment, edges_foldAngle,
	faces_vertices, faces_edges,
}) => {
	if (!faces_vertices) { return undefined; }
	let e = 0;
	let f = 0;
	const result = {
		faces_vertices: faces_vertices
			.map(face => face.map(() => f++)),
	};
	if (!vertices_coords) { return result; }

	// if vertices exist, add vertices
	result.vertices_coords = structuredClone(faces_vertices
		.flatMap(face => face.map(v => vertices_coords[v])));

	// if no edges exist, return the vertex-face graph.
	if (!edges_vertices) { return result; }

	// if edges exist, add edges
	if (!faces_edges) {
		faces_edges = makeFacesEdgesFromVertices({ edges_vertices, faces_vertices });
	}
	result.edges_vertices = faces_edges.flatMap(face => face
		.map((_, i, arr) => (i === arr.length - 1
			? [e, (++e - arr.length)]
			: [e, (++e)])));
	const edgesMap = faces_edges.flatMap(edges => edges);
	if (edges_assignment) {
		result.edges_assignment = structuredClone(edgesMap
			.map(i => edges_assignment[i]));
	}
	if (edges_foldAngle) {
		result.edges_foldAngle = structuredClone(edgesMap
			.map(i => edges_foldAngle[i]));
	}
	return result;
};

/**
 * @description Create a modified graph which contains
 * vertices_coords and edges_vertices but that for every edge,
 * vertices_coords has been duplicated so that edges
 * do not share vertices.
 * @param {FOLD} graph a FOLD graph. not modified.
 * @returns {FOLD|undefined} a new FOLD graph with exploded faces,
 * or undefined if no faces_vertices entry exists.
 */
export const explodeEdges = ({
	vertices_coords, edges_vertices, edges_assignment, edges_foldAngle,
}) => {
	if (!edges_vertices) { return undefined; }
	let e = 0;
	// duplicate vertices are simply duplicate references, changing
	// one will still change the others. we need to deep copy the array
	const result = {
		edges_vertices: edges_vertices.map(edge => edge.map(() => e++)),
	};
	if (edges_assignment) { result.edges_assignment = edges_assignment; }
	if (edges_foldAngle) { result.edges_foldAngle = edges_foldAngle; }
	if (vertices_coords) {
		result.vertices_coords = structuredClone(edges_vertices
			.flatMap(edge => edge.map(v => vertices_coords[v])));
	}
	return result;
};
