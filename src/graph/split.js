/**
 * Rabbit Ear (c) Kraft
 */
import {
	EPSILON,
} from "../math/constant.js";
import {
	includeL,
	includeR,
	includeS,
} from "../math/compare.js";
import {
	pointsToLine,
} from "../math/convert.js";
import {
	overlapConvexPolygonPointNew,
} from "../math/overlap.js";
import {
	makeFacesEdgesFromVertices,
} from "./make.js";
import {
	invertFlatMap,
	invertFlatToArrayMap,
} from "./maps.js";
import {
	intersectWithLine,
	intersectWithLineVerticesEdges,
} from "./intersect.js";

/**
 * @description Method for performing line/ray/segment intersection with
 * a FOLD graph and returning intersection information with faces,
 * edges, and vertices.
 * @param {FOLD} graph a fold graph in creasePattern or foldedForm
 * @param {VecLine} line a line/ray/segment in vector origin form
 * @param {function} lineDomain the function which characterizes "line"
 * parameter into a line, ray, or segment.
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {object} a summary of intersections with faces, edges, and vertices
 * - "faces" contains keys: "edges", "vertices" where each contains existing
 *   component indices which are overlapped by the line.
 * - "edges" contains "collinear" and "intersected" where collinear is simply
 *   a list of edge indices, and intersected is a map between an existing edge
 *   index (key) to an intersection result with "a", "b" and "point" as the value.
 * - "vertices" contains a list of existing vertex indices which
 *   are overlapped by the line.
 */
