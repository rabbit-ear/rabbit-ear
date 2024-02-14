/**
 * Rabbit Ear (c) Kraft
 */
import {
	EPSILON,
} from "../../math/constant.js";
import {
	includeL,
// 	includeR,
// 	includeS,
} from "../../math/compare.js";
// import {
// 	pointsToLine,
// } from "../math/convert.js";
import {
	overlapConvexPolygonPoint,
} from "../../math/overlap.js";
import {
	remapKey,
} from "../maps.js";
import {
	intersectLine,
} from "../intersect.js";

/**
 * @description 
 */
export const splitLineToSegments = (
	{ vertices_coords, edges_vertices, faces_vertices, faces_edges },
	{ vector, origin },
	lineDomain = includeL,
	interiorPoints = [],
	epsilon = EPSILON,
) => {
	// intersect the line with the graph, vertices, edges, and faces info
	const { vertices, edges, faces } = intersectLine(
		{ vertices_coords, edges_vertices, faces_vertices, faces_edges },
		{ vector, origin },
		lineDomain,
		epsilon,
	);

	if (!vertices_coords || !faces_vertices) {
		return { vertices, edges, faces, segments: [] };
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
				...overlapConvexPolygonPoint(polygon, point),
				point,
			}));
			return pointsOverlap.filter(el => el.overlap);
		});

	// Every face in this list will contain a list of intersection events
	// that occur inside this face. The events are one of three categories:
	// - edges: intersections event that crosses over an edge
	// - vertices: intersections that cross exactly over a vertex
	// - point: an object describing a point lying interior to the face
	const facesPoints = faces.map((intersections, f) => ({
		edges: intersections.filter(el => el.edge !== undefined),
		vertices: intersections.filter(el => el.vertex !== undefined),
		points: facesInteriorPoints[f],
	}));

	// sum the number of all these intersection events inside of this face.
	// any face that contains only 2 intersection events is simple enough
	// for us to create a new straight edge between the pair of points.
	// delete all faces which contain anything other than 2 points.
	// todo: it would be possible to handle cases with more than 2 points.
	facesPoints
		.map(face => ["vertices", "edges", "points"]
			.map(key => face[key].length)
			.reduce((a, b) => a + b, 0))
		.map((count, f) => (count !== 2 ? f : undefined))
		.filter(a => a !== undefined)
		.forEach(f => delete facesPoints[f]);

	// our segments will be a little mini graph, with components:
	// - vertices: with any combination of { a, b, t, point, vertex, edge, face}
	//   - where vertices from a vertex have { a, point, vertex}
	//   - vertices from an edge have { a, b, point, edge }
	//   - vertices from inside a face have { t, point, face }
	// - edges_vertices: pairs of indices relating to "vertices" array.
	// - edges_face: for each of these new edges, which face FROM THE INPUT GRAPH
	//   does this edge lie inside? For example, this is useful to reference the
	//   winding of the face (flipped or no) and give an assignment based on this
	const segments = { vertices: [] };

	// keep track of any vertices we have already created and added to the graph,
	// if one of these exists, use its reference, don't create a duplicate entry.
	const vertexVertex = {};
	const edgeVertex = {};

	segments.edges_vertices = facesPoints.map((el, face) => {
		const vertsVerts = el.vertices.map(({ a, point, vertex }) => {
			const index = segments.vertices.length;
			if (vertexVertex[vertex] !== undefined) { return vertexVertex[vertex]; }
			segments.vertices.push({ a, point, vertex });
			vertexVertex[vertex] = index;
			return index;
		});
		const edgesVerts = el.edges.map(({ a, b, point, edge }) => {
			const index = segments.vertices.length;
			if (edgeVertex[edge] !== undefined) { return edgeVertex[edge]; }
			segments.vertices.push({ a, b, point, edge });
			edgeVertex[edge] = index;
			return index;
		});
		const pointsVerts = el.points.map(({ point, t }) => {
			const index = segments.vertices.length;
			segments.vertices.push({ point, t, face });
			return index;
		});
		// create an edge_vertices by joining all results from the new vertex
		// indices from the vertices/edges/points. it will result in only 2.
		return vertsVerts.concat(edgesVerts).concat(pointsVerts);
	}).filter(a => a !== undefined);

	segments.edges_face = facesPoints
		.map((_, face) => face)
		.filter(a => a !== undefined);

	return {
		vertices, edges, faces, segments,
	};
};

