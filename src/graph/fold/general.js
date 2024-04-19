/**
 * Rabbit Ear (c) Kraft
 */
import {
	epsilonEqual,
} from "../../math/compare.js";
import {
	pointsToLine2,
} from "../../math/convert.js";
import {
	scale2,
	cross2,
	add2,
	subtract2,
	resize2,
	average2,
} from "../../math/vector.js";
import {
	invertFlatMap,
} from "../maps.js";

/**
 * @param {[number, number][]} points the points which make up the edge
 * in order, where point[0] is at parameter 0, point[1] is at parameter 1.
 * @param {number} parameter
 * @returns {[number, number]} a recalculated point
 */
export const recalculatePointAlongEdge = (points, parameter) => {
	const edgeLine = pointsToLine2(points[0], points[1]);
	return add2(edgeLine.origin, scale2(edgeLine.vector, parameter));
};

/**
 * @param {FOLD} graph a FOLD object, with edges_faces among other arrays
 * @param {object} assignment info about assignment
 * @param {boolean[]} faces_winding the winding direction for each face
 * @param {{ vertices?: { intersect: number[] } }} splitGraphResult
 * @returns {number[]} a list of edge indices which were reassigned
 */
export const reassignCollinearEdges = (
	{ edges_vertices, edges_faces, edges_assignment, edges_foldAngle },
	{ assignment, foldAngle, oppositeAssignment, oppositeFoldAngle },
	faces_winding,
	splitGraphResult,
) => {
	// using the overlapped vertices, make a list of edges collinear to the line
	// these (old) indices will match with the graph from its original state.
	const verticesCollinear = splitGraphResult.vertices.intersect
		.map(v => v !== undefined);

	// these are new edge indices, relating to the graph after modification.
	const collinearEdges = edges_vertices
		.map(verts => verticesCollinear[verts[0]] && verticesCollinear[verts[1]])
		.map((collinear, e) => (collinear ? e : undefined))
		.filter(a => a !== undefined);

	// This upcoming section can be done without edges_assignments.
	// Now, from the list of collinear edges, we need to filter out the ones to
	// ignore from the ones we need to change. One way of doing this, which works
	// in 2D at least, is to check the adjacent faces' windings, if they are the
	// same winding (assuming they lie in the same plane) the crease between them
	// is flat, and should become folded, in which case we can simply take either
	// of its adjacent faces to know which assignment direction to assign.
	const reassignableCollinearEdges = collinearEdges
		.map(edge => ({
			edge,
			faces: edges_faces[edge].filter(a => a !== undefined),
		}))
		.filter(({ faces }) => faces.length === 2)
		.filter(({ faces: [f0, f1] }) => faces_winding[f0] === faces_winding[f1]);

	reassignableCollinearEdges.forEach(({ edge, faces }) => {
		const winding = faces.map(face => faces_winding[face]).shift();
		edges_assignment[edge] = winding ? assignment : oppositeAssignment;
		edges_foldAngle[edge] = winding ? foldAngle : oppositeFoldAngle;
	});

	// list of edge indices which were reassigned
	return reassignableCollinearEdges.map(({ edge }) => edge);
};

/**
 * @param {number} f0 face index
 * @param {number} f1 face index
 * @param {string} assignment
 * @returns {[number, number, number]|undefined}
 */
const adjacentFacesOrdersAssignments = (f0, f1, assignment) => {
	switch (assignment) {
	case "V":
	case "v": return [f0, f1, 1];
	case "M":
	case "m": return [f0, f1, -1];
	default: return undefined;
	}
};

/**
 * @param {number} f0 face index
 * @param {number} f1 face index
 * @param {number} foldAngle
 * @returns {[number, number, number]|undefined}
 */
const adjacentFacesOrdersFoldAngles = (f0, f1, foldAngle) => {
	if (epsilonEqual(foldAngle, 180)) { return [f0, f1, 1]; }
	if (epsilonEqual(foldAngle, -180)) { return [f0, f1, -1]; }
	return undefined;
};

/**
 * @description all pairs of faces are adjacent faces, so they should have
 * similar windings if unfolded. so there are only two arrangements:
 * V: both face's normals point towards the other face. (+1 order)
 * M: both face's normals point away from the other face. (-1 order)
 * in both cases, it doesn't matter which face comes first with respect
 * to the +1 or -1 ordering.
 * @param {FOLD} graph a FOLD object, with edges_faces among other arrays
 * @param {number[]} newEdges a list of new edges
 * @returns {[number, number, number][]} new faceOrders
 */
