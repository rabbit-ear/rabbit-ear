/**
 * Rabbit Ear (c) Kraft
 */
import { EPSILON } from "../../../math/general/constant.js";
import { clipPolygonPolygon } from "../../../math/intersect/clip.js";
import { makeFacesWinding } from "../../../graph/faces/winding.js";
import { makeFacesPolygon } from "../../../graph/make.js";
import { getFacesFacesOverlap } from "../../../graph/intersect/facesFaces.js";
/**
 * @description given a folded graph, find all trios of faces which overlap
 * each other, meaning there exists at least one point that lies at the
 * intersection of all three faces.
 * @param {FOLD} graph a FOLD graph
 * @param {number[][]} facesFacesOverlap an overlap-relationship between every face
 * @param {boolean[]} faces_winding a boolean for each face, true for counter-clockwise.
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][]} list of arrays containing three face indices.
 * @linkcode Origami ./src/layer/solver2d/tacos/makeTransitivityTrios.js 17
 */
const makeTransitivityTrios = (
	graph,
	facesFacesOverlap,
	faces_winding,
	epsilon = EPSILON,
) => {
	if (!facesFacesOverlap) {
		facesFacesOverlap = getFacesFacesOverlap(graph, epsilon);
	}
	if (!faces_winding) {
		faces_winding = makeFacesWinding(graph);
	}
	// const overlap_matrix = facesFacesOverlap;
	const overlap_matrix = facesFacesOverlap.map(() => []);
	facesFacesOverlap
		.forEach((faces, i) => faces
			.forEach(j => {
				overlap_matrix[i][j] = true;
				overlap_matrix[j][i] = true;
			}));
	// prepare a list of all faces in the graph as lists of vertices
	// also, make sure they all have the same winding (reverse if necessary)
	const polygons = makeFacesPolygon(graph);
	polygons.forEach((face, i) => {
		if (!faces_winding[i]) { face.reverse(); }
	});
	const matrix = graph.faces_vertices.map(() => []);
	for (let i = 0; i < matrix.length - 1; i += 1) {
		for (let j = i + 1; j < matrix.length; j += 1) {
			if (!overlap_matrix[i][j]) { continue; }
			const polygon = clipPolygonPolygon(polygons[i], polygons[j], epsilon);
			if (polygon) { matrix[i][j] = polygon; }
		}
	}
	const trios = [];
	for (let i = 0; i < matrix.length - 1; i += 1) {
		for (let j = i + 1; j < matrix.length; j += 1) {
			if (!matrix[i][j]) { continue; }
			for (let k = j + 1; k < matrix.length; k += 1) {
				if (i === k || j === k) { continue; }
				if (!overlap_matrix[i][k] || !overlap_matrix[j][k]) { continue; }
				const polygon = clipPolygonPolygon(matrix[i][j], polygons[k], epsilon);
				if (polygon) { trios.push([i, j, k].sort((a, b) => a - b)); }
			}
		}
	}
	return trios;
};

export default makeTransitivityTrios;
