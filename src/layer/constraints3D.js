/**
 * Rabbit Ear (c) Kraft
 */
import Messages from "../environment/messages.js";
import { EPSILON } from "../math/constant.js";
import { edgeFoldAngleIsFlat } from "../fold/spec.js";
import { constraints3DFaceClusters } from "./constraints3DFaces.js";
import {
	constraints3DEdges,
	getOverlapFacesWith3DEdge,
	solveOverlapFacesWith3DEdge,
} from "./constraints3DEdges.js";
import { makeTacosAndTortillas } from "./tacosTortillas.js";
import { makeTransitivity, getTransitivityTriosFromTacos } from "./transitivity.js";
import { makeConstraintsLookup } from "./constraintsFlat.js";
import { solveFlatAdjacentEdges } from "./initialSolutionsFlat.js";
import { faceOrdersToSolverOrders, mergeWithoutOverwrite } from "./general.js";

/**
 * Summary of 3D layer constraints so far
 *
 * Handled:
 * - coplanar overlapping faces (constraints3DFaces), where each is solved
 *   like a flat fold using the regular 2D taco/tortilla/transitivity.
 * - collinear overlapping edges with coplanar faces (constraints3DEdges)
 *   - T-junction
 *   - Y-junction
 *   - bent-flat-tortilla (orders),
 *   - bent-tortillas (tortilla-tortilla)
 *   - bent-tortilla-flat-taco (taco-tortilla).
 * - collinear overlapping edges without coplanar faces, imagine a book's pages
 *   fanning out if the spine was an idealized single line. (this will detect
 *   if joined faces are crossing through another causing invalid intersection).
 * - a 3D edge crossing the interior of a face which is coplanar with one
 *   of the edge's faces (orders, getOverlapFacesWith3DEdge).
 *        /
 *   ____/
 *   _________
 *   there are two faces coplanar, the one with the branch upwards MUST be above
 *   the other face (so long as this face extends beyond this crease line)
 *
 * Not handled (invalid graphs will return "valid" solutions):
 * - a face passing through the interior of a non-coplanar face (requires
 *   face-face geometric intersection)
 * - same as above, but the face piercing the other contains an edge exactly
 *   coplanar with the crossing face (this is an edge-case for the above case)
 * - non-manifold edges with more than two faces
 */

/**
 * @description Convert a 3D folded graph into the input parameters for the
 * solver including taco-taco, taco-tortilla, tortilla-tortilla,
 * and transitivity constraints.
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {{
 *   constraints: {
 *     taco_taco: TacoTacoConstraint[],
 *     taco_tortilla: TacoTortillaConstraint[],
 *     tortilla_tortilla: TortillaTortillaConstraint[],
 *     transitivity: TransitivityConstraint[],
 *   },
 *   lookup: {
 *     taco_taco: number[][],
 *     taco_tortilla: number[][],
 *     tortilla_tortilla: number[][],
 *     transitivity: number[][],
 *   },
 *   facePairs: string[],
 *   faces_winding: boolean[],
 *   orders: { [key: string]: number },
 * }} all data required for the solver, including:
 * - constraints
 * - lookup: which tells us location of faces inside of constraints
 * - facePairs: all conditions that need to be solved, a list of
 * space-separated pairs of face indices, "a b" where a < b.
 * - faces_winding: for every face, which direction is the winding.
 * - orders: solutions to facePairs that were discovered during
 *   the construction of these constraints.
 */
