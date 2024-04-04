/**
 * Rabbit Ear (c) Kraft
 */
import {
	arrayArrayToLookupArray,
} from "../general/array.js";
import {
	connectedComponentsPairs,
} from "../graph/connectedComponents.js";
import {
	invertFlatToArrayMap,
} from "../graph/maps.js";
import {
	joinOrderObjects,
} from "./general.js";

/**
 * @description Given a situation where two non-boundary edges are
 * parallel overlapping, and two of the faces lie in the same plane,
 * and need to be layer-solved. Consult the fold-angles, which imply the
 * position of the two other faces, this will determine the layer order
 * between the two faces. (given that the special case where both edges
 * are flat 0 angles which would be the tortilla-tortilla 2D case).
 * @param {{ edges_foldAngle: number[], faces_winding: boolean[] }} graph
 * a FOLD object with faces_winding
 * @param {number[]} edges
 * @param {number[]} faces
 */
export const solveFacePair3D = ({ edges_foldAngle, faces_winding }, edges, faces) => {
	// so the idea is, if we align the faces within the plane, meaning that if
	// a face is flipped, we "flip" it by negating the foldAngle, then we can
	// say that the face (edge) with the larger fold angle should be on top.
	// then we have to work backwards-if we flipped a face, we need to flip
	// the order, or if the faces are not ordered where A < B, also flip the order.
	const facesAligned = faces.map(face => faces_winding[face]);
	const edgesFoldAngleAligned = edges
		.map(edge => edges_foldAngle[edge])
		.map((angle, i) => (facesAligned[i] ? angle : -angle));
	const indicesInOrder = edgesFoldAngleAligned[0] > edgesFoldAngleAligned[1];
	const facesInOrder = faces[0] < faces[1];
	// 0 becomes 1, 1 becomes 2.
	const orderValue = (indicesInOrder ^ facesInOrder) + 1;
	const faceKey = (facesInOrder
		? faces.join(" ")
		: [faces[1], faces[0]].join(" "));
	return { [faceKey]: orderValue };
};

/**
 * - 0: bent (3D)
 * - 1: tortilla
 * - 2: taco
 * @returns {number[]} a classification for edges
 */
