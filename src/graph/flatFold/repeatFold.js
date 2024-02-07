/**
 * Rabbit Ear (c) Kraft
 */
import {
	invertAssignment,
} from "../../fold/spec.js";
import {
	clusterSortedGeneric,
} from "../../general/cluster.js";
import {
	EPSILON,
} from "../../math/constant.js";
import {
	includeS,
	includeL,
} from "../../math/compare.js";
import {
	pointsToLine,
} from "../../math/convert.js";
import {
	magSquared,
	dot2,
	cross2,
	scale2,
	add2,
	subtract2,
} from "../../math/vector.js";
import {
	intersectLineLine,
} from "../../math/intersect.js";
import {
	makeEdgesVector,
	makeFacesEdgesFromVertices,
} from "../make.js";
import {
	makeVerticesCoordsFlatFolded,
} from "../vertices/folded.js";
import {
	makeFacesWinding,
} from "../faces/winding.js";
import {
	faceContainingPoint,
} from "../faces/facePoint.js";

/**
 * @param {FOLD} graph a FOLD object, in crease pattern form
 * @param {VecLine} line a fold line
 * @param {string} assignment the segment's assignment through the first face
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {object[]} For each intersected face, a new segment object:
 * - edges: which two edges were intersected
 * - points: the new segment's two endpoints
 */
export const lineThroughFaces = (
	{ vertices_coords, edges_vertices, faces_vertices, faces_edges },
	{ vector, origin },
	epsilon,
) => {
	if (!faces_edges) {
		faces_edges = makeFacesEdgesFromVertices({ edges_vertices, faces_vertices });
	}

	// intersect the line with every edge. the intersection should be inclusive
	// with respect to the segment endpoints. this will cause duplicate points
	// for every face when a line crosses exactly at its vertex, but this is
	// necessary because we need to know this point, so we will filter later.
	const edgesIntersections = edges_vertices
		.map(vertices => intersectLineLine(
			pointsToLine(...vertices.map(v => vertices_coords[v])),
			{ vector, origin },
			includeS,
			includeL,
			epsilon,
		)).map((res, edge) => (res.point === undefined
			? undefined
			: { ...res, edge }));

	// for every face, get every edge of that face's intersection with our line,
	// however, filter out any edges which had no intersection.
	// it's possible for faces to have 0, 1, 2, 3... any number of intersections.
	const facesIntersections = faces_edges
		.map(edges => edges
			.map(edge => edgesIntersections[edge])
			.filter(a => a !== undefined));

	// delete faces which have fewer than 2 intersections. using this list,
	// we will perform all kinds of filtering to remove duplicate points.
	facesIntersections
		.map((arr, f) => (arr.length < 2 ? f : undefined))
		.filter(f => f !== undefined)
		.forEach(f => delete facesIntersections[f]);

	// this epsilon function will compare the object's "b" property
	// which is the intersections's "b" parameter (line parameter).
	const epsilonEqual = (a, b) => Math.abs(a.b - b.b) < epsilon * 2;

	// Every face now has two or more intersections events.
	// We need to filter out the invalid cases, which include:
	// - line outside face, but face intersected at a vertex, which
	//   registers as two intersections because it touches two edges.
	// - line overlaps face, but face is non-convex, so there are more than
	//   two clusters of points (sorted geometrically)

	// For every face, sort and cluster the face's intersection events using
	// our input line's parameter. This results in, for every face,
	// its intersection events are clustered inside of sub arrays.
	// A simple, valid face will contain two clusters.
	const facesNewSegment = [];
	facesIntersections
		.map(intersections => intersections.sort((a, b) => a.b - b.b))
		.map(intersections => clusterSortedGeneric(intersections, epsilonEqual)
			.map(cluster => cluster.map(index => intersections[index])))
		.forEach((clusters, f) => {
			switch (clusters.length) {
			case 0:
			case 1:
				// the line intersects the face outside of the face, at a single point
				break;
			case 2:
				// take one intersection event from each cluster (doesn't matter which)
				facesNewSegment[f] = [clusters[0][0], clusters[clusters.length - 1][0]];
				break;
			default:
				// todo: non-convex faces which have an even number of clusters > 2,
				// we could take every other pair and create a segment.
				// we would have to refactor to be working with segments plural,
				// and we are no longer returning one new edge per face.
				break;
			}
		});

	// the return object will be, for every intersected face,
	// an object which describes a new segment, including:
	// - edges: which two edges were intersected
	// - edgesParams: the parameters of each edge's vector at this intersection
	// - lineParams: the parameters of the line's vector at the intersections
	return facesNewSegment;
	// return facesNewSegment.map(intersections => ({
	// 	edges: intersections.map(el => el.edge),
	// 	edgesParams: intersections.map(el => el.a),
	// 	lineParams: intersections.map(el => el.b),
	// }));
};

