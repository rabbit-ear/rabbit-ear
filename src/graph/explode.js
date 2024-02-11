/**
 * Rabbit Ear (c) Kraft
 */
import { makeFacesEdgesFromVertices } from "./make.js";

/**
 * @description Create a modified graph which only contains
 * vertices_coords and faces_vertices, but that for every face,
 * vertices_coords has been duplicated so that faces
 * do not share vertices.
 * @param {FOLD} graph a FOLD graph. not modified.
 * @returns {FOLD|undefined} a new FOLD graph with exploded faces,
 * or undefined if no faces_vertices entry exists.
 * @linkcode Origami ./src/graph/explodeFaces.js 82
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
 * @description Create a modified graph which only contains
 * vertices_coords and faces_vertices, but that for every face,
 * vertices_coords has been duplicated so that faces
 * do not share vertices.
 * @param {FOLD} graph a FOLD graph. not modified.
 * @returns {FOLD} a new FOLD graph with exploded faces
 * @linkcode Origami ./src/graph/explodeFaces.js 82
 */
// export const explodeFacesSimple = ({ vertices_coords, faces_vertices }) => {
// 	let f = 0;
// 	return {
// 		vertices_coords: structuredClone(faces_vertices
// 			.flatMap(face => face.map(v => vertices_coords[v]))),
// 		faces_vertices: faces_vertices
// 			.map(face => face.map(() => f++)),
// 	};
// };

/**
 * @description Create a modified graph which contains
 * vertices_coords and edges_vertices but that for every edge,
 * vertices_coords has been duplicated so that edges
 * do not share vertices.
 * @param {FOLD} graph a FOLD graph. not modified.
 * @returns {FOLD|undefined} a new FOLD graph with exploded faces,
 * or undefined if no faces_vertices entry exists.
 * @linkcode Origami ./src/graph/explodeFaces.js 82
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

/**
 * @description Create a modified graph which separates all faces from each other.
 * This will add new vertices and new edges. Most adjacency arrays will be
 * deleted as a lot of it becomes trivial. However, edges_assignment and foldAngle
 * will remain and be correctly updated to match the new edge indices.
 * @param {FOLD} graph a FOLD graph, will be modified in place
 * @returns {object} a summary of changes to the vertices and edges
 * @linkcode Origami ./src/graph/explodeFaces.js 29
 */
// export const explode = (graph) => {
// 	// make sure we have faces_vertices (required) and faces_edges (can be built)
// 	if (!graph.faces_vertices) { return {}; }
// 	const faces_edges = graph.faces_edges
// 		? graph.faces_edges
// 		: makeFacesEdgesFromVertices(graph);
// 	// arrays mapping index (new element index) to value (old element index)
// 	const verticesMap = graph.faces_vertices.flatMap(vertices => vertices);
// 	const edgesMap = faces_edges.flatMap(edges => edges);
// 	// build new data
// 	let fv = 0;
// 	graph.faces_vertices = graph.faces_vertices.map(face => face.map(() => fv++));
// 	let fe = 0;
// 	graph.faces_edges = faces_edges.map(face => face.map(() => fe++));
// 	// use faces_edges (or vertices) to build a loop, where new edges are made to
// 	// connect new vertices, but when a face is done connect back to its first vertex.
// 	let ev = 0;
// 	graph.edges_vertices = faces_edges
// 		.flatMap(face => face
// 			.map((_, i, arr) => (i === arr.length - 1
// 				? [ev, (++ev - arr.length)]
// 				: [ev, (++ev)])));
// 	if (graph.vertices_coords) {
// 		graph.vertices_coords = structuredClone(verticesMap
// 			.map(i => graph.vertices_coords[i]));
// 	}
// 	if (graph.edges_assignment) {
// 		graph.edges_assignment = structuredClone(edgesMap
// 			.map(i => graph.edges_assignment[i]));
// 	}
// 	if (graph.edges_foldAngle) {
// 		graph.edges_foldAngle = structuredClone(edgesMap
// 			.map(i => graph.edges_foldAngle[i]));
// 	}
// 	if (graph.vertices_vertices) { delete graph.vertices_vertices; }
// 	if (graph.vertices_edges) { delete graph.vertices_edges; }
// 	if (graph.vertices_faces) { delete graph.vertices_faces; }
// 	if (graph.edges_edges) { delete graph.edges_edges; }
// 	if (graph.edges_faces) { delete graph.edges_faces; }
// 	if (graph.faces_faces) { delete graph.faces_faces; }
// 	return {
// 		vertices: { map: verticesMap },
// 		edges: { map: edgesMap },
// 	};
// };
