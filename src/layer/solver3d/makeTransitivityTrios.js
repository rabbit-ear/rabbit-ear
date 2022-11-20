/**
 * Rabbit Ear (c) Kraft
 */
import math from "../../math";
import { makeFacesWinding } from "../../graph/facesWinding";
import { getFacesFaces2DOverlap } from "../../graph/overlap";
/**
 * @description given a folded graph, find all trios of faces which overlap
 * each other, meaning there exists at least one point that lies at the
 * intersection of all three faces.
 * @param {FOLD} graph a FOLD graph
 * @param {boolean[][]} faces_facesOverlap an overlap-relationship between every face
 * @param {boolean[]} faces_winding a boolean for each face, true for counter-clockwise.
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][]} list of arrays containing three face indices.
 * @linkcode Origami ./src/layer/tacos/makeTransitivityTrios.js 16
 */
const makeTransitivityTrios = (
	graph,
	faces_facesOverlap,
	faces_winding,
	epsilon = math.core.EPSILON,
) => {
	// prepare a list of all faces in the graph as lists of vertices
	// also, make sure they all have the same winding (reverse if necessary)
	const polygons = graph.faces_vertices
		.map(face => face
			.map(v => graph.vertices_coords[v]));
	makeFacesWinding(graph).forEach((winding, i) => {
		if (!winding) {
			polygons[i].reverse();
		}
	});
	// const matrix = graph.faces_vertices.map(() => []);
	// for (let i = 0; i < matrix.length - 1; i += 1) {
	// 	for (let j = i + 1; j < matrix.length; j += 1) {
	// 		if (!faces_facesOverlap[i][j]) { continue; }
	// 		const polygon = math.core.clipPolygonPolygon(polygons[i], polygons[j], epsilon);
	// 		if (polygon) { matrix[i][j] = polygon; }
	// 	}
	// }
	const matrix = graph.faces_vertices.map(() => []);
	polygons.forEach((_, f1) => faces_facesOverlap[f1].forEach(f2 => {
		matrix[f1][f2] = math.core
			.clipPolygonPolygon(polygons[f1], polygons[f2], epsilon);
	}));
	const trios = [];
	matrix.forEach((row, i) => row.forEach((poly, j) => {
		if (!matrix[i][j]) { return; }
		matrix.forEach((_, k) => {
			if (i === k || j === k) { return; }
			if (!faces_facesOverlap[i][k] || !faces_facesOverlap[j][k]) { return; }
			const polygon = math.core.clipPolygonPolygon(poly, polygons[k], epsilon);
			if (polygon) { trios.push([i, j, k].sort((a, b) => a - b)); }
		});
	}));
	// for (let i = 0; i < matrix.length - 1; i += 1) {
	// 	for (let j = i + 1; j < matrix.length; j += 1) {
	// 		if (!matrix[i][j]) { continue; }
	// 		for (let k = j + 1; k < matrix.length; k += 1) {
	// 			if (i === k || j === k) { continue; }
	// 			if (!faces_facesOverlap[i][k] || !faces_facesOverlap[j][k]) { continue; }
	// 			const polygon = math.core.clipPolygonPolygon(matrix[i][j], polygons[k], epsilon);
	// 			if (polygon) { trios.push([i, j, k].sort((a, b) => a - b)); }
	// 		}
	// 	}
	// }
	return trios;
};

export default makeTransitivityTrios;