/**
 * @description Given a flat-foldable crease pattern, perform a fold through
 * its folded form and return a list of new crease edges as edges in the
 * crease pattern space.
 * @param {FOLD} graph a FOLD object, in crease pattern form
 * @param {VecLine} line a fold line
 * @param {string} assignment the segment's assignment through the first face
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {object[]} For each intersected face, a new segment object:
 * - edges: which two edges were intersected
 * - assignment: the assignment of the new segment
 * - points: the new segment's two endpoints
 */
const repeatFoldLine = ({
	vertices_coords, edges_vertices, edges_foldAngle, edges_assignment,
	faces_vertices, faces_edges, faces_faces,
}, { vector, origin }, assignment = "V", epsilon = EPSILON) => {
	if (!faces_edges) {
		faces_edges = makeFacesEdgesFromVertices({ edges_vertices, faces_vertices });
	}

	// the face under the point's crease will get the assignment in the method
	// input parameter, and all other creases will be valley/mountain accordingly
	const startFace = faceContainingPoint(
		{ vertices_coords, faces_vertices },
		origin,
		vector,
	);

	// Only M and V will exchange. all others, this will be the same assignment
	const oppositeAssignment = invertAssignment(assignment);

	// this assumes the model is flat folded.
	// another approach would be to check for any non-flat edges, fold a 3D
	// graph, then find all faces that are in the same plane as startFace.
	const vertices_coordsFolded = makeVerticesCoordsFlatFolded({
		vertices_coords,
		edges_vertices,
		edges_foldAngle,
		edges_assignment,
		faces_vertices,
		faces_faces,
	}, startFace);

	// edge line data for the crease pattern state, needed to remap the edge
	// intersections, which were calculated in the folded state, into points
	// in the crease pattern state.
	const edges_origin = edges_vertices.map(ev => vertices_coords[ev[0]]);
	const edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });

	// note that this copy of faces_winding will be forced to be the case that
	// our startFace is "true" instead of T/F based on face winding direction.
	const faces_winding = makeFacesWinding({
		vertices_coords: vertices_coordsFolded,
		faces_vertices,
	});
	if (!faces_winding[startFace]) {
		faces_winding.forEach((w, i) => { faces_winding[i] = !w; });
	}

	// the return object will be, for every intersected face,
	// an object which describes a new segment, including:
	// - edges: which two edges were intersected
	// - assignment: the assignment of the new segment
	// - points: the new segment's two endpoints
	// Note: the points will be remapped back into crease pattern space,
	// as all intersection data was calculated using the folded form's vertices.
	// return lineThroughFaces(
	// 	{ vertices_coords: vertices_coordsFolded, edges_vertices, faces_vertices, faces_edges },
	// 	{ vector, origin },
	// 	epsilon,
	// ).map((result, f) => ({
	// 	...result,
	// 	assignment: faces_winding[f] ? assignment : oppositeAssignment,
	// 	points: result.edges.map((edge, s) => add2(
	// 		scale2(edges_vector[edge], result.edgesParams[s]),
	// 		edges_origin[edge],
	// 	)),
	// }));
	return lineThroughFaces(
		{ vertices_coords: vertices_coordsFolded, edges_vertices, faces_vertices, faces_edges },
		{ vector, origin },
		epsilon,
	).map((result, f) => ({
		...result,
		assignment: faces_winding[f] ? assignment : oppositeAssignment,
		points: result.map(({ edge, a }) => add2(
			scale2(edges_vector[edge], a),
			edges_origin[edge],
		)),
	}));
};

// const repeatFoldLine = ({
// 	vertices_coords, edges_vertices, edges_foldAngle, edges_assignment,
// 	faces_vertices, faces_edges, faces_faces,
// }, { vector, origin }, assignment = "V", epsilon = EPSILON) => {
// 	if (!faces_edges) {
// 		faces_edges = makeFacesEdgesFromVertices({ edges_vertices, faces_vertices });
// 	}

// 	// the face under the point's crease will get the assignment in the method
// 	// input parameter, and all other creases will be valley/mountain accordingly
// 	const startFace = faceContainingPoint(
// 		{ vertices_coords, faces_vertices },
// 		origin,
// 		vector,
// 	);

// 	// Only M and V will exchange. all others, this will be the same assignment
// 	const oppositeAssignment = invertAssignment(assignment);

