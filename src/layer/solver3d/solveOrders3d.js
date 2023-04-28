/**
 * Rabbit Ear (c) Kraft
 */
import { EPSILON } from "../../math/general/constant.js";
import {
	include,
	includeS,
	exclude,
	excludeS,
} from "../../math/general/function.js";
import { subtract2 } from "../../math/algebra/vector.js";
import { multiplyMatrix4Vector3 } from "../../math/algebra/matrix4.js";
import { overlapConvexPolygonPoint } from "../../math/intersect/overlap.js";
import { intersectConvexPolygonLine } from "../../math/intersect/intersect.js";
import { clipLineConvexPolygon } from "../../math/intersect/clip.js";
/**
 *
 */
const segmentPolygonOverlap2Inclusive = (polygon, segment, epsilon) => (
	clipLineConvexPolygon(
		polygon,
		{ vector: subtract2(segment[1], segment[0]), origin: segment[0] },
		include, // fnPoly
		includeS, // fnLine
		epsilon,
	) !== undefined
);

const polygonSegmentOverlap = (polygon, segment, epsilon = EPSILON) => {
	const pointInPolygon = segment
		.map(point => overlapConvexPolygonPoint(
			polygon,
			point,
			exclude,
			epsilon,
		)).reduce((a, b) => a || b, false);
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

const segmentPolygonOverlap2Exclusive = (polygon, segment, epsilon = EPSILON) => {
	const point_in_poly = segment
		.map(point => overlapConvexPolygonPoint(
			polygon,
			point,
			exclude,
			epsilon,
		)).reduce((a, b) => a || b, false);
	if (point_in_poly) { return true; }
	const edge_intersect = intersectConvexPolygonLine(
		polygon,
		{ vector: subtract2(segment[1], segment[0]), origin: segment[0] },
		excludeS,
		excludeS,
		epsilon,
	);
	if (edge_intersect) { return true; }
	return false;
};
/**
 * @description There are two kinds of arrangements of edges/faces that
 * don't generate solver conditions, instead, they solve relationships
 * between pairs of faces.
 * @param {number[][]} edges_sets remember this only contains definitions
 * for edges which are members of 2 sets. anything made from this will
 * automatically have a non-flat edges_foldAngle.
 */
const solve3DOrders = (
	{ vertices_coords, edges_vertices, edges_faces, edges_foldAngle },
	sets_facePairs,
	sets_transformXY,
	sets_faces,
	faces_set,
	faces_polygon,
	faces_winding,
	edges_sets,
	epsilon = EPSILON,
) => {
	// sets_facesBunch are sets with more than 1 face in the set.
	const sets_facesBunch = sets_faces.slice();
	sets_facesBunch.forEach((arr, i) => {
		if (arr.length < 2) { delete sets_facesBunch[i]; }
	});
	// convert edges_faces into a quick hash lookup where the face is the index
	const edges_facesLookup = edges_faces.map(faces => {
		const lookup = {};
		faces.forEach(face => { lookup[face] = true; });
		return lookup;
	});
	// for each edge (which is a member of 1 or 2 sets, but in this case only
	// edges in 2 sets are inside edges_sets), get all faces in the same sets.
	const edgesSetsFaces = edges_sets
		.map(sets => sets
			.filter(set => sets_facesBunch[set] !== undefined)
			.map(set => sets_facesBunch[set]));
	// because sets_facesBunch may have been empty (if it contains only 1 face),
	// remove all edgesSetsFaces which only have one set, meaning, only one
	// group of planar faces are available so there is nothing to compare
	// these against and uncover face-pair order solutions.
	edges_sets
		.map((_, i) => i)
		.filter(e => edgesSetsFaces[e].length < 2)
		.forEach(e => delete edgesSetsFaces[e]);
	// from the set of all edgesSetsFaces, filter them into 2 categories:
	// 1: those which are adjacent to the edge (and cannot overlap this edge),
	// 2: those which are non-adjacent, and are candidates for overlap.
	// these arrays are built from edges_sets and edges_sets only contains
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
	// use "edgesSetsFaces" instead of "edges_sets" because we filtered out
	// edges that only contain only one group of planar faces.
	const edgesSegment3D = edgesSetsFaces
		.map((_, e) => edges_vertices[e]
			.map(v => vertices_coords[v]));
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
							sets_transformXY[faces_set[face]],
							point,
						));
					const segment2D = segmentTransform.map(p => [p[0], p[1]]);
					// return segmentPolygonOverlap2Exclusive(faces_polygon[face], segment2D, epsilon);
					return polygonSegmentOverlap(faces_polygon[face], segment2D, epsilon)
						? face
						: undefined;
				})
				.filter(a => a !== undefined)));
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
					set: faces_set[face],
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
	// console.log("sets_facesBunch", sets_facesBunch);
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

export default solve3DOrders;
