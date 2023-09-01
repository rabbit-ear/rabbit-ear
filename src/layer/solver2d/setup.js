/**
 * Rabbit Ear (c) Kraft
 */
import { EPSILON } from "../../math/constant.js";
import { connectedComponentsPairs } from "../../graph/connectedComponents.js";
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
 * @description Convert a folded graph into the input parameters for the solver
 * including taco-taco, taco-tortilla, tortilla-tortilla, and transitivity
 * constraints.
 * @param {FOLD} graph a FOLD graph
 * @param {number} [epsilon=1e-6] optional epsilon. it will be calculated
 * if you leave this empty.
 */
export const setup = ({
	vertices_coords, edges_vertices, edges_faces, faces_vertices, faces_edges,
	edges_vector,
}, epsilon = EPSILON) => {
	// create a polygon (array of points) for every face. ensure that
	// every polygon has the same winding (reverse if necessary).
	const faces_winding = makeFacesWinding({ vertices_coords, faces_vertices });
	const faces_polygon = makeFacesPolygon({ vertices_coords, faces_vertices }, epsilon);
	faces_winding
		.map((upright, i) => (upright ? undefined : i))
		.filter(a => a !== undefined)
		.forEach(f => faces_polygon[f].reverse());
	// for every face (index) get an array of other faces (value) which
	// overlap this face. This array can contain holes.
	const facesFacesOverlap = getFacesFacesOverlap({
		vertices_coords, faces_vertices,
	}, epsilon);
	// create all of the tacos/tortillas constraints that
	// will be used by the solver.
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
	// ...and the transitivity constraints
	const unfilteredTrans = makeTransitivity({ faces_polygon }, facesFacesOverlap, epsilon);
	const transitivity = filterTransitivity(unfilteredTrans, { taco_taco, taco_tortilla });
	// these are all the variables we need to solve- all overlapping faces in
	// pairwise combinations, as a space-separated string, smallest index first
	const facePairs = connectedComponentsPairs(facesFacesOverlap)
		.map(pair => pair.join(" "));
	// format the tacos and transitivity data into maps that relate to the
	// lookup table at the heart of the algorithm, located at "table.js"
	const constraints = makeConstraints({
		taco_taco, taco_tortilla, tortilla_tortilla, transitivity,
	});
	// this is building a massive lookup table, it takes quite a bit of time.
	// any way we can speed this up?
	const lookup = makeConstraintsLookup(constraints);
	return {
		constraints,
		lookup,
		facePairs,
		faces_winding,
	};
};
