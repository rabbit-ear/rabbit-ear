/**
 * Rabbit Ear (c) Kraft
 */
import math from "../math";
import { makeFacesCenterQuick } from "./make";
import { makeFacesWinding } from "./facesWinding";

// todo, expand this to include edges, edges_faces, etc..
/**
 * @description Create a modified graph which contains vertices_coords and faces_vertices
 * but that for every face, vertices_coords has been duplicated so that faces
 * do not share vertices.
 * @param {FOLD} graph a FOLD graph
 * @returns {FOLD} a new FOLD graph with exploded faces
 * @linkcode Origami ./src/graph/explodeFaces.js 15
 */
export const explodeFaces = (graph) => {
	const vertices_coords = graph.faces_vertices
		.map(face => face.map(v => graph.vertices_coords[v]))
		.reduce((a, b) => a.concat(b), []);
	let i = 0;
	const faces_vertices = graph.faces_vertices
		.map(face => face.map(v => i++));
	// deep copy vertices coords
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
 * @linkcode Origami ./src/graph/explodeFaces.js 38
 */
export const explodeShrinkFaces = ({ vertices_coords, faces_vertices }, shrink = 0.333) => {
	const graph = explodeFaces({ vertices_coords, faces_vertices });
	const faces_winding = makeFacesWinding(graph);
	const faces_vectors = graph.faces_vertices
		.map(vertices => vertices.map(v => graph.vertices_coords[v]))
		.map(points => points.map((p, i, arr) => math.core.subtract2(p, arr[(i+1) % arr.length])));
	const faces_centers = makeFacesCenterQuick({ vertices_coords, faces_vertices });
	const faces_point_distances = faces_vertices
		.map(vertices => vertices.map(v => vertices_coords[v]))
		.map((points, f) => points
			.map(point => math.core.distance2(point, faces_centers[f])));
	console.log("faces_point_distances", faces_point_distances);
	const faces_bisectors = faces_vectors
		.map((vectors, f) => vectors
			.map((vector, i, arr) => [
				vector,
				math.core.flip(arr[(i - 1 + arr.length) % arr.length])
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
