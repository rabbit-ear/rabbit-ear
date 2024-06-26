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
	pointsToLine2,
} from "../../math/convert.js";
import {
	resize2,
} from "../../math/vector.js";
import {
	clone,
} from "../../general/clone.js";
import {
	assignmentFlatFoldAngle,
	invertAssignment,
} from "../../fold/spec.js";
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
	makeEdgesFacesUnsorted,
} from "../make/edgesFaces.js";
import {
	makeEdgesFoldAngle,
} from "../make/edgesFoldAngle.js";
import {
	recalculatePointAlongEdge,
	reassignCollinearEdges,
	updateFaceOrders,
} from "./general.js";

/**
 * @typedef FoldGraphEvent
 * @type {{
 *   edges?: {
 *     new: number[],
 *     map: (number|number[])[],
 *     reassigned: number[],
 *   },
 *   faces?: {
 *     new: number[],
 *     map: (number|number[])[],
 *   },
 * }}
 * @description an object which summarizes the changes to the graph.
 */

/**
 * @description Crease a fold line/ray/segment through a folded origami model.
 * This method takes in and returns a crease pattern but performs the fold
 * on the folded form; this approach maintains better precision especially
 * in the case of repeated calls to fold an origami model.
 * @param {FOLD} graph a FOLD object, in creasePattern form, modified in place
 * @param {VecLine2} foldLine a fold line
 * @param {Function} [lineDomain=includeL] a domain function
 * characterizing the line into a line, ray, or segment
 * @param {[number, number][]} interiorPoints in the case of a ray or segement,
 * supply the endpoint(s) here.
 * @param {string} [assignment="V"] the assignment to be applied to the
 * intersected faces with counter-clockwise winding. Clockwise-wound faces
 * will get the opposite assignment
 * @param {number} [foldAngle] the fold angle to be applied, similarly as
 * the assignment
 * @param {[number, number][]|[number, number, number][]} vertices_coordsFolded
 * a copy of the vertices_coords, in folded form
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {FoldGraphEvent} an object summarizing the changes to the graph
 */
export const foldGraph = (
	graph,
	{ vector, origin },
	lineDomain = includeL,
	interiorPoints = [],
	assignment = "V",
	foldAngle = undefined,
	vertices_coordsFolded = undefined,
	epsilon = EPSILON,
) => {
	// if the user asks for a foldAngle, but edges_foldAngle array does not exist,
	// we have to explicitly add it otherwise it will be skipped later on.
	if (foldAngle !== undefined && !graph.edges_foldAngle && graph.edges_assignment) {
		graph.edges_foldAngle = makeEdgesFoldAngle(graph);
	}
	if (!graph.edges_faces) {
		graph.edges_faces = makeEdgesFacesUnsorted(graph);
	}

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

	// new faces, used for the return object, and used to update faceOrders
	const newFaces = Array.from(new Set(splitGraphResult.edges.new
		.flatMap(e => graph.edges_faces[e])));

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

	// at this point, the crease pattern coords have been returned to the graph,
	// aside from the additional vertices that were created during
	// the splitFace / splitEdge methods. Currently, these are still in
	// the folded-form space. the splitGraph method result contains
	// information on how these points were made in folded form space,
	// transfer these points into cp space, via the paramters that created them.
	const splitGraphVerticesSource = splitGraphResult.vertices.source
		.map((intersect, vertex) => ({ ...intersect, vertex }));

	// these points lie somewhere in the inside of a face. use trilateration
	// to move the point from the same location in the folded face to the cp face.
	splitGraphVerticesSource
		.map(el => ("point" in el && "face" in el && "faces" in el && "vertex" in el
			? el
			: undefined))
		.filter(a => a !== undefined)
		// .forEach(({ point, face, faces, vertex }) => {
		.forEach(({ point, faces, vertex }) => {
			// "face" relates to the graph before splitGraphWithLineAndPoints was called.
			// "faces" indices relate to the new graph, it will have one or two indices.
			// which of the two face indices should we use?
			// console.log("transfer in face", point, face, vertex);
			graph.vertices_coords[vertex] = transferPointInFaceBetweenGraphs(
				foldedForm,
				graph,
				faces[0], // todo, ensure that this is okay
				point,
			);
		});

	// these points were made along an edge, instead of using trilateration,
	// we can use the edge vector intersection parameter for more precision.
	splitGraphVerticesSource
		.map(el => ("vertices" in el && "vertex" in el && "b" in el ? el : undefined))
		.filter(a => a !== undefined)
		.forEach(({ b, vertices, vertex }) => {
			graph.vertices_coords[vertex] = recalculatePointAlongEdge(
				vertices.map(v => graph.vertices_coords[v]).map(resize2),
				b,
			);
		});

	// the result of calling splitGraph contains a list of all new edges that
	// were created, each edge contains a reference to the face(s) it lies inside:
	// "face": the index of the edge's face before the graph was modified
	// "faces": the indices of the edge's new faces in the graph after being split
	// use "faces" to grab the edge's face, look up the winding of this face, and
	// assign either the assignment or the inverted assignment accordingly.
	const edgesAttributes = splitGraphResult.edges.source
		.map(({ faces }) => ({
			assign: faces_winding[faces[0]] ? assignment : oppositeAssignment,
			angle: faces_winding[faces[0]] ? foldAngle : oppositeFoldAngle,
		}));

	// only apply the assignment and fold angle if the graph contains these
	// arrays, this way, a simple flat-folded graph won't be forced to
	// include edges_foldAngle if it is unnecessary.
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
	const edgesReassigned = reassignCollinearEdges(
		graph,
		{ assignment, foldAngle, oppositeAssignment, oppositeFoldAngle },
		faces_winding,
		splitGraphResult,
	);

	updateFaceOrders(
		graph,
		{ ...graph, vertices_coords: vertices_coordsFoldedNew },
		{ vector, origin },
		foldAngle,
		faces_winding,
		[...splitGraphResult.edges.new, ...edgesReassigned],
		newFaces,
	);

	return {
		edges: {
			map: splitGraphResult.edges.map,
			new: splitGraphResult.edges.new,
			reassigned: edgesReassigned,
		},
		faces: {
			map: splitGraphResult.faces.map,
			new: newFaces,
		},
	};
};

