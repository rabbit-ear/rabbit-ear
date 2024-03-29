/**
 * Rabbit Ear (c) Kraft
 */
import {
	EPSILON,
} from "../math/constant.js";
import {
	exclude,
	excludeS,
	includeS,
	epsilonEqual,
	epsilonEqualVectors,
} from "../math/compare.js";
import {
	intersectLineLine,
	intersectConvexPolygonLine,
} from "../math/intersect.js";
import {
	overlapBoundingBoxes,
	overlapConvexPolygonPoint,
} from "../math/overlap.js";
import {
	makeEdgesVector,
	makeEdgesBoundingBox,
	makeEdgesCoords,
} from "../graph/make/edges.js";
import {
	makeFacesPolygon,
} from "../graph/make/faces.js";
import {
	makeEdgesFacesUnsorted,
} from "../graph/make/edgesFaces.js";
import {
	boundingBox,
} from "../math/polygon.js";
import {
	makeFacesWinding,
} from "../graph/faces/winding.js";
import {
	sweep,
} from "../graph/sweep.js";
import {
	edgeToLine,
} from "../graph/edges/lines.js";


const booleanMatrixToIndexedArray = matrix => matrix
	.map(row => row
		.map((value, i) => (value === true ? i : undefined))
		.filter(a => a !== undefined));


const makeEdgesEdgesSimilar = ({
	vertices_coords, edges_vertices, edges_coords, edges_boundingBox,
}, epsilon = EPSILON) => {
	if (!edges_coords) {
		edges_coords = makeEdgesCoords({ vertices_coords, edges_vertices });
	}
	if (!edges_boundingBox) {
		edges_boundingBox = makeEdgesBoundingBox({
			vertices_coords, edges_vertices, edges_coords,
		});
	}
	const indexFirst = edges_vertices.map((_, i) => i).shift();
	const matrix = Array.from(Array(edges_coords.length)).map(() => []);
	if (indexFirst === undefined) { return booleanMatrixToIndexedArray(matrix); }
	const dimensions = edges_boundingBox[indexFirst].min.length;
	for (let i = 0; i < edges_coords.length - 1; i += 1) {
		if (!edges_boundingBox[i]) { continue; }
		for (let j = i + 1; j < edges_coords.length; j += 1) {
			if (!edges_boundingBox[j]) { continue; }
			let similar = true;
			for (let d = 0; d < dimensions; d += 1) {
				if (!epsilonEqual(
					edges_boundingBox[i].min[d],
					edges_boundingBox[j].min[d],
					epsilon,
				) || !epsilonEqual(
					edges_boundingBox[i].max[d],
					edges_boundingBox[j].max[d],
					epsilon,
				)) {
					similar = false;
				}
			}
			matrix[i][j] = similar;
			matrix[j][i] = similar;
		}
	}
	for (let i = 0; i < edges_coords.length - 1; i += 1) {
		for (let j = i + 1; j < edges_coords.length; j += 1) {
			if (!matrix[i][j]) { continue; }
			const test0 = epsilonEqualVectors(edges_coords[i][0], edges_coords[j][0], epsilon)
				&& epsilonEqualVectors(edges_coords[i][1], edges_coords[j][1], epsilon);
			const test1 = epsilonEqualVectors(edges_coords[i][0], edges_coords[j][1], epsilon)
				&& epsilonEqualVectors(edges_coords[i][1], edges_coords[j][0], epsilon);
			const similar = test0 || test1;
			matrix[i][j] = similar;
			matrix[j][i] = similar;
		}
	}
	return booleanMatrixToIndexedArray(matrix);
};

/**
 * @description For every edge, a list of face indices which overlap the edge.
 * @param {FOLD} graph a FOLD graph
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][]} for every edge, an array of face indices
 * which overlap this edge or an empty if no faces overlap the edge.
 */
