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
	assignmentFlatFoldAngle,
	invertAssignment,
} from "../../fold/spec.js";
import {
	mergeNextmaps,
} from "../maps.js";
import {
	makeVerticesCoordsFolded,
} from "../vertices/folded.js";
import {
	faceContainingPoint,
} from "../faces/facePoint.js";
import addVertices from "../add/addVertices.js";
import {
	splitEdge,
} from "../split/splitEdge.js";
import {
	splitFaceWithEdge,
} from "../split/splitFace.js";
import {
	intersectLineAndPoints,
} from "../intersect.js";
import {
	makeFacesWinding,
} from "../faces/winding.js";
import {
	transferPointInFaceBetweenGraphs,
	transferPointOnEdgeBetweenGraphs,
} from "../transfer.js";
import clone from "../../general/clone.js";

const arraysLengthSum = (...arrays) => arrays
	.map(arr => arr.length)
	.reduce((a, b) => a + b, 0);

/**
 * @description
 */
export const newFold = (
	graph,
	{ vector, origin },
	lineDomain = includeL,
	interiorPoints = [],
	vertices_coordsFolded = undefined,
	assignment = "V",
	foldAngle = undefined,
	epsilon = EPSILON,
) => {
	// this method will modify the input graph in this manner:
	// vertices will retain their index but new vertices will be added to the end
	// edge indices will be heavily modified, an edge map will be generated
	// face indices will be heavily modified, a face map will be generated

	// this is required for the trilateration in the case of points inside faces
	const initialGraph = clone({
		vertices_coords: graph.vertices_coords,
		faces_vertices: graph.faces_vertices,
	});

	// if user only specifies assignment, fill in the (flat) fold angle for them
	if (foldAngle === undefined) {
		foldAngle = assignmentFlatFoldAngle[assignment] || 0;
	}

	if (vertices_coordsFolded === undefined) {
		const rootFace = faceContainingPoint(graph, origin, vector);
		vertices_coordsFolded = makeVerticesCoordsFolded(graph, rootFace);
	}

	// graph with folded vertices
	const folded = {
		...graph,
		vertices_coords: vertices_coordsFolded,
	};

	// Only M and V will exchange. all others, this will be the same assignment
	const oppositeAssignment = invertAssignment(assignment);
	const oppositeFoldAngle = foldAngle === 0 ? 0 : -foldAngle;
	const faces_winding = makeFacesWinding(folded);

	// capture the current state of the graph before any changes
	// these will be used as the initial state for the map merging methods
	let edgeMap = graph.edges_vertices.map((_, i) => [i]);
	let faceMap = graph.faces_vertices.map((_, i) => [i]);

	// split all edges and create a list of new vertices
	// for each face that has a new edge crossing it, re-build the face
	// intersections contains: { vertices, edges, faces }
	const intersections = intersectLineAndPoints(
		folded,
		{ vector, origin },
		lineDomain,
		interiorPoints,
		epsilon,
	);

	// the result will be an object mapping a vertex: edge, where the vertex
	// is the vertex's final index, the edge is its previous index before the map
	// which (old) edge now has which (new) vertex along it.
	// where old/new relates to before/after changes to graph edge indices
	const oldEdgeNewVertex = {};

	intersections.edges
		.map((intersection, edge) => (intersection
			? ({ ...intersection, edge })
			: undefined))
		.filter(a => a !== undefined)
		.forEach(({ b, edge }) => {
			const newEdge = edgeMap[edge][0];
			const cpPoint = transferPointOnEdgeBetweenGraphs(graph, newEdge, b);
			const { vertex, edges: { map } } = splitEdge(graph, newEdge, cpPoint);
			edgeMap = mergeNextmaps(edgeMap, map);
			oldEdgeNewVertex[edge] = vertex;
		});

	// rebuild face with new edges:
	// face indices will change, vertices edges don't change from here on out

	// collect all new edges, store them as values under
	// the index of the face (original index) they were made to be apart of.
	const oldFaceNewEdge = {};

	// this is a subset of the faces which are easy to solve,
	// where the intersection has resulted in 2 events.
	// also, pack the face index into the object with everything else.
	intersections.faces
		.map(({ vertices, edges, points }, face) => ({ vertices, edges, points, face }))
		.filter(({ vertices, edges, points }) => (
			arraysLengthSum(vertices, edges, points) === 2))
		.forEach(({ vertices, edges, points, face }) => {
			const newFace = faceMap[face][0];
			const assign = faces_winding[face] ? assignment : oppositeAssignment;
			const angle = faces_winding[face] ? foldAngle : oppositeFoldAngle;

			// these are the vertices which were created when an edge was split
			const splitEdgesVertices = edges.map(({ edge }) => oldEdgeNewVertex[edge]);

			// for any isolated points inside the face, transfer the coordinates
			// from the folded space into the crease pattern space.
			// use the old face index, we are using the old faces_vertices array.
			const transferredPoints = points.map(({ point }) => (
				transferPointInFaceBetweenGraphs(folded, initialGraph, face, point)));

			// add any isolated points inside the face as new vertices,
			// if none exist, this array will be empty.
			const isolatedPointVertices = addVertices(graph, transferredPoints);

			// the list of all vertices involved in splitting this face (total 2),
			// comes from one of three places:
			// - intersected vertices
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
			} = splitFaceWithEdge(graph, newFace, newEdgeVertices, assign, angle);
			faceMap = mergeNextmaps(faceMap, map);
			oldFaceNewEdge[face] = newEdgeIndex;
		});

	return {
		edges: {
			new: Object.values(oldFaceNewEdge),
			map: edgeMap,
		},
		faces: {
			map: faceMap,
		},
	};
};
