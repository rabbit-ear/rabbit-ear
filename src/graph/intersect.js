/**
 * Rabbit Ear (c) Kraft
 */
import {
	EPSILON,
} from "../math/constant.js";
import {
	includeL,
	includeS,
} from "../math/compare.js";
import {
	magSquared,
	dot2,
	cross2,
	subtract2,
} from "../math/vector.js";
import {
	pointsToLine,
} from "../math/convert.js";
import {
	intersectLineLine,
} from "../math/intersect.js";
import {
	clusterSortedGeneric,
} from "../general/cluster.js";
import {
	makeFacesEdgesFromVertices,
} from "./make.js";

/**
 * @description Intersect a line/ray/segment with a FOLD graph but only
 * consider the graph's vertices.
 * @param {FOLD} graph a fold graph in creasePattern or foldedForm
 * @param {VecLine} line a line/ray/segment in vector origin form
 * @param {function} lineFunc the function which characterizes the line
 * into a line, ray, or segment.
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {(number|undefined)[]} an array matching the length of vertices,
 * in the case of an intersection, the number is the parameter along the line's
 * vector, if there is no intersection the value is undefined.
 */
export const intersectWithLineVertices = (
	{ vertices_coords },
	{ vector, origin },
	lineDomain = includeL,
	epsilon = EPSILON,
) => {
	const lineMagSq = magSquared(vector);
	const lineMag = Math.sqrt(lineMagSq);
	if (lineMag < epsilon) {
		return Array(vertices_coords.length).fill(undefined);
	}
	return vertices_coords
		.map(coord => subtract2(coord, origin))
		.map(vec => {
			const parameter = dot2(vec, vector) / lineMagSq;
			return Math.abs(cross2(vec, vector)) < epsilon
				&& lineDomain(parameter, epsilon / lineMag)
				? parameter
				: undefined;
		});
};

/**
 * @description Intersect a line/ray/segment with a FOLD graph but only
 * consider the graph's vertices and edges.
 * Intersections are endpoint-inclusive, but will not include collinear edges.
 * Collinear edges will contain an "undefined" in this result, collinear
 * edges can be differentiated for the user by consulting the "vertices"
 * data, if both of an edge's two vertices are true, the edge is collinear.
 * Edges which have one endpoint touching the line are included in the result,
 * and include a "vertex" parameter indicating which vertex index is overlapped.
 * @param {FOLD} graph a fold graph in creasePattern or foldedForm
 * @param {VecLine} line a line/ray/segment in vector origin form
 * @param {function} lineDomain the function which characterizes "line"
 * parameter into a line, ray, or segment.
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {{ vertices: boolean[], edges: (object|undefined)[]}} an object
 * summarizing the intersections with edges and vertices:
 * - vertices: for every vertex, a number or undefined. If there is an
 *   intersection with the line, the number is the parameter along the line's
 *   vector, if there is no intersection the value is undefined.
 * - edges: a list of intersections, undefined if no intersection or collinear,
 *   or an intersection object which describes:
 *   - a: {number} the edge's parameter of the intersection
 *   - b: {number} the line's parameter of the intersection
 *   - point: {number[]} the intersection point
 *   - vertex: {number|undefined} in the case of an intersection which crosses
 *     a vertex, indicate which vertex, otherwise, mark it as undefined.
 */
