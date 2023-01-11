/**
 * Rabbit Ear (c) Kraft
 */
import math from "../../../math";
import { makeFacesConvexCenter } from "../../../graph/make";
import {
	makeEdgesEdgesParallelOverlap,
} from "../../../graph/edgesEdges";
import {
	booleanMatrixToUniqueIndexPairs,
	booleanMatrixToIndexedArray,
} from "../../../general/arrays";
import { makeEdgesFacesOverlap } from "../../../graph/overlap";
import { makeTortillaTortillaFacesCrossing } from "./tortillaTortilla";
import {
	makeEdgesFacesSide,
	makeTacosFacesSide,
} from "./facesSide";
/**
 * @description classify a pair of adjacent faces encoded as +1 or -1
 * depending on which side they are on into one of 3 types:
 * - "both": tortilla (faces lie on both sides of the edge)
 * - "left": a taco facing left
 * - "right": a taco facing right
 */
const classify_faces_pair = (pair) => {
	if ((pair[0] === 1 && pair[1] === -1)
		|| (pair[0] === -1 && pair[1] === 1)) {
		return "both";
	}
	if ((pair[0] === 1 && pair[1] === 1)) { return "right"; }
	if ((pair[0] === -1 && pair[1] === -1)) { return "left"; }
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
/**
 * @description this kind of taco-tortilla is edge-aligned with a tortilla
 * that is made of two faces. there are 4 faces involved, we only need 3.
 * given the direction of the taco ("left" or "right"), get the similarly-
 * facing side of the tortilla and return this along with the taco.
 */
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

/**
 * @description convert a FOLD spec self-relational array
 * (like vertices_vertices / faces_faces), into a non-sparse
 * boolean matrix with false/true, true if elements point to each other
 */
const indicesToBooleanMatrix = (array_array) => {
	const matrix = Array.from(Array(array_array.length))
		.map(() => Array(array_array.length).fill(false));
	array_array
		.forEach((arr, i) => arr
			.forEach(j => { matrix[i][j] = true; }));
	return matrix;
};
/**
 * @description Given a FOLD object, find all instances of edges overlapping which
 * classify as taco/tortillas to determine layer order.
 * @param {FOLD} graph a FOLD graph. vertices_coords should already be folded.
 * @param {number} [epsilon=1e-6] an optional epsilon with a default value of 1e-6
 * @returns {object} an object containing keys: taco_taco, tortilla_tortilla, taco_tortilla
 * @linkcode Origami ./src/layer/tacos/makeTacosTortillas.js 91
 * @notes due to the face_center calculation to determine face-edge sidedness, this
 * is currently hardcoded to only work with convex polygons.
 */
const makeTacosTortillas = (graph, epsilon = math.core.EPSILON) => {
	// given a graph which is already in its folded state,
	// find which edges are tacos, or in other words, find out which
	// edges overlap with another edge.
	const faces_center = makeFacesConvexCenter(graph);
	const edges_faces_side = makeEdgesFacesSide(graph, faces_center);
	// for every edge, find all other edges which are parallel to this edge and
	// overlap the edge, excluding the epsilon space around the endpoints.
	// 130ms:
	const edge_edge_overlap_matrix = makeEdgesEdgesParallelOverlap(graph, epsilon);
	const boolean_edge_edge_overlap = indicesToBooleanMatrix(edge_edge_overlap_matrix);
	// convert this matrix into unique pairs ([4, 9] but not [9, 4])
	// thse pairs are also sorted such that the smaller index is first.
	const tacos_edges = booleanMatrixToUniqueIndexPairs(boolean_edge_edge_overlap)
	// const tacos_edges = booleanMatrixToUniqueIndexPairs(edge_edge_overlap_matrix)
		.filter(pair => pair
			.map(edge => graph.edges_faces[edge].length > 1)
			.reduce((a, b) => a && b, true));
	const tacos_faces = tacos_edges
		.map(pair => pair
			.map(edge => graph.edges_faces[edge]));
	// convert every face into a +1 or -1 based on which side of the edge is it on.
	// ie: tacos will have similar numbers, tortillas will have one of either.
	// the +1/-1 is determined by the cross product to the vector of the edge.
	const tacos_faces_side = makeTacosFacesSide(graph, faces_center, tacos_edges, tacos_faces);
	// each pair of faces is either a "left" or "right" (taco) or "both" (tortilla).
	const tacos_types = tacos_faces_side
		.map(faces => faces
			.map(classify_faces_pair));
	// this completes taco-taco, however both tortilla-tortilla and taco-tortilla
	// has two varieties.
	// tortilla-tortilla has both (1) edge-aligned tortillas where 4 unique faces
	// are involved, and (2) the case where an edge crosses one tortilla, where
	// only 3 faces are involved.
	// taco-tortilla: (1) those tacos which are edge-aligned with another
	// tortilla-tortilla, and (2) those tacos which simply cross through the
	// middle of a face. this completes taco-tortilla (1).
	const taco_taco = tacos_types
		.map((pair, i) => (is_taco_taco(pair) ? tacos_faces[i] : undefined))
		.filter(a => a !== undefined);
	// tortilla-tortilla contains one additional required ordering:
	// [a,b], [c,d] means a and b are connected, and c and d are connected,
	// additionally, a is above/below c and b is above/below d.
	// get the first of the two tacos_edges, use this as the origin/vector.
	// recompute the face-sidedness using these. see: make_tortilla_tortilla.
	const tortilla_tortilla_aligned = tacos_types
		.map((pair, i) => (is_tortilla_tortilla(pair) ? tacos_faces[i] : undefined))
		.map((pair, i) => make_tortilla_tortilla(pair, tacos_faces_side[i]))
		.filter(a => a !== undefined);
	// 5ms:
	const tortilla_tortilla_crossing = makeTortillaTortillaFacesCrossing(
		graph,
		edges_faces_side,
		epsilon,
	);
	const tortilla_tortilla = tortilla_tortilla_aligned
		.concat(tortilla_tortilla_crossing);
	// taco-tortilla (1), first case. taco overlaps tortilla.
	const taco_tortilla_aligned = tacos_types
		.map((pair, i) => (is_taco_tortilla(pair)
			? make_taco_tortilla(tacos_faces[i], tacos_types[i], tacos_faces_side[i])
			: undefined))
		.filter(a => a !== undefined);
	// taco-tortilla (2), the second of two cases, when a taco overlaps a face.
	// 750ms:
	const edges_faces_overlap = makeEdgesFacesOverlap(graph, epsilon);
	// 10ms:
	const edges_overlap_faces = booleanMatrixToIndexedArray(edges_faces_overlap)
		.map((faces, e) => (edges_faces_side[e].length > 1
			&& edges_faces_side[e][0] === edges_faces_side[e][1]
			? faces
			: []));
	const taco_tortillas_crossing = edges_overlap_faces
		.map((tortillas, edge) => ({ taco: graph.edges_faces[edge], tortillas }))
		.filter(el => el.tortillas.length);
	const taco_tortilla_crossing = taco_tortillas_crossing
		.flatMap(el => el.tortillas
			.map(tortilla => ({ taco: [...el.taco], tortilla })));
	// finally, join both taco-tortilla cases together into one.
	const taco_tortilla = taco_tortilla_aligned.concat(taco_tortilla_crossing);
	// console.log("edges_faces_side", edges_faces_side);
	// console.log("edge_edge_overlap_matrix", edge_edge_overlap_matrix);
	// console.log("tacos_edges", tacos_edges);
	// console.log("tortilla_tortilla_aligned", tortilla_tortilla_aligned);
	// console.log("tortilla_tortilla_crossing", tortilla_tortilla_crossing);
	return {
		taco_taco,
		tortilla_tortilla,
		taco_tortilla,
	};
};

export default makeTacosTortillas;