export const makeNewFaceOrders = ({
	edges_faces, edges_assignment, edges_foldAngle,
}, newEdges) => {
	const edges = newEdges.filter(e => edges_faces[e].length === 2);
	const edgesAdjacentFaces = edges.map(e => edges_faces[e]);

	if (edges_assignment) {
		const assignments = edges.map(e => edges_assignment[e]);
		return edgesAdjacentFaces
			.map(([f0, f1], i) => adjacentFacesOrdersAssignments(f0, f1, assignments[i]))
			.filter(a => a !== undefined);
	}

	if (edges_foldAngle) {
		const angles = edges.map(e => edges_foldAngle[e]);
		return edgesAdjacentFaces
			.map(([f0, f1], i) => adjacentFacesOrdersFoldAngles(f0, f1, angles[i]))
			.filter(a => a !== undefined);
	}

	return [];
};

// /**
//  * @description
//  * @param {FOLD} graph a FOLD object
//  * @param {VecLine2} line one of the new edges added from splitGraph
//  * @param {number[]} newFaces
//  * @returns {number[]} for every face, a +1 or -1
//  */
// const makeFacesSide = ({ vertices_coords, faces_vertices }, line, newFaces) => (
// 	invertFlatMap(newFaces)
// 		.map((_, f) => faces_vertices[f].map(v => vertices_coords[v]))
// 		.map(poly => poly.map(resize2)).map(poly => average2(...poly))
// 		.map(point => cross2(subtract2(point, line.origin), line.vector))
// 		.map(Math.sign));

/**
 * @description
 * @param {FOLD} graph a FOLD object
 * @param {VecLine2} line one of the new edges added from splitGraph
 * @param {number[]} newFaces
 * @returns {number[]} a list of faceOrders indices which are now invalid
 * due to now being two faces on the opposite sides of the dividing line.
 */
export const getInvalidFaceOrders = (
	{ vertices_coords, faces_vertices, faceOrders },
	line,
	newFaces,
) => {
	if (!faceOrders) { return []; }

	// this is a 2D only method, but could be extended into 3D.
	const facesSide = invertFlatMap(newFaces)
		.map((_, f) => faces_vertices[f].map(v => vertices_coords[v]))
		.map(poly => poly.map(resize2)).map(poly => average2(...poly))
		.map(point => cross2(subtract2(point, line.origin), line.vector))
		.map(Math.sign);

	// these are indices of faceOrders which have a relationship between
	// two faces from either side of the cut line. These are new faces which
	// were just made from two old faces which used to be overlapping before
	// becoming split. We can either:
	// - throw these relationships away
	// - in the case of a flat-fold, we can calculate the new relationship
	//   between the faces.
	return faceOrders
		.map(([a, b], i) => ((facesSide[a] === 1 && facesSide[b] === -1)
			|| (facesSide[a] === -1 && facesSide[b] === 1)
			? i
			: undefined))
		.filter(a => a !== undefined);
};

/**
 * @description Given a graph with vertices in foldedForm which has just
 * been split by a cutting line, in the special case where this is a flat-fold
 * in 2D, update the faceOrders to match the state after the fold.
 * Note: the vertices_coords in the folded state refers to the folded state of
 * the graph before the split, so, everything is folded except the new crease
 * line.
 * @param {FOLD} graph a FOLD object
 * @param {number[]} invalidFaceOrders
 * @param {string} assignment
 * @param {boolean[]} faces_winding calculated on new vertices in folded form
 * @returns {undefined}
 */
export const updateFlatFoldedInvalidFaceOrders = (
	{ faceOrders },
	invalidFaceOrders,
	assignment,
	faces_winding,
) => {
	// valley fold:
	// if B's winding is true, A is in front of B, if false A is behind B
	// mountain fold:
	// if B's winding is true, A is behind B, if false A is in front of B
	// "true" and "false" keys here are B's winding.
	const valley = { true: 1, false: -1 };
	const mountain = { true: -1, false: 1 };
	invalidFaceOrders.forEach(i => {
		// face b's normal decides the order.
		const [a, b] = faceOrders[i];
		/** @type {number} */
		const newOrder = assignment === "V" || assignment === "v"
			? valley[faces_winding[b]]
			: mountain[faces_winding[b]];
		faceOrders[i] = [a, b, newOrder];
	});
};
