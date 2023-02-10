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
import { subgraphWithFaces } from "../../graph/subgraph.js";

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
	// the graphs are all prepared, now uncover taco/tortilla information
	const groups_tacos_tortillas = graphCopies
		.map(el => makeTacosTortillas(el, epsilon));
	const groups_unfiltered_trios = graphCopies
		.map(el => makeTransitivityTrios(el, faces_facesOverlap, epsilon));
	const groups_transitivity_trios = groups_unfiltered_trios
		.map((trios, i) => filterTransitivity(trios, groups_tacos_tortillas[i]));
	const groups_constraints = groups_tacos_tortillas
		.map((tacos_tortillas, i) => makeConstraints(
			tacos_tortillas,
			groups_transitivity_trios[i],
		));
	const facePairsInts = selfRelationalUniqueIndexPairs(faces_facesOverlap);
	const facePairs = facePairsInts.map(pair => pair.join(" "));
	// const groups_edgeAdjacentOrders = graphCopies
	// 	.map(el => solveEdgeAdjacent(el, facePairs, overlapInfo.faces_winding));
	const facePairsIndex_group = facePairsInts
		.map(pair => faces_set[pair[0]]);
	const groups_facePairsIndex = invertMap(facePairsIndex_group)
		.map(el => (el.constructor === Array ? el : [el]));
	const groups_facePairsWithHoles = groups_facePairsIndex
		.map(indices => indices.map(i => facePairs[i]));
	const groups_facePairs = groups_constraints
		.map((_, i) => (groups_facePairsWithHoles[i] ? groups_facePairsWithHoles[i] : []));
	// console.log("sets_transformXY", sets_transformXY);
	// console.log("faces_set", faces_set);
	// console.log("sets_faces", sets_faces);
	// console.log("faces_winding", faces_winding);
	// console.log("faces_facesOverlap", faces_facesOverlap);
	// console.log("graphCopies", graphCopies);
	// console.log("faces_polygon", faces_polygon);
	// console.log("faces_center", faces_center);
	// console.log("groups_tacos_tortillas", groups_tacos_tortillas);
	// console.log("groups_unfiltered_trios", groups_unfiltered_trios);
	// console.log("groups_transitivity_trios", groups_transitivity_trios);
	// console.log("groups_constraints", groups_constraints);
	// // console.log("groups_constraintsLookup", groups_constraintsLookup);
	// console.log("facePairsInts", facePairsInts);
	// console.log("facePairs", facePairs);
	// // console.log("groups_edgeAdjacentOrders", groups_edgeAdjacentOrders);
	// console.log("facePairsIndex_group", facePairsIndex_group);
	// console.log("groups_facePairsIndex", groups_facePairsIndex);
	// console.log("groups_facePairs", groups_facePairsWithHoles);
	// now we join all the data from the separate groups together.
	// make sure edges_faces is added here, not any sooner
	// hmmmmm..... lets try to remove this and see what happens.
	// if (!graph.edges_faces) {
	// 	graph.edges_faces = makeEdgesFacesUnsorted(graph);
	// }
	const constraints = {
		taco_taco: [],
		taco_tortilla: [],
		tortilla_tortilla: [],
		transitivity: [],
	};
	groups_constraints.forEach(group => {
		constraints.taco_taco.push(...group.taco_taco);
		constraints.taco_tortilla.push(...group.taco_tortilla);
		constraints.tortilla_tortilla.push(...group.tortilla_tortilla);
		constraints.transitivity.push(...group.transitivity);
	});
	// const tortillas3D = make3DTortillas(graph, faces_set, epsilon).map(el => [
	// 	// el[0][0], el[1][0], el[0][1], el[1][1],
	// 	...el[0], ...el[1],
	// ]);
	// constraints.tortilla_tortilla.push(...tortillas3D);
	const constraintsLookup = makeConstraintsLookup(constraints);
	const facePairsFlat = groups_facePairs.flat();
	const edgeAdjacentOrders = solveEdgeAdjacent(graph, facePairs, faces_winding);
	// // const edgeAdjacentOrders = {};
	// console.log("constraints", constraints);
	// console.log("tortillas3D", tortillas3D);
	// console.log("constraintsLookup", constraintsLookup);
	// console.log("facePairsFlat", facePairsFlat);
	// console.log("edgeAdjacentOrders", edgeAdjacentOrders);
	return {
		constraints,
		constraintsLookup,
		facePairs: facePairsFlat,
		edgeAdjacentOrders,
		faces_winding,
	};
	// return {
	// 	groups_constraints,
	// 	groups_constraintsLookup,
	// 	groups_facePairs,
	// 	groups_edgeAdjacentOrders,
	// 	faces_winding,
	// };
};

export default prepare;
