/**
 * Rabbit Ear (c) Kraft
 */
import { EPSILON } from "../../math/general/constant.js";
import { average2 } from "../../math/algebra/vector.js";
import { invertMap } from "../../graph/maps.js";
import { makeFacesPolygon } from "../../graph/make.js";
import {
	flatSort,
	selfRelationalUniqueIndexPairs,
} from "../../general/arrays.js";
import { coplanarOverlappingFacesGroups } from "../../graph/faces/coplanar.js";
import { getFacesFacesOverlap } from "../../graph/intersect/facesFaces.js";
import makeTacosTortillas from "../solver2d/tacosAndTortillas.js";
import {
	makeTransitivity,
	filterTransitivity,
} from "../solver2d/transitivity.js";
import {
	makeConstraints,
	makeConstraintsLookup,
} from "../solver2d/makeConstraints.js";
import { getOverlappingParallelEdgePairs } from "./edges3D.js";
import makeBentTortillas from "./bentTortillas.js";
import {
	solveEdgeFaceOverlapOrders,
	solveEdgeEdgeOverlapOrders,
} from "./solveOrders3d.js";
import { graphGroupCopies } from "./copyGraph.js";
import solveEdgeAdjacent from "../solver2d/edgeAdjacent.js";
/**
 * @description Get a list of
 */
const getEdgesSets = ({ edges_vertices, faces_edges }, faces_set) => {
	// find edges which are in two sets
	const edges_sets_lookup = edges_vertices.map(() => ({}));
	faces_set
		.forEach((set, face) => faces_edges[face]
			.forEach(edge => { edges_sets_lookup[edge][set] = true; }));
	// for every edge, which co-planar group does it appear in.
	// ensure entries in edges_sets are sorted.
	const edges_sets = edges_sets_lookup
		.map(o => Object.keys(o)
			.map(n => parseInt(n, 10))
			.sort((a, b) => a - b));
	return edges_sets;
};
/**
 *
 */
const setup3d = ({
	vertices_coords, edges_vertices, edges_faces, edges_foldAngle, faces_edges,
	faces_winding, faces_center,
}, sets_faces, sets_transformXY, faces_set, faces_polygon, facePairs, facePairsInts, epsilon) => {
	// prep
	const facePairsIndex_set = facePairsInts
		.map(pair => faces_set[pair[0]]);
	const sets_facePairsIndex = invertMap(facePairsIndex_set)
		.map(el => (el.constructor === Array ? el : [el]));
	// const sets_facePairsWithHoles = sets_facePairsIndex
	// 	.map(indices => indices.map(i => facePairs[i]));
	// const sets_facePairs = sets_constraints
	// 	.map((_, i) => (sets_facePairsWithHoles[i] ? sets_facePairsWithHoles[i] : []));
	const sets_facePairs = sets_facePairsIndex
		.map(indices => indices.map(i => facePairs[i]));
	// for each edge, which set(s) is it a member of, this method
	// only finds those which are in two sets, as the ones in one
	// set only is not interesting to us
	const edges_sets = getEdgesSets({ edges_vertices, faces_edges }, faces_set);
	// if an edge only appears in one group, delete the entry from the array
	// this will create an array with holes, maintaining edge's indices.
	edges_sets
		.map((arr, i) => (arr.length !== 2 ? i : undefined))
		.filter(e => e !== undefined)
		.forEach(e => delete edges_sets[e]);
	// new stuff
	const {
		tortillaTortillaEdges,
		solvable1,
		solvable2,
	} = getOverlappingParallelEdgePairs({
		vertices_coords, edges_vertices, edges_faces, edges_foldAngle, faces_center,
	}, edges_sets, faces_set, sets_transformXY, epsilon);
	// tacos tortillas
	const tortillas3D = makeBentTortillas(
		{ edges_faces },
		tortillaTortillaEdges,
		faces_set,
		faces_winding,
	);
	const ordersEdgeFace = solveEdgeFaceOverlapOrders(
		{ vertices_coords, edges_vertices, edges_faces, edges_foldAngle },
		sets_facePairs,
		sets_transformXY,
		sets_faces,
		faces_set,
		faces_polygon,
		faces_winding,
		edges_sets,
		epsilon,
	);
	const ordersEdgeEdge = solveEdgeEdgeOverlapOrders(solvable1, solvable2);
	const orders = {
		...ordersEdgeFace,
		...ordersEdgeEdge,
	};
	// console.log("facePairsIndex_set", facePairsIndex_set);
	// console.log("sets_facePairsIndex", sets_facePairsIndex);
	// console.log("sets_facePairs", sets_facePairs);
	// console.log("edges_sets", edges_sets);
	// console.log("facePairsIndex_set", facePairsIndex_set);
	// console.log("sets_facePairsIndex", sets_facePairsIndex);
	// // console.log("sets_facePairs", sets_facePairsWithHoles);
	// console.log("edges_sets", edges_sets);
	// console.log("tortillaTortillaEdges", tortillaTortillaEdges);
	// console.log("tortillas3D", tortillas3D);
	// console.log("orders 3D", orders);
	return {
		tortillas3D,
		orders,
	};
};
/**
 *
 */
