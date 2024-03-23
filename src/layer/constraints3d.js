/**
 * Rabbit Ear (c) Kraft
 */
import {
	EPSILON,
} from "../math/constant.js";
import {
	average2,
	resize,
} from "../math/vector.js";
import {
	multiplyMatrix4Vector3,
} from "../math/matrix4.js";
import {
	mergeArraysWithHoles,
} from "../general/array.js";
import {
	invertFlatToArrayMap,
} from "../graph/maps.js";
import {
	edgeFoldAngleIsFlat,
} from "../fold/spec.js";
import {
	makeFacesPolygon,
} from "../graph/make/faces.js";
import {
	connectedComponentsPairs,
} from "../graph/connectedComponents.js";
import {
	getCoplanarAdjacentOverlappingFaces,
} from "../graph/faces/planes.js";
import {
	subgraphWithFaces,
} from "../graph/subgraph.js";
import {
	getFacesFacesOverlap,
} from "../graph/overlap.js";
import {
	makeTacosAndTortillas,
	makeBentTortillas,
} from "./tacosTortillas.js";
import {
	makeTransitivity,
	getTransitivityTriosFromTacos,
} from "./transitivity.js";
import {
	makeConstraintsLookup,
} from "./constraints.js";
import {
	getOverlappingParallelEdgePairs,
} from "./intersect3d.js";
import {
	solveFlatAdjacentEdges,
	solveEdgeFaceOverlapOrders,
	solveEdgeEdgeOverlapOrders,
} from "./adjacentEdges.js";

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
export const makeSolverConstraints3DBetweenClusters = (
	{
		vertices_coords,
		edges_vertices,
		edges_faces,
		edges_foldAngle,
		faces_edges,
		faces_winding,
		faces_center,
	},
	clusters_faces,
	clusters_transform,
	faces_cluster,
	faces_polygon,
	facePairs,
	facePairsInts,
	epsilon,
) => {
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
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon
 */
export const makeSolverConstraints3D = ({
	vertices_coords, edges_vertices, edges_faces, edges_assignment, edges_foldAngle,
	faces_vertices, faces_edges, faces_faces, // edges_vector
}, epsilon = EPSILON) => {
	// cluster faces into coplanar-adjacent-overlapping sets. this creates:
	// - "planes": every unique plane that at least one face inhabits
	// - "clusters": a coplanar set of faces, multiple of these clusters can be
	//   from the same plane, but individual clusters do not overlap each other.
	const {
		// planes,
		planes_transform,
		faces_winding,
		// planes_faces,
		// faces_plane,
		// planes_clusters,
		clusters_plane,
		clusters_faces,
		faces_cluster,
	} = getCoplanarAdjacentOverlappingFaces({
		vertices_coords, faces_vertices, faces_faces,
	}, epsilon);

	// for every cluster, make a shallow copy of the input graph, containing
	// only the faces included in that cluster, and by extension, all edges and
	// vertices which are used by this subset of faces.
	const clusters_graph = clusters_faces.map(faces => subgraphWithFaces({
		vertices_coords,
		edges_vertices,
		edges_faces,
		edges_assignment,
		edges_foldAngle,
		faces_vertices,
		faces_edges,
		faces_faces,
	}, faces));

	// ensure all vertices_coords are 3D (make a copy array here) for use in
	// multiplyMatrix4Vector3, which requires points to be in 3D.
	const vertices_coords3D = vertices_coords.map(coord => resize(3, coord));

	// for each cluster, get the transform which, when applied, brings
	// all points into the XY plane.
	const clusters_transform = clusters_plane.map(p => planes_transform[p]);

	// transform all vertices_coords by the inverse transform
	// to bring them all into the XY plane. convert back into a 2D point.
	clusters_graph.forEach(({ vertices_coords: coords }, i) => {
		clusters_graph[i].vertices_coords = coords
			.map((_, v) => multiplyMatrix4Vector3(
				clusters_transform[i],
				vertices_coords3D[v],
			))
			.map(([a, b]) => [a, b]);
	});

	// now, any arrays referencing edges (_edges) are out of sync with
	// the edge arrays themselves (edges_). Therefore this method really
	// isn't intended to be used outside of this higly specific context.

	// faces_polygon is a flat array of polygons in 2D, where every face
	// is re-oriented into 2D via each set's transformation.
	// collinear vertices (if exist) are removed from every polygon.
	const faces_polygon = mergeArraysWithHoles(...clusters_graph
		.map(copy => makeFacesPolygon(copy, epsilon)));

	// ensure that all faces are counter-clockwise, flip winding if necessary.
	faces_winding
		.map((upright, i) => (upright ? undefined : i))
		.filter(a => a !== undefined)
		.forEach(f => faces_polygon[f].reverse());

	// for every face, a list of face indices which overlap this face.
	// compute face-face-overlap for every cluster's graph one at a time,
	// this is important because vertices have been translated into 2D now,
	// and it's possible that faces from other clusters overlap each other
	// in this transformed state; we don't want that. After we compute face-face
	// overlap information separately, we can merge all of the results into
	// a flat array since none of the resulting arrays will overlap.
	const facesFacesOverlap = mergeArraysWithHoles(...clusters_graph
		.map(graph => getFacesFacesOverlap(graph, epsilon)));

	// simple faces center by averaging all the face's vertices.
	// we don't have to be precise here, these are used to tell which
	// side of a face's edge the face is (assuming all faces are convex).
	const faces_center = faces_polygon.map(coords => average2(...coords));

	// populate individual graph copies with faces_center data.
	clusters_graph.forEach(({ faces_vertices: fv }, c) => {
		clusters_graph[c].faces_center = fv.map((_, f) => faces_center[f]);
	});

	// these are all the variables we need to solve- all overlapping faces in
	// pairwise combinations, as a space-separated string, smallest index first
	const facePairsInts = connectedComponentsPairs(facesFacesOverlap);
	const facePairs = facePairsInts.map(pair => pair.join(" "));

	// the additional 3d tacos/tortillas data
	const {
		tortillas3D,
		orders,
	} = makeSolverConstraints3DBetweenClusters(
		{
			vertices_coords,
			edges_vertices,
			edges_faces,
			edges_foldAngle,
			faces_edges,
			faces_winding,
			faces_center,
		},
		clusters_faces,
		clusters_transform,
		faces_cluster,
		faces_polygon,
		facePairs,
		facePairsInts,
		epsilon,
	);

	// get a list of all edge indices which are non-flat edges.
	// non-flat edges are anything other than 0, -180, or +180 fold angles.
	const nonFlatEdges = edges_foldAngle
		.map(edgeFoldAngleIsFlat)
		.map((flat, i) => (!flat ? i : undefined))
		.filter(a => a !== undefined);

	// remove any non-flat edges from the shallow copies.
	["edges_vertices", "edges_faces", "edges_assignment", "edges_foldAngle"]
		.forEach(key => clusters_graph
			.forEach(graph => nonFlatEdges
				.forEach(e => delete graph[key][e])));

	// now that we have all faces separated into coplanar-overlapping sets,
	// run the 2D taco/tortilla algorithms on each set individually
	const clusters_TacosAndTortillas = clusters_graph
		.map(el => makeTacosAndTortillas(el, epsilon));

	// now that we have computed these separately, we can flatten them into the
	// same array, since indices are maintained to their original index from the
	// input graph, the flat data will contain no overlaps between clusters.
	const taco_taco = clusters_TacosAndTortillas
		.flatMap(el => el.taco_taco);
	const taco_tortilla = clusters_TacosAndTortillas
		.flatMap(el => el.taco_tortilla);
	const tortilla_tortilla = clusters_TacosAndTortillas
		.flatMap(el => el.tortilla_tortilla);

	// transitivity can be built once, globally. transitivity is built from
	// facesFacesOverlap, which inheritely includes the clusters-information by
	// the fact that no two faces in different sets overlap one another.
	const tacosTrios = getTransitivityTriosFromTacos({ taco_taco, taco_tortilla });
	const transitivity = makeTransitivity({ faces_polygon }, facesFacesOverlap, epsilon)
		.filter(trio => tacosTrios[trio.join(" ")] === undefined);

	// 3D-tortillas are a constraint that follow the exact same rules as the
	// 2D tortilla-tortillas. we can simply add them to the this array.
	tortilla_tortilla.push(...tortillas3D);

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
		.map(el => solveFlatAdjacentEdges(el, faces_winding))
		.reduce((a, b) => Object.assign(a, b), ({}));

	Object.assign(orders, adjacentOrders);

	// console.log("clusters_graph", clusters_graph);
	// console.log("faces_polygon", faces_polygon);
	// console.log("faces_center", faces_center);
	// console.log("facesFacesOverlap", facesFacesOverlap);
	// console.log("setsTacosAndTortillas", setsTacosAndTortillas);
	// console.log("taco_taco", taco_taco);
	// console.log("taco_tortilla", taco_tortilla);
	// console.log("tortilla_tortilla", tortilla_tortilla);
	// console.log("taco_taco", taco_taco);
	// console.log("taco_tortilla", taco_tortilla);
	// console.log("tortilla_tortilla", tortilla_tortilla);
	// console.log("transitivity", transitivity);
	// console.log("facePairs", facePairs);
	// console.log("clusters_transform", clusters_transform);
	// console.log("faces_cluster", faces_cluster);
	// console.log("clusters_faces", clusters_faces);
	// console.log("faces_winding", faces_winding);
	// console.log("facesFacesOverlap", facesFacesOverlap);
	// console.log("faces_polygon", faces_polygon);
	// console.log("faces_center", faces_center);
	// console.log("facePairsInts", facePairsInts);
	// console.log("facePairs", facePairs);
	// console.log("orders", orders);

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
