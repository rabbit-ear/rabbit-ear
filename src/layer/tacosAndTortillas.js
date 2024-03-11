/**
 * Rabbit Ear (c) Kraft
 */
import {
	EPSILON,
} from "../math/constant.js";
import {
	makeEdgesVector,
	makeFacesConvexCenter,
} from "../graph/make.js";
import {
	connectedComponentsPairs,
} from "../graph/connectedComponents.js";
import {
	makeEdgesEdgesParallelOverlap,
	getEdgesFacesOverlap,
} from "./intersect.js";
import {
	makeEdgesFacesSide,
	makeEdgePairsFacesSide,
} from "./facesSide.js";

/**
 * @description for every edge, find all other edges which are
 * parallel to this edge and overlap the edge, excluding
 * the epsilon space around the endpoints.
 * @param {FOLD} graph a FOLD object with edges_vector
 * @returns {[number, number][]} a list of pairs of edge indices
 */
export const overlappingParallelEdgePairs = ({
	vertices_coords, edges_vertices, edges_faces, edges_vector,
}, epsilon = EPSILON) => {
	// if edges_vector does not exist make it
	if (!edges_vector) {
		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	}

	// for every edge, a list of other edges which overlap and are parallel
	const edgesEdgesOverlap = makeEdgesEdgesParallelOverlap({
		vertices_coords, edges_vertices, edges_vector,
	}, epsilon);

	// convert all overlapping edge groups into unique pairs, [i, j]
	// where i < j, all pairs are stored only once.
	return connectedComponentsPairs(edgesEdgesOverlap)
		.filter(pair => pair.every(edge => edges_faces[edge].length > 1));
};

/**
 * @description classify a pair of adjacent faces encoded as +1 or -1
 * depending on which side they are on into one of 3 types:
 * - "both": tortilla (faces lie on both sides of the edge)
 * - "left": a taco facing left
 * - "right": a taco facing right
 * @param {[number, number]} facesSide for two adjacent faces, which side
 * of their shared edge does this face lie on: +1 or -1.
 * @returns {string|undefined} which side of the edge are the two faces?
 * "right" and "left" for both faces, or "both" where each face is... ugh
 * these need to be renamed.
 */
const classifyFacePairSidedness = ([a, b]) => {
	if ((a === 1 && b === -1) || (a === -1 && b === 1)) { return "both"; }
	if ((a === 1 && b === 1)) { return "right"; }
	if ((a === -1 && b === -1)) { return "left"; }
	return undefined;
};

// pairs of tacos are valid taco-taco if they are both "left" or "right".
const is_taco_taco = (classes) => classes[0] === classes[1]
	&& classes[0] !== "both";

// pairs of tortillas are valid tortillas if both of them are "both".
const is_tortilla_tortilla = (classes) => classes[0] === classes[1]
	&& classes[0] === "both";

// pairs of face-pairs are valid taco-tortillas if one is "both" (tortilla)
// and the other is either a "left" or "right" taco.
const is_taco_tortilla = (classes) => classes[0] !== classes[1]
	&& (classes[0] === "both" || classes[1] === "both");

const make_taco_tortilla = (face_pairs, types, faces_side) => {
	const direction = types[0] === "left" || types[1] === "left" ? -1 : 1;
	// deep copy these objects. ensures that no arrays share pointers.
	const taco = types[0] === "both" ? [...face_pairs[1]] : [...face_pairs[0]];
	// get only one side of the tortilla
	const index = types[0] === "both" ? 0 : 1;
	const tortilla = faces_side[index][0] === direction
		? face_pairs[index][0]
		: face_pairs[index][1];
	return { taco, tortilla };
};

const make_tortilla_tortilla = (face_pairs, tortillas_sides) => {
	if (face_pairs === undefined) { return undefined; }
	return (tortillas_sides[0][0] === tortillas_sides[1][0])
		? face_pairs
		: [face_pairs[0], [face_pairs[1][1], face_pairs[1][0]]];
};

const makeTacoTortilla = (face_pairs, classification) => {
	switch (classification) {
		case 4: return { taco: face_pairs[0], tortilla: face_pairs[1][0] };
		case 5: return { taco: face_pairs[0], tortilla: face_pairs[1][1] };
		case 6: return { taco: face_pairs[1], tortilla: face_pairs[0][0] };
		case 7: return { taco: face_pairs[1], tortilla: face_pairs[0][1] };
	}
};

/**
 * @description Tortilla-tortillas can be generated in two ways:
 * 1. two tortillas (4 faces) where the two dividing edges are collinear
 * 2. two tortillas (4 faces) where the dividing edges lie on top of
 * each other, crossing each other, but are not collinear.
 * This method generates all tortillas from the second set.
 */
