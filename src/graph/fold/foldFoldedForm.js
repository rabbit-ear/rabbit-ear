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
	mergeArraysWithHoles,
} from "../../general/array.js";
import {
	transferPointBetweenGraphs,
	transferPointOnEdgeBetweenGraphs,
} from "../transfer.js";
import {
	makeEdgesFacesUnsorted,
} from "../make.js";
import {
	splitLineIntoEdges,
} from "../split/splitLine.js";
import {
	makeFacesWinding,
} from "../faces/winding.js";

/**
 * @description 
 */
const transferPoint = (from, to, { edge, face, point, b }) => {
	if (edge !== undefined) {
		return transferPointOnEdgeBetweenGraphs(from, to, edge, b);
	}
	if (face !== undefined) {
		return transferPointBetweenGraphs(from, to, face, point);
	}
	return point;
};

/**
 * @description 
 */
export const foldFoldedForm = (
	cp,
	folded,
	line,
	lineDomain = includeL,
	interiorPoints = [],
	assignment = "V",
	foldAngle = undefined,
	epsilon = EPSILON,
) => {
	// if user only specifies assignment, fill in the (flat) fold angle for them
	if (foldAngle === undefined) {
		foldAngle = assignmentFlatFoldAngle[assignment] || 0;
	}

	// Only M and V will exchange. all others, this will be the same assignment
	const oppositeAssignment = invertAssignment(assignment);
	const oppositeFoldAngle = foldAngle === 0 ? 0 : -foldAngle;
	const faces_winding = makeFacesWinding(folded);

	const {
		vertices,
		edges_vertices,
		edges_collinear,
		edges_face,
	} = splitLineIntoEdges(
		folded,
		line,
		lineDomain,
		interiorPoints,
		epsilon,
	);

	const edges_assignment = edges_face
		.map((face) => (faces_winding[face] ? assignment : oppositeAssignment));
	const edges_foldAngle = edges_face
		.map((face) => (faces_winding[face] ? foldAngle : oppositeFoldAngle));

	// splitSegmentWithGraph created new points in the foldedForm coordinate
	// space. we need to transfer these to their respective position in the
	// crease pattern space. 2 different methods depending on how the point was made
	const vertices_coords = vertices
		.map(pointInfo => transferPoint(folded, cp, pointInfo));

	cp.vertices_coords = mergeArraysWithHoles(cp.vertices_coords, vertices_coords);
	cp.edges_vertices = mergeArraysWithHoles(cp.edges_vertices, edges_vertices);
	cp.edges_assignment = mergeArraysWithHoles(cp.edges_assignment, edges_assignment);
	cp.edges_foldAngle = mergeArraysWithHoles(cp.edges_foldAngle, edges_foldAngle);

	// collinear edges should be dealt in this way:
	// if the edge is alredy a M or V, we can ignore it
	// if the edge is a F or U, we need to fold it, and we need to know which
	// direction, this is done by checking one of its two neighboring faces
	// (edges_faces), they should be the same winding, so just grab one.
	const reassignable = { F: true, f: true, U: true, u: true };

	// this is the crease pattern's edges_faces (not edges_face from above)
	const edges_faces = cp.edges_faces ? cp.edges_faces : makeEdgesFacesUnsorted(cp);

	edges_collinear
		.map((collinear, e) => (collinear ? e : undefined))
		.filter(a => a !== undefined)
		.forEach(edge => {
			// if edge is F or U:
			if (!reassignable[cp.edges_assignment[edge]]) { return; }
			const face = edges_faces[edge]
				.filter(a => a !== undefined)
				.shift();
			const winding = faces_winding[face];
			cp.edges_assignment[edge] = winding ? assignment : oppositeAssignment;
			cp.edges_foldAngle[edge] = winding ? foldAngle : oppositeFoldAngle;
		});

	return cp;
};

/**
 * @description 
 */
export const foldFoldedFormLine = (
	cp,
	folded,
	line,
	assignment = "V",
	foldAngle = undefined,
	epsilon = EPSILON,
) => (
	foldFoldedForm(
		cp,
		folded,
		line,
		includeL,
		[],
		assignment,
		foldAngle,
		epsilon,
	));

/**
 * @description 
 */
export const foldFoldedFormRay = (
	cp,
	folded,
	ray,
	assignment = "V",
	foldAngle = undefined,
	epsilon = EPSILON,
) => (
	foldFoldedForm(
		cp,
		folded,
		ray,
		includeR,
		[ray.origin],
		assignment,
		foldAngle,
		epsilon,
	));

/**
 * @description 
 */
export const foldFoldedFormSegment = (
	cp,
	folded,
	segment,
	assignment = "V",
	foldAngle = undefined,
	epsilon = EPSILON,
) => (
	foldFoldedForm(
		cp,
		folded,
		pointsToLine(...segment),
		includeS,
		segment,
		assignment,
		foldAngle,
		epsilon,
	));
