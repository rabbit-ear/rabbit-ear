/**
 * Rabbit Ear (c) Kraft
 */
import { EPSILON } from "../../math/constant.js";
import {
	include,
	includeL,
	includeS,
	exclude,
} from "../../math/compare.js";
import {
	magnitude2,
	normalize2,
	cross2,
	add2,
	subtract2,
	scale2,
} from "../../math/vector.js";
import { overlapConvexPolygonPoint } from "../../math/overlap.js";
import { clusterSortedGeneric } from "../../general/cluster.js";
import { facesContainingPoint } from "../nearest.js";
import {
	makeEdgesVector,
	makeFacesEdgesFromVertices,
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
const getContainingFace = ({ vertices_coords, faces_vertices }, point, vector) => {
	const facesInclusive = facesContainingPoint(
		{ vertices_coords, faces_vertices },
		point,
		include,
	);
	switch (facesInclusive.length) {
	case 0: return undefined;
	case 1: return facesInclusive[0];
	default: break; // continue search by nudging point
	}
	const nudgePoint = add2(point, scale2(vector, 1e-2));
	const polygons = facesInclusive
		.map(face => faces_vertices[face]
			.map(v => vertices_coords[v]));
	const facesExclusive = facesInclusive
		.filter((face, i) => overlapConvexPolygonPoint(polygons[i], nudgePoint, exclude));
	switch (facesExclusive.length) {
	// backtrack and try inclusive using nudge point and facesInclusive
	case 0: return facesInclusive
		.filter((face, i) => overlapConvexPolygonPoint(polygons[i], nudgePoint, include))
		.shift();
	case 1: return facesExclusive[0];
		// all faces lie on the point so it shouldn't matter
	default: return facesExclusive[0];
	}
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
	vertices_coords, edges_vertices, edges_foldAngle, edges_assignment,
	faces_vertices, faces_edges, faces_faces,
}, { vector, origin }, assignment = "V", epsilon = EPSILON) => {
	if (!faces_edges) {
		faces_edges = makeFacesEdgesFromVertices({ edges_vertices, faces_vertices });
	}
	const startFace = getContainingFace(
		{ vertices_coords, faces_vertices },
		origin,
		vector,
	);
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
	// intersect the line with every edge. the intersection should be inclusive
	// with respect to the segment endpoints. this will cause duplicate points
	// for every face when a line crosses exactly at its vertex, but this is
	// necessary because we need to know this point, so we will filter later.
	const edgesIntersections = getEdgesLineIntersection(
		{ vertices_coords: vertices_coordsFolded, edges_vertices },
		{ vector, origin },
		epsilon,
	).map((el, edge) => (el === undefined ? undefined : { ...el, edge }));
	// edge line data for the crease pattern state, needed to remap the edge
	// intersections, which were calculated in the folded state, into points
	// in the crease pattern state.
	const edges_origin = edges_vertices.map(ev => vertices_coords[ev[0]]);
	const edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	// for every face, using its faces_edges, gather a list of all of the
	// face's edge intersections. faces with fewer than 2 will be thrown out.
	const facesPreCluster = [];
	faces_edges
		.map(edges => edges
			.map(edge => edgesIntersections[edge])
			.filter(a => a !== undefined))
		.forEach((solutions, f) => {
			switch (solutions.length) {
			case 0:
			case 1: break;
			default: facesPreCluster[f] = solutions; break;
			}
		});
	// this epsilon function will compare the object's "b" property
	// which is the intersections's "b" paramter (line parameter).
	const epsilonEqual = (a, b) => Math.abs(a.b - b.b) < epsilon * 2;
	// every face now has two or more intersections events. we need to
	// filter out the invalid cases, which include:
	// - line outside face, but face intersected at a vertex, which
	//   registers as two intersections because it touches two edges.
	// - line overlaps face, but face is non-convex, so there are more than
	//   two clusters of points (sorted geometrically)
	// clustering vertices (along the line's parameter) and only accepting
	// two hopefully solves all the issues that I haven't considered as well.
	const faces_solution = [];
	facesPreCluster
		// sort the solutions along the line's intersection parameter
		.map(solutions => solutions.sort((a, b) => a.b - b.b))
		// cluster the solutions along the line's intersection parameter.
		.map(solutions => clusterSortedGeneric(solutions, epsilonEqual)
			.map(cluster => cluster.map(index => solutions[index])))
		.forEach((clusters, f) => {
			// length === 1 is ignored because the solution is degenerate,
			// length > 2 is ignored because the polygon is non convex, however,
			// todo: we could add this feature by %2 including area between events.
			if (clusters.length === 2) {
				faces_solution[f] = [clusters[0][0], clusters[clusters.length - 1][0]];
			}
			if (clusters.length > 2) {
				console.log("repeatFoldLine, non-convex polygons.");
			}
		});
	// remap the face's solution points back onto their crease pattern points,
	// (we have the points from the folded vertex graph).
	return faces_solution.map((solutions, f) => ({
		edges: solutions.map(el => el.edge),
		assignment: faces_winding[f] ? assignment : oppositeAssignment,
		points: solutions.map(solution => add2(
			scale2(edges_vector[solution.edge], solution.a),
			edges_origin[solution.edge],
		)),
	}));
};

export default repeatFoldLine;
