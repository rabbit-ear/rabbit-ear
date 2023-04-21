/**
 * Rabbit Ear (c) Kraft
 */
import { chooseTwoPairs } from "../../general/arrays.js";
import { EPSILON } from "../../math/general/constant.js";
import {
	dot,
	normalize,
	subtract,
} from "../../math/algebra/vector.js";
import { rangesOverlapExclusive } from "./general.js";
/**
 *
 */
const doEdgesOverlap = ({
	vertices_coords, edges_vertices,
}, edgePair, vector, epsilon = EPSILON) => {
	// console.log("doEdgesOverlap", graph, edgePair, vector, epsilon);
	const pairCoords = edgePair
		.map(edge => edges_vertices[edge]
			.map(v => vertices_coords[v]));
	const pairCoordsDots = pairCoords
		.map(edge => edge
			.map(coord => dot(coord, vector)));
	const result = rangesOverlapExclusive(...pairCoordsDots, epsilon);
	// console.log("pairCoords", pairCoords);
	// console.log("pairCoordsDots", pairCoordsDots);
	// console.log("result", result);
	return result;
};

// this will only work with graphs which are manifolds, edges must
// have only one or two adjacent faces (so, be a member of only
// one or two coplanar groups), not three or more.
/**
 *
 */
const make3DTortillaEdges = ({
	vertices_coords, edges_vertices,
}, edges_sets, epsilon = EPSILON) => {
	const edges_sets_keys = edges_sets.map(arr => arr.join(" "));
	// intersectingSets_edges will be a dictionary of pairs of groups: "3 15"
	// indicating that there is an intersection between these two planes,
	// and the value is an array of all edges along that intersection.
	const intersectingSets_edges = {};
	edges_sets_keys.forEach((key, i) => {
		if (intersectingSets_edges[key] === undefined) {
			intersectingSets_edges[key] = [];
		}
		intersectingSets_edges[key].push(i);
	});
	// we are looking for tortilla-tortilla cases so we need two or more edges.
	// remove an intersectingSets_edges if it contains only one edge.
	Object.keys(intersectingSets_edges)
		.filter(key => intersectingSets_edges[key].length < 2)
		.forEach(key => delete intersectingSets_edges[key]);
	// every intersection line contains two or more edges. turn this list
	// into a pairwise combination where every pair of edges is made.
	// not all pairs of two edges will actually overlap geometrically
	// but we will filter those in the next step.
	const intersectingSets_pairsAll = {};
	Object.keys(intersectingSets_edges).forEach(key => {
		intersectingSets_pairsAll[key] = chooseTwoPairs(intersectingSets_edges[key]);
	});
	const intersectingSets_pairsValid = {};
	// now, true or false if the edge pairs overlap
	Object.keys(intersectingSets_pairsAll).forEach(key => {
		// get a unit vector in the direction of the edges
		const firstEdge = intersectingSets_pairsAll[key][0][0];
		const coords = edges_vertices[firstEdge]
			.map(v => vertices_coords[v]);
		const vector = normalize(subtract(coords[1], coords[0]));
		// get one of the groups to get a plane/normal
		// const group = parseInt(key.split(" ")[0], 10);
		intersectingSets_pairsValid[key] = intersectingSets_pairsAll[key]
			.map(pair => doEdgesOverlap({ vertices_coords, edges_vertices }, pair, vector, epsilon));
	});
	const intersectingSets_pairs = {};
	Object.keys(intersectingSets_pairsAll).forEach(key => {
		intersectingSets_pairs[key] = intersectingSets_pairsAll[key]
			.filter((_, i) => intersectingSets_pairsValid[key][i]);
	});
	// console.log("intersectingSets_edges", intersectingSets_edges);
	// console.log("intersectingSets_pairsAll", intersectingSets_pairsAll);
	// console.log("intersectingSets_pairsValid", intersectingSets_pairsValid);
	// console.log("intersectingSets_pairs", intersectingSets_pairs);
	return Object.keys(intersectingSets_pairs)
		.flatMap(key => intersectingSets_pairs[key]);
};
/**
 * @description For a 3D folded model, this will find the places
 * where two planes meet along collinear edges, these joining of two
 * planes creates a tortilla-tortilla relationship.
 */
const make3DTortillas = ({
	vertices_coords, edges_vertices, edges_faces,
}, faces_set, edges_set, epsilon = 1e-6) => {
	const tortilla_edges = make3DTortillaEdges({
		vertices_coords, edges_vertices,
	}, edges_set, epsilon);
	const tortilla_faces = tortilla_edges
		.map(pair => pair
			.map(edge => edges_faces[edge]));
	// make sure to sort the faces of the tacos on the correct side so that
	// the two faces in the same plane are on the same side of the edge.
	// [[A,X], [B,Y]], A and B are connected faces, X and Y are connected
	// and A and X are in the same plane, B and Y are in the same plane.
	tortilla_faces.forEach((tacos, i) => {
		if (faces_set[tacos[0][0]] !== faces_set[tacos[1][0]]) {
			tortilla_faces[i][1].reverse();
		}
	});
	// finally, each face's shared planar group chose a normal to the plane
	// according to only one of its faces, it could also have chosen the
	// flip of this normal. this normal will be used at the end of the solver
	// to re-orient all faces in their plane. we need to determine if the two
	// plane normals involved here are consistent across the edge, across two
	// neighbor faces, or is one flipped from the other, and if it's flipped,
	// we need to...
	// i think...
	// flip one of the pairs so that it looks like A joins Y and B joins X.
	// const normalsMatch = tortilla_faces
	// 	// get two adjacent faces from the two distinct planar groups
	// 	.map(tortillas => [tortillas[0][0], tortillas[1][0]])
	// 	.map(faces => faces.map(face => overlapInfo.faces_winding[face]))
	// 	.map(orients => orients[0] === orients[1]);
	// normalsMatch
	// 	.map((match, i) => (!match ? i : undefined))
	// 	.filter(a => a !== undefined)
	// 	.forEach(i => tortilla_faces[i][1].reverse());
	// console.log("tortilla_edges", tortilla_edges);
	// console.log("tortilla_faces", tortilla_faces);
	// console.log("normalsMatch", normalsMatch);
	return tortilla_faces;
};

export default make3DTortillas;
