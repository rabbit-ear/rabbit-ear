/**
 * Rabbit Ear (c) Kraft
 */
import {
	chooseTwoPairs,
} from "../../general/array.js";
import {
	EPSILON,
} from "../../math/constant.js";
import {
	dot,
	cross2,
	subtract2,
} from "../../math/vector.js";
import {
	multiplyMatrix4Vector3,
} from "../../math/matrix4.js";
import {
	doRangesOverlap,
} from "./general.js";
import {
	edgeFoldAngleIsFlat,
} from "../../fold/spec.js";
import {
	getEdgesLine,
} from "../../graph/edges/lines.js";
import {
	invertFlatToArrayMap,
} from "../../graph/maps.js";
import {
	makeEdgesCoords,
} from "../../graph/make.js";
/**
 *
 */
const getOverlappingCollinearEdges = ({
	vertices_coords, edges_vertices,
}, epsilon = EPSILON) => {
	const {
		lines,
		edges_line,
	} = getEdgesLine({ vertices_coords, edges_vertices }, epsilon);
	// this is not the unique vector for each line, for every edge that is
	// inside a shared collinear group they all have the same vector (important).
	const edges_vector = edges_line.map(line => lines[line].vector);
	const edges_dots = makeEdgesCoords({ vertices_coords, edges_vertices })
		.map((points, e) => points
			.map(point => dot(edges_vector[e], point)));
	// todo: n^2. line sweep can improve. could be only in rare cases though
	// that this is really an issue. inside each lines_edges group is typically
	// only a small number of edges anyway. this is what is being n^2 compared.
	return invertFlatToArrayMap(edges_line)
		.flatMap(edges => chooseTwoPairs(edges)
			.filter(pair => (doRangesOverlap(...pair.map(n => edges_dots[n])))));
};
/**
 * @description This method finds all overlapping parallel edges and
 * classifies them into one of a few groups. This classification is
 * a important part of the algorithm and hopefully will be described
 * at length some place else, a bit too involved to describe here.
 * One class is the bent-tortilla-tortillas, for example, which are
 * returned as "tortillaTortillaEdges".
 */
