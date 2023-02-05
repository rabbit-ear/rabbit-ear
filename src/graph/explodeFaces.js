/**
 * Rabbit Ear (c) Kraft
 */
import math from "../math.js";
import clone from "../general/clone.js";
import {
	makeFacesConvexCenter,
	makeFacesEdgesFromVertices,
} from "./make.js";
import { makeFacesWinding } from "./facesWinding.js";
/**
 * @description Create a modified graph which separates all faces from each other.
 * This will add new vertices and new edges. Most adjacency arrays will be
 * deleted as a lot of it becomes trivial. However, edges_assignment and foldAngle
 * will remain and be correctly updated to match the new edge indices.
 * @param {FOLD} graph a FOLD graph, will be modified in place
 * @returns {object} a summary of changes to the vertices and edges
 * @linkcode Origami ./src/graph/explodeFaces.js 18
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
 * @linkcode Origami ./src/graph/explodeFaces.js 71
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
 * @description Create a modified graph which contains vertices_coords and faces_vertices
 * but that for every face, vertices_coords has been duplicated so that faces
 * do not share vertices, and finally, a scaling transform has been applied to every
 * face creating a gap between all faces.
 * @param {FOLD} graph a FOLD graph
 * @param {number} [shrink=0.333] a scale factor for a shrinking transform
 * @returns {FOLD} a new FOLD graph with exploded faces
 * @linkcode Origami ./src/graph/explodeFaces.js 95
 */
export const explodeShrinkFaces = ({ vertices_coords, faces_vertices }, shrink = 0.333) => {
	const graph = explodeFaces({ vertices_coords, faces_vertices });
	const faces_winding = makeFacesWinding(graph);
	const faces_vectors = graph.faces_vertices
		.map(vertices => vertices.map(v => graph.vertices_coords[v]))
		.map(points => points.map((p, i, arr) => math.core.subtract2(p, arr[(i+1) % arr.length])));
	const faces_centers = makeFacesConvexCenter({ vertices_coords, faces_vertices });
	const faces_point_distances = faces_vertices
		.map(vertices => vertices.map(v => vertices_coords[v]))
		.map((points, f) => points
			.map(point => math.core.distance2(point, faces_centers[f])));
	// console.log("faces_point_distances", faces_point_distances);
	const faces_bisectors = faces_vectors
		.map((vectors, f) => vectors
			.map((vector, i, arr) => [
				vector,
				math.core.flip(arr[(i - 1 + arr.length) % arr.length]),
			]).map(pair => faces_winding[f]
				? math.core.counterClockwiseBisect2(...pair)
				: math.core.clockwiseBisect2(...pair)))
		.map((vectors, f) => vectors
			.map((vector, i) => math.core.scale(vector, faces_point_distances[f][i])))
	graph.faces_vertices
		.forEach((vertices, f) => vertices
			.forEach((v, i) => {
				graph.vertices_coords[v] = math.core.add2(
					graph.vertices_coords[v],
					math.core.scale2(faces_bisectors[f][i], -shrink),
				);
			}));
	return graph;
};
