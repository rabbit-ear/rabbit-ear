/**
 * Rabbit Ear (c) Kraft
 */
import { chooseTwoPairs } from "../../general/arrays.js";
import math from "../../math.js";
/**
 * @description a range is an array of two numbers [start, end]
 * not necessarily in sorted order.
 * Do the two spans overlap on the numberline?
 */
const rangesOverlapExclusive = (a, b, epsilon = 1e-6) => {
	// make sure ranges are well formed (sorted low to high)
	const r1 = a[0] < a[1] ? a : [a[1], a[0]];
	const r2 = b[0] < b[1] ? b : [b[1], b[0]];
	const overlap = Math.min(r1[1], r2[1]) - Math.max(r1[0], r2[0]);
	return overlap > epsilon;
};

const doEdgesOverlap = (graph, edgePair, vector, epsilon = 1e-6) => {
	// console.log("doEdgesOverlap", graph, edgePair, vector, epsilon);
	const pairCoords = edgePair
		.map(edge => graph.edges_vertices[edge]
			.map(v => graph.vertices_coords[v]));
	const pairCoordsDots = pairCoords
		.map(edge => edge
			.map(coord => math.core.dot(coord, vector)));
	const result = rangesOverlapExclusive(...pairCoordsDots, epsilon);
	// console.log("pairCoords", pairCoords);
	// console.log("pairCoordsDots", pairCoordsDots);
	// console.log("result", result);
	return result;
};

// this will only work with graphs which are manifolds, edges must
// have only one or two adjacent faces, not three or more.
/**
 *
 */
const make3DTortillaEdges = (graph, overlapInfo, epsilon = 1e-6) => {
	const edges_groups_lookup = graph.edges_vertices.map(() => ({}));
	overlapInfo.faces_set
		.forEach((set, face) => graph.faces_edges[face]
			.forEach(edge => { edges_groups_lookup[edge][set] = true; }));
	// for every edge, which co-planar group does it appear in
	const edges_groups = edges_groups_lookup
		.map(o => Object.keys(o)
			.map(n => parseInt(n, 10)));
	// if an edge only appears in one group, delete the entry from the array
	// this will create an array with holes, maintaining edge's indices.
	edges_groups.forEach((arr, i) => {
		if (arr.length !== 2) { delete edges_groups[i]; }
	});
	// ensure entries in edges_groups are sorted
	edges_groups.forEach((arr, i) => {
		if (arr[0] > arr[1]) { edges_groups[i].reverse(); }
	});
	const edges_groups_keys = edges_groups.map(arr => arr.join(" "));
	// intersectingGroups_edges will be a dictionary of pairs of groups: "3 15"
	// indicating that there is an intersection between these two planes,
	// and the value is an array of all edges along that intersection.
	const intersectingGroups_edges = {};
	edges_groups_keys.forEach((key, i) => {
		if (intersectingGroups_edges[key] === undefined) {
			intersectingGroups_edges[key] = [];
		}
		intersectingGroups_edges[key].push(i);
	});
	// we are looking for taco-taco cases so we need two or more edges.
	// remove an intersectingGroups_edges if it contains only one edge.
	Object.keys(intersectingGroups_edges)
		.filter(key => intersectingGroups_edges[key].length < 2)
		.forEach(key => delete intersectingGroups_edges[key]);
	// every intersection line contains two or more edges. turn this list
	// into a pairwise combination where every pair of edges is made.
	// not all pairs of two edges will actually overlap geometrically
	// but we will filter those in the next step.
	const intersectingGroups_pairsAll = {};
	Object.keys(intersectingGroups_edges).forEach(key => {
		intersectingGroups_pairsAll[key] = chooseTwoPairs(intersectingGroups_edges[key]);
	});
	const intersectingGroups_pairsValid = {};
	// now, true or false if the edge pairs overlap
	Object.keys(intersectingGroups_pairsAll).forEach(key => {
		// get a unit vector in the direction of the edges
		const firstEdge = intersectingGroups_pairsAll[key][0][0];
		const coords = graph.edges_vertices[firstEdge]
			.map(v => graph.vertices_coords[v]);
		const vector = math.core.normalize(math.core.subtract(coords[1], coords[0]));
		// get one of the groups to get a plane/normal
		// const group = parseInt(key.split(" ")[0], 10);
		intersectingGroups_pairsValid[key] = intersectingGroups_pairsAll[key]
			.map(pair => doEdgesOverlap(graph, pair, vector, epsilon));
	});
	const intersectingGroups_pairs = {};
	Object.keys(intersectingGroups_pairsAll).forEach(key => {
		intersectingGroups_pairs[key] = intersectingGroups_pairsAll[key]
			.filter((_, i) => intersectingGroups_pairsValid[key][i]);
	});
	// console.log("edges_groups", edges_groups);
	// console.log("intersectingGroups_edges", intersectingGroups_edges);
	// console.log("intersectingGroups_pairsAll", intersectingGroups_pairsAll);
	// console.log("intersectingGroups_pairsValid", intersectingGroups_pairsValid);
	// console.log("intersectingGroups_pairs", intersectingGroups_pairs);
	return Object.keys(intersectingGroups_pairs)
		.flatMap(key => intersectingGroups_pairs[key]);
};
/**
 * @description For a 3D folded model, this will find the places
 * where two planes meet along collinear edges, these joining of two
 * planes creates a tortilla-tortilla relationship.
 */
const make3DTortillas = (graph, overlapInfo, epsilon = 1e-6) => {
	const tortilla_edges = make3DTortillaEdges(graph, overlapInfo, epsilon);
	const tortilla_faces = tortilla_edges
		.map(pair => pair
			.map(edge => graph.edges_faces[edge]));
	// make sure to sort the faces of the tacos on the correct side so that
	// the two faces in the same plane are on the same side of the edge.
	// [[A,X], [B,Y]], A and B are connected faces, X and Y are connected
	// and A and X are in the same plane, B and Y are in the same plane.
	tortilla_faces.forEach((tacos, i) => {
		if (overlapInfo.faces_set[tacos[0][0]] !== overlapInfo.faces_set[tacos[1][0]]) {
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
	// console.log("overlapInfo", overlapInfo);
	// console.log("tortilla_edges", tortilla_edges);
	// console.log("tortilla_faces", tortilla_faces);
	// console.log("normalsMatch", normalsMatch);
	return tortilla_faces;
};

export default make3DTortillas;
