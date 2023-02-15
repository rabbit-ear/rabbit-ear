/**
 * Rabbit Ear (c) Kraft
 */
import {
	include,
	includeS,
	exclude,
	excludeS,
} from "../../math/general/functions.js";
import { subtract2 } from "../../math/algebra/vectors.js";
import { multiplyMatrix4Vector3 } from "../../math/algebra/matrix4.js";
import { overlapConvexPolygonPoint } from "../../math/intersect/overlap.js";
import { intersectConvexPolygonLine } from "../../math/intersect/intersect.js";
import { clipLineConvexPolygon } from "../../math/intersect/clip.js";
import { edgeFoldAngleIsFlat } from "../../fold/spec.js";
/**
 *
 */
const segmentPolygonOverlap2Inclusive = (segment, polygon, epsilon) => (
	clipLineConvexPolygon(
		polygon,
		{ vector: subtract2(segment[1], segment[0]), origin: segment[0] },
		include, // fnPoly
		includeS, // fnLine
		epsilon,
	) !== undefined
);

const segmentPolygonOverlap2Exclusive = (segment, polygon, epsilon) => {
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
 * @description For a 3D folded model, this will find the places
 * where two planes meet along collinear edges, these joining of two
 * planes creates a tortilla-tortilla relationship.
 */
const make3DTacoTortillas = (
	graph,
	sets_facePairs,
	sets_transformXY,
	faces_set,
	faces_polygon,
	edges_sets,
	epsilon = 1e-6,
) => {
	if (sets_facePairs.length < 2) { return []; }
	const sets_face_pairs = sets_facePairs
		.map(set => set
			.map(pair => pair.split(" ").map(n => parseInt(n, 10))));
	const sets_facesSet = sets_face_pairs
		.map(pairs => pairs
			.flat()
			.sort((a, b) => a - b));
	const sets_faces = sets_facesSet.map(faces => [...new Set(faces)]);
	const edges_facesLookup = graph.edges_faces
		.map(faces => {
			const lookup = {};
			faces.forEach(face => { lookup[face] = {}; });
			return lookup;
		});
	const edges_possibleOverlapFaces = edges_sets
		.map((sets, edge) => sets
			.flatMap(set => sets_faces[set])
			.filter(face => !edges_facesLookup[edge][face]));
	const edges_possibleOverlapOtherFaces = edges_sets
		.map((sets, edge) => sets
			.flatMap(set => sets_faces[set])
			.filter(face => edges_facesLookup[edge][face]));
	// we only want to be dealing with edges which are 3D.
	// these are the flat angles. delete them
	edges_possibleOverlapFaces
		.map((_, e) => (edgeFoldAngleIsFlat(graph.edges_foldAngle[e])
			? e : undefined))
		.filter(a => a !== undefined)
		.forEach(e => {
			delete edges_possibleOverlapFaces[e];
			delete edges_possibleOverlapOtherFaces[e];
		});
	const edges_segment3D = edges_possibleOverlapFaces
		.map((_, e) => graph.edges_vertices[e]
			.map(v => graph.vertices_coords[v]));
	const edgeFaceOverlapBoolean = edges_possibleOverlapFaces
		.map((faces, edge) => faces
			.map(face => segmentPolygonOverlap2Exclusive(
				edges_segment3D[edge]
					.map(point => multiplyMatrix4Vector3(
						sets_transformXY[faces_set[face]],
						point,
					)),
				faces_polygon[face],
				epsilon,
			)));
	// const edgeFaceOverlap = edgeFaceOverlapBoolean
	// 	.map((faces, i) => faces
	// 		.map((overlap, j) => (overlap
	// 			? edges_possibleOverlapFaces[i][j]
	// 			: undefined))
	// 		.filter(a => a !== undefined));
	// const edgeFaceOverlapOtherFace = edgeFaceOverlapBoolean
	// 	.map((faces, i) => faces
	// 		.map((overlap, j) => (overlap
	// 			? edges_possibleOverlapOtherFaces[i][j]
	// 			: undefined))
	// 		.filter(a => a !== undefined));
	const results = edgeFaceOverlapBoolean
		.flatMap((faces, i) => faces
			.map((overlap, j) => (overlap
				? ({
					edge: i,
					face: edges_possibleOverlapFaces[i][j],
					otherFace: edges_possibleOverlapOtherFaces[i][j],
				})
				: undefined))
			.filter(a => a !== undefined));
	console.log("make3DTacoTortillas");
	console.log("sets_facePairs", sets_facePairs);
	console.log("edges_sets", edges_sets);
	console.log("sets_face_pairs", sets_face_pairs);
	console.log("sets_faces", sets_faces);
	console.log("edges_possibleOverlapFaces", edges_possibleOverlapFaces);
	console.log("edges_possibleOverlapOtherFaces", edges_possibleOverlapOtherFaces);
	console.log("edges_segment3D", edges_segment3D);
	// console.log("edges_transform", edges_transform);
	// console.log("edges_segment2D", edges_segment2D);
	console.log("results", results);
	return results;
};

// the 2D tacoTortilla method generates an array of objects in the form:
// [
// 	{ taco: [ 8, 9 ], tortilla: 6 },
// 	...
// ]
// this one is generating 3D tacos (one face coplanar with the tortilla),
// so there is no debate on which side the tortilla this taco will lie.
// instead of returning taco tortilla data, we can just return solutions
// to face-pair constraints.

export default make3DTacoTortillas;
