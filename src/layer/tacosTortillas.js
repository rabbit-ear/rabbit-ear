/**
 * Rabbit Ear (c) Kraft
 */
import {
	EPSILON,
} from "../math/constant.js";
import {
	makeFacesConvexCenter,
} from "../graph/make.js";
import {
	getEdgesFacesOverlap,
} from "./intersect.js";
import {
	overlappingParallelEdgePairs,
} from "./general.js";
import {
	makeEdgesFacesSide,
	makeEdgePairsFacesSide,
} from "./facesSide.js";

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
 * @param {[[number, number], [number, number]]} facePairs two pairs of
 * faces indices, the adjacent faces to the two edges involved.
 * @param {number} classification the class id number that is
 * the result of calling classifyEdgePair()
 * @returns {TacoTortillaConstraint}
 */
const formatTacoTortilla = ([faces0, faces1], classification) => {
	switch (classification) {
		// taco: faces0
		case 4: return [faces0[0], faces1[0], faces0[1]];
		case 5: return [faces0[0], faces1[1], faces0[1]];
		// taco: faces1
		case 6: return [faces1[0], faces0[0], faces1[1]];
		case 7: return [faces1[0], faces0[1], faces1[1]];
	}
};

/**
* @param {[[number, number], [number, number]]} facePairs two pairs of
* faces indices, the adjacent faces to the two edges involved.
* @param {number} classification the class id number that is
* the result of calling classifyEdgePair()
* @returns {TortillaTortillaConstraint} four face indices involved in a
* tortilla-tortilla where [0] is above/below [2] and [1] is above/below [3]
*/
const formatTortillaTortilla = ([faces0, faces1], classification) => {
	switch (classification) {
		case 2: return [...faces0, ...faces1];
		// the 0/0 indices in both faces are not above them.
		case 3: return [...faces0, faces1[1], faces1[0]];
	}
};

/**
 * @description Tortilla-tortillas can be generated in two ways:
 * 1. two tortillas (4 faces) where the two dividing edges are collinear
 * 2. two tortillas (4 faces) where the dividing edges lie on top of
 * each other, crossing each other, but are not collinear.
 * This method generates all tortillas from the second set.
 * @param {number[][]} edges_faces the array from the FOLD graph
 * @param {[[number, number], [number, number]]} edgesFacesSide for each
 * edge's pair of faces, which side of the edge does this face lie? (+1 or -1)
 * @param {number[][]} edgesFacesOverlap for every edge, a list of faces
 * which overlap this edge.
 * @returns {TortillaTortillaConstraint[]} array of tortilla-tortilla conditions
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
	return tortillas_faces_crossing
		.flatMap((faces, e) => faces
			// .map(face => [edges_faces[e], [face, face]]))
			.map(face => [...edges_faces[e], face, face]));
};

/**
 * @description Given a FOLD object, find all instances of edges overlapping which
 * classify as taco/tortillas to determine layer order.
 * @param {FOLD} graph a FOLD graph. vertices_coords should already be folded.
 * @param {number} [epsilon=1e-6] an optional epsilon with a default value of 1e-6
 * @returns {{
 *   taco_taco: TacoTacoConstraint[],
 *   taco_tortilla: TacoTortillaConstraint[],
 *   tortilla_tortilla: TortillaTortillaConstraint[],
 * }} For a particular model, a set of layer constraints sorted into
 * taco/tortilla/transitivity types needed to be solved.
 * @linkcode
 * @notes due to the face_center calculation to determine face-edge sidedness, this
 * is currently hardcoded to only work with convex polygons.
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
		.filter(({ tortillas }) => tortillas.length)
		.flatMap(({ taco: [a, b], tortillas }) => tortillas
			.map(tortilla => [a, tortilla, b]));

	// taco-taco
	// map faces [[a, b], [c, d]] into [a, c, b, d]
	const taco_taco = edgePairsFacesType
		.map((n, i) => (n === 0 || n === 1 ? i : undefined))
		.filter(a => a !== undefined)
		.map(i => edgePairs[i].map(edge => edges_faces[edge]))
		.map(el => [el[0][0], el[1][0], el[0][1], el[1][1]]);

	// taco-tortilla
	// map faces { taco: [a, b], tortilla: c } into [a, c, b]
	const taco_tortilla = edgePairsFacesType
		.map((n, i) => (n > 3 ? i : undefined))
		.filter(a => a !== undefined)
		.map(i => formatTacoTortilla(
			edgePairs[i].map(edge => edges_faces[edge]),
			edgePairsFacesType[i]))
		.concat(tacoTortillaCrossing);

	// tortilla-tortilla
	// tortilla-tortilla contains one additional required ordering:
	// [a, b], [c, d] means a and b are connected, and c and d are connected,
	// additionally, a is above/below c and b is above/below d.
	const tortilla_tortilla = edgePairsFacesType
		.map((n, i) => (n === 2 || n === 3 ? i : undefined))
		.filter(a => a !== undefined)
		.map(i => formatTortillaTortilla(
			edgePairs[i].map(edge => edges_faces[edge]),
			edgePairsFacesType[i]))
		.concat(tortillaTortillaCrossing);

	return {
		taco_taco,
		taco_tortilla,
		tortilla_tortilla,
	};
};
