/**
 * Rabbit Ear (c) Kraft
 */
import math from "../../math.js";
import { invertMap } from "../../graph/maps.js";
import {
	makeEdgesFoldAngle,
	makeEdgesFacesUnsorted,
	makeFacesEdgesFromVertices,
	makeFacesPolygon,
} from "../../graph/make.js";
import { selfRelationalUniqueIndexPairs } from "../../general/arrays.js";
// import { disjointFacePlaneSets } from "../../graph/sets.js";
import { coplanarOverlappingFacesGroups } from "../../graph/coplanar.js";
import makeTacosTortillas from "./makeTacosTortillas.js";
import makeTransitivityTrios from "./makeTransitivityTrios.js";
import filterTransitivity from "./filterTransitivity.js";
// import { makeFacesWinding } from "../../graph/facesWinding.js";
import {
	makeConstraints,
	makeConstraintsLookup,
} from "./makeConstraints.js";
import solveEdgeAdjacent from "./solveEdgeAdjacent.js";
import make3DTortillas from "./make3DTortillas.js";
import make3DTacoTortillas from "./make3DTacoTortillas.js";
import { subgraphWithFaces } from "../../graph/subgraph.js";

const getEdgesSetsInTwoPlanes = (graph, faces_set) => {
	// find edges which are in two sets
	const edges_sets_lookup = graph.edges_vertices.map(() => ({}));
	faces_set
		.forEach((set, face) => graph.faces_edges[face]
			.forEach(edge => { edges_sets_lookup[edge][set] = true; }));
	// for every edge, which co-planar group does it appear in
	const edges_sets = edges_sets_lookup
		.map(o => Object.keys(o)
			.map(n => parseInt(n, 10)));
	// if an edge only appears in one group, delete the entry from the array
	// this will create an array with holes, maintaining edge's indices.
	edges_sets.forEach((arr, i) => {
		if (arr.length !== 2) { delete edges_sets[i]; }
	});
	// ensure entries in edges_sets are sorted
	edges_sets.forEach((arr, i) => {
		if (arr[0] > arr[1]) { edges_sets[i].reverse(); }
	});
	return edges_sets;
};

/**
 * todo: bad code. n^2
 */
const makeFacesFacesOverlap = (graph, sets_faces, faces_polygon, epsilon) => {
	const faces_facesOverlapMatrix = graph.faces_vertices.map(() => []);
	sets_faces.forEach(set_faces => {
		for (let i = 0; i < set_faces.length - 1; i += 1) {
			for (let j = i + 1; j < set_faces.length; j += 1) {
				const faces = [set_faces[i], set_faces[j]];
				const polygons = faces.map(f => faces_polygon[f]);
				const overlap = math.overlapConvexPolygons(...polygons, epsilon);
				if (overlap) {
					faces_facesOverlapMatrix[faces[0]][faces[1]] = true;
					faces_facesOverlapMatrix[faces[1]][faces[0]] = true;
				}
			}
		}
	});
	return faces_facesOverlapMatrix
		.map(overlap => overlap
			.map((_, i) => i)
			.filter(a => a !== undefined));
};
/**
 * @description make copies of 
 */
const graphGroupCopies = (graph, sets_faces, sets_transform) => {
	// transform point by a matrix, return result as 2D
	const transformTo2D = (matrix, point) => {
		const p = math.multiplyMatrix4Vector3(matrix, point);
		return [p[0], p[1]];
	};
	// coerce all vertices into 3D in case they are not already
	const vertices_coords_3d = graph.vertices_coords
		.map(coord => math.resize(3, coord));
	// make shallow copies of the graph, one for every group
	const copies = sets_faces.map(faces => subgraphWithFaces(graph, faces));
	// transform all vertices_coords by the inverse transform
	// to bring them all into the XY plane. convert to 2D
	sets_transform.forEach((matrix, i) => {
		copies[i].vertices_coords = copies[i].vertices_coords
			.map((_, v) => transformTo2D(matrix, vertices_coords_3d[v]));
	});
	return copies;
};