export const makeTortillaTortillaFacesCrossing = (
	edges_faces,
	edgesFacesSide,
	edgesFacesOverlap,
) => {
	// a tortilla-edge is defined by an edge having two adjacent faces,
	// and both of those faces are on either side of the edge
	const tortilla_edge_indices = edgesFacesSide
		.map(side => side.length === 2 && side[0] !== side[1])
		.map((isTortilla, i) => (isTortilla ? i : undefined))
		.filter(a => a !== undefined);
	const tortillas_faces_crossing = [];
	tortilla_edge_indices.forEach(edge => {
		tortillas_faces_crossing[edge] = edgesFacesOverlap[edge];
	});
	const tortilla_faces_results = tortillas_faces_crossing
		.map((faces, e) => faces.map(face => [edges_faces[e], [face, face]]))
		.reduce((a, b) => a.concat(b), []);
	return tortilla_faces_results;
};

/**
 * @param {[[number,number],[number,number]]} edgePairFacesSide
 * @returns {number} classification id, where:
 * - -1: invalid
 * - 0: taco-taco, (+1)
 * - 1: taco-taco, (-1)
 * - 2: tortilla-tortilla (faces are aligned)
 * - 3: tortilla-tortilla (faces are not aligned)
 * - 4: taco-tortilla, taco ([0]) is on top of tortilla's ([1]) 0 index
 * - 5: taco-tortilla, taco ([0]) is on top of tortilla's ([1]) 1 index
 * - 6: tortilla-taco, taco ([1]) is on top of tortilla's ([0]) 0 index
 * - 7: tortilla-taco, taco ([1]) is on top of tortilla's ([0]) 1 index
 */
const classifyEdgePair = (edgePairFacesSide) => {
	// a taco means both faces of an edge are on the same side
	const isTaco = edgePairFacesSide.map(([f0, f1]) => f0 === f1);

	// break each case into taco-taco, tortilla-tortilla, or taco-tortilla

	// both edges are tacos. taco-taco is the only case where it might result as
	// invalid. taco-taco is only valid if both tacos are on the same side.
	if (isTaco[0] && isTaco[1]) {
		if (edgePairFacesSide[0][0] !== edgePairFacesSide[1][0]) { return -1; }
		return (edgePairFacesSide[0][0] === 1 ? 0 : 1);
	}

	// both are tortillas. all cases are valid.
	// if the tortilla's are aligned meaning both tortilla's index 0
	// are on top of each other, the result is 2, otherwise 3.
	if (!isTaco[0] && !isTaco[1]) {
		return edgePairFacesSide[0][0] === edgePairFacesSide[1][0] ? 2 : 3;
	}

	// taco-tortilla. all cases are valid.
	// depending on the taco-position, result is either 4/5 or 6/7
	// for the taco, which side (+1/-1) are its faces on?
	const tacoSide = isTaco[0] ? edgePairFacesSide[0][0] : edgePairFacesSide[1][0];

	// get the tortilla's facesSides array
	const tortillaFacesSide = isTaco[0] ? edgePairFacesSide[1] : edgePairFacesSide[0];

	// is the taco on top of the [0] index of the tortilla or the [1] index?
	const tortillaSideMatch = tacoSide === tortillaFacesSide[0] ? 0 : 1;
	const whichIsTaco = isTaco[0] ? 0 : 2;
	return 4 + whichIsTaco + tortillaSideMatch;
};

/**
 * @param {[[number, number], [number, number]] arr
 * @returns {[[number, number], [number, number]]
 */
const reverseSecondArray = (arr) => [arr[0], [arr[1][1], arr[1][0]]]

/**
 * @description Given a FOLD object, find all instances of edges overlapping which
 * classify as taco/tortillas to determine layer order.
 * @param {FOLD} graph a FOLD graph. vertices_coords should already be folded.
 * @param {number} [epsilon=1e-6] an optional epsilon with a default value of 1e-6
 * @returns {{
 *   taco_taco: [[number,number],[number,number]][],
 *   tortilla_tortilla: [[number,number],[number,number]][],
 *   taco_tortilla: { taco: number[], tortilla: number[] }[]
 * }} an object containing taco information
 * @linkcode Origami ./src/layer/solver2d/tacos/makeTacosTortillas.js 91
 * @notes due to the face_center calculation to determine face-edge sidedness, this
 * is currently hardcoded to only work with convex polygons.
 */