/**
 * @description Given a 2D line and a graph with vertices in 2D, split
 * the line at every vertex/edge, resulting in a graph containing only
 * the new line, prepared as a list of vertices and edges. The indices
 * of the resulting graph are made into arrays with a large hole
 * at the start making sure there is no overlap with the existing graph's
 * indices. This allows the two graphs to very simply be able to be merged.
 * The edge indices will make use of existing vertices when possible, so,
 * edges_vertices may reference vertex indices from the source graph.
 * @param {FOLD} graph a fold graph in creasePattern or foldedForm
 * @param {VecLine} line a line/ray/segment in vector origin form
 * @param {function} [lineDomain=() => true] the function which characterizes "line"
 * parameter into a line, ray, or segment.
 * @param {number[][]} [interiorPoints=[]] in the case of a ray or segment, place
 * in here the endpoint(s), and they will be included in the result.
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {FOLD} graph a FOLD graph containing only the line's geometry,
 * as a list of vertices and edges, where all new geometry's indices are
 * indexed to start after the input graph's components end, so there is no
 * confusion as to which graph's indices we are referring.
 * - vertices: for each vertex, this is the result of the
 *   intersection algorithm which calculated this vertex's coordinate.
 *   including a "point" property on all entries, which is the vertex's coords.
 * - edges_vertices: new edges, as pairs of vertices, can include references
 *   to new vertices or vertices from the input graph.
 * - edges_face: note "face" not "faces", which face does this new edge lie in
 * - edges_collinear: list of edges from the input graph containing a boolean,
 *   true if the edge lies collinear to the input line.
 */
export const splitLineIntoEdges = (
	{ vertices_coords, edges_vertices, faces_vertices, faces_edges },
	line,
	lineDomain = includeL,
	interiorPoints = [],
	epsilon = EPSILON,
) => {
	if (!vertices_coords || !edges_vertices || !faces_vertices) {
		return undefined;
	}

	// intersect the line with the graph, vertices, edges, and faces info.
	const { vertices, segments } = splitLineToSegments(
		{ vertices_coords, edges_vertices, faces_vertices, faces_edges },
		line,
		lineDomain,
		interiorPoints,
		epsilon,
	);

	// rename "vertices" into any name that includes a "_" so that when
	// we run "remapKey" it will include this array in the remapping.
	segments.vertices_info = segments.vertices;
	delete segments.vertices;

	// create a map that moves the vertices and edges so that there is a large
	// hole at the start of the array and that the indices start after the
	// current graph's components. this allows the two arrays to be later merged.
	// additionally, vertices will be mapped so that the final vertex list
	// excludes those vertices which are pointing to existing vertex indices
	// from the input graph; only including vertices which will become new points.
	let count = 0;
	const vertexMap = segments.vertices_info
		.map(el => (el.vertex === undefined
			? vertices_coords.length + (count++)
			: el.vertex));
	const edgeMap = segments.edges_vertices
		.map((_, i) => edges_vertices.length + i);
	remapKey(segments, "vertices", vertexMap);
	remapKey(segments, "edges", edgeMap);

	// we are done requiring the vertices_ array have an underbar. rename it back
	segments.vertices = segments.vertices_info;
	delete segments.vertices_info;

	// this also populates the coords for vertices which already exist in the
	// input graph, we just need to check the input graph and delete these.
	segments.vertices
		.map((_, v) => v)
		.filter(v => vertices_coords[v] !== undefined)
		.forEach(v => delete segments.vertices[v]);

	// using the overlapped vertices, make a list of edges collinear to the line
	const verticesCollinear = vertices.map(v => v !== undefined);
	const edges_collinear = edges_vertices
		.map(verts => verticesCollinear[verts[0]] && verticesCollinear[verts[1]]);

	return {
		...segments,
		edges_collinear,
	};
};