export const getEdgesFacesOverlapOld = ({
	vertices_coords, edges_vertices, edges_vector, edges_faces, faces_vertices,
}, epsilon = EPSILON) => {
	if (!edges_vector) {
		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	}

	/** @type {number[][][]} */
	const matrix = edges_vertices
		.map(() => faces_vertices.map(() => []));
	edges_faces.forEach((faces, e) => faces
		.forEach(f => { matrix[e][f] = false; }));
	const edges_coords = edges_vertices
		.map(verts => verts.map(v => vertices_coords[v]));

	// todo: is this okay if it contains adjacent collinear edges?
	const faces_coords = faces_vertices
		.map(verts => verts.map(v => vertices_coords[v]));
	// const faces_coords = makeFacesPolygon({ vertices_coords, faces_vertices });
	makeFacesWinding({ vertices_coords, faces_vertices })
		.map((winding, i) => (!winding ? i : undefined))
		.filter(f => f !== undefined)
		.forEach(f => faces_coords[f].reverse());

	const edges_boundingBox = makeEdgesBoundingBox({ edges_coords });
	const faces_bounds = faces_coords.map(coords => boundingBox(coords));

	// should be inclusive, positive epsilon, we are filtering out
	// edge face pairs which DEFINITELY don't overlap.
	for (let e = 0; e < matrix.length; e += 1) {
		if (!edges_boundingBox[e]) { continue; }
		for (let f = 0; f < matrix[e].length; f += 1) {
			if (matrix[e][f] === false) { continue; }
			if (!faces_bounds[f]) { continue; }
			if (!overlapBoundingBoxes(faces_bounds[f], edges_boundingBox[e], epsilon)) {
				matrix[e][f] = false;
				continue;
			}
		}
	}
	// edges similar. able to duplicate solutions to other edges if they exist.
	const edges_similar = makeEdgesEdgesSimilar({
		vertices_coords, edges_vertices, edges_coords, edges_boundingBox,
	});
	// compute overlap
	const finished_edges = {};
	for (let e = 0; e < matrix.length; e += 1) {
		if (finished_edges[e]) { continue; }
		if (!edges_coords[e]) { continue; }
		for (let f = 0; f < matrix[e].length; f += 1) {
			if (matrix[e][f] !== undefined) { continue; }
			if (!faces_coords[f]) { continue; }
			const point_in_poly = edges_coords[e]
				.map(point => overlapConvexPolygonPoint(
					faces_coords[f],
					point,
					exclude,
					1e-3,
				).overlap).reduce((a, b) => a || b, false);
			if (point_in_poly) { matrix[e][f] = true; continue; }
			const edge_intersect = intersectConvexPolygonLine(
				faces_coords[f],
				{ vector: edges_vector[e], origin: edges_coords[e][0] },
				excludeS,
				excludeS,
				epsilon,
			);
			if (edge_intersect) { matrix[e][f] = true; continue; }
			matrix[e][f] = false;
		}
		edges_similar[e].forEach(adjacent_edge => {
			matrix[adjacent_edge] = matrix[e].slice();
			finished_edges[adjacent_edge] = true;
		});
	}
	return matrix
		.map(faces => faces
			.map((overlap, i) => (overlap ? i : undefined))
			.filter(i => i !== undefined));
};



/**
 * @param {FOLD} graph a FOLD object
 */
export const getEdgesFacesOverlap = ({
	vertices_coords, edges_vertices, edges_vector, edges_faces, faces_vertices,
}, epsilon = EPSILON) => {
	if (!edges_vector) {
		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	}

	// const faces_coords = faces_vertices
	// 	.map(verts => verts.map(v => vertices_coords[v]));
	const faces_coords = makeFacesPolygon({ vertices_coords, faces_vertices });

	makeFacesWinding({ vertices_coords, faces_vertices })
		.map((winding, i) => (!winding ? i : undefined))
		.filter(f => f !== undefined)
		.forEach(f => faces_coords[f].reverse());

	const edgesLine = edges_vertices
		.map((_, e) => edgeToLine({ vertices_coords, edges_vertices }, e));

	// create a quick hash lookup for edges_faces
	const edgesFacesLookup = edges_faces.map(faces => {
		const obj = {};
		faces.forEach(f => { obj[f] = true; });
		return obj;
	});

	return edges_vertices
		.map(verts => verts.map(v => vertices_coords[v]))
		.map((segment, e) => faces_coords
			.map((polygon, f) => {
				if (edgesFacesLookup[e][f]) { return undefined; }
				const pointInPolygon = segment.map(point => (
					overlapConvexPolygonPoint(polygon, point, exclude, 1e-3).overlap
				)).reduce((a, b) => a || b, false);
				// if (pointInPolygon) { return f; }
				const edge_intersect = intersectConvexPolygonLine(
					polygon,
					edgesLine[e],
					excludeS,
					excludeS,
					epsilon,
					// (e === 62 || e === 63) && f > 16 && f < 23
				);
				// if ((e === 62 || e === 63) && f > 16 && f < 23) {
				// 	console.log(e, f, pointInPolygon, edge_intersect)
				// }
				if (pointInPolygon) { return f; }
				return edge_intersect !== undefined ? f : undefined;
			}).filter(a => a !== undefined));
};





