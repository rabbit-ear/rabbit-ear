import {
	includeL,
	includeR,
	includeS,
	epsilonEqual,
} from "../math/compare.js";
import { intersectLineLine } from "../math/intersect.js";
import { makeFacesEdgesFromVertices } from "./make.js";
import { pointsToLine } from "../math/convert.js";
/**
 * @param {FOLD} graph a fold graph in foldedForm
 * @param {number[][]} segment a pair of two points forming a segment
 */
const intersectGraphLineFunc = ({
	vertices_coords, edges_vertices, faces_vertices, faces_edges,
}, userLine, lineFunc = includeL) => {
	if (!vertices_coords || !edges_vertices || !faces_vertices) {
		return { vertices: [], edges: [] };
	}
	if (!faces_edges) {
		faces_edges = makeFacesEdgesFromVertices({ edges_vertices, faces_vertices });
	}
	const edgesSegment = edges_vertices
		.map(ev => ev.map(v => vertices_coords[v]));
	const edgesIntersections = edgesSegment
		.map(seg => pointsToLine(...seg))
		.map(edgeLine => intersectLineLine(edgeLine, userLine, includeS, lineFunc));
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
	// if a face has a crossed edge or vertex,
	// const vertices = Object.keys(crossVertices);
	const facesSplitInfo = faces_vertices.map((_, f) => {
		if (facesWithOverlappedEdges[f].length) { return undefined; }
		const edges = facesWithCrossedEdges[f];
		const vertices = facesWithVertices[f];
		return edges.length + vertices.length === 2
			? { edges, vertices }
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
	return {
		faces: facesSplitInfo,
		edges: edgesIntersections,
	};
};

/**
 *
 */
export const intersectGraphLine = intersectGraphLineFunc;
/**
 *
 */
export const intersectGraphRay = (graph, ray) => (
	intersectGraphLineFunc(graph, ray, includeR)
);
/**
 *
 */
export const intersectGraphSegment = (graph, segment) => (
	intersectGraphLineFunc(graph, pointsToLine(...segment), includeS)
);
/**
 * @param {FOLD} graph a fold graph in foldedForm
 * @param {number[][]} segment a pair of two points forming a segment
 */
// export const intersectSegment = ({
// 	vertices_coords, edges_vertices, faces_vertices, faces_edges,
// }, segment) => {
// 	if (!vertices_coords || !edges_vertices || !faces_vertices) {
// 		return { vertices: [], edges: [] };
// 	}
// 	if (!faces_edges) {
// 		faces_edges = makeFacesEdgesFromVertices({ edges_vertices, faces_vertices });
// 	}
// 	const segmentLine = pointsToLine(...segment);
// 	const edgesSegment = edges_vertices
// 		.map(ev => ev.map(v => vertices_coords[v]));
// 	const edgesLine = edgesSegment.map(seg => pointsToLine(...seg));
// 	const edgesIntersections = edgesLine
// 		.map(line => intersectLineLine(line, segmentLine, includeS, includeS));
// 	const crossEdges = {};
// 	const crossVertices = {};
// 	edgesIntersections.forEach((el, e) => {
// 		if (el.a !== undefined) {
// 			const v0 = epsilonEqual(el.a, 0);
// 			const v1 = epsilonEqual(el.a, 1);
// 			if (v0) { crossVertices[edges_vertices[e][0]] = true; }
// 			if (v1) { crossVertices[edges_vertices[e][1]] = true; }
// 			if (!v0 && !v1) { crossEdges[e] = true; }
// 		}
// 	});
// 	// if a face has an overlapped edge, don't consider it as overlapped.
// 	const overlappedEdges = edges_vertices
// 		.map(ev => !!(crossVertices[ev[0]] && crossVertices[ev[1]]));
// 	// if a face has one or more crossed edges/vertices, we can place
// 	// a segment between the two intersection events.
// 	const facesWithOverlappedEdges = faces_edges
// 		.map(fe => fe.filter(e => overlappedEdges[e]));
// 	const facesWithCrossedEdges = faces_edges
// 		.map(fe => fe.filter(e => crossEdges[e]));
// 	// for a vertex to count as being "inside" a face, we want to remove from
// 	// the list any vertices which are a part of an overlapped edge, not ANY
// 	// overlapped edge, but an overlapped edge included in this face. However,
// 	// if we are already filtering out faces that contain an overlapped edge,
// 	// we don't have to worry about it in this moment.
// 	const facesWithVertices = faces_vertices
// 		.map(fv => fv.filter(v => crossVertices[v]));
// 	// if a face has a crossed edge or vertex,
// 	// const vertices = Object.keys(crossVertices);
// 	const facesSplitInfo = faces_vertices.map((_, f) => {
// 		if (facesWithOverlappedEdges[f].length) { return undefined; }
// 		const edges = facesWithCrossedEdges[f];
// 		const vertices = facesWithVertices[f];
// 		return edges.length + vertices.length === 2
// 			? { edges, vertices }
// 			: undefined;
// 	});
// 	// remove faces that aren't crossed by our line.
// 	Object.keys(facesSplitInfo)
// 		.filter(f => facesSplitInfo[f] === undefined)
// 		.forEach(f => delete facesSplitInfo[f]);
// 	// delete the edge intersections which aren't included in the split face list
// 	// this should be removing all edges which were intersected at a vertex.
// 	const includedEdges = {};
// 	facesSplitInfo
// 		.filter(el => el.edges)
// 		.forEach(({ edges }) => edges.forEach(e => { includedEdges[e] = true; }));
// 	Object.keys(edgesIntersections)
// 		.filter(e => !includedEdges[e])
// 		.forEach(e => delete edgesIntersections[e]);
// 	return {
// 		faces: facesSplitInfo,
// 		edges: edgesIntersections,
// 	};
// };
