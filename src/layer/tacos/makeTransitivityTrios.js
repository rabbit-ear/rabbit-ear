/**
 * Rabbit Ear (c) Kraft
 */
import math from "../../math";
import { makeFacesWinding } from "../../graph/facesWinding";
import { makeFacesFacesOverlap } from "../../graph/overlap";
/**
 * @description given a folded graph, find all trios of faces which overlap
 * each other, meaning there exists at least one point that lies at the
 * intersection of all three faces.
 * @param {object} graph a FOLD graph
 * @param {boolean[][]} overlap_matrix an overlap-relationship between every face
 * @param {boolean[]} faces_winding a boolean for each face, true for counter-clockwise.
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][]} list of arrays containing three face indices.
 */
const makeTransitivityTrios = (graph, overlap_matrix, faces_winding, epsilon = math.core.EPSILON) => {
	if (!overlap_matrix) {
		overlap_matrix = makeFacesFacesOverlap(graph, epsilon);
	}
	if (!faces_winding) {
		faces_winding = makeFacesWinding(graph);
	}
	// prepare a list of all faces in the graph as lists of vertices
	// also, make sure they all have the same winding (reverse if necessary)
	const polygons = graph.faces_vertices
		.map(face => face
			.map(v => graph.vertices_coords[v]));
	polygons.forEach((face, i) => {
		if (!faces_winding[i]) { face.reverse(); }
	});
	const matrix = graph.faces_vertices.map(() => []);
	for (let i = 0; i < matrix.length - 1; i++) {
		for (let j = i + 1; j < matrix.length; j++) {
			if (!overlap_matrix[i][j]) { continue; }
			const polygon = math.core.clipPolygonPolygon(polygons[i], polygons[j], epsilon);
			if (polygon) { matrix[i][j] = polygon; }
		}
	}
	const trios = [];
	for (let i = 0; i < matrix.length - 1; i++) {
		for (let j = i + 1; j < matrix.length; j++) {
			if (!matrix[i][j]) { continue; }
			for (let k = j + 1; k < matrix.length; k++) {
				if (i === k || j === k) { continue; }
				if (!overlap_matrix[i][k] || !overlap_matrix[j][k]) { continue; }
				const polygon = math.core.clipPolygonPolygon(matrix[i][j], polygons[k], epsilon);
				if (polygon) { trios.push([i, j, k].sort((a, b) => a - b)); }
			}
		}
	}
	return trios;
};

export default makeTransitivityTrios;
