/**
 * Rabbit Ear (c) Kraft
 */
import math from "../math";
import {
	singularize,
	filterKeysWithPrefix,
} from "../fold/spec";
import { makeFacesCenterQuick } from "./make";
/**
 * @description Iterate through all vertices in a graph and find the one nearest to a
 * provided point. This is the only of the "nearest" graph operations that works in 3D.
 * @param {FOLD} graph a FOLD graph
 * @param {number[]} point the point to find the nearest vertex
 * @returns {number} the index of the nearest vertex
 * @todo improve with space partitioning
 * @linkcode Origami ./src/graph/nearest.js 13
 */
export const nearestVertex = ({ vertices_coords }, point) => {
	if (!vertices_coords) { return undefined; }
	// resize our point to be the same dimension as the first vertex
	const p = math.core.resize(vertices_coords[0].length, point);
	// sort by distance, hold onto the original index in vertices_coords
	const nearest = vertices_coords
		.map((v, i) => ({ d: math.core.distance(p, v), i }))
		.sort((a, b) => a.d - b.d)
		.shift();
	// return index, not vertex
	return nearest ? nearest.i : undefined;
};
/**
 * @description Iterate through all edges in a graph and find the one nearest to a provided point.
 * @param {FOLD} graph a FOLD graph
 * @param {number[]} point the point to find the nearest edge
 * @returns {number|undefined} the index of the nearest edge, or undefined
 * if there are no vertices_coords or edges_vertices
 * @linkcode Origami ./src/graph/nearest.js 33
 */
export const nearestEdge = ({ vertices_coords, edges_vertices }, point) => {
	if (!vertices_coords || !edges_vertices) { return undefined; }
	const nearest_points = edges_vertices
		.map(e => e.map(ev => vertices_coords[ev]))
		.map(e => math.core.nearestPointOnLine(
			math.core.subtract(e[1], e[0]),
			e[0],
			point,
			math.core.segmentLimiter,
		));
	return math.core.smallestComparisonSearch(point, nearest_points, math.core.distance);
};
/**
 * @description Iterate through all faces in a graph and find one that encloses a point.
 * This method assumes the graph is in 2D, it ignores any z components.
 * @param {FOLD} graph a FOLD graph
 * @param {number[]} point the point to find the enclosing face
 * @returns {number|undefined} the index of the face, or undefined if no face encloses a point
 * @linkcode Origami ./src/graph/nearest.js 53
 */
export const faceContainingPoint = ({ vertices_coords, faces_vertices }, point) => {
	if (!vertices_coords || !faces_vertices) { return undefined; }
	const face = faces_vertices
		.map((fv, i) => ({ face: fv.map(v => vertices_coords[v]), i }))
		.filter(f => math.core.overlapConvexPolygonPoint(f.face, point))
		.shift();
	return (face === undefined ? undefined : face.i);
};
/**
 * @description Iterate through all faces in a graph and find one nearest to a point.
 * This method assumes the graph is in 2D, it ignores any z components.
 * @param {FOLD} graph a FOLD graph
 * @param {number[]} point the point to find the nearest face
 * @returns {number|undefined} the index of the face, or undefined if edges_faces is not defined.
 * @todo make this work if edges_faces is not defined (not hard)
 * @linkcode Origami ./src/graph/nearest.js 70
 */
export const nearestFace = (graph, point) => {
	const face = faceContainingPoint(graph, point);
	if (face !== undefined) { return face; }
	if (graph.edges_faces) {
		const edge = nearestEdge(graph, point);
		const faces = graph.edges_faces[edge];
		if (faces.length === 1) { return faces[0]; }
		if (faces.length > 1) {
			const faces_center = makeFacesCenterQuick({
				vertices_coords: graph.vertices_coords,
				faces_vertices: faces.map(f => graph.faces_vertices[f]),
			});
			const distances = faces_center
				.map(center => math.core.distance(center, point));
			let shortest = 0;
			for (let i = 0; i < distances.length; i += 1) {
				if (distances[i] < distances[shortest]) { shortest = i; }
			}
			return faces[shortest];
		}
	}
	return undefined;
};
/**
 * @description Return an object which contains information regarding
 * vertices, edges, and faces, which indices are closest to the provided point.
 * @param {FOLD} graph a FOLD graph
 * @param {number[]} point the point to find the nearest face
 * @returns {object} object which contains information about the nearest components,
 * some of which is stored in a getter, which delays the computation until called.
 * @linkcode
 */
export const nearest = (graph, ...args) => {
	const nearestMethods = {
		vertices: nearestVertex,
		edges: nearestEdge,
		faces: nearestFace,
	};
	const point = math.core.getVector(...args);
	const nears = Object.create(null);
	["vertices", "edges", "faces"].forEach(key => {
		Object.defineProperty(nears, singularize[key], {
			enumerable: true,
			get: () => nearestMethods[key](graph, point),
		});
		filterKeysWithPrefix(graph, key)
			.forEach(fold_key => Object.defineProperty(nears, fold_key, {
				enumerable: true,
				get: () => graph[fold_key][nears[singularize[key]]],
			}));
	});
	return nears;
};
/**
 * @todo this needs testing: does the cache cause a memory leak after many repeated calls?
 */
// export const nearest = (graph, ...args) => {
// 	const nearestMethods = {
// 		vertices: nearestVertex,
// 		edges: nearestEdge,
// 		faces: nearestFace,
// 	};
// 	const point = math.core.getVector(...args);
// 	const nears = Object.create(null);
// 	const cache = {};
// 	["vertices", "edges", "faces"].forEach(key => {
// 		Object.defineProperty(nears, singularize[key], {
// 			enumerable: true,
// 			get: () => {
// 				if (cache[key] !== undefined) { return cache[key]; }
// 				cache[key] = nearestMethods[key](graph, point);
// 				return cache[key];
// 			},
// 		});
// 		filterKeysWithPrefix(graph, key)
// 			.forEach(fold_key => Object.defineProperty(nears, fold_key, {
// 				enumerable: true,
// 				get: () => graph[fold_key][nears[singularize[key]]],
// 			}));
// 	});
// 	return nears;
// };
