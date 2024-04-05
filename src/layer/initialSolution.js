/**
 * Rabbit Ear (c) Kraft
 */
import {
	EPSILON,
} from "../math/constant.js";
import {
	exclude,
	excludeS,
} from "../math/compare.js";
import {
	subtract2,
} from "../math/vector.js";
import {
	multiplyMatrix4Vector3,
} from "../math/matrix4.js";
import {
	overlapConvexPolygonPoint,
} from "../math/overlap.js";
import {
	clipLineConvexPolygon,
} from "../math/clip.js";

/**
 * @description Given a FOLD graph, already folded, find the layer arrangement
 * between neighboring faces (using edges_faces), and assign this facePair
 * a 1 or 2, checking whether faces have been flipped or not.
 * @param {FOLD} graph a FOLD object
 * @param {string[]} facePairs an array of space-separated face-pair strings
 * @param {boolean[]} faces_winding for every face, true if the face's
 * winding is counter-clockwise, false if clockwise.
 * @returns {{[key: string]: number}} an object describing all the
 * solved facePairs (keys) and their layer order 1 or 2 (value),
 * the object only includes those facePairs
 * which are solved, so, no 0-value entries will exist.
 * @linkcode
 */
export const solveFlatAdjacentEdges = (
	{ edges_faces, edges_assignment },
	faces_winding,
) => {
	// flip 1 and 2 to be the other, leaving 0 to be 0.
	const flipCondition = { 0: 0, 1: 2, 2: 1 };

	// neighbor faces determined by crease between them
	const assignmentOrder = { M: 1, m: 1, V: 2, v: 2 };

	// "solution" contains solved orders (1, 2) for face-pair keys.
	/** @type {{ [key: string]: number }} */
	const solution = {};
	edges_faces.forEach((faces, edge) => {
		// the crease assignment determines the order between pairs of faces.
		const assignment = edges_assignment[edge];
		const localOrder = assignmentOrder[assignment];

		// skip boundary edges, non-manifold edges, and irrelevant assignments
		if (faces.length !== 2 || localOrder === undefined) { return; }

		// face[0] is the origin face.
		// the direction of "m" or "v" will be inverted if face[0] is flipped.
		const upright = faces_winding[faces[0]];

		// now we know from a global perspective the order between the face pair.
		const globalOrder = upright
			? localOrder
			: flipCondition[localOrder];

		// all face-pairs are stored "a b" where a < b. Our globalOrder is the
		// relationship from faces[0] to faces[1], so if faces[0] > [1] we need
		// to flip the order of faces, and flip the result.
		const inOrder = faces[0] < faces[1];
		const key = inOrder ? faces.join(" ") : faces.slice().reverse().join(" ");
		const value = inOrder ? globalOrder : flipCondition[globalOrder];

		solution[key] = value;
	});
	return solution;
};

/**
 *
 */
const polygonSegmentOverlap = (polygon, segment, epsilon = EPSILON) => {
	const pointInPolygon = segment
		.map(point => overlapConvexPolygonPoint(
			polygon,
			point,
			exclude,
			epsilon,
		).overlap).reduce((a, b) => a || b, false);
	if (pointInPolygon) { return true; }
	const edgeClip = clipLineConvexPolygon(
		polygon,
		{ vector: subtract2(segment[1], segment[0]), origin: segment[0] },
		exclude,
		excludeS,
		epsilon,
	);
	return edgeClip !== undefined;
};

/**
 * @description There are two kinds of arrangements of edges/faces that
 * don't generate solver conditions, instead, they solve relationships
 * between pairs of faces.
 * @param {number[][]} edges_clusters remember this only contains definitions
 * for edges which are members of 2 sets. anything made from this will
 * automatically have a non-flat edges_foldAngle.
 * @returns {{ [key: string]: number }} solutions to face-pair layer orders
 */