export const makeSolverConstraints3D = (
	{
		vertices_coords,
		edges_vertices,
		edges_faces,
		edges_assignment,
		edges_foldAngle,
		faces_vertices,
		faces_edges,
		faces_faces,
		faceOrders,
	},
	epsilon = EPSILON,
) => {
	const {
		// planes_transform,
		faces_plane,
		// faces_cluster,
		faces_winding,
		faces_polygon,
		// faces_center,
		// clusters_faces,
		clusters_graph,
		// clusters_transform,
		facesFacesOverlap,
		facePairs,
	} = constraints3DFaceClusters(
		{
			vertices_coords,
			edges_vertices,
			edges_faces,
			edges_assignment,
			edges_foldAngle,
			faces_vertices,
			faces_edges,
			faces_faces,
		},
		epsilon,
	);

	let edgeResults;
	try {
		edgeResults = constraints3DEdges(
			{
				vertices_coords,
				edges_vertices,
				edges_faces,
				edges_foldAngle,
				faces_vertices,
			},
			{
				faces_plane,
				faces_winding,
				facesFacesOverlap,
			},
			epsilon,
		);
	} catch (error) {
		throw new Error(Messages.noLayerSolution, { cause: error });
	}

	const {
		orders: orders3D,
		tortilla_tortilla: tortilla_tortilla3D,
		taco_tortilla: taco_tortilla3D,
	} = edgeResults;

	// get a list of all edge indices which are non-flat edges.
	// non-flat edges are anything other than 0, -180, or +180 fold angles.
	const nonFlatEdges = edges_foldAngle
		.map(edgeFoldAngleIsFlat)
		.map((flat, i) => (!flat ? i : undefined))
		.filter((a) => a !== undefined);

  // this was previously lower in the function,
  // this needs to be before the 3D edges are removed from clusters_graph
	const edgeFace3DOverlaps = getOverlapFacesWith3DEdge(
		{ edges_faces },
		{ clusters_graph, faces_plane },
		epsilon,
	);

	let orders3DEdgeFace;
	try {
		orders3DEdgeFace = solveOverlapFacesWith3DEdge(
			{ edges_foldAngle },
			edgeFace3DOverlaps,
			faces_winding,
		);
	} catch (error) {
		throw new Error(Messages.noLayerSolution, { cause: error });
	}

	// remove any non-flat edges from the shallow copies.
	["edges_vertices", "edges_faces", "edges_assignment", "edges_foldAngle"].forEach(
		(key) =>
			clusters_graph.forEach((_, c) =>
				nonFlatEdges.forEach((e) => delete clusters_graph[c][key][e]),
			),
	);

	// now that we have all faces separated into coplanar-overlapping sets,
	// run the 2D taco/tortilla algorithms on each set individually
	const clusters_TacosAndTortillas = clusters_graph.map((el) =>
		makeTacosAndTortillas(el, epsilon),
	);

	// now that we have computed these separately, we can flatten them into the
	// same array. The fact that these face pairs are from different 2D planes
	// does not matter, the solver simply solves them all at once.
	const taco_taco = clusters_TacosAndTortillas.flatMap((el) => el.taco_taco);
	const taco_tortilla = clusters_TacosAndTortillas.flatMap((el) => el.taco_tortilla);
	const tortilla_tortilla = clusters_TacosAndTortillas.flatMap(
		(el) => el.tortilla_tortilla,
	);

	// transitivity can be built once, globally. transitivity is built from
	// facesFacesOverlap, which inheritely includes the clusters-information by
	// the fact that no two faces in different sets overlap one another.
	const tacosTrios = getTransitivityTriosFromTacos({ taco_taco, taco_tortilla });
	const transitivity = makeTransitivity(
		{ faces_polygon },
		facesFacesOverlap,
		epsilon,
	).filter((trio) => tacosTrios[trio.join(" ")] === undefined);

	// 3D-tortillas are a constraint that follow the exact same rules as the
	// 2D tortilla-tortillas. we can simply add them to the this array.
	taco_tortilla.push(...taco_tortilla3D);
	tortilla_tortilla.push(...tortilla_tortilla3D);

	// this is building a massive lookup table, it takes quite a bit of time.
	// any way we can speed this up?
	const lookup = makeConstraintsLookup({
		taco_taco,
		taco_tortilla,
		tortilla_tortilla,
		transitivity,
	});

	// before we run the solver, solve all of the conditions that we can.
	// at this point, this means adjacent faces with an M or V edge between them.
	// this is a 2D-only algorithm, we need to run it on each cluster individually
	const adjacentOrders = clusters_graph
		.map((el) => solveFlatAdjacentEdges(el, faces_winding))
		.reduce((a, b) => Object.assign(a, b), {});

	// if the FOLD object contains a subset of pre-solved faceOrders,
	// convert them into solver form and use them as the initial condition.
	const preExistingOrders = faceOrders
		? faceOrdersToSolverOrders(faceOrders, faces_winding)
		: {};

	let orders;
	try {
		orders = mergeWithoutOverwrite([
			preExistingOrders,
			orders3D,
			adjacentOrders,
			orders3DEdgeFace,
		]);
	} catch (error) {
		throw new Error(Messages.noLayerSolution, { cause: error });
	}

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
		orders,
	};
};
