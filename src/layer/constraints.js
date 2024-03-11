/**
 * Rabbit Ear (c) Kraft
 */
import {
	EPSILON,
} from "../math/constant.js";
import {
	connectedComponentsPairs,
} from "../graph/connectedComponents.js";
import {
	getFacesFacesOverlap,
} from "../graph/intersect/facesFaces.js";
import {
	makeFacesWinding,
} from "../graph/faces/winding.js";
import {
	makeFacesPolygon,
} from "../graph/make.js";
import {
	constraintToFacePairsStrings,
} from "./general.js";
import {
	makeTacosAndTortillas,
} from "./tacosTortillas.js";
import {
	makeTransitivity,
	getTransitivityTriosFromTacos,
} from "./transitivity.js";

/**
 * @param {{
 *   taco_taco: TacoTacoConstraint[],
 *   taco_tortilla: TacoTortillaConstraint[],
 *   tortilla_tortilla: TortillaTortillaConstraint[],
 *   transitivity: TransitivityConstraint[],
 * }} constraints
 * @returns {{
 *   taco_taco: number[][],
 *   taco_tortilla: number[][],
 *   tortilla_tortilla: number[][],
 *   transitivity: number[][],
 * }} for a particular model, a set of layer constraints sorted into
 * taco/tortilla/transitivity types, needed to be solved.
 */
export const makeConstraintsLookup = (constraints) => {
	const lookup = {};
	// fill the top layer with "taco / tortilla" category names
	Object.keys(constraints).forEach(key => { lookup[key] = {}; });
	Object.keys(constraints).forEach(type => {
		constraints[type]
			.forEach((constraint, i) => constraintToFacePairsStrings[type](constraint)
				.forEach(key => {
					if (lookup[type][key] === undefined) {
						lookup[type][key] = [];
					}
					lookup[type][key].push(i);
				}));
	});
	return lookup;
};

/**
 * @description
 * @param {FOLD} graph a FOLD graph with edges_vector
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {{
 *   taco_taco: TacoTacoConstraint[],
 *   taco_tortilla: TacoTortillaConstraint[],
 *   tortilla_tortilla: TortillaTortillaConstraint[],
 *   transitivity: TransitivityConstraint[],
 *   faces_winding: boolean[],
 *   faces_facesOverlap: number[][],
 * }} taco information
 */
export const makeTacosTortillasTransitivity = ({
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
	const faces_facesOverlap = getFacesFacesOverlap({
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
	const tacosTrios = getTransitivityTriosFromTacos({ taco_taco, taco_tortilla });
	const transitivity = makeTransitivity({ faces_polygon }, faces_facesOverlap, epsilon)
		.filter(trio => tacosTrios[trio.join(" ")] === undefined);

	return {
		taco_taco,
		taco_tortilla,
		tortilla_tortilla,
		transitivity,
		faces_winding,
		faces_facesOverlap,
	};
};

/**
 * @description Convert a folded graph into the input parameters for the solver
 * including taco-taco, taco-tortilla, tortilla-tortilla, and transitivity
 * constraints.
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] optional epsilon. it will be calculated
 * if you leave this empty.
 */
export const makeSolverConstraints = ({
	vertices_coords, edges_vertices, edges_faces, faces_vertices, faces_edges,
	edges_vector,
}, epsilon = EPSILON) => {
	const {
		taco_taco,
		taco_tortilla,
		tortilla_tortilla,
		transitivity,
		faces_winding,
		faces_facesOverlap,
	} = makeTacosTortillasTransitivity({
		vertices_coords, edges_vertices, edges_faces, faces_vertices, faces_edges,
		edges_vector,
	}, epsilon);

	// these are all the variables we need to solve- all overlapping faces in
	// pairwise combinations, as a space-separated string, smallest index first
	const facePairs = connectedComponentsPairs(faces_facesOverlap)
		.map(pair => pair.join(" "));

	// this is building a massive lookup table, it takes quite a bit of time.
	// any way we can speed this up?
	const lookup = makeConstraintsLookup({
		taco_taco,
		taco_tortilla,
		tortilla_tortilla,
		transitivity,
	});

	return {
		constraints: {
			taco_taco,
			taco_tortilla,
			tortilla_tortilla,
			transitivity,
		},
		lookup,
		facePairs,
		faces_winding,
	};
};
