/**
 * Rabbit Ear (c) Kraft
 */
import {
	EPSILON,
} from "../math/constant.js";
import {
	makeFacesConvexCenter,
} from "../graph/make/faces.js";
import {
	makeEdgesFacesSide,
	makeEdgePairsFacesSide,
} from "./facesSide.js";
import {
	getEdgesEdgesCollinearOverlap,
	getEdgesFacesOverlap,
} from "../graph/overlap.js";
import { connectedComponentsPairs } from "../graph/connectedComponents.js";

/**
 * @description Assign a classification to a face-pair which will assist us in
 * assembling the faces in the appropriate order later, without any additional
 * information:
 * (in 4, 5 taco is the first set of faces, in 6, 7 taco is the second set)
 * @param {[[number,number],[number,number]]} edgePairFacesSide
 * @returns {number} a classifaction number
 * - 0: invalid
 * - 1: taco-taco
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
		if (edgePairFacesSide[0][0] !== edgePairFacesSide[1][0]) { return 0; }
		return 1;
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
	default: return [];
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
	// [0] from one is above [1] in the other, we need to flip one of them.
	case 3: return [...faces0, faces1[1], faces1[0]];
	default: return [];
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
			.map(face => [...edges_faces[e], face, face]));
};

/**
 * @description For a 3D folded model, this will find the places
 * where two planes meet along collinear edges, these joining of two
 * planes creates a tortilla-tortilla relationship.
 * @param {FOLD} graph a FOLD object
 * @param {number[][]} tortillaTortillaEdges each tortilla event is
 * a pair of edge indices.
 * @param {number[]} faces_set for every face, which set is it a member of.
 * @param {boolean[]} faces_winding for every face, is it aligned in its plane?
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {TortillaTortillaConstraint} an array of tortilla-tortilla constraints
 * where indices [A, B, X, Y], A-B are adjacent faces and X-Y are adjacent,
 * and A is above/below X and B is above/below Y.
 */
export const makeBentTortillas = ({
	edges_faces,
}, tortillaTortillaEdges, faces_set, faces_winding) => {
	// all pairwise combinations of edges that create a 3D tortilla-tortilla
	// for each tortilla-tortilla edge, get the four adjacent faces involved
	const tortilla_faces = tortillaTortillaEdges
		// todo: instead of mapping this here, and running the method with
		// the old input data, see about using the additional data that comes in
		.map(el => el.edges)
		.map(pair => pair
			.map(edge => edges_faces[edge].slice()));
	// console.log("tortillaTortillaEdges", tortillaTortillaEdges);
	// console.log("tortilla_faces", tortilla_faces);
	// sort the faces of the tortillas on the correct side so that
	// the two faces in the same plane have the same index in their arrays.
	// [[A,B], [X,Y]], A and B are edge-connected faces, X and Y are connected,
	// and A and X are in the same plane, B and Y are in the same plane.
	tortilla_faces.forEach((tortillas, i) => {
		// if both [0] are not from the same set, reverse the second tortilla's faces
		if (faces_set[tortillas[0][0]] !== faces_set[tortillas[1][0]]) {
			tortilla_faces[i][1].reverse();
		}
	});
	// finally, each planar set chose a normal for that plane at random,
	// it's possible that either side of the tortilla have opposing normals,
	// the act of the solver placing a face "above" or "below" the other means
	// two different things for either side. we need to normalize this behavior.
	// determine a mismatch by checking two adjacent faces (two different sets)
	tortilla_faces
		.map(tortillas => [tortillas[0][0], tortillas[0][1]])
		.map(faces => faces.map(face => faces_winding[face]))
		.map((orients, i) => (orients[0] !== orients[1] ? i : undefined))
		.filter(a => a !== undefined)
		.forEach(i => {
			// two faces that are a member of the same planar set. swap them.
			const temp = tortilla_faces[i][0][1];
			tortilla_faces[i][0][1] = tortilla_faces[i][1][1];
			tortilla_faces[i][1][1] = temp;
		});
	return tortilla_faces.map(faces => faces.flat());
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
	vertices_coords, edges_vertices, edges_faces, faces_vertices, faces_edges,
	faces_center,
}, epsilon = EPSILON) => {
	if (!faces_center) {
		faces_center = makeFacesConvexCenter({ vertices_coords, faces_vertices });
	}

	const edgesFacesOverlap = getEdgesFacesOverlap({
		vertices_coords, edges_vertices, faces_vertices, faces_edges,
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
	const edgePairs = connectedComponentsPairs(
		getEdgesEdgesCollinearOverlap({ vertices_coords, edges_vertices }, epsilon)
	).filter(pair => pair.every(edge => edges_faces[edge].length > 1));

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
		.map((n, i) => (n === 1 ? i : undefined))
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
			edgePairsFacesType[i],
		))
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
			edgePairsFacesType[i]
		))
		.concat(tortillaTortillaCrossing);

	return {
		taco_taco,
		taco_tortilla,
		tortilla_tortilla,
	};
};
