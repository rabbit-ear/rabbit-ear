/**
 * Rabbit Ear (c) Kraft
 */
import { EPSILON } from "../math/constant.js";
import {
	includeL,
	includeR,
	includeS,
} from "../math/compare.js";
import {
	magSquared,
	dot2,
	cross2,
	subtract2,
} from "../math/vector.js";
import { pointsToLine } from "../math/convert.js";
import { intersectLineLine } from "../math/intersect.js";
import { makeFacesEdgesFromVertices } from "./make.js";

/**
 *
 */
export const intersectVerticesLineFunc = (
	{ vertices_coords },
	{ vector, origin },
	lineDomain = includeL,
	epsilon = EPSILON,
) => {
	const lineMagSq = magSquared(vector);
	const lineMag = Math.sqrt(lineMagSq);
	if (lineMag < epsilon) {
		return vertices_coords.map(() => false);
	}
	return vertices_coords
		.map(coord => subtract2(coord, origin))
		.map(vec => Math.abs(cross2(vec, vector)) < epsilon
			&& lineDomain(dot2(vec, vector) / lineMagSq, epsilon / lineMag));
};

/**
 *
 */
export const intersectEdgesLineFunc = (
	{ vertices_coords, edges_vertices },
	line,
	lineFunc = includeL,
	epsilon = EPSILON,
) => {
	if (!vertices_coords || !edges_vertices) {
		return { vertices: [], edges: [] };
	}

	// for every vertex, does that vertex lie along the line.
	const vertices = intersectVerticesLineFunc(
		{ vertices_coords },
		line,
		lineFunc,
		epsilon,
	);

	// for every edge, count the number of its vertices that lie along the line.
	// results will be: 0, 1, or 2. I'll call these "degree 2 edges".
	// if an edge is 2 it's collinear, if 1 we can ignore it, and if it's 0
	// we will need to run the intersection algorithm to know if it intersects.
	const overlapVertexCount = edges_vertices
		.map(ev => vertices[ev[0]] + vertices[ev[1]]);

	// if the edge contains no vertices which overlap the line,
	// perform a line-segment intersection, otherwise do nothing.
	const intersected = edges_vertices
		.map(ev => ev.map(v => vertices_coords[v]))
		.map((seg, e) => (overlapVertexCount[e] === 0
			? intersectLineLine(pointsToLine(...seg), line, includeS, lineFunc)
			: ({})));

	// this will clear the "intersected" array of both:
	// - edges which are not overlapped (degree 1 or 2)
	// - edges of degree 0, but the intersection call resulted in no intersection
	intersected
		.map((_, i) => i)
		.filter(i => !intersected[i].point)
		.forEach(i => delete intersected[i]);

	// if a face has an overlapped edge, don't consider it as overlapped.
	const collinear = overlapVertexCount.map(count => count === 2);

	return {
		vertices, // array of true, false
		edges: {
			collinear, // array of true, false
			intersected, // array with holes
		},
	};
};

/**
 * @description Internal function for performing line/ray/segment
 * intersection with a graph.
 * @param {FOLD} graph a fold graph in creasePattern or foldedForm
 * @param {VecLine} line a line/ray/segment in vector origin form
 * @param {number[][]} in the case of a ray or segment, place in here
 * the endpoint(s), and they will be included in the result.
 * @param {function} lineFunc the function which characterizes "line"
 * parameter into a line, ray, or segment.
 */
export const intersectGraphLineFunc = (
	{ vertices_coords, edges_vertices, faces_vertices, faces_edges },
	line,
	lineFunc = includeL,
	epsilon = EPSILON,
) => {
	if (!faces_vertices) { return { vertices: [], edges: [] }; }
	if (!faces_edges) {
		faces_edges = makeFacesEdgesFromVertices({ edges_vertices, faces_vertices });
	}
	const {
		vertices,
		edges: {
			collinear,
			intersected,
		},
	} = intersectEdgesLineFunc(
		{ vertices_coords, edges_vertices },
		line,
		lineFunc,
		epsilon,
	);

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
		.map(fv => fv.filter(v => vertices[v]));

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
		vertices: vertices
			.map((overlap, i) => (overlap ? i : undefined))
			.filter(a => a !== undefined),
	};
};

/**
 * @description Intersect a line with a graph.
 * @param {FOLD} graph a fold graph, creasePattern or foldedForm
 * @param {VecLine} line a line in "vector" "origin" form
 */
export const intersectGraphLine = (graph, line, epsilon = EPSILON) => (
	intersectGraphLineFunc(graph, line, includeL, epsilon)
);

/**
 * @description Intersect a ray with a graph.
 * @param {FOLD} graph a fold graph, creasePattern or foldedForm
 * @param {VecLine} ray a ray in "vector" "origin" form
 */
export const intersectGraphRay = (graph, ray, epsilon = EPSILON) => (
	intersectGraphLineFunc(graph, ray, includeR, epsilon)
);

/**
 * @description Intersect a segment with a graph.
 * @param {FOLD} graph a fold graph, creasePattern or foldedForm
 * @param {number[][]} segment a pair of two points forming a segment
 */
export const intersectGraphSegment = (graph, segment, epsilon = EPSILON) => (
	intersectGraphLineFunc(
		graph,
		pointsToLine(...segment),
		includeS,
		epsilon,
	)
);