/**
* @description Crease a fold line through a folded origami model.
* This method takes in and returns a crease pattern but performs the fold
* on the folded form; this approach maintains better precision especially
* in the case of repeated calls to fold an origami model.
 * @param {FOLD} graph a FOLD object
 * @param {VecLine2} line the fold line
 * @param {string} [assignment="V"]
 * @param {number} [foldAngle]
 * @param {[number, number][]|[number, number, number][]} [vertices_coordsFolded]
 * @param {number} [epsilon=1e-6]
 * @returns {FoldGraphEvent} an object summarizing the changes to the graph
 */
export const foldLine = (
	graph,
	line,
	assignment = "V",
	foldAngle = undefined,
	vertices_coordsFolded = undefined,
	epsilon = EPSILON,
) => (
	foldGraph(
		graph,
		line,
		includeL,
		[],
		assignment,
		foldAngle,
		vertices_coordsFolded,
		epsilon,
	));

/**
* @description Crease a fold ray through a folded origami model.
* This method takes in and returns a crease pattern but performs the fold
* on the folded form; this approach maintains better precision especially
* in the case of repeated calls to fold an origami model.
 * @param {FOLD} graph a FOLD object
 * @param {VecLine2} ray the fold line as a ray
 * @param {string} [assignment="V"]
 * @param {number} [foldAngle]
 * @param {[number, number][]|[number, number, number][]} [vertices_coordsFolded]
 * @param {number} [epsilon=1e-6]
 * @returns {FoldGraphEvent} an object summarizing the changes to the graph
 */
export const foldRay = (
	graph,
	ray,
	assignment = "V",
	foldAngle = undefined,
	vertices_coordsFolded = undefined,
	epsilon = EPSILON,
) => (
	foldGraph(
		graph,
		ray,
		includeR,
		[ray.origin],
		assignment,
		foldAngle,
		vertices_coordsFolded,
		epsilon,
	));

/**
* @description Crease a fold segment through a folded origami model.
* This method takes in and returns a crease pattern but performs the fold
* on the folded form; this approach maintains better precision especially
* in the case of repeated calls to fold an origami model.
 * @param {FOLD} graph a FOLD object
 * @param {[[number, number], [number, number]]} segment the fold segment
 * @param {string} [assignment="V"]
 * @param {number} [foldAngle]
 * @param {[number, number][]|[number, number, number][]} [vertices_coordsFolded]
 * @param {number} [epsilon=1e-6]
 * @returns {FoldGraphEvent} an object summarizing the changes to the graph
 */
export const foldSegment = (
	graph,
	segment,
	assignment = "V",
	foldAngle = undefined,
	vertices_coordsFolded = undefined,
	epsilon = EPSILON,
) => (
	foldGraph(
		graph,
		pointsToLine2(segment[0], segment[1]),
		includeS,
		segment,
		assignment,
		foldAngle,
		vertices_coordsFolded,
		epsilon,
	));