export const getEdgesEdgesOverlapingSpans = ({
	vertices_coords, edges_vertices, edges_coords,
}, epsilon = EPSILON) => {
	const min_max = makeEdgesBoundingBox({ vertices_coords, edges_vertices, edges_coords }, epsilon);
	const span_overlaps = edges_vertices.map(() => []);
	// span_overlaps will be false if no overlap possible, true if overlap is possible.
	for (let e0 = 0; e0 < edges_vertices.length - 1; e0 += 1) {
		for (let e1 = e0 + 1; e1 < edges_vertices.length; e1 += 1) {
			// if first max is less than second min, or second max is less than first min,
			// for both X and Y
			const outside_of = (
				(min_max[e0].max[0] < min_max[e1].min[0] || min_max[e1].max[0] < min_max[e0].min[0])
				&& (min_max[e0].max[1] < min_max[e1].min[1] || min_max[e1].max[1] < min_max[e0].min[1]));
			// true if the spans are not touching. flip for overlap
			span_overlaps[e0][e1] = !outside_of;
			span_overlaps[e1][e0] = !outside_of;
		}
	}
	for (let i = 0; i < edges_vertices.length; i += 1) {
		span_overlaps[i][i] = true;
	}
	return span_overlaps;
};

export const makeEdgesEdgesIntersection = function ({
	vertices_coords, edges_vertices,
}, epsilon = EPSILON) {
	const edgesLine = edges_vertices
		.map((_, e) => edgeToLine({ vertices_coords, edges_vertices }, e));
	const edges_intersections = edges_vertices.map(() => []);
	const span = getEdgesEdgesOverlapingSpans({ vertices_coords, edges_vertices }, epsilon);
	for (let i = 0; i < edges_vertices.length - 1; i += 1) {
		if (!edges_vertices[i]) { continue; }
		for (let j = i + 1; j < edges_vertices.length; j += 1) {
			if (!edges_vertices[j]) { continue; }
			if (span[i][j] !== true) { continue; }
			edges_intersections[i][j] = intersectLineLine(
				edgesLine[i],
				edgesLine[j],
				includeS,
				includeS,
				epsilon,
			).point !== undefined;
			edges_intersections[j][i] = edges_intersections[i][j];
		}
	}
	return edges_intersections;
};


export const getEdgesFacesOverlapNew = ({
	vertices_coords, edges_vertices, edges_vector, edges_faces, faces_vertices, faces_edges,
}, epsilon = EPSILON) => {
	if (!edges_vector) {
		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	}

	const edges_edgesIntersect = makeEdgesEdgesIntersection({
		vertices_coords, edges_vertices, edges_vector,
	}, epsilon);

	console.log("faces_edges", faces_edges);
	console.log("edges_edgesIntersect", edges_edgesIntersect);

	// const faces_coords = faces_vertices
	// 	.map(verts => verts.map(v => vertices_coords[v]));
	const faces_coords = makeFacesPolygon({ vertices_coords, faces_vertices });

	makeFacesWinding({ vertices_coords, faces_vertices })
		.map((winding, i) => (!winding ? i : undefined))
		.filter(f => f !== undefined)
		.forEach(f => faces_coords[f].reverse());

	// create a quick hash lookup for edges_faces
	const edgesFacesLookup = edges_faces.map(faces => {
		const obj = {};
		faces.forEach(f => { obj[f] = true; });
		return obj;
	});

	return edges_vertices
		.map(verts => verts.map(v => vertices_coords[v]))
		.map(([p, q], e) => faces_coords
			.map((polygon, f) => {
				if (edgesFacesLookup[e][f]) { return undefined; }
				console.log("chexcking", e, f, faces_edges[f], faces_edges[f].filter(edge => edges_edgesIntersect[e][edge]).length);
				if (overlapConvexPolygonPoint(polygon, p, exclude, 1e-3).overlap
					|| overlapConvexPolygonPoint(polygon, q, exclude, 1e-3).overlap) {
					console.log("point in poly");
					return f;
				}
				// if (faces_edges[f].some(edge => edges_edgesIntersect[e][edge])) {
				if (faces_edges[f].filter(edge => edges_edgesIntersect[e][edge]).length > 1) {
					console.log("edge on edge");
					return f;
				}
				return undefined;
			}).filter(a => a !== undefined));
};



