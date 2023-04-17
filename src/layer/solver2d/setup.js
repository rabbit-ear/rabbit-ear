/**
 * Rabbit Ear (c) Kraft
 */
import { selfRelationalUniqueIndexPairs } from "../../general/arrays.js";
import { getFacesFacesOverlap } from "../../graph/intersect/facesFaces.js";
import { makeFacesWinding } from "../../graph/faces/winding.js";
import { makeFacesPolygon } from "../../graph/make.js";
import {
	makeConstraints,
	makeConstraintsLookup,
} from "./makeConstraints.js";
import makeTacosTortillas from "./tacos/makeTacosTortillas.js";
import {
	makeTransitivity,
	filterTransitivity,
} from "./tacos/transitivity.js";
/**
 *
 */
const setup = ({
	vertices_coords, edges_vertices, edges_faces, faces_vertices, faces_edges, edges_vector,
}, epsilon = 1e-6) => {
	// create a polygon (array of points) for every face. ensure that
	// every polygon has the same winding (reverse if necessary).
	const faces_winding = makeFacesWinding({ vertices_coords, faces_vertices });
	const faces_polygon = makeFacesPolygon({ vertices_coords, faces_vertices }, epsilon);
	faces_polygon.forEach((polygon, i) => {
		if (!faces_winding[i]) { polygon.reverse(); }
	});
	const facesFacesOverlap = getFacesFacesOverlap({ vertices_coords, faces_vertices }, epsilon);
	const tacos_tortillas = makeTacosTortillas({
		vertices_coords,
		edges_vertices,
		edges_faces,
		faces_vertices,
		faces_edges,
		edges_vector,
		faces_polygon,
	}, epsilon);
	const unfiltered_trios = makeTransitivity(faces_polygon, facesFacesOverlap, epsilon);
	const transitivity_trios = filterTransitivity(unfiltered_trios, tacos_tortillas);
	// format the tacos and transitivity data into maps that relate to the
	// lookup table at the heart of the algorithm, located at "table.js"
	const constraints = makeConstraints(tacos_tortillas, transitivity_trios);
	// this is building a massive lookup table, it takes quite a bit of time
	const lookup = makeConstraintsLookup(constraints);
	// these are all the variables we need to solve- all overlapping faces in
	// pairwise combinations, as a space-separated string, smallest index first
	const facePairs = selfRelationalUniqueIndexPairs(facesFacesOverlap)
		.map(pair => pair.join(" "));
	// console.log("facesFacesOverlap", facesFacesOverlap);
	// console.log("tacos_tortillas", tacos_tortillas);
	// console.log("unfiltered_trios", unfiltered_trios);
	// console.log("transitivity_trios", transitivity_trios);
	// console.log("constraints", constraints);
	// console.log("lookup", lookup);
	// console.log("facePairs", facePairs);
	return {
		constraints,
		lookup,
		facePairs,
		faces_winding,
	};
};

export default setup;