const prepare = (graphInput, epsilon = 1e-6) => {
	// shallow copy the user input graph so we don't modify it.
	const graph = { ...graphInput };
	// ensure this data is here because 
	if (!graph.faces_edges) {
		graph.faces_edges = makeFacesEdgesFromVertices(graph);
	}
	if (!graph.edges_faces) {
		graph.edges_faces = makeEdgesFacesUnsorted(graph);
	}
	// edges_foldAngle needs to be present so we can ignore foldAngles
	// which are not flat when doing taco/tortilla things. if we need to
	// build it here, all of them are flat, but we need the array to exist
	if (!graph.edges_foldAngle && graph.edges_assignment) {
		graph.edges_foldAngle = makeEdgesFoldAngle(graph);
	}
	// separate the group into coplanar overlapping sets
	const {
		sets_faces,
		// sets_plane,
		sets_transformXY,
		faces_set,
		faces_winding,
		// faces_facesOverlap,
	} = coplanarOverlappingFacesGroups(graph, epsilon);
	// const overlapInfo = coplanarOverlappingFacesGroups(graph, epsilon);
	// const overlapInfo = disjointFacePlaneSets(graph, epsilon);
	// const sets_faces = invertMap(faces_set)
	// 	.map(el => (el.constructor === Array ? el : [el]));
	// all vertices_coords will become 2D
	const graphCopies = graphGroupCopies(
		graph,
		sets_faces,
		sets_transformXY,
	);
	// convert faces into polygons, ordered set of points, not necessarily
	// matching the winding in the original face because all faces will be
	// made to be counter clockwise. using faces_winding, flip it if needed.
	// additionally, makeFacesPolygon ensures no collinear vertices exist.
	const faces_polygon = [];
	graphCopies
		.map(copy => makeFacesPolygon(copy, epsilon))
		.forEach(faces => faces
			.forEach((polygon, f) => { faces_polygon[f] = polygon; }));
	// reverse order of points if the winding is flipped.
	// all faces_polygon are now counter-clockwise and in the XY plane.
	faces_winding
		.map((upright, i) => (upright ? undefined : i))
		.filter(a => a !== undefined)
		.forEach(f => faces_polygon[f].reverse());
	// simple faces center by averaging all the face's vertices
	const faces_center = faces_polygon
		.map(polygon => polygon
			.reduce((a, b) => math.add2(a, b), [0, 0])
			.map(el => el / polygon.length));
	// populate faces_center into each of the graph copies
	graphCopies.forEach(el => {
		el.faces_center = el.faces_vertices.map((_, i) => faces_center[i]);
	});
	const faces_facesOverlap = makeFacesFacesOverlap(
		graph,
		sets_faces,
		faces_polygon,
		epsilon,
	);
	// now that we have all faces separated into coplanar-overlapping sets,
	// run the 2D taco/tortilla algorithms on each set individually,
	// until we get to make3DTortillas, which will work across coplanar sets
	const sets_tacos_tortillas = graphCopies
		.map(el => makeTacosTortillas(el, epsilon));
	const sets_unfiltered_trios = graphCopies
		.map(el => makeTransitivityTrios(el, faces_facesOverlap, epsilon));
	const sets_transitivity_trios = sets_unfiltered_trios
		.map((trios, i) => filterTransitivity(trios, sets_tacos_tortillas[i]));
	const sets_constraints = sets_tacos_tortillas
		.map((tacos_tortillas, i) => makeConstraints(
			tacos_tortillas,
			sets_transitivity_trios[i],
		));
	const facePairsInts = selfRelationalUniqueIndexPairs(faces_facesOverlap);
	const facePairs = facePairsInts.map(pair => pair.join(" "));
	// const sets_edgeAdjacentOrders = graphCopies
	// 	.map(el => solveEdgeAdjacent(el, facePairs, overlapInfo.faces_winding));
	const facePairsIndex_group = facePairsInts
		.map(pair => faces_set[pair[0]]);
	const sets_facePairsIndex = invertMap(facePairsIndex_group)
		.map(el => (el.constructor === Array ? el : [el]));
	const sets_facePairsWithHoles = sets_facePairsIndex
		.map(indices => indices.map(i => facePairs[i]));
	const sets_facePairs = sets_constraints
		.map((_, i) => (sets_facePairsWithHoles[i] ? sets_facePairsWithHoles[i] : []));
	// for each edge, which set(s) is it a member of, this method
	// only finds those which are in two sets, as the ones in one
	// set only is not interesting to us
	const edges_sets = getEdgesSetsInTwoPlanes(graph, faces_set);

	const tortillas3D = make3DTortillas(graph, faces_set, edges_sets, epsilon)
		.map(el => [
			// el[0][0], el[1][0], el[0][1], el[1][1],
			...el[0], ...el[1],
		]);
	const tacoTortillas3D = make3DTacoTortillas(
		graph,
		sets_facePairs,
		sets_transformXY,
		faces_set,
		faces_polygon,
		edges_sets,
		epsilon,
	);
	const tt3dWindings = tacoTortillas3D
		.map(el => [el.face, el.otherFace].map(f => faces_winding[f]));
	const tt3dKeysOrdered = tacoTortillas3D
		.map(el => el.face < el.otherFace);
	const tt3dKeys = tacoTortillas3D
		.map((el, i) => (tt3dKeysOrdered[i]
			? [el.face, el.otherFace]
			: [el.otherFace, el.face]))
		.map(pair => pair.join(" "));
	const signOrder = { "-1": 2, 1: 1, 0: 0 };
	const tt3dOrders = tacoTortillas3D
		.map(el => Math.sign(graph.edges_foldAngle[el.edge]))
		// .map((sign, i) => {
		// 	// needs some complicated thing here
		// 	const flip = (tt3dKeysOrdered[i] ? tt3dWindings[i][0] : tt3dWindings[i][1]);
		// 	return flip ? -1 * sign : sign;
		// })
		.map(sign => signOrder[sign]);

	console.log("tacoTortillas3D", tacoTortillas3D);
	// console.log("tt3dWindings", tt3dWindings);
	// console.log("tt3dKeysOrdered", tt3dKeysOrdered);
	// console.log("tt3dKeys", tt3dKeys);
	// console.log("tt3dOrders", tt3dOrders);

	// console.log("sets_transformXY", sets_transformXY);
	// console.log("faces_set", faces_set);
	// console.log("sets_faces", sets_faces);
	// console.log("faces_winding", faces_winding);
	// console.log("faces_facesOverlap", faces_facesOverlap);
	// console.log("graphCopies", graphCopies);
	// console.log("faces_polygon", faces_polygon);
	// console.log("faces_center", faces_center);
	// console.log("sets_tacos_tortillas", sets_tacos_tortillas);
	// console.log("sets_unfiltered_trios", sets_unfiltered_trios);
	// console.log("sets_transitivity_trios", sets_transitivity_trios);
	// console.log("sets_constraints", sets_constraints);
	// // console.log("sets_constraintsLookup", sets_constraintsLookup);
	// console.log("facePairsInts", facePairsInts);
	// console.log("facePairs", facePairs);
	// // console.log("sets_edgeAdjacentOrders", sets_edgeAdjacentOrders);
	// console.log("facePairsIndex_group", facePairsIndex_group);
	// console.log("sets_facePairsIndex", sets_facePairsIndex);
	// console.log("sets_facePairs", sets_facePairsWithHoles);
	// console.log("edges_sets", edges_sets);
	// console.log("tortillas3D", tortillas3D);
	// console.log("tacoTortillas3D", tacoTortillas3D);
	// now we join all the data from the separate groups together.
	const constraints = {
		taco_taco: [],
		taco_tortilla: [],
		tortilla_tortilla: [],
		transitivity: [],
	};
	sets_constraints.forEach(group => {
		constraints.taco_taco.push(...group.taco_taco);
		constraints.taco_tortilla.push(...group.taco_tortilla);
		constraints.tortilla_tortilla.push(...group.tortilla_tortilla);
		constraints.transitivity.push(...group.transitivity);
	});
	constraints.tortilla_tortilla.push(...tortillas3D);
	const constraintsLookup = makeConstraintsLookup(constraints);
	const facePairsFlat = sets_facePairs.flat();
	const edgeAdjacentOrders = solveEdgeAdjacent(graph, facePairs, faces_winding);
	// const edgeAdjacentOrders = {};
	console.log("constraints", constraints);
	console.log("constraintsLookup", constraintsLookup);
	console.log("facePairsFlat", facePairsFlat);
	console.log("edgeAdjacentOrders", edgeAdjacentOrders);

	tt3dKeys.forEach((key, i) => { edgeAdjacentOrders[key] = tt3dOrders[i]; });

	return {
		constraints,
		constraintsLookup,
		facePairs: facePairsFlat,
		edgeAdjacentOrders,
		faces_winding,
	};
	// return {
	// 	sets_constraints,
	// 	sets_constraintsLookup,
	// 	sets_facePairs,
	// 	sets_edgeAdjacentOrders,
	// 	faces_winding,
	// };
};

export default prepare;
