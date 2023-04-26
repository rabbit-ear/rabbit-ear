/**
 * Rabbit Ear (c) Kraft
 */
import { EPSILON } from "../../math/general/constant.js";
import { clipPolygonPolygon } from "../../math/intersect/clip.js";
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
export const makeTransitivity = (
	{ faces_polygon },
	facesFacesOverlap,
	epsilon = EPSILON,
) => {
	// convert facesFacesOverlap into index-based sparse arrays for fast access.
	const overlap_matrix = facesFacesOverlap.map(() => []);
	facesFacesOverlap.forEach((faces, i) => faces.forEach(j => {
		overlap_matrix[i][j] = true;
		overlap_matrix[j][i] = true;
	}));
	// for every pair of faces that overlap, compute their intersection,
	// if it exists, save the new polygon in this sparse matrix.
	const facesFacesIntersection = [];
	facesFacesOverlap.forEach((faces, i) => faces.forEach(j => {
		const polygon = clipPolygonPolygon(faces_polygon[i], faces_polygon[j], epsilon);
		if (polygon) {
			if (!facesFacesIntersection[i]) { facesFacesIntersection[i] = []; }
			if (!facesFacesIntersection[j]) { facesFacesIntersection[j] = []; }
			facesFacesIntersection[i][j] = polygon;
			facesFacesIntersection[j][i] = polygon;
		}
	}));
	const trios = [];
	for (let i = 0; i < facesFacesIntersection.length - 1; i += 1) {
		if (!facesFacesIntersection[i]) { continue; }
		for (let j = i + 1; j < facesFacesIntersection.length; j += 1) {
			if (!facesFacesIntersection[i][j]) { continue; }
			for (let k = j + 1; k < facesFacesIntersection.length; k += 1) {
				if (i === k || j === k) { continue; }
				if (!overlap_matrix[i][k] || !overlap_matrix[j][k]) { continue; }
				const polygon = clipPolygonPolygon(
					facesFacesIntersection[i][j],
					faces_polygon[k],
					epsilon,
				);
				if (polygon) { trios.push([i, j, k].sort((a, b) => a - b)); }
			}
		}
	}
	return trios;
};
/**
 * @description given a full set of transitivity conditions (trios of faces which
 * overlap each other), and the set of pre-computed taco-taco and
 * taco-tortilla events, remove any transitivity condition where the three
 * faces are already covered in a taco-taco case.
 * @linkcode Origami ./src/layer/solver2d/tacos/filterTransitivity.js 9
 */
export const filterTransitivity = (transitivity_trios, { taco_taco, taco_tortilla }) => {
	// will contain taco-taco and taco-tortilla events encoded as all
	// permutations of 3 faces involved in each event.
	const tacos_trios = {};
	// using the list of all taco-taco conditions, store all permutations of
	// the three faces (sorted low to high) into a dictionary for quick lookup.
	// store them as space-separated strings.
	taco_taco
		.map(tacos => [tacos[0][0], tacos[0][1], tacos[1][0], tacos[1][1]]
			.sort((a, b) => a - b))
		.forEach(taco => [
			`${taco[0]} ${taco[1]} ${taco[2]}`,
			`${taco[0]} ${taco[1]} ${taco[3]}`,
			`${taco[0]} ${taco[2]} ${taco[3]}`,
			`${taco[1]} ${taco[2]} ${taco[3]}`,
		].forEach(key => { tacos_trios[key] = true; }));
	// convert all taco-tortilla cases into similarly-formatted,
	// space-separated strings.
	taco_tortilla
		.map(el => [el.taco[0], el.taco[1], el.tortilla]
			.sort((a, b) => a - b).join(" "))
		.forEach(key => { tacos_trios[key] = true; });
	// return the filtered set of trios.
	return transitivity_trios
		.filter(trio => tacos_trios[trio.join(" ")] === undefined);
};
