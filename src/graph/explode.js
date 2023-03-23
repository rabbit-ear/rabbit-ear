/**
 * Rabbit Ear (c) Kraft
 */
import clone from "../general/clone.js";
import { makeFacesEdgesFromVertices } from "./make.js";
/**
 * @description Create a modified graph which separates all faces from each other.
 * This will add new vertices and new edges. Most adjacency arrays will be
 * deleted as a lot of it becomes trivial. However, edges_assignment and foldAngle
 * will remain and be correctly updated to match the new edge indices.
 * @param {FOLD} graph a FOLD graph, will be modified in place
 * @returns {object} a summary of changes to the vertices and edges
 * @linkcode Origami ./src/graph/explodeFaces.js 29
 */
export const explode = (graph) => {
	// make sure we have faces_vertices (required) and faces_edges (can be built)
	if (!graph.faces_vertices) { return {}; }
	const faces_edges = graph.faces_edges
		? graph.faces_edges
		: makeFacesEdgesFromVertices(graph);
	// every new element's location in the old elements_ arrays.
	const verticesMap = graph.faces_vertices.flatMap(vertices => vertices);
	const edgesMap = faces_edges.flatMap(edges => edges);
	// build new data
	let fv = 0;
	let fe = 0;
	let ev = 0;
	graph.faces_vertices = graph.faces_vertices.map(face => face.map(() => fv++));
	graph.faces_edges = graph.faces_edges.map(face => face.map(() => fe++));
	// use faces_edges (or vertices) to build a loop, where new edges are made to
	// connect new vertices, but when a face is done connect back to its first vertex.
	graph.edges_vertices = graph.faces_edges
		.flatMap(face => face.map((_, i, arr) => {
			const edge_vertices = i === arr.length - 1
				? [ev, (ev + 1 - arr.length)]
				: [ev, (ev + 1)];
			ev += 1;
			return edge_vertices;
		}));
	if (graph.vertices_coords) {
		graph.vertices_coords = clone(verticesMap.map(i => graph.vertices_coords[i]));
	}
	if (graph.edges_assignment) {
		graph.edges_assignment = clone(edgesMap.map(i => graph.edges_assignment[i]));
	}
	if (graph.edges_foldAngle) {
		graph.edges_foldAngle = clone(edgesMap.map(i => graph.edges_foldAngle[i]));
	}
	if (graph.vertices_vertices) { delete graph.vertices_vertices; }
	if (graph.vertices_edges) { delete graph.vertices_edges; }
	if (graph.vertices_faces) { delete graph.vertices_faces; }
	if (graph.edges_edges) { delete graph.edges_edges; }
	if (graph.edges_faces) { delete graph.edges_faces; }
	if (graph.faces_faces) { delete graph.faces_faces; }
	return {
		vertices: { map: verticesMap },
		edges: { map: edgesMap },
	};
};
/**
 * @description Create a modified graph which contains vertices_coords and faces_vertices
 * but that for every face, vertices_coords has been duplicated so that faces
 * do not share vertices.
 * @param {FOLD} graph a FOLD graph
 * @returns {FOLD} a new FOLD graph with exploded faces
 * @linkcode Origami ./src/graph/explodeFaces.js 82
 */
export const explodeFaces = (graph) => {
	const vertices_coords = graph.faces_vertices
		.flatMap(face => face
			.map(v => graph.vertices_coords[v]));
	let i = 0;
	const faces_vertices = graph.faces_vertices
		.map(face => face.map(() => i++));
	// duplicate vertices are simply duplicate references, changing
	// one will still change the others. we need to deep copy the array
	return {
		vertices_coords: JSON.parse(JSON.stringify(vertices_coords)),
		faces_vertices,
	};
};
/**
 * @description Create a modified graph which contains vertices_coords and edges_vertices
 * but that for every edge, vertices_coords has been duplicated so that edges
 * do not share vertices.
 * @param {FOLD} graph a FOLD graph
 * @returns {FOLD} a new FOLD graph with exploded edges
 * @linkcode Origami ./src/graph/explodeFaces.js 82
 */
export const explodeEdges = (graph) => {
	const vertices_coords = graph.edges_vertices
		.flatMap(edge => edge
			.map(v => graph.vertices_coords[v]));
	let i = 0;
	const edges_vertices = graph.edges_vertices
		.map(edge => edge.map(() => i++));
	// duplicate vertices are simply duplicate references, changing
	// one will still change the others. we need to deep copy the array
	return {
		vertices_coords: JSON.parse(JSON.stringify(vertices_coords)),
		edges_vertices,
	};
};
