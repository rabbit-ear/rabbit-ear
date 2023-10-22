import {
	includeL,
	includeR,
	includeS,
	epsilonEqual,
} from "../math/compare.js";
import { intersectLineLine } from "../math/intersect.js";
import { overlapConvexPolygonPointNew } from "../math/overlap.js";
import {
	makeFacesEdgesFromVertices,
	makeFacesPolygonQuick,
} from "./make.js";
import { pointsToLine } from "../math/convert.js";
/**
 * @description Internal function for performing line/ray/segment
 * intersection with a graph.
 * @param {FOLD} graph a fold graph in foldedForm
 * @param {VecLine} line a line/ray/segment in vector origin form
 * @param {number[][]} in the case of a ray or segment, place in here
 * the endpoint(s), and they will be included in the result.
 * @param {function} lineFunc the function which characterizes "line"
 * parameter into a line, ray, or segment.
 */
const intersectGraphLineFunc = ({
	vertices_coords, edges_vertices, faces_vertices, faces_edges,
}, line, userPoints = [], lineFunc = includeL) => {
	if (!vertices_coords || !edges_vertices || !faces_vertices) {
		return { vertices: [], edges: [] };
	}
	if (!faces_edges) {
		faces_edges = makeFacesEdgesFromVertices({ edges_vertices, faces_vertices });
	}
	const edgesSegment = edges_vertices
		.map(ev => ev.map(v => vertices_coords[v]));
	edgesSegment.forEach((seg, e) => {
		if (seg.includes(undefined)) { delete edgesSegment[e]; }
	});
	const edgesIntersections = edgesSegment
		.map(seg => pointsToLine(...seg))
		.map(edgeLine => intersectLineLine(edgeLine, line, includeS, lineFunc));
	const crossEdges = {};
	const crossVertices = {};
	edgesIntersections.forEach((el, e) => {
		if (el.a !== undefined) {
			const v0 = epsilonEqual(el.a, 0);
			const v1 = epsilonEqual(el.a, 1);
			if (v0) { crossVertices[edges_vertices[e][0]] = true; }
			if (v1) { crossVertices[edges_vertices[e][1]] = true; }
			if (!v0 && !v1) { crossEdges[e] = true; }
		}
	});
	// if a face has an overlapped edge, don't consider it as overlapped.
	const overlappedEdges = edges_vertices
		.map(ev => !!(crossVertices[ev[0]] && crossVertices[ev[1]]));
	// if a face has one or more crossed edges/vertices, we can place
	// a segment between the two intersection events.
	const facesWithOverlappedEdges = faces_edges
		.map(fe => fe.filter(e => overlappedEdges[e]));
	const facesWithCrossedEdges = faces_edges
		.map(fe => fe.filter(e => crossEdges[e]));
	// for a vertex to count as being "inside" a face, we want to remove from
	// the list any vertices which are a part of an overlapped edge, not ANY
	// overlapped edge, but an overlapped edge included in this face. However,
	// if we are already filtering out faces that contain an overlapped edge,
	// we don't have to worry about it in this moment.
	const facesWithVertices = faces_vertices
		.map(fv => fv.filter(v => crossVertices[v]));

	// /////////////////////////
	const facesContainPoint = userPoints.length
		? makeFacesPolygonQuick({
			vertices_coords, faces_vertices,
		}).map(poly => userPoints.map(point => ({
			...overlapConvexPolygonPointNew(poly, point),
			point,
		}))).map(results => results.filter(el => el.overlap))
		: undefined;
	// /////////////////////////

	// if a face has a crossed edge or vertex,
	const facesSplitInfo = faces_vertices.map((_, f) => {
		if (facesWithOverlappedEdges[f].length) { return undefined; }
		const edges = facesWithCrossedEdges[f];
		const vertices = facesWithVertices[f];
		const points = facesContainPoint ? facesContainPoint[f] : [];
		return edges.length + vertices.length + points.length === 2
			? { edges, vertices, points }
			: undefined;
	});
	// remove faces that aren't crossed by our line.
	Object.keys(facesSplitInfo)
		.filter(f => facesSplitInfo[f] === undefined)
		.forEach(f => delete facesSplitInfo[f]);
	// delete the edge intersections which aren't included in the split face list
	// this should be removing all edges which were intersected at a vertex.
	const includedEdges = {};
	facesSplitInfo
		.filter(el => el.edges)
		.forEach(({ edges }) => edges.forEach(e => { includedEdges[e] = true; }));
	Object.keys(edgesIntersections)
		.filter(e => !includedEdges[e])
		.forEach(e => delete edgesIntersections[e]);
	const edges_overlapped = overlappedEdges
		.map((over, e) => (over ? e : undefined))
		.filter(a => a !== undefined);
	return {
		faces: facesSplitInfo,
		edges: edgesIntersections,
		edges_overlapped,
	};
};
/**
 * @description Intersect a line with a graph.
 * @param {FOLD} graph a fold graph, creasePattern or foldedForm
 * @param {VecLine} line a line in "vector" "origin" form
 */
export const intersectGraphLine = (graph, line) => (
	intersectGraphLineFunc(graph, line, [], includeL)
);
/**
 * @description Intersect a ray with a graph.
 * @param {FOLD} graph a fold graph, creasePattern or foldedForm
 * @param {VecLine} ray a ray in "vector" "origin" form
 */
export const intersectGraphRay = (graph, ray) => (
	intersectGraphLineFunc(graph, ray, [ray.origin], includeR)
);
/**
 * @description Intersect a segment with a graph.
 * @param {FOLD} graph a fold graph, creasePattern or foldedForm
 * @param {number[][]} segment a pair of two points forming a segment
 */
export const intersectGraphSegment = (graph, segment) => (
	intersectGraphLineFunc(
		graph,
		pointsToLine(...segment),
		segment,
		includeS,
	)
);
