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
	multiplyMatrix4Line3,
} from "../math/matrix4.js";
import {
	mergeArraysWithHoles,
	uniqueElements,
	arrayArrayToLookupArray,
} from "../general/array.js";
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
import {
	makeEdgesFacesSide3D,
} from "./facesSide.js";
import {
	invertFlatToArrayMap,
} from "../graph/maps.js";

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
 * - 0: bent (3D)
 * - 1: tortilla
 * - 2: taco
 */
const getEdgesClass = (edges_faces, faces_plane, facesFacesLookup) => {
	const edges_class = [];

	// filter only edges with two adjacent faces
	const degreeTwoEdges = edges_faces
		.map((_, edge) => edge)
		.filter(edge => edges_faces[edge].length === 2);

	// filter only edges whose both faces are in the same plane
	degreeTwoEdges
		.filter(e => faces_plane[edges_faces[e][0]] === faces_plane[edges_faces[e][1]])
		.forEach(edge => {
			const [f0, f1] = edges_faces[edge];
			edges_class[edge] = facesFacesLookup[f0][f1] ? 2 : 1;
		});

	// filter only edges whose both faces are not in the same plane
	degreeTwoEdges
		.filter(e => faces_plane[edges_faces[e][0]] !== faces_plane[edges_faces[e][1]])
		.forEach(edge => { edges_class[edge] = 0; });
	return edges_class;
};

