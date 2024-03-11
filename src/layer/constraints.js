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
} from "./tacosAndTortillas.js";
import {
	makeTransitivity,
	filterTransitivity,
} from "./transitivity.js";

/**
 * @typedef TacoTortillaTransitivityConstraints
 * @type {{
 *   taco_taco: [number, number, number, number],
 *   taco_tortilla: [number, number, number],
 *   tortilla_tortilla: [number, number, number, number],
 *   transitivity: [number, number, number],
 * }}
 * @description For a particular model, a set of layer constraints
 * sorted into taco/tortilla/transitivity types, needed to be solved.
 * @property {number[][]} taco_taco four faces making a taco-taco arrangement
 */

 /**
  * @typedef TacoTortillaTransitivityLookup
  * @type {{
  *   taco_taco: number[][],
  *   taco_tortilla: number[][],
  *   tortilla_tortilla: number[][],
  *   transitivity: number[][],
  * }}
  * @description For a particular model, a set of layer constraints
  * sorted into taco/tortilla/transitivity types, needed to be solved.
  * @property {number[][]} taco_taco four faces making a taco-taco arrangement
  */

/**
 * @description Each taco/tortilla event involves the relationship between
 * 3 or 4 faces. The lookup table encodes the relationship between all
 * permutations of pairs of these faces in a particular order.
 * 6: taco-taco, 3: taco-tortilla, 2: tortilla-tortilla, 3: transitivity.
 * @returns {TacoTortillaTransitivityConstraints} constraints object
 * @linkcode Origami ./src/layer/solver2d/makeConstraints.js 12
 */
export const formatConstraintsArrays = ({
	taco_taco, taco_tortilla, tortilla_tortilla, transitivity,
}) => {
	const constraints = {};
	// A-C and B-D are connected. A:[0][0] C:[0][1] B:[1][0] D:[1][1]
	// "(A,C) (B,D) (B,C) (A,D) (A,B) (C,D)"
	constraints.taco_taco = taco_taco.map(el => [
		el[0][0], el[1][0], el[0][1], el[1][1],
	]);
	// A-C is the taco, B is the tortilla. A:taco[0] C:taco[1] B:tortilla
	// (A,C) (A,B) (B,C)
	constraints.taco_tortilla = taco_tortilla.map(el => [
		el.taco[0], el.tortilla, el.taco[1],
	]);
	// A-B and C-D are connected, where A is above/below C and B is above/below D
	// A:[0][0] B:[0][1] C:[1][0] D:[1][1]
	// (A,C) (B,D)
	constraints.tortilla_tortilla = tortilla_tortilla.map(el => [
		el[0][0], el[0][1], el[1][0], el[1][1],
	]);
	// transitivity. no relation between faces in the graph.
	// (A,B) (B,C) (C,A)
	constraints.transitivity = transitivity.map(el => [
		el[0], el[1], el[2],
	]);
	return constraints;
};

/**
 * @param {TacoTortillaTransitivityConstraints} constraints
 * @returns {TacoTortillaTransitivityLookup}
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
 * @description Convert a folded graph into the input parameters for the solver
 * including taco-taco, taco-tortilla, tortilla-tortilla, and transitivity
 * constraints.
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] optional epsilon. it will be calculated
 * if you leave this empty.
 */
export const makeConstraints = ({
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
	const constraints = formatConstraintsArrays({
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