const getEdgesClass = ({ edges_faces, faces_plane, facesFacesLookup }) => {
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

/**
 *
 */
export const getSolvable3DEdgePairs = ({
	edges_faces,
	faces_plane,
	edgePairs,
	facesFacesLookup,
}) => {
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

	// classes:
	// undefined: unknown
	// 0: no face-overlaps to solve (ignore)
	// 0: flat (ignore)
	// 1: T-junction (generates order)
	// 2: Y-junction (generates order)
	// 3: bent-flat-tortillas (generates order)
	// 4: bent-tortillas (generates tortilla_tortilla)
	// 5: bent-tortilla-flat-taco (generates taco_tortilla)

	const edges_class = getEdgesClass({ edges_faces, faces_plane, facesFacesLookup });

	const edgePairsClass = edgePairs.map(edges => {
		if (edges_class[edges[0]] && edges_class[edges[1]]) { return 0; }
		const classes = edges.map(edge => edges_class[edge]);
		const [f0, f1, f2, f3] = edges.flatMap(e => edges_faces[e]);
		const [p0, p1, p2, p3] = edges
			.flatMap(edge => edges_faces[edge]
				.map(face => faces_plane[face]));

		// true if any one pair's face overlaps any face from the other pair.
		const interPairOverlap = facesFacesLookup[f0][f2]
			|| facesFacesLookup[f0][f3]
			|| facesFacesLookup[f1][f2]
			|| facesFacesLookup[f1][f3];

		if (!interPairOverlap) { return 0; }

		// bent-flat tortillas
		// true if either includes "tortilla" and interPairOverlap
		if (classes.includes(1)) { return 3; }

		// bent-tortilla-flat-taco
		// true if either includes "taco" and interPairOverlap
		if (classes.includes(2)) { return 5; }

		// Y-junction
		// A1-B and A2-C, where A1-A2 overlap
		if ((p0 === p2 && p1 !== p3 && facesFacesLookup[f0][f2])
			|| (p0 === p3 && p1 !== p2 && facesFacesLookup[f0][f3])
			|| (p1 === p2 && p0 !== p3 && facesFacesLookup[f1][f2])
			|| (p1 === p3 && p0 !== p2 && facesFacesLookup[f1][f3])) {
			return 2;
		}

		// T-junction
		// A1-B1 and A2-B2, where A1-A2 overlap and B1-B2 do NOT overlap
		if ((p0 === p2 && p1 === p3 && facesFacesLookup[f0][f2] && !facesFacesLookup[f1][f3])
			|| (p0 === p3 && p1 === p2 && facesFacesLookup[f0][f3] && !facesFacesLookup[f1][f2])
			|| (p1 === p2 && p0 === p3 && facesFacesLookup[f1][f2] && !facesFacesLookup[f0][f3])
			|| (p1 === p3 && p0 === p2 && facesFacesLookup[f1][f3] && !facesFacesLookup[f0][f2])) {
			return 1;
		}

		// bent-tortillas
		// A1-B1 and A2-B2, where A1-A2 overlap and B1-B2 overlap
		if ((p0 === p2 && p1 === p3 && facesFacesLookup[f0][f2] && facesFacesLookup[f1][f3])
			|| (p0 === p3 && p1 === p2 && facesFacesLookup[f0][f3] && facesFacesLookup[f1][f2])
			|| (p1 === p2 && p0 === p3 && facesFacesLookup[f1][f2] && facesFacesLookup[f0][f3])
			|| (p1 === p3 && p0 === p2 && facesFacesLookup[f1][f3] && facesFacesLookup[f0][f2])) {
			return 4;
		}

		return 6;
	});

	// 0: ignore the first entry
	// 1: T-junction (generates order)
	// 2: Y-junction (generates order)
	// 3: bent-flat-tortillas (generates order)
	// 4: bent-tortillas (generates tortilla_tortilla)
	// 5: bent-tortilla-flat-taco (generates taco_tortilla)
	const [
		,
		tJunctions,
		yJunctions,
		bentFlatTortillas,
		bentTortillas,
		bentTortillasFlatTaco,
		uncaught
	] = invertFlatToArrayMap(edgePairsClass);

	if (uncaught && uncaught.length) {
		console.warn("getSolvable3DEdgePairs uncaught edge pairs");
	}

	return {
		tJunctions: (tJunctions || []),
		yJunctions: (yJunctions || []),
		bentFlatTortillas: (bentFlatTortillas || []),
		bentTortillas: (bentTortillas || []),
		bentTortillasFlatTaco: (bentTortillasFlatTaco || []),
	};
};

/**
 *
 */
export const constraints3DEdges = ({
	edges_faces,
	edges_foldAngle,
}, {
	faces_plane,
	faces_winding,
	facesFacesOverlap,
	edgesEdgesOverlap, // ensure this works even if the user passes in
	// edges with boundary edges.
}) => {
	// all pairings of overlapping edges, including pairs of edges which
	// hold no value to us at this stage
	const edgePairs = connectedComponentsPairs(edgesEdgesOverlap);

	// const edges_facesSide = makeEdgesFacesSide3D(
	// 	{ vertices_coords, edges_faces, faces_vertices, faces_center },
	// 	{ lines, edges_line, planes_transform, faces_plane }
	// );

	const facesFacesLookup = arrayArrayToLookupArray(facesFacesOverlap);

	const {
		tJunctions,
		yJunctions,
		bentFlatTortillas,
		bentTortillas,
		bentTortillasFlatTaco,
	} = getSolvable3DEdgePairs({
		edges_faces,
		faces_plane,
		edgePairs,
		facesFacesLookup,
	});

	// todo: as we build the dictionary we need to make sure we aren't
	// overwriting the same key with different values, we need to throw
	// an error.
	const solveYTJunction = (edges) => {
		const [f0, f1, f2, f3] = edges.flatMap(e => edges_faces[e]);
		// one face from edge[0] (f0 or f1) should be overlapping with another
		// face from edge[1] (f2 or f3). find and get this pair of faces.
		const faces = [[f0, f2], [f0, f3], [f1, f2], [f1, f3]]
			.filter(([a, b]) => facesFacesLookup[a][b])
			.shift();
		if (!faces) { return undefined; }
		return solveFacePair3D({ edges_foldAngle, faces_winding }, edges, faces);
	};

	/**
	 * @description This creates a taco-tortilla constraint
	 * @param {[number, number]} edges a pair of overlapping edges
	 * already established to form a bent-tortilla-flat-taco combo.
	 * @returns {TacoTortillaConstraint | undefined}
	 */
	const makeBentTortillaFlatTaco = (edges) => {
		const [f0, f1, f2, f3] = edges.flatMap(e => edges_faces[e]);
		// every permutation of 3 faces (the fourth face is ignored in the overlap)
		// the order of the 3 faces is already in TacoTortillaConstraint form, where
		// the first and last are connected (taco) and the middle face is the tortilla
		return [[f0, f2, f1], [f2, f1, f3], [f2, f0, f3], [f0, f3, f1]]
			.filter(([a, b, c]) => facesFacesLookup[a][b] && facesFacesLookup[a][c])
			.shift();
	};

	/**
	 * @description This creates a tortilla-tortilla constraint
	 * @param {[number, number]} edges a pair of overlapping edges
	 * already established to form a bent-tortilla combo.
	 * @returns {TortillaTortillaConstraint | undefined}
	 */
	const makeBentTortillas = (edges) => {
		// all pairwise combinations of edges that create a 3D tortilla-tortilla
		// for each tortilla-tortilla edge, get the four adjacent faces involved
		/** @type {[[number, number], [number, number]]} */
		const tortilla_tortilla = edges
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

	// - Y-junction: A1-B and A2-C, where A1-A2 overlap
	// - T-junction: A1-B1 and A2-B2, where A1-A2 overlap and B1-B2 do NOT overlap
	// - bent-flat-tortillas: A1-A2 and A3-B, where A1-A2 do NOT overlap,
	//   but A3 does overlap with either A1 or A2
	// - bent-tortilla-flat-taco: A1-A2 and A3-B, where A1-A2-A3 all overlap
	// - bent-tortillas: A1-B1 and A2-B2, where A1-A2 overlap and B1-B2 overlap
	// additional:
	// - four-plane: A-B and C-D

	const tOrders = tJunctions
		.map(i => edgePairs[i])
		.map(solveYTJunction);

	const yOrders = yJunctions
		.map(i => edgePairs[i])
		.map(solveYTJunction);

	const bentFlatTortillaOrders = bentFlatTortillas
		.map(i => edgePairs[i])
		.map(solveYTJunction);

	const tortilla_tortilla = bentTortillas
		.map(i => edgePairs[i])
		.map(makeBentTortillas);

	const taco_tortilla = bentTortillasFlatTaco
		.map(i => edgePairs[i])
		.map(makeBentTortillaFlatTaco);

	const orders = joinOrderObjects([
		...tOrders,
		...yOrders,
		...bentFlatTortillaOrders,
	]);

	return {
		orders,
		tortilla_tortilla,
		taco_tortilla,
	};
};

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