export const intersectWithLineVerticesEdges = (
	{ vertices_coords, edges_vertices },
	{ vector, origin },
	lineDomain = includeL,
	epsilon = EPSILON,
) => {
	if (!vertices_coords) { return { vertices: [], edges: [] }; }

	// for every vertex, does that vertex lie along the line.
	const vertices = intersectWithLineVertices(
		{ vertices_coords },
		{ vector, origin },
		lineDomain,
		epsilon,
	);

	if (!edges_vertices) { return { vertices, edges: [] }; }

	// for every edge, a list of its vertices that lie along the line (0, 1, or 2)
	// if an edge has 1-2 overlapping vertices, we can skip the intersection call
	// if an edge has no overlapping vertices, we must run the edge-intersection.
	const edgesVerticesOverlap = edges_vertices
		.map(ev => ev
			.map(v => (vertices[v] !== undefined ? v : undefined))
			.filter(a => a !== undefined));

	// if the edge contains no vertices which overlap the line,
	// perform a line-segment intersection, otherwise do nothing.
	// it's possible the intersection returns no result, which looks like
	// an object with all undefined values, if so, replace these objects
	// with a single undefined.
	// Additionally, add a { vertex: undefined } key/value to all intersections.
	const edgesNoOverlapIntersection = edges_vertices
		.map(ev => ev.map(v => vertices_coords[v]))
		.map((seg, e) => (edgesVerticesOverlap[e].length === 0
			? ({ ...intersectLineLine(
				pointsToLine(...seg),
				{ vector, origin },
				includeS,
				lineDomain,
			),
			vertex: undefined })
			: undefined))
		.map(res => (res === undefined || !res.point ? undefined : res));

	// if our line crosses the edge at one vertex, we still want to include the
	// intersection information, but we can construct it ourselves without
	// running the intersection algorithm. this should save us some time.
	const edges = edgesVerticesOverlap
		.map((verts, e) => (verts.length === 1
			? ({
				a: edges_vertices[e][0] === verts[0] ? 0 : 1,
				b: (dot2(vector, subtract2(vertices_coords[verts[0]], origin))
					/ magSquared(vector)),
				point: [...vertices_coords[verts[0]]],
				vertex: verts[0],
			})
			: edgesNoOverlapIntersection[e]));

	return { vertices, edges };
};

/**
 * @description Intersect a line/ray/segment with a FOLD graph, and return
 * intersect information with vertices, edges, and faces.
 * @param {VecLine} line a line/ray/segment in vector origin form
 * @param {function} lineDomain the function which characterizes "line"
 * parameter into a line, ray, or segment.
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {{ vertices: boolean[], edges: (object|undefined)[]}} an object
 * summarizing the intersections with vertices, edges, and faces:
 * - vertices: for every vertex, true or false, does the vertex overlap the line
 * - edges: a list of intersections, undefined if no intersection or collinear,
 *   or an intersection object which describes:
 *   - a: {number} the edge's parameter of the intersection
 *   - b: {number} the line's parameter of the intersection
 *   - point: {number[]} the intersection point
 *   - vertex: {number|undefined} in the case of an intersection which crosses
 *     a vertex, indicate which vertex, otherwise, mark it as undefined.
 * - faces: for every intersected face, an array of two intersection objects
 *   as detailed under the "edges" section of this description.
 */
export const intersectWithLine = (
	{ vertices_coords, edges_vertices, faces_vertices, faces_edges },
	{ vector, origin },
	lineDomain = includeL,
	epsilon = EPSILON,
) => {
	if (!faces_edges) {
		faces_edges = makeFacesEdgesFromVertices({ edges_vertices, faces_vertices });
	}

	// intersect the line with every edge. the intersection should be inclusive
	// with respect to the segment endpoints. this will cause duplicate points
	// for every face when a line crosses exactly at its vertex, but this is
	// necessary because we need to know this point, so we will filter later.
	const { vertices, edges } = intersectWithLineVerticesEdges(
		{ vertices_coords, edges_vertices },
		{ vector, origin },
		lineDomain,
		epsilon,
	);

	// for every face, get every edge of that face's intersection with our line,
	// however, filter out any edges which had no intersection.
	// it's possible for faces to have 0, 1, 2, 3... any number of intersections.
	const facesIntersections = faces_edges
		.map(fe => fe
			.map(edge => (edges[edge] ? { ...edges[edge], edge } : undefined))
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
	// - line outside face but touches only at one point, which still
	//   registers as two intersections because it touches two edges.
	// - line overlaps face, but face is non-convex, so there are more than
	//   two clusters of points (sorted geometrically)

	// For every face, sort and cluster the face's intersection events using
	// our input line's parameter. This results in, for every face,
	// its intersection events are clustered inside of sub arrays.
	// A simple, valid face will contain two clusters.
	const faces = [];
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
				faces[f] = [clusters[0][0], clusters[clusters.length - 1][0]];
				break;
			default:
				// todo: non-convex faces which have an even number of clusters > 2,
				// we could take every other pair and create a segment.
				// we would have to refactor to be working with segments plural,
				// and we are no longer returning one new edge per face.
				break;
			}
		});

	return { vertices, edges, faces };
};
