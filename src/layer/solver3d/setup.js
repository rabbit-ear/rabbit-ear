/**
 * Rabbit Ear (c) Kraft
 */
import {
	EPSILON,
} from "../../math/constant.js";
import {
	average2,
} from "../../math/vector.js";
import {
	mergeArraysWithHoles,
} from "../../general/array.js";
import {
	invertFlatToArrayMap,
} from "../../graph/maps.js";
import {
	makeFacesEdgesFromVertices,
	makeEdgesFacesUnsorted,
	makeEdgesAssignmentSimple,
	makeEdgesFoldAngle,
	makeFacesFaces,
	makeFacesPolygon,
} from "../../graph/make.js";
import {
	connectedComponentsPairs,
} from "../../graph/connectedComponents.js";
import {
	getCoplanarAdjacentOverlappingFaces,
} from "../../graph/faces/planes.js";
import {
	getFacesFacesOverlap,
} from "../../graph/overlap.js";
import {
	makeTacosTortillas,
} from "../tacosAndTortillas.js";
import {
	makeTransitivity,
	filterTransitivity,
} from "../transitivity.js";
import {
	formatConstraintsArrays,
	makeConstraintsLookup,
} from "../makeConstraints.js";
import {
	getOverlappingParallelEdgePairs,
} from "./edges3D.js";
import {
	makeBentTortillas,
} from "./bentTortillas.js";
import {
	solveEdgeFaceOverlapOrders,
	solveEdgeEdgeOverlapOrders,
} from "./solveOrders3d.js";
import {
	graphGroupCopies,
} from "./copyGraph.js";
import {
	solveEdgeAdjacent,
} from "../solver.js";

/**
 * @description Get a list of
 */
const getEdgesClusters = ({ edges_vertices, faces_edges }, faces_cluster) => {
	// find edges which are in two sets
	const edges_clusters_lookup = edges_vertices.map(() => ({}));
	faces_cluster
		.forEach((cluster, face) => faces_edges[face]
			.forEach(edge => { edges_clusters_lookup[edge][cluster] = true; }));
	// for every edge, which co-planar group does it appear in.
	// ensure entries in edges_sets are sorted.
	const edges_clusters = edges_clusters_lookup
		.map(o => Object.keys(o)
			.map(n => parseInt(n, 10))
			.sort((a, b) => a - b));
	return edges_clusters;
};

/**
 *
 */