/**
 * update: yet again, there is something wrong with this method.
 *
 * @description well, this was supposed to be an improvement. try checking
 * these lines: setOfFaces.forEach((_, f) => setOfEdges.forEach((__, e) => {
 * it might have something to do with doing too many comparisons and not
 * only comparing against the new ones (not the entire current stack)
 */
// export const getEdgesFacesOverlapNew = ({
// 	vertices_coords, edges_vertices, edges_faces, faces_vertices, faces_edges,
// }, epsilon = EPSILON) => {
// 	if (!edges_faces) {
// 		edges_faces = makeEdgesFacesUnsorted({ edges_vertices, faces_edges });
// 	}
// 	const faces_winding = makeFacesWinding({ vertices_coords, faces_vertices });
// 	const edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
// 	// use graph vertices_coords for edges vertices
// 	const edges_origin = edges_vertices
// 		.map(verts => vertices_coords[verts[0]]);
// 	// const edges_similar = makeEdgesEdgesSimilar({ vertices_coords, edges_vertices });
// 	const edges_coords = edges_vertices
// 		.map(verts => verts.map(v => vertices_coords[v]));
// 	const faces_coords = faces_vertices
// 		.map(verts => verts.map(v => vertices_coords[v]));
// 	faces_winding.forEach((winding, i) => {
// 		if (!winding) {
// 			faces_coords[i].reverse();
// 		}
// 	});
// 	const edgesFacesLookup = edges_faces.map(() => []);
// 	edges_faces
// 		.forEach((faces, e) => faces
// 			.forEach(f => { edgesFacesLookup[e][f] = true; }));
// 	const edges_bounds = makeEdgesBoundingBox({ edges_coords });
// 	const faces_bounds = faces_coords.map(coords => boundingBox(coords));
// 	const intersections = edges_vertices.map(() => []);
// 	// as we progress through the line sweep, maintain a list (hash table)
// 	// of the set of edges which are currently overlapping this sweep line.
// 	const computeEdgeFace = (e, f) => {
// 		if (edgesFacesLookup[e][f]) { return; }
// 		if (intersections[e][f]) { return; }
// 		if (!overlapBoundingBoxes(faces_bounds[f], edges_bounds[e], epsilon)) { return; }
// 		// todo: memo the vertex-in-face result
// 		const point_in_poly = edges_coords[e]
// 			.map(point => overlapConvexPolygonPoint(
// 				faces_coords[f],
// 				point,
// 				exclude,
// 				epsilon,
// 			).overlap).reduce((a, b) => a || b, false);
// 		if (point_in_poly) { intersections[e][f] = true; return; }
// 		const edge_intersect = intersectConvexPolygonLine(
// 			faces_coords[f],
// 			{ vector: edges_vector[e], origin: edges_origin[e] },
// 			excludeS,
// 			excludeS,
// 			epsilon,
// 		);
// 		if (edge_intersect) { intersections[e][f] = true; }
// 	};
// 	const setOfEdges = [];
// 	const setOfFaces = [];
// 	sweep({ vertices_coords, edges_vertices, faces_vertices }, 0, epsilon)
// 		.forEach(event => {
// 			event.edges.start.forEach(e => { setOfEdges[e] = true; });
// 			event.faces.start.forEach(f => { setOfFaces[f] = true; });
// 			setOfEdges
// 				.forEach((_, e) => event.faces.start
// 					.forEach(f => computeEdgeFace(e, f)));
// 			setOfFaces
// 				.forEach((_, f) => event.edges.start
// 					.forEach(e => computeEdgeFace(e, f)));
// 			event.edges.end.forEach(e => delete setOfEdges[e]);
// 			event.faces.end.forEach(f => delete setOfFaces[f]);
// 		});
// 	return intersections
// 		.map(faces => faces
// 			.map((overlap, i) => (overlap ? i : undefined))
// 			.filter(i => i !== undefined));
// };