export const makeTacosAndTortillasOld = ({
	vertices_coords, edges_vertices, edges_faces, faces_vertices, faces_center,
	edges_vector, // faces_edges,
}, epsilon = EPSILON) => {
	if (!faces_center) {
		faces_center = makeFacesConvexCenter({ vertices_coords, faces_vertices });
	}

	// faces_edges is not needed with the current "getEdgesFacesOverlap" method.
	// there is one in the works which does use faces_edges.
	const edgesFacesOverlap = getEdgesFacesOverlap({
		vertices_coords, edges_vertices, edges_faces, faces_vertices, // faces_edges,
	}, epsilon);

	// for each edge, for its adjacent faces (1 or 2), which side of the edge
	// (using the edge's vector) is each face on?
	const edgesFacesSide = makeEdgesFacesSide({
		vertices_coords, edges_vertices, edges_faces, faces_center,
	});

	// every permutation of pairs of overlapping, parallel edges, where both
	// edges have two adjacent faces (not one). Each of these will become
	// either a taco-taco, taco-tortilla, or tortilla-tortilla condition.
	// this will contain unique pairs ([4, 9] but not [9, 4]), smallest first.
	const edgePairs = overlappingParallelEdgePairs({
		vertices_coords, edges_vertices, edges_faces, edges_vector
	}, epsilon);

	// convert every face into a +1 or -1 based on which side of the edge is it on.
	// ie: tacos will have similar numbers, tortillas will have one of either.
	// the +1/-1 is determined by the cross product to the vector of the edge.
	const edgePairsFacesSide = makeEdgePairsFacesSide({
		vertices_coords, edges_vertices, edges_faces, faces_center,
	}, edgePairs);

	// each pair of faces is either a "left" or "right" (taco) or "both" (tortilla).
	const edgePairs_faces_sideType = edgePairsFacesSide
		.map(faces => faces
			.map(classifyFacePairSidedness));

	const edgePairsFaces = edgePairs
		.map(pair => pair
			.map(edge => edges_faces[edge]));
	// this completes taco-taco, however both tortilla-tortilla and taco-tortilla
	// has two varieties.
	// tortilla-tortilla has both (1) edge-aligned tortillas where 4 unique faces
	// are involved, and (2) the case where an edge crosses one tortilla, where
	// only 3 faces are involved.
	// taco-tortilla: (1) those tacos which are edge-aligned with another
	// tortilla-tortilla, and (2) those tacos which simply cross through the
	// middle of a face.
	const taco_taco = edgePairs_faces_sideType
		.map((pair, i) => (is_taco_taco(pair) ? edgePairsFaces[i] : undefined))
		.filter(a => a !== undefined);

	// tortilla-tortilla contains one additional required ordering:
	// [a,b], [c,d] means a and b are connected, and c and d are connected,
	// additionally, a is above/below c and b is above/below d.
	// get the first of the two edgePairs, use this as the origin/vector.
	// recompute the face-sidedness using these. see: make_tortilla_tortilla.
	const tortilla_tortilla_aligned = edgePairs_faces_sideType
		.map((pair, i) => (is_tortilla_tortilla(pair) ? edgePairsFaces[i] : undefined))
		.map((pair, i) => make_tortilla_tortilla(pair, edgePairsFacesSide[i]))
		.filter(a => a !== undefined);

	// 5ms:
	const tortilla_tortilla_crossing = makeTortillaTortillaFacesCrossing(
		edges_faces,
		edgesFacesSide,
		edgesFacesOverlap,
		epsilon,
	);
	const tortilla_tortilla = tortilla_tortilla_aligned
		.concat(tortilla_tortilla_crossing);
	// taco-tortilla (1), first case. taco overlaps tortilla.
	const taco_tortilla_aligned = edgePairs_faces_sideType
		.map((pair, i) => (is_taco_tortilla(pair)
			? make_taco_tortilla(edgePairsFaces[i], edgePairs_faces_sideType[i], edgePairsFacesSide[i])
			: undefined))
		.filter(a => a !== undefined);

	// taco-tortilla (2), the second of two cases, when a taco overlaps a face.
	const edges_overlap_faces = edgesFacesOverlap
		.map((faces, e) => (edgesFacesSide[e].length > 1
			&& edgesFacesSide[e][0] === edgesFacesSide[e][1]
			? faces
			: []));
	const taco_tortillas_crossing = edges_overlap_faces
		.map((tortillas, edge) => ({ taco: edges_faces[edge], tortillas }))
		.filter(el => el.tortillas.length);
	const taco_tortilla_crossing = taco_tortillas_crossing
		.flatMap(el => el.tortillas
			.map(tortilla => ({ taco: [...el.taco], tortilla })));
	// finally, join both taco-tortilla cases together into one.
	const taco_tortilla = taco_tortilla_aligned.concat(taco_tortilla_crossing);
	return {
		taco_taco,
		tortilla_tortilla,
		taco_tortilla,
	};
};

