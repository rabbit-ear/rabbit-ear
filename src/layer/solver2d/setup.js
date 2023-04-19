/**
 * Rabbit Ear (c) Kraft
 */
import { EPSILON } from "../../math/general/constant.js";
import { selfRelationalUniqueIndexPairs } from "../../general/arrays.js";
import { getFacesFacesOverlap } from "../../graph/intersect/facesFaces.js";
import { makeFacesWinding } from "../../graph/faces/winding.js";
import { makeFacesPolygon } from "../../graph/make.js";
import {
	makeConstraints,
	makeConstraintsLookup,
} from "./makeConstraints.js";
import makeTacosAndTortillas from "./tacosAndTortillas.js";
import {
	makeTransitivity,
	filterTransitivity,
} from "./transitivity.js";
/**
 *
 */
export const makeRelationships = ({
	vertices_coords,
	edges_vertices,
	edges_faces,
	faces_vertices,
	faces_edges,
	edges_vector,
	faces_polygon,
}, facesFacesOverlap, epsilon = EPSILON) => {
	const {
		taco_taco, taco_tortilla, tortilla_tortilla,
	} = makeTacosAndTortillas({
		vertices_coords,
		edges_vertices,
		edges_faces,
		faces_vertices,
		faces_edges,
		edges_vector,
	}, epsilon);
	const unfilteredTrans = makeTransitivity({ faces_polygon }, facesFacesOverlap, epsilon);
	const transitivity = filterTransitivity(unfilteredTrans, { taco_taco, taco_tortilla });
	return {
		taco_taco,
		taco_tortilla,
		tortilla_tortilla,
		transitivity,
	};
};
/**
 *
 */
export const setup = ({
	vertices_coords, edges_vertices, edges_faces, faces_vertices, faces_edges, edges_vector,
}, epsilon = EPSILON) => {
	// create a polygon (array of points) for every face. ensure that
	// every polygon has the same winding (reverse if necessary).
	const faces_winding = makeFacesWinding({ vertices_coords, faces_vertices });
	const faces_polygon = makeFacesPolygon({ vertices_coords, faces_vertices }, epsilon);
	faces_polygon.forEach((polygon, i) => {
		if (!faces_winding[i]) { polygon.reverse(); }
	});
	const facesFacesOverlap = getFacesFacesOverlap({
		vertices_coords, faces_vertices,
	}, epsilon);
	const {
		taco_taco, taco_tortilla, tortilla_tortilla, transitivity,
	} = makeRelationships({
		vertices_coords,
		edges_vertices,
		edges_faces,
		faces_vertices,
		faces_edges,
		edges_vector,
		faces_polygon,
	}, facesFacesOverlap, epsilon);
	// format the tacos and transitivity data into maps that relate to the
	// lookup table at the heart of the algorithm, located at "table.js"
	const constraints = makeConstraints({
		taco_taco, taco_tortilla, tortilla_tortilla, transitivity,
	});
	// this is building a massive lookup table, it takes quite a bit of time.
	// any way we can speed this up?
	const lookup = makeConstraintsLookup(constraints);
	// these are all the variables we need to solve- all overlapping faces in
	// pairwise combinations, as a space-separated string, smallest index first
	const facePairs = selfRelationalUniqueIndexPairs(facesFacesOverlap)
		.map(pair => pair.join(" "));
	// console.log("facesFacesOverlap", facesFacesOverlap);
	// console.log("taco_taco", taco_taco);
	// console.log("taco_tortilla", taco_tortilla);
	// console.log("tortilla_tortilla", tortilla_tortilla);
	// console.log("transitivity", transitivity);
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
