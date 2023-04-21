/**
 * Rabbit Ear (c) Kraft
 */
import { EPSILON } from "../../math/general/constant.js";
import { average2 } from "../../math/algebra/vector.js";
import { overlapConvexPolygons } from "../../math/intersect/overlap.js";
import { invertMap } from "../../graph/maps.js";
import { makeFacesPolygon } from "../../graph/make.js";
import {
	flatSort,
	selfRelationalUniqueIndexPairs,
} from "../../general/arrays.js";
// import { disjointFacePlaneSets } from "../../graph/sets.js";
import { coplanarOverlappingFacesGroups } from "../../graph/faces/coplanar.js";
import makeTacosTortillas from "./tacosAndTortillas.js";
import {
	makeTransitivity,
	filterTransitivity,
} from "../solver2d/transitivity.js";
import {
	makeConstraints,
	makeConstraintsLookup,
} from "../solver2d/makeConstraints.js";
import make3DTortillas from "./make3DTortillas.js";
import make3DTacoTortillas from "./make3DTacoTortillas.js";
import {
	graphGroupCopies,
} from "./copyGraph.js";
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
 * todo: bad code. n^2
 */
const makeFacesFacesOverlap = ({ faces_vertices }, sets_faces, faces_polygon, epsilon) => {
	const faces_facesOverlapMatrix = faces_vertices.map(() => []);
	sets_faces.forEach(set_faces => {
		for (let i = 0; i < set_faces.length - 1; i += 1) {
			for (let j = i + 1; j < set_faces.length; j += 1) {
				const faces = [set_faces[i], set_faces[j]];
				const polygons = faces.map(f => faces_polygon[f]);
				const overlap = overlapConvexPolygons(...polygons, epsilon);
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
 *
 */
export const setup = ({
	vertices_coords, edges_vertices, edges_faces, edges_foldAngle,
	faces_vertices, faces_edges, faces_faces,
}, epsilon = EPSILON) => {
	// separate the list of faces into coplanar overlapping sets
	const {
		sets_faces,
		// sets_plane,
		sets_transformXY,
		faces_set,
		faces_winding,
		// faces_facesOverlap,
	} = coplanarOverlappingFacesGroups({
		vertices_coords, faces_vertices, faces_faces,
	}, epsilon);
	// all vertices_coords will become 2D
	const sets_graphs = graphGroupCopies({
		vertices_coords,
		edges_vertices,
		edges_faces,
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
	// simple faces center by averaging all the face's vertices
	const faces_center = faces_polygon.map(coords => average2(...coords));
	// populate individual graph copies with data only relevant to it.
	sets_graphs.forEach(el => {
		el.faces_center = el.faces_vertices.map((_, f) => faces_center[f]);
	});
	// faces-faces overlap will be a single flat array.
	// each face is only a part of one planar-group anyway.
	// as opposed to edges-faces overlap which is computed for each planar-group.
	const faces_facesOverlap = makeFacesFacesOverlap(
		{ vertices_coords, faces_vertices },
		sets_faces,
		faces_polygon,
		epsilon,
	);
	// now that we have all faces separated into coplanar-overlapping sets,
	// run the 2D taco/tortilla algorithms on each set individually,
	// until we get to make3DTortillas, which will work across coplanar sets
	const sets_tacos_tortillas = sets_graphs
		.map(el => makeTacosTortillas(el, epsilon));
	const taco_taco = sets_tacos_tortillas.flatMap(set => set.taco_taco);
	const taco_tortilla = sets_tacos_tortillas.flatMap(set => set.taco_tortilla);
	const tortilla_tortilla = sets_tacos_tortillas.flatMap(set => set.tortilla_tortilla);
	// transitivity can be built once, globally. transitivity is built from
	// faces_facesOverlap, which inheritely includes the sets-information by
	// the fact that no two faces in different sets overlap one another.
	const unfilteredTrans = makeTransitivity({
		faces_polygon,
	}, faces_facesOverlap, epsilon);
	const transitivity = filterTransitivity(unfilteredTrans, {
		taco_taco, taco_tortilla,
	});
	const constraints = makeConstraints({
		taco_taco, taco_tortilla, tortilla_tortilla, transitivity,
	});
	// const sets_constraints = sets_tacos_tortillas
	// 	.map((tacos_tortillas, i) => makeConstraints(
	// 		tacos_tortillas,
	// 		sets_transitivity_trios[i],
	// 	));
	const facePairsInts = selfRelationalUniqueIndexPairs(faces_facesOverlap);
	const facePairs = facePairsInts.map(pair => pair.join(" "));
	// const sets_edgeAdjacentOrders = sets_graphs
	// 	.map(el => solveEdgeAdjacent(el, facePairs, overlapInfo.faces_winding));
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
	console.log("sets_graphs", sets_graphs);
	console.log("faces_polygon", faces_polygon);
	console.log("faces_center", faces_center);
	console.log("faces_facesOverlap", faces_facesOverlap);
	console.log("sets_tacos_tortillas", sets_tacos_tortillas);
	console.log("unfilteredTrans", unfilteredTrans);
	console.log("transitivity", transitivity);
	console.log("constraints", constraints);
	console.log("facePairs", facePairs);
	console.log("facePairsIndex_set", facePairsIndex_set);
	console.log("sets_facePairsIndex", sets_facePairsIndex);
	console.log("sets_facePairs", sets_facePairs);
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
	const tortillas3D = make3DTortillas({
		vertices_coords, edges_vertices, edges_faces,
	}, faces_set, edges_sets, epsilon)
		.map(el => [
			// el[0][0], el[1][0], el[0][1], el[1][1],
			...el[0], ...el[1],
		]);
	const tacoTortillas3D = make3DTacoTortillas(
		{ vertices_coords, edges_vertices, edges_faces, edges_foldAngle },
		sets_facePairs,
		sets_transformXY,
		faces_set,
		faces_polygon,
		edges_sets,
		epsilon,
	);
	console.log("edges_sets", edges_sets);
	console.log("tortillas3D", tortillas3D);
	console.log("tacoTortillas3D", tacoTortillas3D);
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
		.map(el => Math.sign(edges_foldAngle[el.edge]))
		// .map((sign, i) => {
		// 	// needs some complicated thing here
		// 	const flip = (tt3dKeysOrdered[i] ? tt3dWindings[i][0] : tt3dWindings[i][1]);
		// 	return flip ? -1 * sign : sign;
		// })
		.map(sign => signOrder[sign]);

	// console.log("tt3dWindings", tt3dWindings);
	// console.log("tt3dKeysOrdered", tt3dKeysOrdered);
	// console.log("tt3dKeys", tt3dKeys);
	// console.log("tt3dOrders", tt3dOrders);

	// console.log("sets_transformXY", sets_transformXY);
	// console.log("faces_set", faces_set);
	// console.log("sets_faces", sets_faces);
	// console.log("faces_winding", faces_winding);
	// console.log("faces_facesOverlap", faces_facesOverlap);
	// console.log("sets_graphs", sets_graphs);
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
	// console.log("facePairsIndex_set", facePairsIndex_set);
	// console.log("sets_facePairsIndex", sets_facePairsIndex);
	// console.log("sets_facePairs", sets_facePairsWithHoles);
	// console.log("edges_sets", edges_sets);
	// console.log("tortillas3D", tortillas3D);
	// console.log("tacoTortillas3D", tacoTortillas3D);
	// now we join all the data from the separate groups together.
	const constraintsOld = {
		taco_taco: [],
		taco_tortilla: [],
		tortilla_tortilla: [],
		transitivity: [],
	};
	sets_constraints.forEach(group => {
		constraintsOld.taco_taco.push(...group.taco_taco);
		constraintsOld.taco_tortilla.push(...group.taco_tortilla);
		constraintsOld.tortilla_tortilla.push(...group.tortilla_tortilla);
		constraintsOld.transitivity.push(...group.transitivity);
	});
	constraintsOld.tortilla_tortilla.push(...tortillas3D);
	// const constraintsLookup = makeConstraintsLookup(constraintsOld);
	const constraintsLookup = makeConstraintsLookup(constraintsOld);
	const facePairsFlat = sets_facePairs.flat();
	// const edgeAdjacentOrders = solveEdgeAdjacent(graph, facePairs, faces_winding);
	// const edgeAdjacentOrders = {};
	// console.log("constraintsOld", constraintsOld);
	// console.log("constraintsLookup", constraintsLookup);
	// console.log("facePairsFlat", facePairsFlat);
	// console.log("edgeAdjacentOrders", edgeAdjacentOrders);

	// tt3dKeys.forEach((key, i) => { edgeAdjacentOrders[key] = tt3dOrders[i]; });
	return {
		constraints,
		lookup: constraintsLookup,
		facePairs: facePairsFlat,
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
