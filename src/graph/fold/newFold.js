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
	assignmentFlatFoldAngle,
	invertAssignment,
} from "../../fold/spec.js";
import {
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
import {
	validate,
} from "../validate.js";
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

	// this is required for trilateration for isolated points inside faces
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

	const isValid = validate(graph);
	console.log("validate", isValid);

	// this is the crease pattern's edges_faces (not edges_face from above)
	// const edges_faces = graph.edges_faces
	// 	? graph.edges_faces
	// 	: makeEdgesFacesUnsorted(graph);
	const edges_faces = makeEdgesFacesUnsorted(graph);

	console.log("graph.edges_faces", graph.edges_faces);
	console.log("edges_faces", edges_faces);

	// collinear edges should be dealt in this way:
	// if the edge is alredy a M or V, we can ignore it
	// if the edge is a F or U, we need to fold it, and we need to know which
	// direction, this is done by checking one of its two neighboring faces
	// (edges_faces), they should be the same winding, so just grab one.
	const reassignable = { F: true, f: true, U: true, u: true };

	// using the overlapped vertices, make a list of edges collinear to the line
	const verticesCollinear = intersections.vertices.map(v => v !== undefined);
	const edges_collinear = graph.edges_vertices
		.map(verts => verticesCollinear[verts[0]] && verticesCollinear[verts[1]]);

	console.log("verticesCollinear", verticesCollinear);
	console.log("edges_collinear", edges_collinear);

	edges_collinear
		.map((collinear, e) => (collinear ? e : undefined))
		.filter(a => a !== undefined)
		.forEach(edge => {
			if (!reassignable[graph.edges_assignment[edge]]) { return; }
			const face = edges_faces[edge]
				.filter(a => a !== undefined)
				.shift();
			console.log("edges_faces[edge]", edges_faces[edge]);
			const winding = faces_winding[face];
			console.log("winding", winding);
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
	newFold(
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
	newFold(
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
	newFold(
		graph,
		pointsToLine(...segment),
		includeS,
		segment,
		vertices_coordsFolded,
		assignment,
		foldAngle,
		epsilon,
	));