export const constraints3DEdgeClustersNew = (
	{
		vertices_coords,
		edges_vertices,
		edges_faces,
		edges_foldAngle,
		faces_vertices,
		faces_center,
	},
	{
		lines,
		edges_line,
		planes_transform,
		faces_plane,
		faces_winding,
		facesFacesOverlap,
	},
	epsilon = EPSILON,
) => {
	// create a copy of edges_vertices, remove all boundary edges.
	const edges_verticesDegree2 = edges_vertices.slice();
	edges_faces
		.map((_, e) => e)
		.filter(e => edges_faces[e].length !== 2)
		.forEach(e => delete edges_verticesDegree2[e]);

	const edgesEdgesOverlap = getEdgesEdgesCollinearOverlap(
		{ vertices_coords, edges_vertices: edges_verticesDegree2 },
		epsilon,
	);

	// all pairings of overlapping edges, including pairs of edges which
	// hold no value to us at this stage
	const edgePairs = connectedComponentsPairs(edgesEdgesOverlap);
	const facesFacesLookup = arrayArrayToLookupArray(facesFacesOverlap);
	const edges_class = getEdgesClass(edges_faces, faces_plane, facesFacesLookup);

	// classifications
	// (letters are face planes in 3D: A, B, C, ...)
	// - Y-junction: A1-B and A2-C, where A1-A2 overlap
	// - T-junction: A1-B1 and A2-B2, where A1-A2 overlap and B1-B2 do NOT overlap
	// - bent-flat-tortillas: A1-A2 and A3-B, where A1-A2 do NOT overlap,
	//   but A3 does overlap with either A1 or A2
	// - bent-tortilla-flat-taco: A1-A2 and A3-B, where A1-A2-A3 all overlap
	// - bent-tortillas: A1-B1 and A2-B2, where A1-A2 overlap and B1-B2 overlap
	// additional:
	// - four-plane: A-B and C-D

	// const edgePairsPlanes = edgePairs
	// 	.map(edges => edges
	// 		.flatMap(edge => edges_faces[edge].map(face => faces_plane[face])));

	// classes:
	// undefined: unknown
	// -1: no face-overlaps to solve (ignore)
	// 0: flat (ignore)
	// 1: bent-flat-tortillas
	// 2: bent-tortilla-flat-taco
	// 3: Y-junction
	// 4: T-junction
	// 5: bent-tortillas
	const edgePairsClass = edgePairs.map(edges => {
		if (edges_class[edges[0]] && edges_class[edges[1]]) { return 0; }
		const classes = edges.map(edge => edge);
		const [f0, f1, f2, f3] = edges.flatMap(e => edges_faces[e]);
		const [p0, p1, p2, p3] = edges
			.flatMap(edge => edges_faces[edge]
				.map(face => faces_plane[face]));

		// true if any one pair's face overlaps any face from the other pair.
		const interPairOverlap = facesFacesLookup[f0][f2]
			|| facesFacesLookup[f0][f3]
			|| facesFacesLookup[f1][f2]
			|| facesFacesLookup[f1][f3];

		if (!interPairOverlap) { return -1; }

		// bent-flat tortillas
		// true if either includes "tortilla" and interPairOverlap
		if (classes.includes(1)) { return 1; }

		// bent-tortilla-flat-taco
		// true if either includes "taco" and interPairOverlap
		if (classes.includes(2)) { return 2; }

		// Y-junction
		// A1-B and A2-C, where A1-A2 overlap
		if ((p0 === p2 && p1 !== p3 && facesFacesLookup[f0][f2])
			|| (p0 === p3 && p1 !== p2 && facesFacesLookup[f0][f3])
			|| (p1 === p2 && p0 !== p3 && facesFacesLookup[f1][f2])
			|| (p1 === p3 && p0 !== p2 && facesFacesLookup[f1][f3])) { return 3; }

		// T-junction
		// A1-B1 and A2-B2, where A1-A2 overlap and B1-B2 do NOT overlap
		if ((p0 === p2 && p1 === p3 && facesFacesLookup[f0][f2] && !facesFacesLookup[f1][f3])
			|| (p0 === p3 && p1 === p2 && facesFacesLookup[f0][f3] && !facesFacesLookup[f1][f2])
			|| (p1 === p2 && p0 === p3 && facesFacesLookup[f1][f2] && !facesFacesLookup[f0][f3])
			|| (p1 === p3 && p0 === p2 && facesFacesLookup[f1][f3] && !facesFacesLookup[f0][f2])) {
				return 4;
			}

		// bent-tortillas
		// A1-B1 and A2-B2, where A1-A2 overlap and B1-B2 overlap
		if ((p0 === p2 && p1 === p3 && facesFacesLookup[f0][f2] && facesFacesLookup[f1][f3])
			|| (p0 === p3 && p1 === p2 && facesFacesLookup[f0][f3] && facesFacesLookup[f1][f2])
			|| (p1 === p2 && p0 === p3 && facesFacesLookup[f1][f2] && facesFacesLookup[f0][f3])
			|| (p1 === p3 && p0 === p2 && facesFacesLookup[f1][f3] && facesFacesLookup[f0][f2])) {
			return 5;
		}

		return undefined;
	});

	const edges_facesSide = makeEdgesFacesSide3D(
		{ vertices_coords, edges_faces, faces_vertices, faces_center },
		{ lines, edges_line, planes_transform, faces_plane }
	);

	// - Y-junction: A1-B and A2-C, where A1-A2 overlap
	// - T-junction: A1-B1 and A2-B2, where A1-A2 overlap and B1-B2 do NOT overlap
	// - bent-flat-tortillas: A1-A2 and A3-B, where A1-A2 do NOT overlap,
	//   but A3 does overlap with either A1 or A2
	// - bent-tortilla-flat-taco: A1-A2 and A3-B, where A1-A2-A3 all overlap
	// - bent-tortillas: A1-B1 and A2-B2, where A1-A2 overlap and B1-B2 overlap
	// additional:
	// - four-plane: A-B and C-D

	const makeBentTortillas = (edgePair) => {
		// all pairwise combinations of edges that create a 3D tortilla-tortilla
		// for each tortilla-tortilla edge, get the four adjacent faces involved
		/** @type {[[number, number], [number, number]]} */
		const tortilla_tortilla = edgePair
			.map(edge => edges_faces[edge].slice());

		// sort the faces of the tortillas on the correct side so that
		// the two faces in the same plane have the same index in their arrays.
		// [[A,B], [X,Y]], A and B are edge-connected faces, X and Y are connected,
		// and A and X are in the same plane, B and Y are in the same plane.
		if (faces_plane[tortilla_tortilla[0][0]] !== faces_plane[tortilla_tortilla[1][0]]) {
			// if both [0] are not from the same set, reverse the second tortilla's faces
			tortilla_tortilla[1].reverse();
		}

		// Finally, each planar cluster chose a normal for that plane at random,
		// (the normal from whichever was the first face from that cluster).
		// Because these are bent tortillas, it's possible that the normal direction
		// flips moving from one face to the other inside of one tortilla.
		// The solver works by placing a face "above" or "below" the other, and
		// repeating that same action on the other side of the edge, but if the normal
		// flips, "below" and "above" flip, resulting in a self-intersecting tortilla-
		// tortilla.
		// For each tortilla-tortilla [[A, B], [X, Y]], ignore the second, just grab
		// face A and B, get each face's winding direction, and check if they match.
		// If they don't match, swap B and Y, so that the result is [[A, Y], [X, B]]
		// which no longer means that each pair shares an edge in common, but that
		// does not matter we will simply pass this off to the solver in a moment.
		if (faces_winding[tortilla_tortilla[0][0]] !== faces_winding[tortilla_tortilla[0][1]]) {
			// swap face order [[A, B], [X, Y]] into [[A, Y], [X, B]]
			[tortilla_tortilla[0][1], tortilla_tortilla[1][1]] = [
				tortilla_tortilla[1][1], tortilla_tortilla[0][1],
			];
		}

		// convert [[0, 1], [2, 3]] into [0, 1, 2, 3], ready for the solver
		return tortilla_tortilla.flat();
	};

	const bentTortillas = edgePairsClass
		.map((_, i) => i)
		.filter(i => edgePairsClass[i] === 5)
		.map(i => edgePairs[i])
		.map(makeBentTortillas);

	// const edges_planes = edges_faces
	// 	.map(faces => faces.flatMap(face => faces_plane[face]))
	// 	.map(uniqueElements);

	// const edgePairs_facePlanes = edgePairs
	// 	.map(edges => edges
	// 		.map(edge => edges_faces[edge])
	// 		.flatMap(faces => faces.map(face => faces_plane[face])));
	//

	// const edgePairs_unqiuePlanes = edgePairs
	// 	.map(edges => edges
	// 		.flatMap(edge => edges_faces[edge]
	// 			.map(face => faces_plane[face])))
	// 	.map(uniqueElements);

	// const edgePairs_pairPlanes = edgePairs
	// 	.map(edges => edges
	// 		.map(edge => edges_faces[edge]
	// 			.map(face => faces_plane[face])))

	// const edgePairs_uniquePairPlanes = edgePairs_pairPlanes
	// 	.map(pairs => pairs.map(uniqueElements));

	// const edgePairs_planesCount = edgePairs_unqiuePlanes
	// 	.map(planes => planes.length);

	// const edgePairs_pairsPlaneLookups = edgePairs
	// 	.map(edges => edges
	// 		.map(edge => edges_faces[edge]
	// 			.map(face => faces_plane[face]))
	// 		.map(planes => {
	// 			const obj = [];
	// 			planes.forEach(p => { obj[p] = true; });
	// 			return obj;
	// 		}));

	// const edgePairs_pairsPlaneInCommon = edgePairs_pairsPlaneLookups
	// 	.map(([pair0, pair1], ep) => [
	// 		edgePairs_uniquePairPlanes[ep][0].filter(plane => pair0[plane]),
	// 		edgePairs_uniquePairPlanes[ep][1].filter(plane => pair1[plane]),
	// 	]);

	// const edgePairs_pairsPlaneNotInCommon = edgePairs_pairsPlaneLookups
	// 	.map(([pair0, pair1], ep) => [
	// 		edgePairs_uniquePairPlanes[ep][0].filter(plane => !pair0[plane]),
	// 		edgePairs_uniquePairPlanes[ep][1].filter(plane => !pair1[plane]),
	// 	]);

	// for every edge, which cluster(s) is it a member of.
	// ultimately, we are only interested in edges which join two clusters.
	// in the upcoming steps we are going to delete values from edges which:
	// - are a memeber of only one cluster (boundary edges)
	// - oh no. here it is. we can't do this yet.

	return {
		edgePairs,
		edgePairsClass,
		edges_facesSide,
		edgesEdgesOverlap,
		bentTortillas,
		// lines_planes,
		// edges_planes,
		// edgePairs_facePlanes,
	};
};