export const solveOrders3DEdgeFaceOverlap = (
	{ vertices_coords, edges_vertices, edges_faces, edges_foldAngle },
	clusters_transform,
	clusters_faces,
	faces_cluster,
	faces_polygon,
	faces_winding,
	epsilon = EPSILON,
) => {
	// make edges_clusters
	const edges_clusters = edges_faces
		.map(faces => faces
			.map(face => faces_cluster[face]));
	edges_clusters
		.map((_, i) => i)
		.filter(e => edges_clusters[e].length !== 2
			|| (edges_clusters[e][0] === edges_clusters[e][1]))
		.forEach(e => delete edges_clusters[e]);

	// clusters_facesBunch are sets with more than 1 face in the set.
	const clusters_facesBunch = clusters_faces.slice();
	clusters_facesBunch.forEach((arr, i) => {
		if (arr.length < 2) { delete clusters_facesBunch[i]; }
	});
	// convert edges_faces into a quick hash lookup where the face is the index
	const edges_facesLookup = edges_faces.map(faces => {
		const lookup = {};
		faces.forEach(face => { lookup[face] = true; });
		return lookup;
	});
	// for each edge (which is a member of 1 or 2 sets, but in this case only
	// edges in 2 sets are inside edges_clusters), get all faces in the same sets.
	const edgesSetsFaces = edges_clusters
		.map(sets => sets
			.filter(set => clusters_facesBunch[set] !== undefined)
			.map(set => clusters_facesBunch[set]));
	// because clusters_facesBunch may have been empty (if it contains only 1 face),
	// remove all edgesSetsFaces which only have one set, meaning, only one
	// group of planar faces are available so there is nothing to compare
	// these against and uncover face-pair order solutions.
	edges_clusters
		.map((_, i) => i)
		.filter(e => edgesSetsFaces[e].length < 2)
		.forEach(e => delete edgesSetsFaces[e]);
	// from the set of all edgesSetsFaces, filter them into 2 categories:
	// 1: those which are adjacent to the edge (and cannot overlap this edge),
	// 2: those which are non-adjacent, and are candidates for overlap.
	// these arrays are built from edges_clusters and edges_clusters only contains
	// definitions for edges in 2 sets, so all edges have non-flat fold angles.
	const edgesSetsFacesAdjacent = edgesSetsFaces
		.map((sets, edge) => sets
			.map(faces => faces
				.filter(face => edges_facesLookup[edge][face])));
	const edgesSetsFacesAllNonAdjacent = edgesSetsFaces
		.map((sets, edge) => sets
			.map(faces => faces
				.filter(face => !edges_facesLookup[edge][face])));
	// convert all edges into 3D segments, pairs of 3D vertices.
	// use "edgesSetsFaces" instead of "edges_clusters" because we filtered out
	// edges that only contain only one group of planar faces.
	const edgesSegment3D = edgesSetsFaces
		.map((_, e) => edges_vertices[e]
			.map(v => vertices_coords[v]));
	// console.log(
	// 	"edges",
	// 	edgesSegment3D.length,
	// 	"faces",
	// 	edgesSetsFacesAllNonAdjacent.map(sets => sets.map(faces => faces.length)),
	// );
	// 3,386ms
	// console.time("solveOrders3d.js polygon-segment-overlap");
	// now, iterate through the non-adjacent faces for every edge and
	// check if they overlap with the edge. this requires applying the same
	// transform to the edge which was applied to the face, remove the Z
	// component (because the transform only rotates), and compute the overlap.
	// subset of all non-adjacent faces that overlap the edge
	const edgesSetsFacesNonAdjacent = edgesSetsFacesAllNonAdjacent
		.map((sets, edge) => sets
			.map(faces => faces
				.map(face => {
					const segmentTransform = edgesSegment3D[edge]
						.map(point => multiplyMatrix4Vector3(
							clusters_transform[faces_cluster[face]],
							point,
						));
					const segment2D = segmentTransform.map(p => [p[0], p[1]]);
					// return segmentPolygonOverlap2Exclusive(faces_polygon[face], segment2D, epsilon);
					return polygonSegmentOverlap(faces_polygon[face], segment2D, epsilon)
						? face
						: undefined;
				})
				.filter(a => a !== undefined)));
	// console.timeEnd("solveOrders3d.js polygon-segment-overlap");
	// create a set of objects where each "edge" has two adjacent "faces",
	// and the first faces index [0] is coplanar with the face in "overlap".
	// faces index [1] deviates from the plane by the edge's edges_foldAngle.
	// this implies in a known layer order between "faces[0]" and "overlap".
	const tacoTortillas3D = edgesSetsFaces
		.flatMap((_, edge) => edgesSetsFacesNonAdjacent[edge]
			.flatMap((faces, setIndex) => {
				const otherSetIndex = 1 - setIndex; // 0 becomes 1. 1 becomes 0.
				const adjacent = edgesSetsFacesAdjacent[edge];
				return faces.map(face => ({
					edge,
					faces: [adjacent[setIndex][0], adjacent[otherSetIndex][0]],
					overlap: face,
					set: faces_cluster[face],
				}));
			}));
	// get the two faces whose order will be solved.
	const tacoTortillas3DFacePairs = tacoTortillas3D
		.map(el => [el.faces[0], el.overlap]);
	// are the face pairs in the correct order for the solver? where A < B?
	const tacoTortillas3DFacePairsCorrect = tacoTortillas3DFacePairs
		.map(pair => pair[0] < pair[1]);
	// order the pair of faces so the smaller index comes first.
	tacoTortillas3DFacePairsCorrect.forEach((correct, i) => {
		if (!correct) { tacoTortillas3DFacePairs[i].reverse(); }
	});
	// is the first face (faces[0]) aligned with the planar-set's normal?
	const tacoTortillas3DAligned = tacoTortillas3D
		.map(el => faces_winding[el.faces[0]]);
	// true is positive/valley, false is negative/mountain
	const tacoTortillas3DBendDir = tacoTortillas3D
		.map(el => edges_foldAngle[el.edge])
		.map(Math.sign)
		.map(n => n === 1);
	// 0 means A is above B, 1 means B is above A.
	// where A is the adjacent face, B is the overlapped face.
	const tacoTortillas3DXOR = tacoTortillas3D
		.map((_, i) => tacoTortillas3DAligned[i] ^ tacoTortillas3DBendDir[i]);
	// solver notation, where 1 means A is above B. 2 means B is above A.
	// also, if we flipped the order of the faces for the solution key,
	// flip this solution as well
	const tacoTortillas3DSolution = tacoTortillas3DXOR
		.map((xor, i) => (tacoTortillas3DFacePairsCorrect[i] ? xor : 1 - xor))
		.map(xor => xor + 1);
	// a dictionary with keys: face pairs ("5 23"), and values: 1 or 2.
	const orders = {};
	tacoTortillas3DFacePairs.forEach((pair, i) => {
		orders[pair.join(" ")] = tacoTortillas3DSolution[i];
	});
	// console.log("clusters_facesBunch", clusters_facesBunch);
	// console.log("edges_facesLookup", edges_facesLookup);
	// console.log("edgesSetsFaces", edgesSetsFaces);
	// console.log("edgesSetsFacesAdjacent", edgesSetsFacesAdjacent);
	// console.log("edgesSetsFacesAllNonAdjacent", edgesSetsFacesAllNonAdjacent);
	// console.log("edgesSetsFacesNonAdjacent", edgesSetsFacesNonAdjacent);
	// console.log("edgesSegment3D", edgesSegment3D);
	// console.log("tacoTortillas3D", tacoTortillas3D);
	// console.log("tacoTortillas3DAligned", tacoTortillas3DAligned);
	// console.log("tacoTortillas3DBendDir", tacoTortillas3DBendDir);
	// console.log("tacoTortillas3DXOR", tacoTortillas3DXOR);
	// console.log("tacoTortillas3DSolution", tacoTortillas3DSolution);
	// console.log("tacoTortillas3DFacePairs", tacoTortillas3DFacePairs);
	// console.log("tacoTortillas3DFacePairsCorrect", tacoTortillas3DFacePairsCorrect);
	// console.log("orders", orders);
	return orders;
};
