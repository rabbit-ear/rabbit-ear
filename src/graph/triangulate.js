/**
 * Rabbit Ear (c) Kraft
 */
import Messages from "../environment/messages.js";
import { makeVerticesToEdgeBidirectional } from "./make.js";

/**
 * @description Convert an array of indices into an array of array of
 * indices where each inner array forms a triangle fan: [0, 1, 2, 3, 4]
 * becomes [[0, 1, 2], [1, 2, 3], [1, 3, 4]].
 * @param {number[]} indices an array of indices
 * @returns {number[][]} an array of arrays where the inner arrays are
 * all of length 3.
 */
const makeTriangleFan = (indices) => Array
	.from(Array(indices.length - 2))
	.map((_, i) => [indices[0], indices[i + 1], indices[i + 2]]);

/**
 * @description Triangulate a faces_vertices with the capability to handle
 * only convex faces. This will increase the number of faces.
 * @param {FOLD} graph a FOLD object.
 * @returns {number[][]} faces_vertices where all faces have only 3 vertices
 */
export const triangulateConvexFacesVertices = ({ faces_vertices }) => (
	faces_vertices.flatMap(vertices => (vertices.length < 4
		? [vertices]
		: makeTriangleFan(vertices)))
);

/**
 * @description convert an array of any values into an array of arrays
 * where each of the inner arrays contains 3 elements.
 * This assumes the length % 3 is 0, if not, the couple remainders
 * will be chopped off.
 * @param {any[]} array an array containing any type
 * @returns {any[][]} array of arrays where each inner array is length 3.
 */
const groupByThree = (array) => (array.length === 3 ? [array] : Array
	.from(Array(Math.floor(array.length / 3)))
	.map((_, i) => [i * 3 + 0, i * 3 + 1, i * 3 + 2]
		.map(j => array[j])));

/**
 * @description Triangulate a faces_vertices with the capability to handle
 * both convex and nonconvex. This will increase the number of faces.
 * You will need to link a reference to the package "Earcut" by Mapbox.
 * Earcut is a small and capable library with zero dependencies.
 * https://www.npmjs.com/package/earcut
 * @param {FOLD} graph a FOLD object.
 * @returns {number[][]} faces_vertices where all faces have only 3 vertices
 * @linkcode
 */
export const triangulateNonConvexFacesVertices = (
	{ vertices_coords, faces_vertices },
	earcut,
) => {
	if (!vertices_coords || !vertices_coords.length) {
		throw new Error(Messages.nonConvexTriangulation);
	}
	const dimensions = vertices_coords.filter(() => true).shift().length;
	return faces_vertices
		.map(fv => fv.flatMap(v => vertices_coords[v]))
		.map(polygon => earcut(polygon, null, dimensions))
		// earcut returns vertices [0...n] local to this one polygon
		// convert these indices back to the face's faces_vertices.
		.map((vertices, i) => vertices
			.map(j => faces_vertices[i][j]))
		.flatMap(res => groupByThree(res));
};

/**
 * @description A subroutine for both convex and non-convex triangulation
 * methods. This will run just after faces_vertices was modified to contain
 * only triangulated faces. This method rebuild faces_edges and
 * add new joined edges edges_vertices, assignment, and foldAngle.
 * @param {FOLD} graph a FOLD object, modified in place
 * @returns {FOLD} the same FOLD object as the parameter
 * @linkcode
 */
const rebuildWithNewFaces = (graph) => {
	if (!graph.edges_vertices) { graph.edges_vertices = []; }
	const edgeLookup = makeVerticesToEdgeBidirectional(graph);
	let e = graph.edges_vertices.length;
	// as we traverse the new faces_edges, if we encounter a new edge, add
	// it here in the form of a new edges_vertices
	const newEdgesVertices = [];
	graph.faces_edges = graph.faces_vertices
		.map(vertices => vertices
			.map((v, i, arr) => {
				const edge_vertices = [v, arr[(i + 1) % arr.length]];
				const vertexPair = edge_vertices.join(" ");
				if (vertexPair in edgeLookup) { return edgeLookup[vertexPair]; }
				newEdgesVertices.push(edge_vertices);
				edgeLookup[vertexPair] = e;
				edgeLookup[edge_vertices.slice().reverse().join(" ")] = e;
				return e++;
			}));
	const newEdgeCount = newEdgesVertices.length;
	graph.edges_vertices.push(...newEdgesVertices);
	if (graph.edges_assignment) {
		graph.edges_assignment.push(...Array(newEdgeCount).fill("J"));
	}
	if (graph.edges_foldAngle) {
		graph.edges_foldAngle.push(...Array(newEdgeCount).fill(0));
	}
	if (graph.vertices_vertices) { delete graph.vertices_vertices; }
	if (graph.vertices_edges) { delete graph.vertices_edges; }
	if (graph.vertices_faces) { delete graph.vertices_faces; }
	if (graph.edges_faces) { delete graph.edges_faces; }
	if (graph.faces_faces) { delete graph.faces_faces; }
	if (graph.faceOrders) { delete graph.faceOrders; }
	return graph;
};

/**
 * @description Given a faces_vertices, generate a nextmap which
 * describes how the faces will change after triangulation,
 * specifically by triangulateConvexFacesVertices or
 * triangulateNonConvexFacesVertices.
 */
const makeTriangulatedFacesNextMap = ({ faces_vertices }) => {
	let count = 0;
	return faces_vertices
		.map(verts => Math.max(3, verts.length))
		.map(length => Array.from(Array(length - 2)).map(() => count++));
};

/**
 * @description Modify a fold graph so that all faces are triangles.
 * This will increase the number of faces and edges, and give all
 * new edges a "J" join assignment.
 * This method is capable of parsing models with convex faces only without
 * any additional help. If your model contains non-convex faces, this method
 * can still triangulate your model, however, you will need to link
 * a reference to the package "Earcut" by Mapbox. Earcut is a small and
 * capable library with zero dependencies: https://www.npmjs.com/package/earcut
 * @param {FOLD} graph a FOLD object, modified in place.
 * @param {object} earcut an optional reference to the Earcut library
 * by Mapbox, required to operate on a graph with non-convex faces.
 * @returns {object} a summary of changes to the input parameter.
 * @todo preserve faceOrders, match preexisting faces against new ones,
 * this may create too much unnecessary data but at least it will work.
 * @linkcode
 */
export const triangulate = (graph, earcut) => {
	if (!graph.faces_vertices) { return {}; }
	const edgeCount = graph.edges_vertices ? graph.edges_vertices.length : 0;
	const nextMap = makeTriangulatedFacesNextMap(graph);
	graph.faces_vertices = earcut
		? triangulateNonConvexFacesVertices(graph, earcut)
		: triangulateConvexFacesVertices(graph);
	// if the graph did not contain edges_vertices after this method, it will
	rebuildWithNewFaces(graph);
	const newEdges = Array
		.from(Array(graph.edges_vertices.length - edgeCount))
		.map((_, i) => edgeCount + i);
	return {
		faces: { map: nextMap },
		edges: { new: newEdges },
	};
};
