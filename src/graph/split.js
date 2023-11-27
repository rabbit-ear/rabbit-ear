/**
 * Rabbit Ear (c) Kraft
 */
import { EPSILON } from "../math/constant.js";
import {
	includeL,
	includeR,
	includeS,
} from "../math/compare.js";
// import {
// 	add2,
// 	scale2,
// } from "../math/vector.js";
import { pointsToLine } from "../math/convert.js";
import { overlapConvexPolygonPointNew } from "../math/overlap.js";
import { intersectGraphLineFunc } from "./intersect.js";
/**
 *
 */
// const addToGraph = ({ faces, edges, vertices }, graph) => {
// 	// if there are any points that lie inside of faces, convert
// 	// them into their position in the crease pattern
// 	// faces.forEach((faceInfo, f) => faceInfo.points.forEach(el => {
// 	// 	el.cpPoint = transferPointBetweenGraphs(folded, graph, f, el.point);
// 	// }));
// 	// add new vertices to the graph: middle of edge intersections,
// 	// and points that lie somewhere inside of a face.
// 	let vCount = graph.vertices_coords.length;
// 	let eCount = graph.edges_vertices.length;
// 	const newEdgesNewVertex = edges.intersected.map(() => vCount++);
// 	faces.forEach((el, f) => el.points.forEach((_, i) => {
// 		faces[f].points[i].newIndex = vCount++;
// 	}));
// 	// append these vertices_coords to our crease pattern
// 	const vertices_coords = {};
// 	edges.intersected.forEach((el, e) => {
// 		const edgeSegment = graph.edges_vertices[e].map(v => graph.vertices_coords[v]);
// 		const edgeLine = pointsToLine(...edgeSegment);
// 		return add2(edgeLine.origin, scale2(edgeLine.vector, el.a));
// 	}).filter(a => a !== undefined);
// 	faces
// 		.forEach(info => info.points
// 			.forEach(el => { vertices_coords.push(el.cpPoint); }));
// 	// append these edges_vertices to our crease pattern
// 	const edges_vertices = faces.map((face) => {
// 		const newVerticesEdgesMap = face.edges.map(e => newEdgesNewVertex[e]);
// 		const newVerticesPointsMap = face.points.map(el => el.newIndex);
// 		// guaranteed to be length 2.
// 		// console.log("length 2", newVerticesEdgesMap.concat(newVerticesPointsMap).concat(vertices));
// 		return newVerticesEdgesMap.concat(newVerticesPointsMap).concat(face.vertices);
// 	}).filter(a => a !== undefined);

// 	return {
// 		vertices_coords,
// 		edges_vertices,
// 		edges_assignment: edges_vertices.map(() => "F"),
// 		edges_foldAngle: edges_vertices.map(() => 0),
// 	};
// };
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
const splitGraphLineFunc = (
	{ vertices_coords, edges_vertices, faces_vertices, faces_edges },
	line,
	userPoints = [],
	lineFunc = includeL,
	epsilon = EPSILON,
) => {
	if (!vertices_coords || !edges_vertices || !faces_vertices) {
		return { vertices: [], edges: [] };
	}

	const { faces, edges, vertices } = intersectGraphLineFunc(
		{ vertices_coords, edges_vertices, faces_vertices, faces_edges },
		line,
		lineFunc,
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

	faces.forEach((face, f) => {
		const count = (faces[f].points
			? faces[f].vertices.length + faces[f].edges.length + faces[f].points.length
			: faces[f].vertices.length + faces[f].edges.length);
		if (count < 2) { delete faces[f]; }
	});

	return { faces, edges, vertices };
};
/**
 * @description Intersect a line with a graph.
 * @param {FOLD} graph a fold graph, creasePattern or foldedForm
 * @param {VecLine} line a line in "vector" "origin" form
 */
export const splitLineWithGraph = (graph, line, epsilon = EPSILON) => (
	splitGraphLineFunc(graph, line, [], includeL, epsilon)
);
/**
 * @description Intersect a ray with a graph.
 * @param {FOLD} graph a fold graph, creasePattern or foldedForm
 * @param {VecLine} ray a ray in "vector" "origin" form
 */
export const splitRayWithGraph = (graph, ray, epsilon = EPSILON) => (
	splitGraphLineFunc(graph, ray, [ray.origin], includeR, epsilon)
);
/**
 * @description Intersect a segment with a graph.
 * @param {FOLD} graph a fold graph, creasePattern or foldedForm
 * @param {number[][]} segment a pair of two points forming a segment
 */
export const splitSegmentWithGraph = (graph, segment, epsilon = EPSILON) => (
	splitGraphLineFunc(
		graph,
		pointsToLine(...segment),
		segment,
		includeS,
		epsilon,
	)
);
