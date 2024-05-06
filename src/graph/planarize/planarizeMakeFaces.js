/**
 * Rabbit Ear (c) Kraft
 */
import {
	makePlanarFaces,
} from "../make/faces.js";
import {
	arrayIntersection,
} from "../../general/array.js";
import {
	makeEdgesFacesUnsorted,
} from "../make/edgesFaces.js";
import {
	makeFacesEdgesFromVertices,
} from "../make/facesEdges.js";
import {
	invertArrayMap,
} from "../maps.js";

// the face-matching algorithm should go like this:
// prerequisite: vertex map
// the data structure should do something like
// - for every face, here is a list of its vertices.
// - using the vertex-map, find a face with 3 or more matching vertices
// we can't depend on them being in order, because it's possible that for
// every vertex in the face, each edge was split inserting new vertices
// between every pair of old vertices.

// call arrayIntersection, but inside the reduce, where the initial
// value is []- in which case, don't perform an intersection just
// return the second array (the current value).
const callArrayIntersection = (a, b) => (!a.length
	? b
	: arrayIntersection(a, b));

/**
 * @param {FOLD} graph the input graph from the very start of the planarize()
 * @param {number[][]} faces_edgesNew the faces_edges from the new graph
 * @param {number[][]} edgesBackmap
 * @returns {number[][]}
 */
const makeFaceBackmap = (
	{ edges_vertices, edges_faces, faces_vertices, faces_edges },
	faces_edgesNew,
	edgesBackmap,
) => {
	if (!faces_vertices && !faces_edges) { return []; }
	if (!faces_edges) {
		faces_edges = makeFacesEdgesFromVertices({ edges_vertices, faces_vertices });
	}
	if (!edges_faces) {
		edges_faces = makeEdgesFacesUnsorted({ edges_vertices, faces_vertices, faces_edges });
	}

	return faces_edgesNew
		.map(edges => edges.filter(e => edgesBackmap[e] !== undefined))
		.map(edges => edges
			.map(newE => edgesBackmap[newE].flatMap(oldE => edges_faces[oldE]))
			.filter(a => a.length)
			.reduce((a, b) => callArrayIntersection(a, b), []));
	// these are array maps with only one item, they can be changed into flat maps
	// but the only use case is to merge them, and that method takes either.
	// .map(arr => arr[0]);
};

/**
 * @description This is the final step of a planarize method, rebuild faces
 * and create a map that relates each of the new faces to the old faces
 * from which it came.
 * @param {FOLD} oldGraph the input graph from before any changes,
 * "edgeBackmap" relates this graph to the newGraph
 * @param {FOLD} newGraph the planar graph after all changes to it,
 * "edgeBackmap" relates this graph to the oldGraph
 * @param {number[][]} edgeBackmap
 * @returns {{
 *   faces_vertices: number[][],
 *   faces_edges: number[][],
 *   faceMap: number[][],
 * }} new face information for the newGraph, and a map relating the new
 * faces to the old faces.
 */
export const planarizeMakeFaces = (oldGraph, newGraph, edgeBackmap) => {
	const {
		faces_vertices,
		faces_edges,
	} = makePlanarFaces(newGraph);
	const faceBackMap = makeFaceBackmap(
		oldGraph,
		faces_edges,
		edgeBackmap,
	);
	return {
		faces_vertices,
		faces_edges,
		faceMap: invertArrayMap(faceBackMap),
	};
};

/**
 * @description Turns out this is not an ideal way of finding faces,
 * a face can be cut so that only one vertex survives, a vertex which
 * is adjacent to more than one face, so the only way to tell which face
 * it ISN'T is by process of elimination, and I'm not sure this will actually
 * generate a definitive mapping. One way which does work is using edges
 * instead of vertices, which was implemented above.
 * @param {FOLD} oldGraph
 * @param {FOLD} newGraph
 * @param {number[][]} vertexBackmap
 * @returns {number[][]}
 */
// const matchFacesUsingVertices = (oldGraph, newGraph, vertexBackmap) => {
// 	if (!oldGraph.faces_vertices) { return undefined; }
// 	const vertices_faces = makeVerticesFacesUnsorted(oldGraph);
// 	console.log("vertices_faces", vertices_faces);
// 	// vertexBackmap
// 	const res = newGraph.faces_vertices
// 		.map(vertices => vertices.filter(v => vertexBackmap[v] !== undefined))
// 		.map(vertices => vertices
// 			.map(newV => vertexBackmap[newV].flatMap(oldV => vertices_faces[oldV])));
// 	console.log("RES", res);
// 	const res2 = newGraph.faces_vertices
// 		.map(vertices => vertices.filter(v => vertexBackmap[v] !== undefined))
// 		.map(vertices => vertices
// 			.map(newV => vertexBackmap[newV].flatMap(oldV => vertices_faces[oldV]))
// 			.reduce((a, b) => arrayIntersection(a, b)));
// 	console.log("RES", res2);

// 	// if (oldGraph.faces_vertices) {}
// 	return [];
// };