// 	// this assumes the model is flat folded.
// 	// another approach would be to check for any non-flat edges, fold a 3D
// 	// graph, then find all faces that are in the same plane as startFace.
// 	const vertices_coordsFolded = makeVerticesCoordsFlatFolded({
// 		vertices_coords,
// 		edges_vertices,
// 		edges_foldAngle,
// 		edges_assignment,
// 		faces_vertices,
// 		faces_faces,
// 	}, startFace);

// 	// intersect the line with every edge. the intersection should be inclusive
// 	// with respect to the segment endpoints. this will cause duplicate points
// 	// for every face when a line crosses exactly at its vertex, but this is
// 	// necessary because we need to know this point, so we will filter later.
// 	const edgesIntersections = getEdgesLineIntersection(
// 		{ vertices_coords: vertices_coordsFolded, edges_vertices },
// 		{ vector, origin },
// 		epsilon,
// 	).map((el, edge) => (el.point === undefined ? undefined : { ...el, edge }));

// 	// for every face, get every edge of that face's intersection with our line,
// 	// however, filter out any edges which had no intersection.
// 	// it's possible for faces to have 0, 1, 2, 3... any number of intersections.
// 	const facesIntersections = faces_edges
// 		.map(edges => edges
// 			.map(edge => edgesIntersections[edge])
// 			.filter(a => a !== undefined));

// 	// delete faces which have fewer than 2 intersections. using this list,
// 	// we will perform all kinds of filtering to remove duplicate points.
// 	facesIntersections
// 		.map((arr, f) => (arr.length < 2 ? f : undefined))
// 		.filter(f => f !== undefined)
// 		.forEach(f => delete facesIntersections[f]);

// 	// this epsilon function will compare the object's "b" property
// 	// which is the intersections's "b" parameter (line parameter).
// 	const epsilonEqual = (a, b) => Math.abs(a.b - b.b) < epsilon * 2;

// 	// Every face now has two or more intersections events.
// 	// We need to filter out the invalid cases, which include:
// 	// - line outside face, but face intersected at a vertex, which
// 	//   registers as two intersections because it touches two edges.
// 	// - line overlaps face, but face is non-convex, so there are more than
// 	//   two clusters of points (sorted geometrically)

// 	// For every face, sort and cluster the face's intersection events using
// 	// our input line's parameter. This results in, for every face,
// 	// its intersection events are clustered inside of sub arrays.
// 	// A simple, valid face will contain two clusters.
// 	const facesNewSegment = [];
// 	facesIntersections
// 		.map(intersections => intersections.sort((a, b) => a.b - b.b))
// 		.map(intersections => clusterSortedGeneric(intersections, epsilonEqual)
// 			.map(cluster => cluster.map(index => intersections[index])))
// 		.forEach((clusters, f) => {
// 			switch (clusters.length) {
// 			case 0:
// 			case 1:
// 				// the line intersects the face outside of the face, at a single point
// 				break;
// 			case 2:
// 				// take one intersection event from each cluster (doesn't matter which)
// 				facesNewSegment[f] = [clusters[0][0], clusters[clusters.length - 1][0]];
// 				break;
// 			default:
// 				// todo: non-convex faces which have an even number of clusters > 2,
// 				// we could take every other pair and create a segment.
// 				// we would have to refactor to be working with segments plural,
// 				// and we are no longer returning one new edge per face.
// 				break;
// 			}
// 		});

// 	// edge line data for the crease pattern state, needed to remap the edge
// 	// intersections, which were calculated in the folded state, into points
// 	// in the crease pattern state.
// 	const edges_origin = edges_vertices.map(ev => vertices_coords[ev[0]]);
// 	const edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });

// 	// note that this copy of faces_winding will be forced to be the case that
// 	// our startFace is "true" instead of T/F based on face winding direction.
// 	const faces_winding = makeFacesWinding({
// 		vertices_coords: vertices_coordsFolded,
// 		faces_vertices,
// 	});
// 	if (!faces_winding[startFace]) {
// 		faces_winding.forEach((w, i) => { faces_winding[i] = !w; });
// 	}

// 	// the return object will be, for every intersected face,
// 	// an object which describes a new segment, including:
// 	// - edges: which two edges were intersected
// 	// - assignment: the assignment of the new segment
// 	// - points: the new segment's two endpoints
// 	// Note: the points will be remapped back into crease pattern space,
// 	// as all intersection data was calculated using the folded form's vertices.
// 	return facesNewSegment.map((intersections, f) => ({
// 		edges: intersections.map(el => el.edge),
// 		assignment: faces_winding[f] ? assignment : oppositeAssignment,
// 		points: intersections.map(intersection => add2(
// 			scale2(edges_vector[intersection.edge], intersection.a),
// 			edges_origin[intersection.edge],
// 		)),
// 	}));
// };

export default repeatFoldLine;