/**
 * @description
 * @param {FOLD} graph a FOLD object
 * @param {{
 *   faces_center: [number, number][],
 *   faces_cluster: number[],
 *   clusters_transform: number[][],
 * }}
 */
export const constraints3DEdgeClusters = (
	{ vertices_coords, edges_vertices, edges_faces, edges_foldAngle },
	{ faces_center, faces_cluster, clusters_transform },
	epsilon = EPSILON,
) => {
	// for every edge, which cluster(s) is it a member of.
	// ultimately, we are only interested in edges which join two clusters.
	// in the upcoming steps we are going to delete values from edges which:
	// - are a memeber of only one cluster (boundary edges)
	// - oh no. here it is. we can't do this yet.
	const edges_clusters = edges_faces
		.map(faces => faces.map(face => faces_cluster[face]));

	// remove edges which are members of only one cluster (boundary edges),
	edges_clusters
		.map((_, e) => e)
		.filter(e => edges_clusters[e].length !== 2)
		.forEach(e => delete edges_clusters[e]);

	// and remove edges whose two faces are from the same cluster.
	// todo: remove this. this is keeping us from finding bent-flat-tortillas
	edges_clusters
		.map(([a, b], e) => (a === b ? e : undefined))
		.filter(a => a !== undefined)
		.forEach(e => delete edges_clusters[e]);

	// console.log("edges_clusters", edges_clusters);

	const edgesFlat = edges_foldAngle.map(edgeFoldAngleIsFlat);

	const edgesEdgesOverlap = getEdgesEdgesCollinearOverlap(
		{ vertices_coords, edges_vertices },
		epsilon,
	);

	const overlappingEdgePairs = connectedComponentsPairs(edgesEdgesOverlap);

	// console.log("overlappingEdgePairs", overlappingEdgePairs);

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

	// console.log("pairs_edges", pairs_edges);

	// for each pair of edges, which sets is each edge a member of?
	const pairs_edges_clusters = pairs_edges
		.map(pair => pair.map(e => edges_clusters[e]));

	const pairs_sets = pairs_edges_clusters
		.map(sets => Array.from(new Set(sets.flat())));

	// for each edge-pair, create an object with keys as set-indices, and
	// values as arrays where each edge is inside
	const pairs_sets_edges = pairs_edges_clusters.map((pair, i) => {
		const hash = {};
		pair.flat().forEach(s => { hash[s] = []; });
		pair.forEach((sets, j) => sets
			.forEach(s => hash[s].push(pairs_edges[i][j])));
		return hash;
	});

	const pairs_edges_faces = pairs_edges
		.map(pair => pair.map(e => edges_faces[e]));

	// for every pair, make an object with planar-set index (key) and
	// an array of the edge's adjacent faces that lie in that plane (value)
	const pairs_sets_faces = pairs_edges_faces
		.map((faces, i) => {
			const hash = {};
			pairs_sets[i].forEach(s => { hash[s] = []; });
			faces.flat().forEach(f => hash[faces_cluster[f]].push(f));
			return hash;
		});

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

	const pairs_sets_facesSidesSameSide = pairs_sets_facesSides
		.map((pair, i) => {
			const hash = {};
			pairs_sets[i].forEach(set => {
				hash[set] = pair[set].reduce((a, b) => a && (b === pair[set][0]), true);
			});
			return hash;
		});

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

	return {
		pairs_data,
		edges_clusters,
	};
};

