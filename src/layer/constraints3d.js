/**
 * Rabbit Ear (c) Kraft
 */
import Messages from "../environment/messages.js";
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
	getEdgesLine,
} from "../graph/edges/lines.js";
import {
	subgraphWithFaces,
} from "../graph/subgraph.js";
import {
	getEdgesEdgesCollinearOverlap,
	getFacesFacesOverlap,
} from "../graph/overlap.js";
import {
	constraints3DEdges,
} from "./constraints3dEdges.js";
import {
	makeTacosAndTortillas,
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
} from "./initialSolution.js";
import {
	joinOrderObjects,
} from "./general.js";
import {
	makeEdgesFacesSide3D,
} from "./facesSide.js";

/**
 * @description The first subroutine to initialize solver constraints for a
 * 3D model. This method locates all coplanar-overlapping clusters of faces
 * "clusters", clone one subgraph per cluster which contain only components
 * from this cluster's faces, rotate these graphs's vertices to place them
 * into the XY plane, and compute the overlap state between every pair of faces.
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {{
 *   faces_cluster: number[],
 *   faces_winding: boolean[],
 *   faces_polygon: [number, number][][],
 *   faces_center: [number, number][],
 *   clusters_faces: number[][],
 *   clusters_graph: FOLD[],
 *   clusters_transform: number[][],
 *   facesFacesOverlap: number[][],
 *   facePairs: string[],
 * }}
 */
export const constraints3DFaceClusters = ({
	vertices_coords, edges_vertices, edges_faces, edges_assignment, edges_foldAngle,
	faces_vertices, faces_edges, faces_faces,
}, epsilon = EPSILON) => {
	// cluster faces into coplanar-adjacent-overlapping sets. this creates:
	// - "planes": every unique plane that at least one face inhabits
	// - "clusters": a coplanar set of faces, multiple of these clusters can be
	//   from the same plane, but individual clusters do not overlap each other.
	const {
		// planes,
		// planes_faces,
		planes_transform,
		// planes_clusters,
		faces_winding,
		faces_plane,
		faces_cluster,
		clusters_plane,
		clusters_faces,
	} = getCoplanarAdjacentOverlappingFaces({
		vertices_coords, faces_vertices, faces_faces,
	}, epsilon);

	// for each cluster, get the transform which, when applied, brings
	// all points into the XY plane.
	const clusters_transform = clusters_plane.map(p => planes_transform[p]);

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

	// transform all vertices_coords by the inverse transform
	// to bring them all into the XY plane. convert back into a 2D point.
	clusters_graph.forEach(({ vertices_coords: coords }, c) => {
		clusters_graph[c].vertices_coords = coords
			.map((_, v) => multiplyMatrix4Vector3(
				clusters_transform[c],
				vertices_coords3D[v],
			))
			.map(([x, y]) => [x, y]);
	});

	// now, any arrays referencing edges (_edges) are out of sync with
	// the edge arrays themselves (edges_). Therefore this method really
	// isn't intended to be used outside of this higly specific context.

	// faces_polygon is a flat array of polygons in 2D, where every face
	// is re-oriented into 2D via each set's transformation.
	// collinear vertices (if exist) are removed from every polygon.
	/** @type {[number, number][][]} */
	const faces_polygon = mergeArraysWithHoles(...clusters_graph
		.map(copy => makeFacesPolygon(copy, epsilon)));

	// simple faces center by averaging all the face's vertices.
	// we don't have to be precise here, these are used to tell which
	// side of a face's edge the face is (assuming all faces are convex).
	const faces_center = faces_polygon.map(coords => average2(...coords));

	// populate individual graph copies with faces_center data.
	clusters_graph.forEach(({ faces_vertices: fv }, c) => {
		clusters_graph[c].faces_center = fv.map((_, f) => faces_center[f]);
	});

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
	/** @type {number[][]} */
	const facesFacesOverlap = mergeArraysWithHoles(...clusters_graph
		.map(graph => getFacesFacesOverlap(graph, epsilon)));

	// these are all the variables we need to solve- all overlapping faces in
	// pairwise combinations, as a space-separated string, smallest index first
	const facePairs = connectedComponentsPairs(facesFacesOverlap)
		.map(pair => pair.join(" "));

	return {
		planes_transform,
		faces_plane,
		faces_cluster,
		faces_winding,
		faces_polygon,
		faces_center,
		clusters_faces,
		clusters_graph,
		clusters_transform,
		facesFacesOverlap,
		facePairs,
	};
};

