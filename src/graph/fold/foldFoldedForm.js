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
	makeEdgesFacesUnsorted,
} from "../make/edgesFaces.js";
import {
	makeVerticesCoordsFolded,
} from "../vertices/folded.js";
import {
	faceContainingPoint,
} from "../faces/facePoint.js";
import {
	makeFacesWinding,
} from "../faces/winding.js";
import {
	splitGraphWithLineAndPoints,
} from "../split/splitGraph.js";
import {
	transferPointInFaceBetweenGraphs,
} from "../transfer.js";
import {
	clone,
} from "../../general/clone.js";

/**
 *
 */
const recalculatePointBetweenPoints = (points, parameter) => {
	const edgeLine = pointsToLine(points[0], points[1]);
	return add2(edgeLine.origin, scale2(edgeLine.vector, parameter));
};

/**
 * @description In progress
 */
export const foldFoldedForm = (
	graph,
	{ vector, origin },
	lineDomain = includeL,
	interiorPoints = [],
	vertices_coordsFolded = undefined,
	assignment = "V",
	foldAngle = undefined,
	epsilon = EPSILON,
) => {
	// if user only specifies assignment, fill in the (flat) fold angle for them
	if (foldAngle === undefined) {
		foldAngle = assignmentFlatFoldAngle[assignment] || 0;
	}

	if (vertices_coordsFolded === undefined) {
		const rootFace = faceContainingPoint(graph, origin, vector);
		vertices_coordsFolded = makeVerticesCoordsFolded(graph, [rootFace]);
	}

	// Only M and V will exchange. all others, this will be the same assignment
	const oppositeAssignment = invertAssignment(assignment);
	const oppositeFoldAngle = foldAngle === 0 ? 0 : -foldAngle;

	// we will run the method on the same graph, but swap out the vertices_coords.
	// run the splitGraph method on the folded form but then swap out the coords
	// for the crease pattern coords once finished. backup the cp coords here.
	const vertices_coordsCP = clone(graph.vertices_coords);

	// the split operation will happen to the folded graph.
	// the vertices_coords will be modified in place, so, create a copy in case
	// the user is passing in an argument they don't want modified.
	Object.assign(graph, { vertices_coords: clone(vertices_coordsFolded) });

	// split all edges and faces that are crossed by our line, and place
	// new vertices at the split edges, and inside faces in the case of segment.
	const splitGraphResult = splitGraphWithLineAndPoints(
		graph,
		{ vector, origin },
		lineDomain,
		interiorPoints,
		epsilon,
	);

	console.log("splitGraphResult", splitGraphResult);

	// now that the split operation is complete and new faces have been built,
	// capture the winding of the faces while still in folded form.
	const faces_winding = makeFacesWinding(graph);

	// we need to hold onto these for the upcoming point-transfer methods.
	// vertices_coords from the crease pattern and folded form now differ
	// in length, the folded form contain additional vertices_coords at the end,
	// however, during the parts that do overlap, the vertices match 1:1.
	// (albeit, folded and cp coordinates are different, of course)
	const vertices_coordsFoldedNew = clone(graph.vertices_coords);

	// reassign the crease pattern's vertices back onto the graph. it's likely
	// that the graph is now invalid, as the split created new vertices which
	// are no longer here, but this is only temporary, in the upcoming section
	// we will rebuild and set these new vertices back into the crease pattern
	// space using the intersection information that made them.
	Object.assign(graph, { vertices_coords: vertices_coordsCP });

	// build a copy of the folded form for the transfer method
	const foldedForm = {
		...graph,
		vertices_coords: vertices_coordsFoldedNew,
	};

	const splitGraphVerticesSource = splitGraphResult.vertices.source
		.map((intersect, vertex) => ({ ...intersect, vertex }));

	// at this point, the crease pattern coords have been returned to the graph,
	// but it's still missing the additional vertices that were created during
	// the splitFace / splitEdge methods. the splitGraph method result contains
	// information on how these points were made in folded form space,
	// transfer these points into cp space, via the paramters that created them.
	splitGraphVerticesSource
		.map(el => ("point" in el && "face" in el && "vertex" in el ? el : undefined))
		.filter(a => a !== undefined)
		.forEach(({ point, face, vertex }) => {
			console.log("transfer in face", point, face, vertex);
			graph.vertices_coords[vertex] = transferPointInFaceBetweenGraphs(
				foldedForm,
				graph,
				face,
				point,
			);
		});

	// these points were made along an edge, instead of using trilateration,
	// we can use the edge vector intersection parameter for more precision.
	splitGraphVerticesSource
		.map(el => ("vertices" in el && "vertex" in el && "b" in el ? el : undefined))
		.filter(a => a !== undefined)
		.forEach(({ b, vertices, vertex }) => {
			graph.vertices_coords[vertex] = recalculatePointBetweenPoints(
				vertices.map(v => graph.vertices_coords[v]),
				b,
			);
		});

	// reassign edges to reflect the winding of the face they were created in
	const edgesAttributes = splitGraphResult.edges.source
		.map(({ faces }) => ({
			assign: faces_winding[faces[0]] ? assignment : oppositeAssignment,
			angle: faces_winding[faces[0]] ? foldAngle : oppositeFoldAngle,
		}));

	console.log("edgesAttributes", edgesAttributes);

	if (graph.edges_assignment) {
		edgesAttributes.forEach(({ assign }, edge) => {
			graph.edges_assignment[edge] = assign;
		});
	}
	if (graph.edges_foldAngle) {
		edgesAttributes.forEach(({ angle }, edge) => {
			graph.edges_foldAngle[edge] = angle;
		});
	}

	// collinear edges should be dealt in this way: folded edges can be ignored,
	// flat edges which lie collinear to the fold line must be folded,
	// these edges were missed in the edge construction and assignment inside
	// "splitFace", because these edges already existed.

	// using the overlapped vertices, make a list of edges collinear to the line
	// these (old) indices will match with the graph from its original state.
	const verticesCollinear = splitGraphResult.vertices.intersect
		.map(v => v !== undefined);

	// these are new edge indices, relating to the graph after modification.
	const collinearEdges = graph.edges_vertices
		.map(verts => verticesCollinear[verts[0]] && verticesCollinear[verts[1]])
		.map((collinear, e) => (collinear ? e : undefined))
		.filter(a => a !== undefined);

	// this edges_faces maps new edge indices to new face indices
	const edges_faces = graph.edges_faces
		? graph.edges_faces
		: makeEdgesFacesUnsorted(graph);

	// This can be done without bothering with assignments, we simply check
	// edges_faces and proceed if both face's face windings match in orientation.
	// get the adjacent faces to this edge. initially these are the faces'
	// new indices, but because the faces_winding array is build with
	// old indices we need to change these face indices to their old versions
	const reassignableCollinearEdges = collinearEdges
		.map(edge => ({
			edge,
			faces: edges_faces[edge].filter(a => a !== undefined),
		}))
		.filter(({ faces }) => faces.length === 2)
		.filter(({ faces: [f0, f1] }) => faces_winding[f0] === faces_winding[f1]);

	console.log("reassignableCollinearEdges", reassignableCollinearEdges);

	reassignableCollinearEdges.forEach(({ edge, faces }) => {
		const winding = faces.map(face => faces_winding[face])[0];
		console.log("winding", edge, faces, faces.map(face => faces_winding[face]));
		graph.edges_assignment[edge] = winding ? assignment : oppositeAssignment;
		graph.edges_foldAngle[edge] = winding ? foldAngle : oppositeFoldAngle;
	});

	// console.log("graph", structuredClone(graph));
	// console.log("folded", structuredClone(folded));

	console.log("DONE", structuredClone(graph));

	// {
	// 	vertices: {
	// 		intersect: intersections.vertices,
	// 		source: vertexSource,
	// 	},
	// 	edges: {
	// 		intersect: intersections.edges,
	// 		new: Object.values(oldFaceNewEdge),
	// 		map: edgeMap,
	// 		source: edgeSource,
	// 		collinear: collinearEdges,
	// 	},
	// 	faces: {
	// 		intersect: intersections.faces,
	// 		map: faceMap,
	// 	},
	// }
	return splitGraphResult;
};

/**
 * @description In progress
 */
export const foldFoldedLine = (
	graph,
	line,
	vertices_coordsFolded = undefined,
	assignment = "V",
	foldAngle = undefined,
	epsilon = EPSILON,
) => (
	foldFoldedForm(
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
 * @description In progress
 */
export const foldFoldedRay = (
	graph,
	ray,
	vertices_coordsFolded = undefined,
	assignment = "V",
	foldAngle = undefined,
	epsilon = EPSILON,
) => (
	foldFoldedForm(
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
 * @description In progress
 */
export const foldFoldedSegment = (
	graph,
	segment,
	vertices_coordsFolded = undefined,
	assignment = "V",
	foldAngle = undefined,
	epsilon = EPSILON,
) => (
	foldFoldedForm(
		graph,
		pointsToLine(segment[0], segment[1]),
		includeS,
		segment,
		vertices_coordsFolded,
		assignment,
		foldAngle,
		epsilon,
	));