/**
 *
 */
export const constraints3DSolverCases = ({ edges_faces, pairs_data }) => {
	// a list of all bent-tortilla-tortilla edges
	const bentTortillaTortillaEdges = pairs_data.filter(data => {
		const testA = Object.values(data.sets)
			.map(el => el.faces.length === 2)
			.reduce((a, b) => a && b, true);
		const testB = Object.values(data.sets)
			.map(el => el.facesSameSide)
			.reduce((a, b) => a && b, true);
		return testA && testB;
	});

	// Y-junction
	const YJunctions = pairs_data.filter(data => {
		const testA = Object.values(data.sets).length === 3;
		const testB = Object.values(data.sets)
			.map(el => el.facesSameSide)
			.reduce((a, b) => a && b, true);
		return testA && testB;
	});

	// T-junction
	const TJunctions = pairs_data.filter(data => {
		const testA = Object.values(data.sets)
			.map(el => el.faces.length === 2)
			.reduce((a, b) => a && b, true);
		const sameSide = Object.values(data.sets)
			.map(el => el.facesSameSide);
		const testB = sameSide[0] !== sameSide[1];
		return testA && testB;
	});

	// bent-flat-tortillas
	// one bent tortilla-tortilla on top of one flat tortilla-tortilla
	const bentFlatTortillas = pairs_data.filter(data => {
		const threeInPlane = Object.values(data.sets)
			.filter(el => el.faces.length === 3)
			.shift();
		// console.log("threeInPlane", threeInPlane);
		const testA = threeInPlane !== undefined;
		if (!testA) { return false; }
		// valid facesSides will be either [1, 1, -1] or [-1, -1, 1] (in any order)
		// removing the cases [1, 1, 1] or [-1, -1, -1]
		// valid cases sums will be +1 or -1.
		const sum = threeInPlane.facesSides.reduce((a, b) => a + b, 0);
		// console.log("sum", sum);
		const testB = Math.abs(sum) === 1;
		if (!testB) { return false; }
		const sameSideFaces = threeInPlane.faces
			.filter((_, i) => threeInPlane.facesSides[i] === sum);
		// console.log("sameSideFaces", sameSideFaces);

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
		// console.log("isAdjacent", isAdjacent);
		// we want the case where the faces are non-adjacent.
		const testC = !isAdjacent;
		return testA && testB && testC;
	});
	// if (bentFlatTortillas.length) {
	// 	console.log("This model contains the third case", bentFlatTortillas);
	// }

	return {
		YJunctions,
		TJunctions,
		bentFlatTortillas,
		bentTortillaTortillaEdges,
	};
};

