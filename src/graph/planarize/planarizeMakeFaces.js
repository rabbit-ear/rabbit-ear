/**
 * Rabbit Ear (c) Kraft
 */
import {
	makeVerticesFacesUnsorted,
} from "../make/verticesFaces.js";
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

/**
 * @description Turns out this is not an ideal way of
 * @param {FOLD} oldGraph
 * @param {FOLD} newGraph
 * @param {number[][]} vertexBackmap
 * @returns {number[][]}
 */
const matchFacesUsingVertices = (oldGraph, newGraph, vertexBackmap) => {
	if (!oldGraph.faces_vertices) { return undefined; }
	const vertices_faces = makeVerticesFacesUnsorted(oldGraph);
	console.log("vertices_faces", vertices_faces);
	// vertexBackmap
	const res = newGraph.faces_vertices
		.map(vertices => vertices.filter(v => vertexBackmap[v] !== undefined))
		.map(vertices => vertices
			.map(newV => vertexBackmap[newV].flatMap(oldV => vertices_faces[oldV])));
	console.log("RES", res);
	const res2 = newGraph.faces_vertices
		.map(vertices => vertices.filter(v => vertexBackmap[v] !== undefined))
		.map(vertices => vertices
			.map(newV => vertexBackmap[newV].flatMap(oldV => vertices_faces[oldV]))
			.reduce((a, b) => arrayIntersection(a, b)));
	console.log("RES", res2);

	// if (oldGraph.faces_vertices) {}
	return [];
};

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
	// console.log("edgesBackmap", edgesBackmap);
	// const res = newGraph.faces_edges
	// 	.map(edges => edges.filter(e => edgesBackmap[e] !== undefined))
	// 	.map(edges => edges
	// 		.map(newE => edgesBackmap[newE].flatMap(oldE => edges_faces[oldE])));
	// console.log("RES", res);
	return faces_edgesNew
		.map(edges => edges.filter(e => edgesBackmap[e] !== undefined))
		.map(edges => edges
			.map(newE => edgesBackmap[newE].flatMap(oldE => edges_faces[oldE]))
			.filter(a => a.length)
			.reduce((a, b) => callArrayIntersection(a, b), []));
		// .map(arr => arr[0]);
};

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
