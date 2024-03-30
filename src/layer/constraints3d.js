/**
 * Rabbit Ear (c) Kraft
 */
import {
	EPSILON,
} from "../math/constant.js";
import {
	average2,
	resize,
	cross2,
	subtract2,
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
	makeEdgesCoords,
} from "../graph/make/edges.js";
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
	getEdgesEdgesCollinearOverlap,
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
} from "./constraintsFlat.js";
import {
	solveFlatAdjacentEdges,
	solveEdgeFaceOverlapOrders,
	solveEdgeEdgeOverlapOrders,
} from "./initialSolution.js";

/**
 * @description
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon
 */
export const makeSolverConstraints3D = ({
	vertices_coords, edges_vertices, edges_faces, edges_assignment, edges_foldAngle,
	faces_vertices, faces_edges, faces_faces,
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

	// for every facePair, which cluster is the face pair a member of.
	// we only need to check one face, because they should be in the same cluster.
	const facePairs_cluster = facePairsInts
		.map(pair => faces_cluster[pair[0]]);

	// for every cluster, a list of indices of facePairs which inhabit the
	// cluster. these indices point to the "facePairsInts" array.
	const clusters_facePairsInt = invertFlatToArrayMap(facePairs_cluster);

	// const sets_facePairsWithHoles = clusters_facePairsInt
	// 	.map(indices => indices.map(i => facePairs[i]));
	// const sets_facePairs = sets_constraints
	// 	.map((_, i) => (sets_facePairsWithHoles[i] ? sets_facePairsWithHoles[i] : []));

	// for every cluster, a list of facePairs which inabit the cluster.
	const clusters_facePairs = clusters_facePairsInt
		.map(indices => indices.map(i => facePairs[i]));

	// for every edge, which cluster(s) is it a member of.
	// ultimately, we are only interested in edges which join two clusters.
	const edges_clusters = edges_faces
		.map(faces => faces.map(face => faces_cluster[face]));

	// remove edges which are members of only one cluster (boundary edges),
	edges_clusters
		.map((_, e) => e)
		.filter(e => edges_clusters[e].length !== 2)
		.forEach(e => delete edges_clusters[e]);

	// and remove edges whose two faces are from the same cluster.
	edges_clusters
		.map(([a, b], e) => (a === b ? e : undefined))
		.filter(a => a !== undefined)
		.forEach(e => delete edges_clusters[e]);

	const edgesFlat = edges_foldAngle.map(edgeFoldAngleIsFlat);

	const edgesEdgesOverlap = getEdgesEdgesCollinearOverlap(
		{ vertices_coords, edges_vertices },
		epsilon,
	);

	const overlappingEdgePairs = connectedComponentsPairs(edgesEdgesOverlap);

	// from our original set of all pairs of edges,
	// - filter out edge pairs where both edges are flat
	// - filter out edge pairs where edges have fewer than 2 adjacent faces
	// - filter out edges where the 4 adjacent faces involved are all from
	//   four different planes. no information can be gained from these.
	const pairs_edges = overlappingEdgePairs
		.map(pair => (pair[0] < pair[1] ? pair : pair.slice().reverse()))
		.filter(p => !(edgesFlat[p[0]] && edgesFlat[p[1]]))
		.filter(pair => pair.every(edge => edges_faces[edge].length === 2))
		.filter(pair => pair.every(edge => edges_clusters[edge] !== undefined))
		.filter(pair => Array
			.from(new Set(pair.flatMap(e => edges_clusters[e]))).length !== 4);

	// for each pair of edges, which sets is each edge a member of?
	const pairs_edges_clusters = pairs_edges
		.map(pair => pair.map(e => edges_clusters[e]));

	// console.log("pairs_edges_clusters", pairs_edges_clusters);
	const pairs_sets = pairs_edges_clusters
		.map(sets => Array.from(new Set(sets.flat())));

	// console.log("pairs_sets", pairs_sets);
	// for each edge-pair, create an object with keys as set-indices, and
	// values as arrays where each edge is inside
	const pairs_sets_edges = pairs_edges_clusters.map((pair, i) => {
		const hash = {};
		pair.flat().forEach(s => { hash[s] = []; });
		pair.forEach((sets, j) => sets
			.forEach(s => hash[s].push(pairs_edges[i][j])));
		return hash;
	});
	// console.log("pairs_sets_edges", pairs_sets_edges);
	const pairs_edges_faces = pairs_edges
		.map(pair => pair.map(e => edges_faces[e]));
	// console.log("pairs_edges_faces", pairs_edges_faces);
	// for every pair, make an object with planar-set index (key) and
	// an array of the edge's adjacent faces that lie in that plane (value)
	const pairs_sets_faces = pairs_edges_faces
		.map((faces, i) => {
			const hash = {};
			pairs_sets[i].forEach(s => { hash[s] = []; });
			faces.flat().forEach(f => hash[faces_cluster[f]].push(f));
			return hash;
		});
	// console.log("pairs_sets_faces", pairs_sets_faces);
	const edges_coords = makeEdgesCoords({ vertices_coords, edges_vertices });
	const pairs_sets_2dEdges = pairs_sets.map((sets, i) => {
		const segment3D = edges_coords[pairs_edges[i][0]];
		const hash = {};
		sets.forEach(set => {
			hash[set] = segment3D
				.map(p => multiplyMatrix4Vector3(clusters_transform[set], p))
				.map(p => [p[0], p[1]]);
		});
		return hash;
	});
	// console.log("pairs_sets_2dEdges", pairs_sets_2dEdges);
	const pairs_sets_facesSides = pairs_sets_faces.map((pair, i) => {
		const hash = {};
		pairs_sets[i].forEach(set => {
			const origin = pairs_sets_2dEdges[i][set][0];
			hash[set] = pair[set].map(f => cross2(
				subtract2(faces_center[f], origin),
				subtract2(pairs_sets_2dEdges[i][set][1], origin),
			)).map(cross => Math.sign(cross));
		});
		return hash;
	});
	// console.log("pairs_sets_facesSides", pairs_sets_facesSides);
	const pairs_sets_facesSidesSameSide = pairs_sets_facesSides
		.map((pair, i) => {
			const hash = {};
			pairs_sets[i].forEach(set => {
				hash[set] = pair[set].reduce((a, b) => a && (b === pair[set][0]), true);
			});
			return hash;
		});
	// console.log("pairs_sets_facesSidesSameSide", pairs_sets_facesSidesSameSide);
	const pairs_data = pairs_edges.map((edges, i) => {
		const sets = {};
		Object.keys(pairs_sets_edges[i]).forEach(set => {
			sets[set] = {
				edges: pairs_sets_edges[i][set],
				faces: pairs_sets_faces[i][set],
				facesSides: pairs_sets_facesSides[i][set],
				facesSameSide: pairs_sets_facesSidesSameSide[i][set],
			};
		});
		return { edges, sets };
	});
	// console.log("pairs_data", pairs_data);
	const tortillaTortillaEdges = pairs_data.filter(data => {
		const testA = Object.values(data.sets)
			.map(el => el.faces.length === 2)
			.reduce((a, b) => a && b, true);
		const testB = Object.values(data.sets)
			.map(el => el.facesSameSide)
			.reduce((a, b) => a && b, true);
		return testA && testB;
	});
	// console.log("tortillaTortillaEdges", tortillaTortillaEdges);
	const solvable1 = pairs_data.filter(data => {
		const testA = Object.values(data.sets).length === 3;
		const testB = Object.values(data.sets)
			.map(el => el.facesSameSide)
			.reduce((a, b) => a && b, true);
		return testA && testB;
	});
	// console.log("solvable1", solvable1);
	const solvable2 = pairs_data.filter(data => {
		const testA = Object.values(data.sets)
			.map(el => el.faces.length === 2)
			.reduce((a, b) => a && b, true);
		const sameSide = Object.values(data.sets)
			.map(el => el.facesSameSide);
		const testB = sameSide[0] !== sameSide[1];
		return testA && testB;
	});
	// console.log("solvable2", solvable2);
	// todo: need a good example where we can test this special case.
	const solvable3 = pairs_data.filter(data => {
		const threeInPlane = Object.values(data.sets)
			.filter(el => el.faces.length === 3)
			.shift();
		const testA = threeInPlane !== undefined;
		if (!testA) { return false; }
		// valid facesSides will be either [1, 1, -1] or [-1, -1, 1] (in any order)
		// removing the cases [1, 1, 1] or [-1, -1, -1]
		// valid cases sums will be +1 or -1.
		const sum = threeInPlane.facesSides.reduce((a, b) => a + b, 0);
		const testB = Math.abs(sum) === 1;
		if (!testB) { return false; }
		const sameSideFaces = threeInPlane.faces
			.filter((_, i) => threeInPlane.facesSides[i] === sum);
		// are same side faces adjacent or not? (we don't have faces_faces)
		// non-adjacent faces are the valid case we are looking for.
		// for each of the two edges, check its edges_faces, if each face is
		// included inside of our sameSideFaces, and if all are (AND), this edge
		// registers as a joining edge between the two adjacent faces. if either
		// of the edges satisfy this, the pair of faces are adjacent.
		const isAdjacent = threeInPlane.edges
			.map(e => edges_faces[e]
				.map(f => sameSideFaces.includes(f))
				.reduce((a, b) => a && b, true))
			.reduce((a, b) => a || b, false);
		// we want the case where the faces are non-adjacent.
		const testC = !isAdjacent;
		return testA && testB && testC;
	});
	if (solvable3.length) {
		console.log("This model contains the third case", solvable3);
	}
	// return {
	// 	tortillaTortillaEdges,
	// 	solvable1,
	// 	solvable2,
	// 	solvable3: [],
	// };

	// tacos tortillas
	const tortillas3D = makeBentTortillas(
		{ edges_faces },
		tortillaTortillaEdges,
		faces_cluster,
		faces_winding,
	);
	const ordersEdgeFace = solveEdgeFaceOverlapOrders(
		{ vertices_coords, edges_vertices, edges_faces, edges_foldAngle },
		clusters_facePairs,
		clusters_transform,
		clusters_faces,
		faces_cluster,
		faces_polygon,
		faces_winding,
		edges_clusters,
		epsilon,
	);
	const ordersEdgeEdge = solveEdgeEdgeOverlapOrders({
		edges_foldAngle, faces_winding,
	}, solvable1, solvable2, solvable3);
	const orders = {
		...ordersEdgeFace,
		...ordersEdgeEdge,
	};
	// console.log("facePairs_cluster", facePairsIndex_set);
	// console.log("clusters_facePairsInt", clusters_facePairsInt);
	// console.log("clusters_facePairs", clusters_facePairs);
	// console.log("edges_clusters", edges_clusters);
	// console.log("facePairsIndex_set", facePairsIndex_set);
	// console.log("sets_facePairsIndex", sets_facePairsIndex);
	// console.log("sets_facePairs", sets_facePairsWithHoles);
	// console.log("edges_sets", edges_sets);
	// console.log("tortillaTortillaEdges", tortillaTortillaEdges);
	// console.log("tortillas3D", tortillas3D);
	// console.log("orders 3D", orders);
	// return {
	// 	tortillas3D,
	// 	orders,
	// };

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