export const setup = ({
	vertices_coords, edges_vertices, edges_faces, edges_assignment, edges_foldAngle,
	faces_vertices, faces_edges, faces_faces,
}, epsilon = EPSILON) => {
	// separate the list of faces into coplanar overlapping sets
	const {
		sets_faces,
		// sets_plane,
		sets_transformXY,
		faces_set,
		faces_winding,
		// facesFacesOverlap,
	} = coplanarOverlappingFacesGroups({
		vertices_coords, faces_vertices, faces_faces,
	}, epsilon);
	// all vertices_coords will become 2D
	const sets_graphs = graphGroupCopies({
		vertices_coords,
		edges_vertices,
		edges_faces,
		edges_assignment,
		edges_foldAngle,
		faces_vertices,
		faces_edges,
		faces_faces,
	}, sets_faces, sets_transformXY);
	// faces_polygon is a flat array of polygons in 2D, where every face
	// is re-oriented into 2D via each set's transformation.
	// additionally, flip windings if necessary, all are counter-clockwise.
	const faces_polygon = flatSort(...sets_graphs
		.map(copy => makeFacesPolygon(copy, epsilon)));
	faces_winding
		.map((upright, i) => (upright ? undefined : i))
		.filter(a => a !== undefined)
		.forEach(f => faces_polygon[f].reverse());
	// faces-faces overlap will be a single flat array.
	// each face is only a part of one planar-group anyway.
	// as opposed to edges-faces overlap which is computed for each planar-group.
	const facesFacesOverlap = flatSort(...sets_graphs
		.map(graph => getFacesFacesOverlap(graph, epsilon)));
	// simple faces center by averaging all the face's vertices
	const faces_center = faces_polygon.map(coords => average2(...coords));
	// populate individual graph copies with data only relevant to it.
	sets_graphs.forEach(el => {
		el.faces_center = el.faces_vertices.map((_, f) => faces_center[f]);
	});
	// now that we have all faces separated into coplanar-overlapping sets,
	// run the 2D taco/tortilla algorithms on each set individually,
	// until we get to make3DTortillas, which will work across coplanar sets
	const setsTacosAndTortillas = sets_graphs
		.map(el => makeTacosTortillas(el, epsilon));
	const taco_taco = setsTacosAndTortillas.flatMap(set => set.taco_taco);
	const taco_tortilla = setsTacosAndTortillas.flatMap(set => set.taco_tortilla);
	const tortilla_tortilla = setsTacosAndTortillas.flatMap(set => set.tortilla_tortilla);
	// transitivity can be built once, globally. transitivity is built from
	// facesFacesOverlap, which inheritely includes the sets-information by
	// the fact that no two faces in different sets overlap one another.
	const unfilteredTrans = makeTransitivity({ faces_polygon }, facesFacesOverlap, epsilon);
	const transitivity = filterTransitivity(unfilteredTrans, { taco_taco, taco_tortilla });
	// these are all the variables we need to solve- all overlapping faces in
	// pairwise combinations, as a space-separated string, smallest index first
	const facePairsInts = selfRelationalUniqueIndexPairs(facesFacesOverlap);
	const facePairs = facePairsInts.map(pair => pair.join(" "));
	// const facePairs = selfRelationalUniqueIndexPairs(facesFacesOverlap)
	// 	.map(pair => pair.join(" "));
	// the additional 3d tacos/tortillas data
	const {
		tortillas3D,
		orders,
	} = setup3d({
		vertices_coords,
		edges_vertices,
		edges_faces,
		edges_foldAngle,
		faces_edges,
		faces_winding,
		faces_center,
	}, sets_faces, sets_transformXY, faces_set, faces_polygon, facePairs, facePairsInts, epsilon);
	// 3d "tortilla-tortilla" are additional constraints that simply get
	// added to the 2D tortilla-tortilla constraints.

	tortilla_tortilla.push(...tortillas3D);

	// now, make all taco/tortilla/transitivity constraints for the solver
	const constraints = makeConstraints({
		taco_taco, taco_tortilla, tortilla_tortilla, transitivity,
	});
	// this is building a massive lookup table, it takes quite a bit of time.
	// any way we can speed this up?
	const lookup = makeConstraintsLookup(constraints);
	// before we run the solver, solve all of the conditions that we can.
	// at this point, this means adjacent faces with an M or V edge between them.
	sets_graphs
		.map(el => solveEdgeAdjacent(el, facePairs, faces_winding))
		.forEach(el => Object.assign(orders, el));
	// console.log("sets_graphs", sets_graphs);
	// console.log("faces_polygon", faces_polygon);
	// console.log("faces_center", faces_center);
	// console.log("facesFacesOverlap", facesFacesOverlap);
	// console.log("setsTacosAndTortillas", setsTacosAndTortillas);
	// console.log("taco_taco", taco_taco);
	// console.log("taco_tortilla", taco_tortilla);
	// console.log("tortilla_tortilla", tortilla_tortilla);
	// console.log("unfilteredTrans", unfilteredTrans);
	// console.log("transitivity", transitivity);
	// console.log("constraints", constraints);
	// console.log("facePairs", facePairs);
	// console.log("sets_transformXY", sets_transformXY);
	// console.log("faces_set", faces_set);
	// console.log("sets_faces", sets_faces);
	// console.log("faces_winding", faces_winding);
	// console.log("facesFacesOverlap", facesFacesOverlap);
	// console.log("sets_graphs", sets_graphs);
	// console.log("faces_polygon", faces_polygon);
	// console.log("faces_center", faces_center);
	// console.log("facePairsInts", facePairsInts);
	// console.log("facePairs", facePairs);
	// console.log("orders", orders);
	return {
		constraints,
		lookup,
		facePairs,
		faces_winding,
		orders,
	};
};
