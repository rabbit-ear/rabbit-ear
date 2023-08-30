/**
 * Rabbit Ear (c) Kraft
 */
import { EPSILON } from "../../math/general/constant.js";
import {
	includeL,
	includeS,
} from "../../math/general/function.js";
import {
	magnitude2,
	normalize2,
	cross2,
	add2,
	subtract2,
	scale2,
} from "../../math/algebra/vector.js";
import { clusterSortedGeneric } from "../../general/arrays.js";
import { facesContainingPoint } from "../nearest.js";
import {
	makeEdgesVector,
	makeFacesEdgesFromVertices,
	makeEdgesFacesUnsorted,
} from "../make.js";
import { makeVerticesCoordsFlatFolded } from "../vertices/folded.js";
import { makeFacesWinding } from "../faces/winding.js";
import { invertAssignment } from "../../fold/spec.js";
/**
 *
 */
export const intersectParameterLineLine = (
	a,
	b,
	aDomain = includeL,
	bDomain = includeL,
	epsilon = EPSILON,
) => {
	// a normalized determinant gives consistent values across all epsilon ranges
	const det_norm = cross2(normalize2(a.vector), normalize2(b.vector));
	// lines are parallel
	if (Math.abs(det_norm) < epsilon) { return undefined; }
	const determinant0 = cross2(a.vector, b.vector);
	const determinant1 = -determinant0;
	const a2b = [b.origin[0] - a.origin[0], b.origin[1] - a.origin[1]];
	const b2a = [-a2b[0], -a2b[1]];
	const t0 = cross2(a2b, b.vector) / determinant0;
	const t1 = cross2(b2a, a.vector) / determinant1;
	if (aDomain(t0, epsilon / magnitude2(a.vector))
		&& bDomain(t1, epsilon / magnitude2(b.vector))) {
		return {
			point: add2(a.origin, scale2(a.vector, t0)),
			a: t0,
			b: t1,
		};
	}
	return undefined;
};
/**
 *
 */
const getContainingFace = ({ vertices_coords, faces_vertices }, point) => {
	const faces = facesContainingPoint({ vertices_coords, faces_vertices }, point);
	if (faces.length === 0) { return undefined; }
	if (faces.length === 1) { return faces[0]; }
	// const remainingPolygons =
	return faces[0];
};
/**
 * @description Find all intersections between a segment and all edges
 * of a 2D graph. The method is hard-coded to be inclusive, include both
 * the endpoints of the segment, and the endpoints of each edge.
 * @param {object} a FOLD graph
 * @param {number[]} point1, the first point of the segment
 * @param {number[]} point2, the second point of the segment
 * @returns {number[]} array with holes where the
 * index is the edge number and the value is the intersection point
 * @linkcode Origami ./src/graph/intersect.js 73
 */
const getEdgesLineIntersection = ({
	vertices_coords, edges_vertices,
}, { vector, origin }, epsilon = EPSILON, segmentFunc = includeS) => edges_vertices
	.map(vertices => {
		const edgeCoords = vertices.map(v => vertices_coords[v]);
		const edgeVector = subtract2(edgeCoords[1], edgeCoords[0]);
		const edgeLine = { vector: edgeVector, origin: edgeCoords[0] };
		return intersectParameterLineLine(
			edgeLine,
			{ vector, origin },
			segmentFunc,
			includeL,
			epsilon,
		);
	});
/**
 *
 */