/**
 *
 */
export const makeTacosAndTortillas = ({
	vertices_coords, edges_vertices, edges_faces, faces_vertices, faces_center,
	edges_vector, // faces_edges,
}, epsilon = EPSILON) => {
	if (!faces_center) {
		faces_center = makeFacesConvexCenter({ vertices_coords, faces_vertices });
	}

	// faces_edges is not needed with the current "getEdgesFacesOverlap" method.
	// there is one in the works which does use faces_edges.
	const edgesFacesOverlap = getEdgesFacesOverlap({
		vertices_coords, edges_vertices, edges_faces, faces_vertices, // faces_edges,
	}, epsilon);

	// for each edge, for its adjacent faces (1 or 2), which side of the edge
	// (using the edge's vector) is each face on?
	const edgesFacesSide = makeEdgesFacesSide({
		vertices_coords, edges_vertices, edges_faces, faces_center,
	});

	// every permutation of pairs of overlapping, parallel edges, where both
	// edges have two adjacent faces (not one). Each of these will become
	// either a taco-taco, taco-tortilla, or tortilla-tortilla condition.
	// this will contain unique pairs ([4, 9] but not [9, 4]), smallest first.
	const edgePairs = overlappingParallelEdgePairs({
		vertices_coords, edges_vertices, edges_faces, edges_vector
	}, epsilon);

	// convert every face into a +1 or -1 based on which side of the edge is it on.
	// ie: tacos will have similar numbers, tortillas will have one of either.
	// the +1/-1 is determined by the cross product to the vector of the edge.
	const edgePairsFacesSide = makeEdgePairsFacesSide({
		vertices_coords, edges_vertices, edges_faces, faces_center,
	}, edgePairs);

	// classify each edgePairFaces into its taco/tortilla type using an encoding
	// that includes additional details about the location of faces, for example
	// which of the faces is the taco in the taco-tortilla relationship.
	const edgePairsFacesType = edgePairsFacesSide.map(classifyEdgePair);

	// tortilla-tortilla has both (1) edge-aligned tortillas where 4 unique faces
	// are involved (this will come from edgePairs), and (2) the case where an
	// edge crosses one tortilla, where only 3 faces are involved (below).
	const tortillaTortillaCrossing = makeTortillaTortillaFacesCrossing(
		edges_faces,
		edgesFacesSide,
		edgesFacesOverlap,
		epsilon,
	);

	// taco-tortilla has both (1) those tacos which are edge-aligned with another
	// tortilla-tortilla (this will come from edgePairs), and (2) those tacos
	// which simply cross through the middle of a face (below).
	const tacoTortillaCrossing = edgesFacesOverlap
			.map((faces, e) => (edgesFacesSide[e].length > 1
				&& edgesFacesSide[e][0] === edgesFacesSide[e][1]
				? faces
				: []))
		.map((tortillas, edge) => ({ taco: edges_faces[edge], tortillas }))
		.filter(el => el.tortillas.length)
		.flatMap(el => el.tortillas
			.map(tortilla => ({ taco: [...el.taco], tortilla })));

	// taco-taco
	const taco_taco = edgePairsFacesType
		.map((n, i) => (n === 0 || n === 1 ? i : undefined))
		.filter(a => a !== undefined)
		.map(i => edgePairs[i].map(edge => edges_faces[edge]));

	// tortilla-tortilla
	// tortilla-tortilla contains one additional required ordering:
	// [a,b], [c,d] means a and b are connected, and c and d are connected,
	// additionally, a is above/below c and b is above/below d.
	const tortilla_tortilla = edgePairsFacesType
		.map((n, i) => (n === 2 || n === 3 ? i : undefined))
		.filter(a => a !== undefined)
		.map(i => (edgePairsFacesType[i] === 2
			? edgePairs[i].map(edge => edges_faces[edge])
			: reverseSecondArray(edgePairs[i].map(edge => edges_faces[edge]))))
		.concat(tortillaTortillaCrossing);

	// taco-tortilla
	const taco_tortilla = edgePairsFacesType
		.map((n, i) => (n > 3 ? i : undefined))
		.filter(a => a !== undefined)
		.map(i => makeTacoTortilla(edgePairs[i].map(edge => edges_faces[edge]), edgePairsFacesType[i]))
		.concat(tacoTortillaCrossing);

	return {
		taco_taco,
		tortilla_tortilla,
		taco_tortilla,
	};
};