const prepareSplitGraph = (
	{ vertices_coords, edges_vertices, faces_vertices, faces_edges },
	line,
	lineDomain = includeL,
	epsilon = EPSILON,
) => {
	// calculate intersections with vertices and edges
	const { vertices, edges } = intersectWithLineVerticesEdges(
		{ vertices_coords, edges_vertices },
		line,
		lineDomain,
		epsilon,
	);
	const verticesOverlap = vertices.map(v => v !== undefined);
	const collinear = edges_vertices
		.map(ev => verticesOverlap[ev[0]] && verticesOverlap[ev[1]]);
	const intersected = edges;

	intersected.forEach((el, e) => { if (el === undefined) { delete intersected[e]; } });

	edges_vertices
		.map((verts, e) => (verticesOverlap[verts[0]] || verticesOverlap[verts[1]]
			? e
			: undefined))
		.filter(a => a !== undefined)
		.forEach(e => delete intersected[e]);

	// if faces don't exist, we can still return intersection information
	// regarding the vertices and edges.
	if (!faces_vertices) {
		return {
			vertices,
			edges: { collinear, intersected },
			faces: { edges: [], vertices: [] },
		};
	}
	if (!faces_edges) {
		faces_edges = makeFacesEdgesFromVertices({ edges_vertices, faces_vertices });
	}

	// if a face has one or more crossed edges/vertices, we can place
	// a segment between the two intersection events.
	const facesWithOverlappedEdges = faces_edges
		.map(fe => fe.filter(e => collinear[e]));
	const facesWithCrossedEdges = faces_edges
		.map(fe => fe.filter(e => intersected[e]));

	// for a vertex to count as being "inside" a face, we want to remove from
	// the list any vertices which are a part of an overlapped edge, not ANY
	// overlapped edge, but an overlapped edge included in this face. However,
	// if we are already filtering out faces that contain an overlapped edge,
	// we don't have to worry about it in this moment.
	const facesWithVertices = faces_vertices
		.map(fv => fv.filter(v => verticesOverlap[v]));

	// if a face has a crossed edge or vertex,
	const faces = faces_vertices.map((_, f) => {
		if (facesWithOverlappedEdges[f].length) { return undefined; }
		const faceEdges = facesWithCrossedEdges[f];
		const faceVertices = facesWithVertices[f];
		return faceEdges.length + faceVertices.length
			? { edges: faceEdges, vertices: faceVertices }
			: undefined;
	});

	// remove faces that aren't crossed by our line.
	Object.keys(faces)
		.filter(f => faces[f] === undefined)
		.forEach(f => delete faces[f]);

	return {
		faces,
		edges: {
			intersected,
			collinear: collinear
				.map((overlap, e) => (overlap ? e : undefined))
				.filter(a => a !== undefined),
		},
		vertices: verticesOverlap
			.map((overlap, v) => (overlap ? v : undefined))
			.filter(a => a !== undefined),
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
 * @param {number[][]} userPoints in the case of a ray or segment, place
 * in here the endpoint(s), and they will be included in the result.
 * @param {function} lineDomain the function which characterizes "line"
 * parameter into a line, ray, or segment.
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {FOLD} graph a FOLD graph containing only the line's
 * geometry, as a list of vertices and edges, but with some additional data:
 * - vertices_overlapInfo: for each vertex, this is the result of the
 *   intersection algorithm which made the vertex. useful for re-calculating
 *   the coordinate in another graph's space (transfer foldedForm to CP)
 * - collinear_edges: a list of edge indices from the original graph that
 *   lie collinear to this line. You may want to use this to change the
 *   edge assignment of these edges.
 */
export const splitGraphLineFunction = (
	{ vertices_coords, edges_vertices, faces_vertices, faces_edges },
	line,
	userPoints = [],
	lineDomain = includeL,
	epsilon = EPSILON,
) => {
	if (!vertices_coords || !edges_vertices || !faces_vertices) {
		return undefined;
	}

	// we aren't using the "vertices" data returned by this method.
	const { edges, faces } = prepareSplitGraph(
		{ vertices_coords, edges_vertices, faces_vertices, faces_edges },
		line,
		lineDomain,
		epsilon,
	);

	if (userPoints.length) {
		faces.forEach((_, f) => {
			const poly = faces_vertices[f].map(v => vertices_coords[v]);
			const points = userPoints.map(point => ({
				...overlapConvexPolygonPointNew(poly, point),
				point,
			})).filter(el => el.overlap);
			faces[f].points = points;
		});
	}

	// non-convex faces, faces which have more than 2 intersection points
	const nonConvexFaces = {};

	// filter to contain only faces which have 2 vertices inside.
	faces.forEach((face, f) => {
		const count = (faces[f].points
			? faces[f].vertices.length + faces[f].edges.length + faces[f].points.length
			: faces[f].vertices.length + faces[f].edges.length);
		// todo: here is part 1 of hard-coding to only work with convex faces
		// if (count < 2) { delete faces[f]; }
		if (count > 2) { nonConvexFaces[f] = true; }
		if (count !== 2) { delete faces[f]; }
	});

	// new vertices come from one of two places:
	// - overlap with an edge
	// - overlap with a face, inside, not touching any of its edges
	let vCount = vertices_coords.length;

	// the vertices coords for the new vertices
	const new_vertices_coords = [];

	// the result of the intersection algorithm which calculated the new coords.
	const new_vertices_overlapInfo = [];

	// the edge or face which this new vertex overlaps, where it comes from.
	const new_vertices_onEdge = [];
	const new_vertices_inFace = [];

	// // these edges intersected with the line but at one of its endpoints.
	// // we will use this in the upcoming section to filter out edges.
	// const edgesEndpointOverlap = edges_vertices
	// 	.map(verts => vertices[verts[0]] || vertices[verts[1]]);

	// loop through the intersected edge vertices, and overlapped face vertices,
	// add each new vertex data into the arrays.
	// only include edges which intersect somewhere in the interior of the edge.
	edges.intersected
		// .map((intersection, edge) => (intersection ? edge : undefined))
		// .filter(a => a !== undefined)
		// .filter(edge => !edgesEndpointOverlap[edge])
		// .map(edge => ({ ...edges.intersected[edge], edge }))
		// .forEach(({ a, b, point, edge }) => {
		.forEach(({ a, b, point }, edge) => {
			new_vertices_onEdge[vCount] = edge;
			new_vertices_overlapInfo[vCount] = { a, b, point, edge };
			new_vertices_coords[vCount++] = point;
		});
	faces.forEach(({ points }, face) => points.forEach((overlap) => {
		new_vertices_inFace[vCount] = face;
		new_vertices_overlapInfo[vCount] = { ...overlap, face };
		new_vertices_coords[vCount++] = overlap.point;
	}));

	// for each edge/face involved, what are its new vertices indices
	// edges will only contain one, faces can contain multiple
	const newEdgesVertex = invertFlatMap(new_vertices_onEdge);
	const newFacesVertices = invertFlatToArrayMap(new_vertices_inFace);

	// loop through the faces and consulting the face's edges, vertices,
	// and new interior points (whichever of these three exist),
	// create a new edge which connects the pair of new vertices.
	// todo: convex face hard coded part 2
	// currently this is hard coded to work with convex faces only,
	// and if we were to expand it, we need to gather all new vertices,
	// order them geometrically, and build a consecutive list of them.
	let eCount = edges_vertices.length;
	const new_edges_vertices = [];
	faces.forEach((face, f) => {
		const edgesVertices = face.edges.map(e => newEdgesVertex[e]);
		const interiorVertices = newFacesVertices[f];
		new_edges_vertices[eCount++] = edgesVertices
			.concat(interiorVertices)
			.concat(face.vertices)
			.filter(a => a !== undefined);
	});

	return {
		vertices_coords: new_vertices_coords,
		vertices_overlapInfo: new_vertices_overlapInfo,
		edges_vertices: new_edges_vertices,
		collinear_edges: edges.collinear,
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
 * @param {VecLine} line a line in vector origin form
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {FOLD} graph a FOLD graph containing only the line's
 * geometry, as a list of vertices and edges, but with some additional data:
 * - vertices_overlapInfo: for each vertex, this is the result of the
 *   intersection algorithm which made the vertex. useful for re-calculating
 *   the coordinate in another graph's space (transfer foldedForm to CP)
 * - collinear_edges: a list of edge indices from the original graph that
 *   lie collinear to this line. You may want to use this to change the
 *   edge assignment of these edges.
 */
export const splitLineWithGraph = (graph, line, epsilon = EPSILON) => (
	splitGraphLineFunction(graph, line, [], includeL, epsilon)
);

/**
 * @description Given a 2D ray and a graph with vertices in 2D, split
 * the ray at every vertex/edge, resulting in a graph containing only
 * the new ray, prepared as a list of vertices and edges. The indices
 * of the resulting graph are made into arrays with a large hole
 * at the start making sure there is no overlap with the existing graph's
 * indices. This allows the two graphs to very simply be able to be merged.
 * The edge indices will make use of existing vertices when possible, so,
 * edges_vertices may reference vertex indices from the source graph.
 * @param {FOLD} graph a fold graph in creasePattern or foldedForm
 * @param {VecLine} ray a ray in vector origin form
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {FOLD} graph a FOLD graph containing only the ray's
 * geometry, as a list of vertices and edges, but with some additional data:
 * - vertices_overlapInfo: for each vertex, this is the result of the
 *   intersection algorithm which made the vertex. useful for re-calculating
 *   the coordinate in another graph's space (transfer foldedForm to CP)
 * - collinear_edges: a list of edge indices from the original graph that
 *   lie collinear to this ray. You may want to use this to change the
 *   edge assignment of these edges.
 */
export const splitRayWithGraph = (graph, ray, epsilon = EPSILON) => (
	splitGraphLineFunction(graph, ray, [ray.origin], includeR, epsilon)
);

/**
 * @description Given a 2D segment and a graph with vertices in 2D, split
 * the segment at every vertex/edge, resulting in a graph containing only
 * the new segment, prepared as a list of vertices and edges. The indices
 * of the resulting graph are made into arrays with a large hole
 * at the start making sure there is no overlap with the existing graph's
 * indices. This allows the two graphs to very simply be able to be merged.
 * The edge indices will make use of existing vertices when possible, so,
 * edges_vertices may reference vertex indices from the source graph.
 * @param {FOLD} graph a fold graph in creasePattern or foldedForm
 * @param {number[][]} segment a segment in vector origin form
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {FOLD} graph a FOLD graph containing only the segment's
 * geometry, as a list of vertices and edges, but with some additional data:
 * - vertices_overlapInfo: for each vertex, this is the result of the
 *   intersection algorithm which made the vertex. useful for re-calculating
 *   the coordinate in another graph's space (transfer foldedForm to CP)
 * - collinear_edges: a list of edge indices from the original graph that
 *   lie collinear to this segment. You may want to use this to change the
 *   edge assignment of these edges.
 */
export const splitSegmentWithGraph = (graph, segment, epsilon = EPSILON) => (
	splitGraphLineFunction(
		graph,
		pointsToLine(...segment),
		segment,
		includeS,
		epsilon,
	)
);