const repeatFoldLine = ({
	vertices_coords, edges_vertices, edges_faces, edges_foldAngle, edges_assignment,
	faces_vertices, faces_edges, faces_faces,
}, { vector, origin }, assignment = "V", epsilon = EPSILON) => {
	if (!edges_faces) {
		if (!faces_edges) {
			faces_edges = makeFacesEdgesFromVertices({ edges_vertices, faces_vertices });
		}
		edges_faces = makeEdgesFacesUnsorted({ edges_vertices, faces_edges });
	}
	/**
	 *
	 */
	const edgePairSharedFace = (a, b) => {
		const hash = {};
		edges_faces[a].forEach(f => { hash[f] = true; });
		for (let i = 0; i < edges_faces[b].length; i += 1) {
			if (hash[edges_faces[b][i]]) { return edges_faces[b][i]; }
		}
		return undefined;
	};

	const startFace = getContainingFace({ vertices_coords, faces_vertices }, origin);
	const oppositeAssignment = invertAssignment(assignment);
	const vertices_coordsFolded = makeVerticesCoordsFlatFolded({
		vertices_coords,
		edges_vertices,
		edges_foldAngle,
		edges_assignment,
		faces_vertices,
		faces_faces,
	}, startFace);
	// make a faces_winding, and ensure that our startFace is upright (true)
	const faces_winding = makeFacesWinding({
		vertices_coords: vertices_coordsFolded,
		faces_vertices,
	});
	if (!faces_winding[startFace]) {
		faces_winding.forEach((w, i) => { faces_winding[i] = !w; });
	}
	const edgesIntersections = getEdgesLineIntersection(
		{ vertices_coords: vertices_coordsFolded, edges_vertices },
		{ vector, origin },
		epsilon,
	);
	edgesIntersections.forEach((el, edge) => {
		if (el === undefined) { return; }
		el.edge = edge;
	});

	// restarting here. big commenting out.
	const faces_solution = [];
	const faces_complex = [];
	faces_edges
		.map(edges => edges
			.map(edge => edgesIntersections[edge])
			.filter(a => a !== undefined))
		.forEach((solutions, f) => {
			switch (solutions.length) {
			case 0:
			case 1: break;
			case 2: faces_solution[f] = solutions; break;
			default: faces_complex[f] = solutions; break;
			}
		});
	// process complex faces
	faces_complex.forEach((solutions, f) => {
		solutions.sort((a, b) => a.b - b.b);
		const clusters = clusterSortedGeneric(
			solutions,
			(a, b) => Math.abs(a.b - b.b) < epsilon * 2,
		).map(cluster => cluster.map(index => solutions[index]));
		// face is convex
		if (clusters.length === 2) {
			faces_solution[f] = [clusters[0][0], clusters[clusters.length - 1][0]];
		}
	});
	// process complex faces. done
	const edges_origin = edges_vertices.map(ev => vertices_coords[ev[0]]);
	const edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });

	return faces_solution.map((solutions, f) => ({
		edges: solutions.map(el => el.edge),
		assignment: faces_winding[f] ? assignment : oppositeAssignment,
		points: solutions
			.map(solution => add2(
				scale2(edges_vector[solution.edge], solution.a),
				edges_origin[solution.edge],
			)),
	}));

	/*
	// sort these intersections using the line's (not edges') parameter (el.b)
	const intersectionsSorted = edgesIntersections
		.filter(a => a !== undefined)
		.sort((a, b) => a.b - b.b);
	// clusters of edge indices, where each cluster's edges contain
	// an intersection in "edgesIntersections" that is at a similar position
	// to all the other edge's intersections in the same cluster.
	const edgesClustered = clusterSortedGeneric(
		intersectionsSorted,
		(a, b) => Math.abs(a.b - b.b) < epsilon * 2,
	).map(cluster => cluster.map(index => intersectionsSorted[index].edge));
	// intersection events are now sorted in the direction of the line.
	// walk down the line and pair each event with the next one. each
	// event may be a cluster of events, so we will be making pairs of
	// every permutation of an edge from the first cluster to an edge
	// from the second.
	// however, many of the cluster-to-cluster pairing will be filtered out,
	// we only want to keep pairings which join two edges that are members
	// of the same face, as it's possible to join two edges which may look
	// neighborly in the folded state, but in the crease pattern actually have
	// nothing to do with each other.
	// additionally, for every cluster-to-cluster pairing, there should
	// never be two pairs that cross the same face (this happens when a
	// line crosses a vertex shared by two edges), so when we make a cluster-
	// to-cluster pairing and assign it to a face, we can skip any other
	// pairings which relate to the same face.

	const facesCrossings = [];

	for (let i = 0; i < edgesClustered.length; i += 1) {
		const aCluster = edgesClustered[i];
		const bCluster = edgesClustered[(i + 1) % edgesClustered.length];
		for (let a = 0; a < aCluster.length; a += 1) {
			for (let b = 0; b < bCluster.length; b += 1) {
				const sharedFace = edgePairSharedFace(aCluster[a], bCluster[b]);
				if (sharedFace === undefined) { continue; }
				if (facesCrossings[sharedFace]) { continue; }
				facesCrossings[sharedFace] = [aCluster[a], bCluster[b]];
			}
		}
	}
	const edges_origin = edges_vertices.map(ev => vertices_coords[ev[0]]);
	const edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	const faces_segments = facesCrossings.map((edges, f) => ({
		edges,
		assignment: faces_winding[f] ? assignment : oppositeAssignment,
		points: edges
			.map(edge => add2(
				scale2(edges_vector[edge], edgesIntersections[edge].a),
				edges_origin[edge],
			)),
	}));

	return faces_segments;
	*/
};

export default repeatFoldLine;
