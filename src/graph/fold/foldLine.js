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
	add2,
	scale2,
} from "../../math/vector.js";
import {
	assignmentFlatFoldAngle,
	invertAssignment,
} from "../../fold/spec.js";
import {
	invertArrayToFlatMap,
	mergeNextmaps,
} from "../maps.js";
import {
	makeEdgesFacesUnsorted,
} from "../make.js";
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
	splitFaceWithVertices,
} from "../split/splitFace.js";
import {
	intersectLineAndPoints,
} from "../intersect.js";
import {
	makeFacesWinding,
} from "../faces/winding.js";
import {
	transferPointInFaceBetweenGraphs,
} from "../transfer.js";
import {
	filterCollinearFacesData,
} from "../split/general.js";
import clone from "../../general/clone.js";

/**
 * @description Transfer a point from one graph to another, given the
 * two graphs are isomorphic, but contain different vertices coords.
 * Use this method when the point lies along an edge, we can use the
 * edge parameter (along the edge's vector) to very precisely calculate
 * the position of the point in the new graph.
 * This method is more precise than transferPointBetweenGraphs.
 * @param {FOLD} from a FOLD object which the point now lies inside
 * @param {FOLD} to a FOLD object we want to move the point into
 * @param {number} edge the index of the edge which this point lies on
 * @param {number} parameter the parameter along the edge's vector where
 * this point lies.
 * @returns {number[]} a new point
 */
const transferPointOnEdgeBetweenGraphs = (to, edge, parameter) => {
	const edgeSegment = to.edges_vertices[edge]
		.map(v => to.vertices_coords[v]);
	const edgeLine = pointsToLine(...edgeSegment);
	return add2(edgeLine.origin, scale2(edgeLine.vector, parameter));
};

const arraysLengthSum = (...arrays) => arrays
	.map(arr => arr.length)
	.reduce((a, b) => a + b, 0);

/**
 * @description
 */
export const splitGraphWithLine = (
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

	// this is required to trilaterate isolated points inside faces because
	// the intersection information is tied to the graph in this state.
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

	filterCollinearFacesData(graph, intersections);

	// using the overlapped vertices, make a list of edges collinear to the line
	// these (old) indices will match with the graph from its original state.
	const verticesCollinear = intersections.vertices.map(v => v !== undefined);
	const edges_collinear = graph.edges_vertices
		.map(verts => verticesCollinear[verts[0]] && verticesCollinear[verts[1]]);

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

			// console.log(`splitting face (${face}/${newFace}) V:${vertices.length} E:${edges.length} P:${points.length}`);
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
			} = splitFaceWithVertices(graph, newFace, newEdgeVertices, assign, angle);
			faceMap = mergeNextmaps(faceMap, map);
			oldFaceNewEdge[face] = newEdgeIndex;
		});

	// collinear edges should be dealt in this way: folded edges can be ignored,
	// flat edges which lie collinear to the fold line must be folded,
	// these edges were missed in the edge construction and assignment inside
	// "splitFace", because these edges already existed.

	// these are new edge indices, relating to the graph after modification.
	const collinearEdges = edges_collinear
		.map((collinear, e) => (collinear ? e : undefined))
		.filter(a => a !== undefined)
		.flatMap(edge => (edgeMap[edge] || []));

	// this edges_faces maps new edge indices to new face indices
	// const edges_faces = makeEdgesFacesUnsorted(graph);
	const edges_faces = graph.edges_faces
		? graph.edges_faces
		: makeEdgesFacesUnsorted(graph);

	// this maps new face indices (index) to old face indices (values)
	const faceOldMap = invertArrayToFlatMap(faceMap);

	// This can be done without bothering with assignments, we simply check
	// edges_faces and proceed if both face's face windings match in orientation.
	// get the adjacent faces to this edge. initially these are the faces'
	// new indices, but because the faces_winding array is build with
	// old indices we need to change these face indices to their old versions
	const reassignableCollinearEdges = collinearEdges
		.map(edge => ({
			edge,
			faces: edges_faces[edge]
				.map(f => faceOldMap[f])
				.filter(a => a !== undefined),
		}))
		.filter(({ faces }) => faces.length === 2)
		.filter(({ faces: [f0, f1] }) => faces_winding[f0] === faces_winding[f1]);

	reassignableCollinearEdges.forEach(({ edge, faces }) => {
		const winding = faces.map(face => faces_winding[face])[0];
		graph.edges_assignment[edge] = winding ? assignment : oppositeAssignment;
		graph.edges_foldAngle[edge] = winding ? foldAngle : oppositeFoldAngle;
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

/**
 * @description
 */
export const foldLine = (
	graph,
	line,
	vertices_coordsFolded = undefined,
	assignment = "V",
	foldAngle = undefined,
	epsilon = EPSILON,
) => (
	splitGraphWithLine(
		graph,
		line,
		includeL,
		[],
		vertices_coordsFolded,
		assignment,
		foldAngle,
		epsilon,
	));

/**
 * @description
 */
export const foldRay = (
	graph,
	ray,
	vertices_coordsFolded = undefined,
	assignment = "V",
	foldAngle = undefined,
	epsilon = EPSILON,
) => (
	splitGraphWithLine(
		graph,
		ray,
		includeR,
		[ray.origin],
		vertices_coordsFolded,
		assignment,
		foldAngle,
		epsilon,
	));

/**
 * @description
 */
export const foldSegment = (
	graph,
	segment,
	vertices_coordsFolded = undefined,
	assignment = "V",
	foldAngle = undefined,
	epsilon = EPSILON,
) => (
	splitGraphWithLine(
		graph,
		pointsToLine(...segment),
		includeS,
		segment,
		vertices_coordsFolded,
		assignment,
		foldAngle,
		epsilon,
	));
