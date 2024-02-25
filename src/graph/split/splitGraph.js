/**
 * Rabbit Ear (c) Kraft
 */
import {
	EPSILON,
} from "../../math/constant.js";
import {
	includeL,
	includeR,
	includeS,
} from "../../math/compare.js";
import {
	pointsToLine,
} from "../../math/convert.js";
import {
	mergeNextmaps,
} from "../maps.js";
import {
	intersectLineAndPoints,
} from "../intersect.js";
import {
	splitEdge,
} from "./splitEdge.js";
import {
	splitFace,
} from "./splitFace.js";
import {
	filterCollinearFacesData,
} from "./general.js";
import addVertices from "../add/addVertices.js";

/**
 *
 */
const arraysLengthSum = (...arrays) => arrays
	.map(arr => arr.length)
	.reduce((a, b) => a + b, 0);

/**
 * @description
 */
export const splitGraphWithLineAndPoints = (
	graph,
	{ vector, origin },
	lineDomain = includeL,
	interiorPoints = [],
	epsilon = EPSILON,
) => {
	// todo: test with graph with no faces_vertices
	if (!graph.vertices_coords || !graph.edges_vertices) {
		return {};
	}

	// this method will modify the input graph in this manner:
	// - vertices will not shift around, new vertices will be added to the end
	// - edge indices will be heavily modified, an edge map will be generated
	// - face indices will be heavily modified, a face map will be generated
	let edgeMap = graph.edges_vertices.map((_, i) => [i]);
	let faceMap = graph.faces_vertices.map((_, i) => [i]);

	// for each new vertex (index), an object that describes how that vertex
	// was created, which will be 1 of 2 ways:
	// - splitting an edge: { a, b, vertices, point }
	// - interior point in face: { face, point }
	const vertexSource = [];

	// for each new edge (index), an object that describes how that edge
	// was created. this does not include edges split from 1 into 2, but
	// does include entirely new edges made to split a face.
	const edgeSource = [];

	// split all edges and create a list of new vertices
	// for each face that has a new edge crossing it, re-build the face
	// intersections contains: { vertices, edges, faces }
	const intersections = intersectLineAndPoints(
		graph,
		{ vector, origin },
		lineDomain,
		interiorPoints,
		epsilon,
	);

	// intersectLineAndPoints will return face intersections that includes all
	// vertex overlaps. When a face is convex and only two of its vertices
	// are overlapped and those vertices are neighbors, we want to exclude this
	// intersection as it does not cross through the face.
	filterCollinearFacesData(graph, intersections);

	// This is required for the splitFace method, where we are given a face's
	// intersected edges, which were split in splitEdge and a new vertex made,
	// so, we need to provide the new vertex index for the old edge index.
	// this object maps an old edge's index (index) to a new vertex's index (value)
	const oldEdgeNewVertex = {};

	// edge entry will be undefined if no intersection, filter these out,
	// for each intersected edge, get the current index of this (old) edge index,
	// split the edge creating two edges and one vertex, and update the edge map.
	// store the source for how this vertex was made (edge split object).
	intersections.edges
		.map((intersection, edge) => (intersection
			? ({ ...intersection, edge })
			: undefined))
		.filter(a => a !== undefined)
		.forEach(({ a, b, point, edge }) => {
			const newEdge = edgeMap[edge][0];
			const vertices = [...graph.edges_vertices[newEdge]];
			const { vertex, edges: { map } } = splitEdge(graph, newEdge, point);

			// the intersection information that created this vertex
			vertexSource[vertex] = { a, b, vertices, inEdge: edge, point };

			// edge indices were heavily modified, update the edge map
			edgeMap = mergeNextmaps(edgeMap, map);
			oldEdgeNewVertex[edge] = vertex;
		});

	// collect all new edges, store them as values under
	// the index of the face (original index) they were made to be apart of.
	const oldFaceNewEdge = {};

	// faces' intersections can be from overlapped vertices, overlapped edges,
	// or from interior points inside the face. We are considering only the cases
	// where two of these events exist per face. This cuts out non-convex faces.
	intersections.faces
		.map(({ vertices, edges, points }, face) => ({ vertices, edges, points, face }))
		.filter(({ vertices, edges, points }) => (
			arraysLengthSum(vertices, edges, points) === 2))
		.forEach(({ vertices, edges, points, face }) => {
			const newFace = faceMap[face][0];

			// for faces intersected at the edge, this edge was just split and a new
			// vertex was created. use the edge indices to get these new vertices
			const splitEdgesVertices = edges.map(({ edge }) => oldEdgeNewVertex[edge]);

			// for faces containing an isolated point inside it, add this point(s)
			// to the graph as a new vertex (or vertices).
			const isolatedPointVertices = addVertices(graph, points);

			// the list of all vertices involved in splitting this face,
			// which will sum to length 2, comes from one of three places:
			// - overlapped, pre-existing vertices
			// - vertices created by intersected edges
			// - isolated points inside of the face
			const newEdgeVertices = vertices.map(({ vertex }) => vertex)
				.concat(splitEdgesVertices)
				.concat(isolatedPointVertices);

			// split face, make one new edge, this changes the face indice to the
			// point of needing a map. new edge simply added to end of edge arrays
			const {
				edge: newEdgeIndex,
				faces: { map },
			} = splitFace(graph, newFace, newEdgeVertices);

			// new edge (and possibly new vertices) were just created, update
			// the source information that created these new components.
			edgeSource[newEdgeIndex] = { faces: face };
			isolatedPointVertices.forEach((vertex, i) => {
				vertexSource[vertex] = { face, point: points[i] };
			});

			// face indices were heavily modified, update the face map
			faceMap = mergeNextmaps(faceMap, map);
			oldFaceNewEdge[face] = newEdgeIndex;
		});

	// these were set to the old face indices and need updating
	vertexSource.forEach(({ face }, i) => {
		if (face !== undefined) { vertexSource[i].face = faceMap[face]; }
	});
	edgeSource.forEach(({ faces }, i) => {
		if (faces !== undefined) { edgeSource[i].faces = faceMap[faces]; }
	});

	// // using the overlapped vertices, make a list of edges collinear to the line
	// // these (old) indices will match with the graph from its original state.
	// const verticesCollinear = intersections.vertices.map(v => v !== undefined);
	// const edges_collinear = graph.edges_vertices
	// 	.map(verts => verticesCollinear[verts[0]] && verticesCollinear[verts[1]]);

	// // these are new edge indices, relating to the graph after modification.
	// const collinearEdges = edges_collinear
	// 	.map((collinear, e) => (collinear ? e : undefined))
	// 	.filter(a => a !== undefined)
	// 	.flatMap(edge => (edgeMap[edge] || []));

	return {
		vertices: {
			intersect: intersections.vertices,
			source: vertexSource,
		},
		edges: {
			intersect: intersections.edges,
			new: Object.values(oldFaceNewEdge),
			map: edgeMap,
			source: edgeSource,
			// collinear: collinearEdges,
		},
		faces: {
			intersect: intersections.faces,
			map: faceMap,
		},
	};
};

export const splitGraphWithLine = (graph, line, epsilon = EPSILON) => (
	splitGraphWithLineAndPoints(
		graph,
		line,
		includeL,
		[],
		epsilon,
	));

export const splitGraphWithRay = (graph, ray, epsilon = EPSILON) => (
	splitGraphWithLineAndPoints(
		graph,
		ray,
		includeR,
		[ray.origin],
		epsilon,
	));

export const splitGraphWithSegment = (graph, segment, epsilon = EPSILON) => (
	splitGraphWithLineAndPoints(
		graph,
		pointsToLine(...segment),
		includeS,
		segment,
		epsilon,
	));