const setup3d = ({
	vertices_coords, edges_vertices, edges_faces, edges_foldAngle, faces_edges,
	faces_winding, faces_center,
}, clusters_faces, clusters_transform, faces_cluster, faces_polygon, facePairs, facePairsInts, epsilon) => {
	// prep
	const facePairsIndex_set = facePairsInts
		.map(pair => faces_cluster[pair[0]]);
	const sets_facePairsIndex = invertFlatToArrayMap(facePairsIndex_set);
	// const sets_facePairsWithHoles = sets_facePairsIndex
	// 	.map(indices => indices.map(i => facePairs[i]));
	// const sets_facePairs = sets_constraints
	// 	.map((_, i) => (sets_facePairsWithHoles[i] ? sets_facePairsWithHoles[i] : []));
	const sets_facePairs = sets_facePairsIndex
		.map(indices => indices.map(i => facePairs[i]));
	// for each edge, which set(s) is it a member of, this method
	// only finds those which are in two sets, as the ones in one
	// set only is not interesting to us
	const edges_sets = getEdgesClusters({ edges_vertices, faces_edges }, faces_cluster);
	// if an edge only appears in one group, delete the entry from the array
	// this will create an array with holes, maintaining edge's indices.
	edges_sets
		.map((arr, i) => (arr.length !== 2 ? i : undefined))
		.filter(e => e !== undefined)
		.forEach(e => delete edges_sets[e]);
	// new stuff
	// 117ms
	// console.time("setup.js setup3d() getOverlappingParallelEdgePairs()");
	const {
		tortillaTortillaEdges,
		solvable1,
		solvable2,
		solvable3,
	} = getOverlappingParallelEdgePairs({
		vertices_coords, edges_vertices, edges_faces, edges_foldAngle, faces_center,
	}, edges_sets, faces_cluster, clusters_transform, epsilon);
	// console.timeEnd("setup.js setup3d() getOverlappingParallelEdgePairs()");
	// tacos tortillas
	const tortillas3D = makeBentTortillas(
		{ edges_faces },
		tortillaTortillaEdges,
		faces_cluster,
		faces_winding,
	);
	const ordersEdgeFace = solveEdgeFaceOverlapOrders(
		{ vertices_coords, edges_vertices, edges_faces, edges_foldAngle },
		sets_facePairs,
		clusters_transform,
		clusters_faces,
		faces_cluster,
		faces_polygon,
		faces_winding,
		edges_sets,
		epsilon,
	);
	const ordersEdgeEdge = solveEdgeEdgeOverlapOrders({
		edges_foldAngle, faces_winding,
	}, solvable1, solvable2, solvable3);
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
	if (!faces_edges) {
		faces_edges = makeFacesEdgesFromVertices({ edges_vertices, faces_vertices });
	}
	if (!edges_faces) {
		edges_faces = makeEdgesFacesUnsorted({ edges_vertices, faces_edges });
	}
	if (!faces_faces) {
		faces_faces = makeFacesFaces({ faces_vertices });
	}
	// edges_foldAngle needs to be present so we can ignore foldAngles
	// which are not flat when doing taco/tortilla things. if we need to
	// build it here, all of them are flat, but we need the array to exist
	if (!edges_foldAngle && edges_assignment) {
		edges_foldAngle = makeEdgesFoldAngle({ edges_assignment });
	}
	if (!edges_assignment) {
		edges_assignment = makeEdgesAssignmentSimple({ edges_foldAngle });
	}
	// separate the list of faces into coplanar overlapping sets
	// 444ms
	// console.time("setup.js getCoplanarAdjacentOverlappingFaces()");
	const {
		clusters_faces,
		clusters_plane,
		planes_transform,
		faces_cluster,
		faces_winding,
		// facesFacesOverlap,
	} = getCoplanarAdjacentOverlappingFaces({
		vertices_coords, faces_vertices, faces_faces,
	}, epsilon);

	const clusters_transform = clusters_plane.map(p => planes_transform[p]);

	// console.timeEnd("setup.js getCoplanarAdjacentOverlappingFaces()");
	// console.time("setup.js graphGroupCopies()");
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
	}, clusters_faces, clusters_transform);
	// faces_polygon is a flat array of polygons in 2D, where every face
	// is re-oriented into 2D via each set's transformation.
	// additionally, flip windings if necessary, all are counter-clockwise.
	const faces_polygon = mergeArraysWithHoles(...sets_graphs
		.map(copy => makeFacesPolygon(copy, epsilon)));
	faces_winding
		.map((upright, i) => (upright ? undefined : i))
		.filter(a => a !== undefined)
		.forEach(f => faces_polygon[f].reverse());
	// console.timeEnd("setup.js graphGroupCopies()");
	// console.time("setup.js getFacesFacesOverlap()");
	// faces-faces overlap will be a single flat array.
	// each face is only a part of one planar-group anyway.
	// as opposed to edges-faces overlap which is computed for each planar-group.
	const facesFacesOverlap = mergeArraysWithHoles(...sets_graphs
		.map(graph => getFacesFacesOverlap(graph, epsilon)));
	// console.timeEnd("setup.js getFacesFacesOverlap()");
	// simple faces center by averaging all the face's vertices
	const faces_center = faces_polygon.map(coords => average2(...coords));
	// populate individual graph copies with data only relevant to it.
	sets_graphs.forEach(el => {
		el.faces_center = el.faces_vertices.map((_, f) => faces_center[f]);
	});
	// now that we have all faces separated into coplanar-overlapping sets,
	// run the 2D taco/tortilla algorithms on each set individually,
	// until we get to make3DTortillas, which will work across coplanar sets
	// 1,873ms
	// console.time("setup.js ...make tacos/tortillas/transitivity");
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
	// console.timeEnd("setup.js ...make tacos/tortillas/transitivity");
	// these are all the variables we need to solve- all overlapping faces in
	// pairwise combinations, as a space-separated string, smallest index first
	const facePairsInts = connectedComponentsPairs(facesFacesOverlap);
	const facePairs = facePairsInts.map(pair => pair.join(" "));
	// const facePairs = connectedComponentsPairs(facesFacesOverlap)
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
	}, clusters_faces, clusters_transform, faces_cluster, faces_polygon, facePairs, facePairsInts, epsilon);
	// 3d "tortilla-tortilla" are additional constraints that simply get
	// added to the 2D tortilla-tortilla constraints.
	// console.time("setup.js ...makeConstraints, solveEdgeAdjacent");
	tortilla_tortilla.push(...tortillas3D);
	// now, make all taco/tortilla/transitivity constraints for the solver
	const constraints = formatConstraintsArrays({
		taco_taco, taco_tortilla, tortilla_tortilla, transitivity,
	});
	// this is building a massive lookup table, it takes quite a bit of time.
	// any way we can speed this up?
	const lookup = makeConstraintsLookup(constraints);
	// before we run the solver, solve all of the conditions that we can.
	// at this point, this means adjacent faces with an M or V edge between them.
	sets_graphs
		.map(el => solveEdgeAdjacent(el, faces_winding))
		.forEach(el => Object.assign(orders, el));
	// console.timeEnd("setup.js ...makeConstraints, solveEdgeAdjacent");
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
	// console.log("clusters_transform", clusters_transform);
	// console.log("faces_cluster", faces_cluster);
	// console.log("clusters_faces", clusters_faces);
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