/**
 * @description
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon
 */
export const makeSolverConstraints3D = ({
	vertices_coords, edges_vertices, edges_faces, edges_assignment, edges_foldAngle,
	faces_vertices, faces_edges, faces_faces,
}, epsilon = EPSILON) => {
	const {
		planes_transform,
		faces_plane,
		faces_cluster,
		faces_winding,
		faces_polygon,
		faces_center,
		clusters_faces,
		clusters_graph,
		clusters_transform,
		facesFacesOverlap,
		facePairs,
	} = constraints3DFaceClusters({
		vertices_coords,
		edges_vertices,
		edges_faces,
		edges_assignment,
		edges_foldAngle,
		faces_vertices,
		faces_edges,
		faces_faces,
	}, epsilon);

	// const {
	// 	lines,
	// 	edges_line,
	// } = getEdgesLine({ vertices_coords, edges_vertices }, epsilon);

	// create a copy of edges_vertices, remove all boundary edges.
	const e_vDegree2 = edges_vertices.slice();
	edges_faces
		.map((_, e) => e)
		.filter(e => edges_faces[e].length !== 2)
		.forEach(e => delete e_vDegree2[e]);
	const edgesEdgesOverlap = getEdgesEdgesCollinearOverlap({
		vertices_coords, edges_vertices: e_vDegree2,
	}, epsilon);

	let edgeResults;
	try {
		edgeResults = constraints3DEdges({
			edges_faces,
			edges_foldAngle,
		}, {
			faces_plane,
			faces_winding,
			facesFacesOverlap,
			edgesEdgesOverlap,
		});
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
		.filter(a => a !== undefined);

	// remove any non-flat edges from the shallow copies.
	["edges_vertices", "edges_faces", "edges_assignment", "edges_foldAngle"]
		.forEach(key => clusters_graph
			.forEach((_, c) => nonFlatEdges
				.forEach(e => delete clusters_graph[c][key][e])));

	// now that we have all faces separated into coplanar-overlapping sets,
	// run the 2D taco/tortilla algorithms on each set individually
	const clusters_TacosAndTortillas = clusters_graph
		.map(el => makeTacosAndTortillas(el, epsilon));

	// now that we have computed these separately, we can flatten them into the
	// same array. The fact that these face pairs are from different 2D planes
	// does not matter, the solver simply solves them all at once.
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
		.map(el => solveFlatAdjacentEdges(el, faces_winding))
		.reduce((a, b) => Object.assign(a, b), ({}));

	// solutions where an edge with a 3D fold angle is crossing somewhere
	// in the interior of another face, where one of the edge's face's is
	// co-planar with the face, this results in a known layer ordering
	// between two faces.
	const edges_clusters = edges_faces
		.map(faces => faces
			.map(face => faces_cluster[face]));
	edges_clusters
		.map((_, i) => i)
		.filter(e => edges_clusters[e].length !== 2
			|| (edges_clusters[e][0] === edges_clusters[e][1]))
		.forEach(e => delete edges_clusters[e]);

	const ordersEdgeFace = solveEdgeFaceOverlapOrders(
		{ vertices_coords, edges_vertices, edges_faces, edges_foldAngle },
		clusters_transform,
		clusters_faces,
		faces_cluster,
		faces_polygon,
		faces_winding,
		edges_clusters,
		epsilon,
	);

	const orders = joinOrderObjects([orders3D, adjacentOrders, ordersEdgeFace]);

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