export const getOverlappingParallelEdgePairs = ({
	vertices_coords, edges_vertices, edges_faces, edges_foldAngle, faces_center,
}, edges_sets, faces_set, sets_transformXY, epsilon = EPSILON) => {
	const edgesFlat = edges_foldAngle.map(edgeFoldAngleIsFlat);
	const pairs_edges = getOverlappingCollinearEdges(
		{ vertices_coords, edges_vertices },
		epsilon,
	).map(pair => (pair[0] < pair[1] ? pair : pair.slice().reverse()))
		// filter entirely-flat-folded edge pairs
		.filter(p => !(edgesFlat[p[0]] && edgesFlat[p[1]]))
		// filter any pairs which contain a boundary edge
		.filter(pair => pair
			.map(edge => edges_faces[edge].length === 2)
			.reduce((a, b) => a && b, true))
		// filter edges which don't contain edges_sets - why again?
		.filter(pair => pair
			.map(edge => edges_sets[edge] !== undefined)
			.reduce((a, b) => a && b, true))
		// filter sets that have 4 planes, all edges' faces are in unique planes.
		// there is nothing to solve here.
		.filter(pair => Array
			.from(new Set(pair.flatMap(e => edges_sets[e]))).length !== 4);
	// console.log("pairs_edges", pairs_edges);
	// for each pair of edges, which sets is each edge a member of?
	const pairs_edges_sets = pairs_edges
		.map(pair => pair.map(e => edges_sets[e]));
	// console.log("pairs_edges_sets", pairs_edges_sets);
	const pairs_sets = pairs_edges_sets
		.map(sets => Array.from(new Set(sets.flat())));
	// console.log("pairs_sets", pairs_sets);
	// for each edge-pair, create an object with keys as set-indices, and
	// values as arrays where each edge is inside
	const pairs_sets_edges = pairs_edges_sets.map((pair, i) => {
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
			faces.flat().forEach(f => hash[faces_set[f]].push(f));
			return hash;
		});
	// console.log("pairs_sets_faces", pairs_sets_faces);
	const edges_coords = makeEdgesCoords({ vertices_coords, edges_vertices });
	const pairs_sets_2dEdges = pairs_sets.map((sets, i) => {
		const segment3D = edges_coords[pairs_edges[i][0]];
		const hash = {};
		sets.forEach(set => {
			hash[set] = segment3D
				.map(p => multiplyMatrix4Vector3(sets_transformXY[set], p))
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
	return {
		tortillaTortillaEdges,
		solvable1,
		solvable2,
		solvable3: [],
	};
};
/**
 * @description Not all planar sets will intersect but when they do,
 * they intersect along a line, and this line will have one or more edges.
 * Find the pairs of planar sets which do contain multiple edges along their
 * intersection and then find all pairwise combinations of those edges
 * which overlap. This creates a list of pairs of edges where the four adjacent
 * faces involved all create a tortilla-tortilla condition, albeit with a
 * non-zero dihedral angle along their shared line.
 * Note: this assumes the graph is a valid manifold (edges with <= 2 faces).
 * @param {FOLD} graph the modified fold graph
 * @param {number[][]} edges_sets which planar set is this edge a member of,
 * we have removed all edges which only inhabit one. all will contain two now.
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][]} an array of tortilla-tortilla edge pairs, where each
 * is an array of two collinear edges that overlap each other in 3D space.
 */
// export const getOverlappingCollinearEdgePairs = ({
// 	vertices_coords, edges_vertices, edges_faces,
// }, edges_sets, faces_set, epsilon = EPSILON) => {
// 	// all overlapping collinear pairs of edges (in 2D or 3D)
// 	const allOverlappingEdges = getOverlappingCollinearEdges({
// 		vertices_coords, edges_vertices,
// 	}, epsilon).map(pair => (pair[0] < pair[1] ? pair : pair.slice().reverse()));
// 	// crossingSets is a pair of planar-group-indices as a string: "3 15".
// 	// crossingSets_edges will be a dictionary with pair strings, and the
// 	// value is an array of all edges which lie along this intersection line.
// 	const crossingSets_edges = {};
// 	edges_sets.map(arr => arr.join(" ")).forEach((key, i) => {
// 		if (crossingSets_edges[key] === undefined) {
// 			crossingSets_edges[key] = [];
// 		}
// 		crossingSets_edges[key].push(i);
// 	});
// 	// we are looking for tortilla-tortilla cases, we need two or more edges
// 	// that overlap each other. remove an entry if it contains only one edge.
// 	Object.keys(crossingSets_edges)
// 		.filter(key => crossingSets_edges[key].length < 2)
// 		.forEach(key => delete crossingSets_edges[key]);
// 	// now, every intersection between two planes contains two or more edges.
// 	// make a new choose-two list with every pairwise edge combination,
// 	// then filter out any pairs which do not geometrically overlap.
// 	const lEdges = Object.keys(crossingSets_edges).flatMap(key => {
// 		// each crossingSet has only one intersection line vector.
// 		// compute it here to prevent redundant work.
// 		const edgesPairs = chooseTwoPairs(crossingSets_edges[key]);
// 		const firstEdge = edgesPairs[0][0];
// 		const coords = edges_vertices[firstEdge].map(v => vertices_coords[v]);
// 		const vector = normalize(subtract(coords[1], coords[0]));
// 		// filter out the edge pairs which do not overlap.
// 		return edgesPairs.filter(pair => (
// 			doEdgesOverlap({ vertices_coords, edges_vertices }, pair, vector, epsilon)
// 		));
// 	}).map(pair => (pair[0] < pair[1] ? pair : pair.slice().reverse()));
// 	// now remove the intersection of coplanar edges from allOverlappingEdges.
// 	// the result will be waterbomb edges (3)
// 	// todo: need to filter out so that waterbomb edges contains at least some
// 	// faces which are in the same plane.
// 	// console.log("crossingSets_edges", crossingSets_edges);
// 	const allOverlapKeys = {};
// 	allOverlappingEdges.forEach((pair, i) => {
// 		allOverlapKeys[pair.join(" ")] = i;
// 	});
// 	// console.log("allOverlapKeys", allOverlapKeys);
// 	lEdges.forEach(pair => delete allOverlapKeys[pair.join(" ")]);
// 	const nonLEdges = Object.values(allOverlapKeys)
// 		.map(i => allOverlappingEdges[i]);
// 	const nonLEdgesNoBoundaries = nonLEdges
// 		.filter(pair => pair
// 			.map(edge => edges_faces[edge].length === 2)
// 			.reduce((a, b) => a && b, true));
// 		// .filter(p => edges_faces[p[0]][0] !== edges_faces[p[1]][0]
// 		// 	&& edges_faces[p[0]][0] !== edges_faces[p[1]][1]
// 		// 	&& edges_faces[p[0]][1] !== edges_faces[p[1]][0]
// 		// 	&& edges_faces[p[0]][1] !== edges_faces[p[1]][1]);
// 	const nonLEdges_faces = nonLEdgesNoBoundaries
// 		.map(pair => pair.map(e => edges_faces[e]));
// 	const nonLEdges_facesSets = nonLEdges_faces
// 		.map(pair => pair.map(faces => faces.map(f => faces_set[f])));
// 	const nonLEdges_facesSetSimilar = nonLEdges_facesSets
// 		.map(pair => pair.map(facesSet => facesSet[0] === facesSet[1]));
// 	console.log("nonLEdges_faces", nonLEdges_faces);
// 	console.log("nonLEdges_facesSets", nonLEdges_facesSets);
// 	console.log("nonLEdges_facesSetSimilar", nonLEdges_facesSetSimilar);
// 	return {
// 		lEdges,
// 		tEdges: nonLEdgesNoBoundaries,
// 	};
// };
