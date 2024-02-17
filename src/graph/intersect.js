/**
 * Rabbit Ear (c) Kraft
 */
import {
	EPSILON,
} from "../math/constant.js";
import {
	exclude,
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
	overlapConvexPolygonPoint,
} from "../math/overlap.js";
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
export const intersectLineVertices = (
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
 *   - a: {number} the input line's parameter of the intersection
 *   - b: {number} the edge's parameter of the intersection
 *   - point: {number[]} the intersection point
 *   - vertex: {number|undefined} in the case of an intersection which crosses
 *     a vertex, indicate which vertex, otherwise, mark it as undefined.
 */
export const intersectLineVerticesEdges = (
	{ vertices_coords, edges_vertices },
	{ vector, origin },
	lineDomain = includeL,
	epsilon = EPSILON,
) => {
	if (!vertices_coords) { return { vertices: [], edges: [] }; }

	// for every vertex, does that vertex lie along the line.
	const vertices = intersectLineVertices(
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
				{ vector, origin },
				pointsToLine(...seg),
				lineDomain,
				includeS,
			),
			vertex: undefined })
			: undefined))
		.map(res => (res === undefined || !res.point ? undefined : res));

	// if our line crosses the edge at one vertex, we still want to include the
	// intersection information, but we can construct it ourselves without
	// running the intersection algorithm. this should save us a little time.
	const edges = edgesVerticesOverlap
		.map((verts, e) => (verts.length === 1
			? ({
				a: (dot2(vector, subtract2(vertices_coords[verts[0]], origin))
					/ magSquared(vector)),
				b: edges_vertices[e][0] === verts[0] ? 0 : 1,
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
 *   - a: {number} the input line's parameter of the intersection
 *   - b: {number} the edge's parameter of the intersection
 *   - point: {number[]} the intersection point
 *   - vertex: {number|undefined} in the case of an intersection which crosses
 *     a vertex, indicate which vertex, otherwise, mark it as undefined.
 * - faces: for every intersected face, an array of intersection objects,
 *   objects similar to but slightly different from those in the "edges" array.
 *   Basically there are two types of intersection: "vertex" and "edge":
 *   - a: {number} the input line's parameter of the intersection
 *   - b: {number|undefined} the edge's parameter of the intersection, or
 *     undefined if intersected with a vertex
 *   - point: {number[]} the intersection point
 *   - vertex: {number|undefined} if the intersection crosses a vertex
 *   - edge: {number|undefined} if the intersection crosses an edge
 */
export const intersectLine = (
	{ vertices_coords, edges_vertices, faces_vertices, faces_edges },
	{ vector, origin },
	lineDomain = includeL,
	epsilon = EPSILON,
) => {
	// intersect the line with every edge. the intersection should be inclusive
	// with respect to the segment endpoints. this will cause duplicate points
	// for every face when a line crosses exactly at its vertex, but this is
	// necessary because we need to know this point, so we will filter later.
	const { vertices, edges } = intersectLineVerticesEdges(
		{ vertices_coords, edges_vertices },
		{ vector, origin },
		lineDomain,
		epsilon,
	);

	if (!faces_vertices) { return { vertices, edges, faces: [] }; }

	if (!faces_edges) {
		faces_edges = makeFacesEdgesFromVertices({ edges_vertices, faces_vertices });
	}

	// for every face, get every edge of that face's intersection with our line,
	// filter out any edges which had no intersection.
	// it's possible for faces to have 0, 1, 2, 3... any number of intersections.
	const facesIntersections = faces_edges
		.map(fe => fe
			.map(edge => (edges[edge] ? { ...edges[edge], edge } : undefined))
			.filter(a => a !== undefined));

	// this epsilon function will compare the object's "a" property
	// which is the intersections's "a" parameter (line parameter).
	const epsilonEqual = (p, q) => Math.abs(p.a - q.a) < epsilon * 2;

	// For every face, sort and cluster the face's intersection events using
	// our input line's parameter. This results in, for every face,
	// its intersection events are clustered inside of sub arrays.
	const faces = facesIntersections
		.map(intersections => intersections.sort((p, q) => p.a - q.a))
		.map(intersections => clusterSortedGeneric(intersections, epsilonEqual)
			.map(cluster => cluster.map(index => intersections[index])))
		.map(clusters => clusters
			.map(cluster => cluster[0])
			.map(intersection => ({
				...intersection,
				edge: intersection.vertex === undefined ? intersection.edge : undefined,
				b: intersection.vertex === undefined ? intersection.b : undefined,
			})));

	return { vertices, edges, faces };
};

/**
 * @description Intersect a line/ray/segment with a FOLD graph and
 * check a list of input points to see which faces each point lies inside,
 * returning the intersect information with vertices, edges, and faces.
 * @param {VecLine} line a line/ray/segment in vector origin form
 * @param {function} lineDomain the function which characterizes "line"
 * parameter into a line, ray, or segment.
 * @param {number[][]} [interiorPoints=[]] in the case of a ray or segment,
 * include the endpoint(s) and they will be included if they appear in a face.
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {{ vertices: boolean[], edges: (object|undefined)[]}} an object
 * summarizing the intersections with vertices, edges, and faces:
 * - vertices: for every vertex, true or false, does the vertex overlap the line
 * - edges: a list of intersections, undefined if no intersection or collinear,
 *   or an intersection object which describes:
 *   - a: {number} the input line's parameter of the intersection
 *   - b: {number} the edge's parameter of the intersection
 *   - point: {number[]} the intersection point
 *   - vertex: {number|undefined} in the case of an intersection which crosses
 *     a vertex, indicate which vertex, otherwise, mark it as undefined.
 * - faces: for every intersected face, a list of intersection objects
 *   filtered into three categories: "vertices", "edges", "points" where
 *   each category holds a list of objects with intersection information:
 *   - vertices: { a, point, vertex }
 *   - edges: { a, b, point, edge }
 *   - points: { t, point }
 *   where the data in each object is:
 *   - point: {number[]} the intersection point
 *   - a: {number} the input line's parameter of the intersection
 *   - b: {number} the edge's parameter of the intersection
 *   - t: {number[]} the point-in-polygon's overlap parameters
 *   - vertex: {number} if the intersection crosses a vertex
 *   - edge: {number} if the intersection crosses an edge
 */
export const intersectLineAndPoints = (
	{ vertices_coords, edges_vertices, faces_vertices, faces_edges },
	{ vector, origin },
	lineDomain = includeL,
	interiorPoints = [],
	epsilon = EPSILON,
) => {
	// intersect the line with every edge. the intersection should be inclusive
	// with respect to the segment endpoints. this will cause duplicate points
	// for every face when a line crosses exactly at its vertex, but this is
	// necessary because we need to know this point, so we will filter later.
	const { vertices, edges, faces } = intersectLine(
		{ vertices_coords, edges_vertices, faces_vertices, faces_edges },
		{ vector, origin },
		lineDomain,
		epsilon,
	);

	if (!vertices_coords || !faces_vertices) {
		return { vertices, edges, faces };
	}

	// If there are ray or segment points, we have to query every single face,
	// does a point lie inside of the face, and if so, include it in this list.
	// The result is an object containing a "point" {number[]} and "t" {number[]}
	// this "t" parameter can be used later to trilaterate the position again.
	const facesInteriorPoints = !interiorPoints.length
		? faces.map(() => [])
		: faces.map((_, face) => {
			const polygon = faces_vertices[face].map(v => vertices_coords[v]);
			const pointsOverlap = interiorPoints.map(point => ({
				...overlapConvexPolygonPoint(polygon, point, exclude, epsilon),
				point,
			}));
			return pointsOverlap.filter(el => el.overlap);
		});

	// Every face in this list will contain a list of intersection events
	// that occur inside this face. The events are one of three categories:
	// - edges: intersections event that crosses over an edge
	// - vertices: intersections that cross exactly over a vertex
	// - point: an object describing a point lying interior to the face
	const newFacesData = faces.map((intersections, f) => ({
		edges: intersections.filter(el => el.edge !== undefined),
		vertices: intersections.filter(el => el.vertex !== undefined),
		points: facesInteriorPoints[f],
	}));

	return { vertices, edges, faces: newFacesData };
};