// /**
//  * @description Given a 2D line and a graph with vertices in 2D, split
//  * the line at every vertex/edge, resulting in a graph containing only
//  * the new line, prepared as a list of vertices and edges. The indices
//  * of the resulting graph are made into arrays with a large hole
//  * at the start making sure there is no overlap with the existing graph's
//  * indices. This allows the two graphs to very simply be able to be merged.
//  * The edge indices will make use of existing vertices when possible, so,
//  * edges_vertices may reference vertex indices from the source graph.
//  * @param {FOLD} graph a fold graph in creasePattern or foldedForm
//  * @param {VecLine} line a line in vector origin form
//  * @param {number} [epsilon=1e-6] an optional epsilon
//  * @returns {FOLD} graph a FOLD graph containing only the line's
//  * geometry, as a list of vertices and edges, but with some additional data:
//  * - vertices_info: for each vertex, this is the result of the
//  *   intersection algorithm which made the vertex. useful for re-calculating
//  *   the coordinate in another graph's space (transfer foldedForm to CP)
//  * - edges_collinear: a list of edge indices from the original graph that
//  *   lie collinear to this line. You may want to use this to change the
//  *   edge assignment of these edges.
//  */
// export const splitLineWithGraph = (graph, line, epsilon = EPSILON) => (
// 	splitLineIntoEdges(graph, line, includeL, [], epsilon)
// );

// /**
//  * @description Given a 2D ray and a graph with vertices in 2D, split
//  * the ray at every vertex/edge, resulting in a graph containing only
//  * the new ray, prepared as a list of vertices and edges. The indices
//  * of the resulting graph are made into arrays with a large hole
//  * at the start making sure there is no overlap with the existing graph's
//  * indices. This allows the two graphs to very simply be able to be merged.
//  * The edge indices will make use of existing vertices when possible, so,
//  * edges_vertices may reference vertex indices from the source graph.
//  * @param {FOLD} graph a fold graph in creasePattern or foldedForm
//  * @param {VecLine} ray a ray in vector origin form
//  * @param {number} [epsilon=1e-6] an optional epsilon
//  * @returns {FOLD} graph a FOLD graph containing only the ray's
//  * geometry, as a list of vertices and edges, but with some additional data:
//  * - vertices_info: for each vertex, this is the result of the
//  *   intersection algorithm which made the vertex. useful for re-calculating
//  *   the coordinate in another graph's space (transfer foldedForm to CP)
//  * - edges_collinear: a list of edge indices from the original graph that
//  *   lie collinear to this ray. You may want to use this to change the
//  *   edge assignment of these edges.
//  */
// export const splitRayWithGraph = (graph, ray, epsilon = EPSILON) => (
// 	splitLineIntoEdges(graph, ray, includeR, [ray.origin], epsilon)
// );

// /**
//  * @description Given a 2D segment and a graph with vertices in 2D, split
//  * the segment at every vertex/edge, resulting in a graph containing only
//  * the new segment, prepared as a list of vertices and edges. The indices
//  * of the resulting graph are made into arrays with a large hole
//  * at the start making sure there is no overlap with the existing graph's
//  * indices. This allows the two graphs to very simply be able to be merged.
//  * The edge indices will make use of existing vertices when possible, so,
//  * edges_vertices may reference vertex indices from the source graph.
//  * @param {FOLD} graph a fold graph in creasePattern or foldedForm
//  * @param {number[][]} segment a segment in vector origin form
//  * @param {number} [epsilon=1e-6] an optional epsilon
//  * @returns {FOLD} graph a FOLD graph containing only the segment's
//  * geometry, as a list of vertices and edges, but with some additional data:
//  * - vertices_info: for each vertex, this is the result of the
//  *   intersection algorithm which made the vertex. useful for re-calculating
//  *   the coordinate in another graph's space (transfer foldedForm to CP)
//  * - edges_collinear: a list of edge indices from the original graph that
//  *   lie collinear to this segment. You may want to use this to change the
//  *   edge assignment of these edges.
//  */
// export const splitSegmentWithGraph = (graph, segment, epsilon = EPSILON) => (
// 	splitLineIntoEdges(
// 		graph,
// 		pointsToLine(...segment),
// 		includeS,
// 		segment,
// 		epsilon,
// 	)
// );
