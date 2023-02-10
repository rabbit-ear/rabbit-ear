/**
 * Rabbit Ear (c) Kraft
 */
import math from "../../math.js";
import { makeFacesPolygon } from "../../graph/make.js";
/**
 * @description given a folded graph, find all trios of faces which overlap
 * each other, meaning there exists at least one point that lies at the
 * intersection of all three faces.
 * @param {FOLD} graph a FOLD graph
 * @param {boolean[][]} faces_facesOverlap an overlap-relationship between every face
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][]} list of arrays containing three face indices.
 * @linkcode Origami ./src/layer/solver3d/makeTransitivityTrios.js 15
 */
const makeTransitivityTrios = (
	graph,
	faces_facesOverlap,
	epsilon = math.EPSILON,
) => {
	// prepare a list of all faces in the graph as lists of vertices
	// also, make sure they all have the same winding (reverse if necessary)
	// todo: i replaced this with makeFacesPolygon so that it runs
	// math.makePolygonNonCollinear, which removes collinear vertices
	// which is necessary for the polygon polygon clip method.
	const polygons = makeFacesPolygon(graph, epsilon);
	// const polygons = graph.faces_vertices
	// 	.map(face => face
	// 		.map(v => graph.vertices_coords[v]));
	// todo: why did i write this one? i just uncommented the block below.
	// makeFacesWinding(graph).forEach((winding, i) => {
	// 	if (!winding) { polygons[i].reverse(); }
	// });
	// this is now happening in the prepare() method before this is called
	// polygons.forEach((face, i) => {
	// 	if (!faces_winding[i]) { face.reverse(); }
	// });
	const matrix = graph.faces_vertices.map(() => []);
	polygons.forEach((_, f1) => faces_facesOverlap[f1].forEach(f2 => {
		if (f2 <= f1) { return; }
		const polygon = math
			.clipPolygonPolygon(polygons[f1], polygons[f2], epsilon);
		if (polygon) { matrix[f1][f2] = polygon; }
	}));
	const trios = [];
	matrix.forEach((row, i) => row.forEach((poly, j) => {
		if (j <= i || !matrix[i][j]) { return; }
		matrix.forEach((_, k) => {
			if (k <= i || k <= j) { return; }
			// todo: bring this back. but this would require we convert
			// faces_facesOverlap into a quick lookup table.
			// if (!faces_facesOverlap[i][k] || !faces_facesOverlap[j][k]) { return; }
			const polygon = math.clipPolygonPolygon(poly, polygons[k], epsilon);
			if (polygon) { trios.push([i, j, k].sort((a, b) => a - b)); }
		});
	}));
	return trios;
};

export default makeTransitivityTrios;