/**
 * @description This all-encompassing method is a coroutine of
 * makeSolverConstraints3D, this method calls all of the 3D related
 * constraint construction methods, resulting in a list of coplanar subgraphs,
 * the face-pairs to be solved, an additional list of 3D-bent-tortilla-tortillas
 * solver conditions, and solutions to specific arrangements of edges and faces
 * in 3D in which we are able to determine layer orderings between face pairs.
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {{
 *   clusters_graph: FOLD[],
 *   faces_winding: boolean[],
 *   faces_polygon: [number, number][][],
 *   facesFacesOverlap: number[][],
 *   bentTortillaTortillas: TortillaTortillaConstraint[],
 *   facePairs: string[],
 *   orders: { [key: string]: number },
 * }}
 */
export const constraints3DSetup = ({
	vertices_coords, edges_vertices, edges_faces, edges_assignment, edges_foldAngle,
	faces_vertices, faces_edges, faces_faces,
}, epsilon = EPSILON) => {
	// find all coplanar-overlapping clusters, create subgraphs for each one,
	// move all vertices into the XY plane for each planar cluster, compute
	// face-face overlaps, and find all overlapping face-pairs for the solver.
	const {
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

	//
	const {
		pairs_data,
		edges_clusters,
	} = constraints3DEdgeClusters({
		vertices_coords,
		edges_vertices,
		edges_faces,
		edges_foldAngle,
	}, {
		faces_center,
		faces_plane,
		faces_cluster,
		clusters_transform,
	}, epsilon);

	// conditions where two collinear edges overlap each other and the
	// four faces involved align in planes in ways which can be classified
	// into four categories, three of which result in face-order solutions
	// and one (bentTortillaTortillaEdges) result in more conditions for
	// the solver to solve.
	const {
		YJunctions,
		TJunctions,
		bentFlatTortillas,
		bentTortillaTortillaEdges,
	} = constraints3DSolverCases({ edges_faces, pairs_data });

	// convert bentTortillaTortillaEdges into well-formatted tortilla-tortilla
	// conditions ready to pass off to the solver.
	const bentTortillaTortillas = makeBentTortillas(
		{ edges_faces },
		{ faces_cluster, faces_winding, bentTortillaTortillaEdges },
	);

	// solutions where an edge with a 3D fold angle is crossing somewhere
	// in the interior of another face, where one of the edge's face's is
	// co-planar with the face, this results in a known layer ordering
	// between two faces.
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

	// solutions where two collinear edges overlap each other, and the
	// four faces involved
	const ordersEdgeEdge = solveEdgeEdgeOverlapOrders(
		{ edges_foldAngle, faces_winding },
		YJunctions,
		TJunctions,
		bentFlatTortillas,
	);

	/** @type {{ [key: string]: number }} */
	const orders = {
		...ordersEdgeFace,
		...ordersEdgeEdge,
	};

	return {
		clusters_graph,
		faces_winding,
		faces_polygon,
		facesFacesOverlap,
		bentTortillaTortillas,
		facePairs,
		orders,
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
	//
	const {
		clusters_graph,
		faces_winding,
		faces_polygon,
		facesFacesOverlap,
		bentTortillaTortillas,
		facePairs,
		orders,
	} = constraints3DSetup({
		vertices_coords,
		edges_vertices,
		edges_faces,
		edges_assignment,
		edges_foldAngle,
		faces_vertices,
		faces_edges,
		faces_faces,
	}, epsilon);

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
	tortilla_tortilla.push(...bentTortillaTortillas);

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
