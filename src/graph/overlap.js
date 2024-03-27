/**
 * Rabbit Ear (c) Kraft
 */
import {
	EPSILON,
} from "../math/constant.js";
import {
	include,
	exclude,
	includeS,
	excludeS,
} from "../math/compare.js";
import {
	dot,
} from "../math/vector.js";
import {
	boundingBox,
} from "../math/polygon.js";
import {
	intersectLineLine,
} from "../math/intersect.js";
import {
	overlapLinePoint,
	overlapConvexPolygonPoint,
	overlapBoundingBoxes,
	overlapConvexPolygons,
} from "../math/overlap.js";
import {
	doRangesOverlap,
} from "../math/range.js";
import {
	chooseTwoPairs,
	clustersToReflexiveArrays,
	arrayArrayToLookupArray,
	lookupArrayToArrayArray,
} from "../general/array.js";
import {
	getEdgesLine,
	edgeToLine,
} from "./edges/lines.js";
import {
	makeFacesPolygon,
} from "./make/faces.js";
import {
	makeEdgesCoords,
} from "./make/edges.js";
import {
	sweepFaces,
} from "./sweep.js";
import {
	invertFlatToArrayMap,
} from "./maps.js";
import {
	getVerticesClusters,
} from "./vertices/clusters.js";
import {
	getSimilarEdges,
} from "./edges/duplicate.js";

/**
 * @description For every face, get a list of all other faces
 * that geometrically overlap this face.
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][]} for every face, a list of overlapping face indices
 * @linkcode
 */
export const getFacesFacesOverlap = ({
	vertices_coords, faces_vertices,
}, epsilon = EPSILON) => {
	// these polygons have no collinear vertices
	const facesPolygon = makeFacesPolygon({ vertices_coords, faces_vertices });
	const facesBounds = facesPolygon.map(polygon => boundingBox(polygon));

	// the result will go here, in a index-based sparse array.
	const overlapMatrix = faces_vertices.map(() => []);

	// store here string-separated face pair keys "a b" where a < b
	// to avoid doing duplicate work
	const history = {};

	// as we progress through the line sweep, maintain a list (hash table)
	// of the set of faces which are currently overlapping this sweep line.
	// at the beginning of an event, add new faces, at the end, remove faces.
	const setOfFaces = [];
	sweepFaces({ vertices_coords, faces_vertices }, 0, epsilon)
		.forEach(({ start, end }) => {
			// these are new faces to the sweep line, add them to the set
			start.forEach(e => { setOfFaces[e] = true; });

			// iterate through the set of all current faces crossed by the line,
			// but compare them only to the list of new faces which just joined.
			setOfFaces.forEach((_, f1) => start
				.filter(f2 => f2 !== f1)
				.forEach(f2 => {
					// prevent ourselves from doing duplicate work
					const key = f1 < f2 ? `${f1} ${f2}` : `${f2} ${f1}`;
					if (history[key]) { return; }
					history[key] = true;

					// computing the bounding box overlap first will remove all cases
					// where the pair of faces are far away in the cross-axis.
					if (!overlapBoundingBoxes(facesBounds[f1], facesBounds[f2], epsilon)
						|| !overlapConvexPolygons(facesPolygon[f1], facesPolygon[f2], epsilon)) {
						return;
					}

					// faces overlap. mark both entries in the matrix
					overlapMatrix[f1][f2] = true;
					overlapMatrix[f2][f1] = true;
				}));

			// these are faces which are leaving the sweep line, remove them from the set
			end.forEach(e => delete setOfFaces[e]);
		});
	return overlapMatrix.map(faces => Object.keys(faces).map(n => parseInt(n, 10)));
};

/**
 * @description For every edge, a list of other edge indices which are
 * collinear and overlap this edge.
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][]} for every edge, a list of other edges which
 * are collinear and overlap this edge.
 */
export const getEdgesEdgesCollinearOverlap = ({
	vertices_coords, edges_vertices
}, epsilon = EPSILON) => {
	//
	const {
		lines,
		edges_line,
	} = getEdgesLine({ vertices_coords, edges_vertices }, epsilon);

	// we're going to project each edge onto the shared line, we can't use
	// each edge's vector, we have to use the edge's line's common vector.
	const edges_range = makeEdgesCoords({ vertices_coords, edges_vertices })
		.map((points, e) => points
			.map(point => dot(lines[edges_line[e]].vector, point)));

	/** @type {number[][]} */
	const edgesEdgesOverlap = edges_vertices.map(() => []);

	invertFlatToArrayMap(edges_line)
		.flatMap(edges => chooseTwoPairs(edges))
		.filter(pair => doRangesOverlap(...pair.map(edge => edges_range[edge]), epsilon))
		.forEach(([a, b]) => {
			edgesEdgesOverlap[a].push(b);
			edgesEdgesOverlap[b].push(a);
		});

	return edgesEdgesOverlap;
};




// a valid face has 2 of these conditions:
// - face_vertices which are crossed by this edge
// - face_edges which are crossed by this edge
// - this edge's one or two endpoints lie inside of this face

// the data we have available is:
// - vertices-vertices overlap: are edge endpoints touching or not?
// - edges-vertices-overlap, exclusive.
// - edges-edges, exclusive
// - vertices-polygon-overlap, exclusive. (must be exclusive)
// and how this plays out in terms of between a face and an edge
// - vertex overlaps: taken from both vertices-vertices and edges-vertices
//   using faces_vertices[face]
// - edge overlaps: taken from edges-edges using faces_edges[face]
// - point overlaps: taken from vertices-polygon overlaps. simple.

// alternatively:
// - edges-vertices-overlap, exclusive. this edge, iterate over face_vertices
//   exclude case where 2 vertices make up an edge
// - edges-edges, exclusive
// - vertices-polygon-overlap, inclusive
// this does not work because vertices-polygon overlap now includes cases where
// both points of the same edge lie along a single polygon boundary edge.

export const getOverlappingComponents = ({
	vertices_coords, edges_vertices, faces_vertices,
}, epsilon = EPSILON) => {
	// prepare edges and faces into their geometric forms (line, polygon)
	const edgesLine = edges_vertices
		.map((_, e) => edgeToLine({ vertices_coords, edges_vertices }, e));
	const facesPolygon = faces_vertices
		.map(vertices => vertices
			.map(v => vertices_coords[v]));

	const similarVertices = getVerticesClusters({ vertices_coords }, epsilon);
	const verticesVerticesOverlap = clustersToReflexiveArrays(similarVertices);
	const verticesVertices = arrayArrayToLookupArray(
		verticesVerticesOverlap
	);

	const verticesEdges = vertices_coords.map(() => []);
	vertices_coords
		.map((coord, v) => edgesLine
			.map((_, e) => e)
			// .filter(e => overlapLinePoint(edgesLine[e], coord, excludeS, epsilon)
			// 	&& !edges_vertices[e].includes(v))
			.filter(e => overlapLinePoint(edgesLine[e], coord, excludeS, epsilon))
			.forEach(e => { verticesEdges[v][e] = true; }));
	// const edgesVerticesOverlap = lookupArrayToArrayArray(edgesVerticesOverlapLookup);

	// for every edge, intersect it against all other edges
	//   - exclude edges which contain an overlapped vertex from earlier
	const edgesEdges = edges_vertices.map(() => []);
	edgesLine
		.map((line1, e1) => edgesLine
			.map((_, e2) => e2)
			.filter(e2 => e1 !== e2
				&& intersectLineLine(line1, edgesLine[e2], excludeS, excludeS, epsilon).point !== undefined)
			.forEach(e2 => {
				edgesEdges[e1][e2] = true;
				edgesEdges[e2][e1] = true;
			}));
	// const edgesEdgesOverlap = lookupArrayToArrayArray(edgesEdgesOverlapLookup);

	// const verticesFacesOverlapLookup = vertices_coords
	// 	.map((coords, v) => facesPolygon
	// 		.map((poly, f) => (faces_vertices[f].includes(v)
	// 			? false
	// 			: overlapConvexPolygonPoint(poly, coords, exclude, epsilon).overlap
	// 		)));
	const facesVertices = faces_vertices.map(() => []);
	facesPolygon
		.map((polygon, f) => vertices_coords
			.map((_, v) => v)
			.filter(v => overlapConvexPolygonPoint(polygon, vertices_coords[v], exclude, epsilon).overlap)
			.forEach(v => { facesVertices[f][v] = true; }));
	// const verticesFacesOverlap = lookupArrayToArrayArray(verticesFacesOverlapLookup);

	return {
		verticesVertices,
		verticesEdges,
		edgesEdges,
		facesVertices,
	};
};


/**
 * @description
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][]} for every edge, a list of faces which overlap the edge
 */
export const getFacesEdgesOverlapAllData = ({
	vertices_coords, vertices_edges, edges_vertices, faces_vertices, faces_edges,
}, epsilon = EPSILON) => {
	//
	const edgesLine = edges_vertices
		.map((_, e) => edgeToLine({ vertices_coords, edges_vertices }, e));
	const facesPolygon = faces_vertices
		.map(vertices => vertices
			.map(v => vertices_coords[v]));

	// gather similar vertices
	// gather similar edges
	// gather similar faces
	const similarVertices = getVerticesClusters({ vertices_coords }, epsilon);
	const similarEdges = getSimilarEdges({
		vertices_coords, vertices_edges, edges_vertices,
	}, epsilon);

	// todo
	const similarFaces = faces_vertices.map((_, f) => [f]);

	const verticesVerticesOverlap = clustersToReflexiveArrays(similarVertices);
	const verticesVerticesOverlapLookup = arrayArrayToLookupArray(
		verticesVerticesOverlap
	);

	const edgesVerticesOverlapLookup = edgesLine
		.map((line, e) => vertices_coords
			.map((coord, v) => (edges_vertices[e].includes(v)
				? false
				: overlapLinePoint(line, coord, excludeS, epsilon))));
	const edgesVerticesOverlap = lookupArrayToArrayArray(edgesVerticesOverlapLookup);

	// for every edge, intersect it against all other edges
	//   - exclude edges which contain an overlapped vertex from earlier
	const edgesEdgesOverlapLookup = edgesLine
		.map((line1, e1) => edgesLine
			.map((line2, e2) => (e1 === e2
				? false
				: intersectLineLine(line1, line2, excludeS, excludeS, epsilon).point !== undefined
			)));
	const edgesEdgesOverlap = lookupArrayToArrayArray(edgesEdgesOverlapLookup);

	// const verticesFacesOverlapLookup = vertices_coords
	// 	.map((coords, v) => facesPolygon
	// 		.map((poly, f) => (faces_vertices[f].includes(v)
	// 			? false
	// 			: overlapConvexPolygonPoint(poly, coords, exclude, epsilon).overlap
	// 		)));
	const verticesFacesOverlapLookup = vertices_coords
		.map(coords => facesPolygon
			.map(poly => overlapConvexPolygonPoint(poly, coords, exclude, epsilon).overlap));
	const verticesFacesOverlap = lookupArrayToArrayArray(verticesFacesOverlapLookup);

	// console.log("verticesVerticesOverlap", verticesVerticesOverlap);
	// console.log("edgesVerticesOverlap", edgesVerticesOverlap);
	// console.log("edgesEdgesOverlap", edgesEdgesOverlap);
	// console.log("verticesFacesOverlap", verticesFacesOverlap);

	// - vertex overlaps: taken from both vertices-vertices and edges-vertices
	//   using faces_vertices[face]
	// - edge overlaps: taken from edges-edges using faces_edges[face] and
	//   vertex-edge overlaps
	// - point overlaps: taken from vertices-polygon overlaps. simple.

	const filterNeighbors = (indices, length) => {
		const map = {};
		indices.forEach(i => { map[i] = true; });
		const keep = indices
			.map(i => map[(i + 1) % length] === undefined
				&& map[(i + length - 1) % length] === undefined);
		return indices.filter((_, i) => keep[i]);
	};

	/**
	 *
	 */
	const getVerticesOverlap = (edge, face) => {
		const [v0, v1] = edges_vertices[edge];
		const verticesEndpoints = faces_vertices[face]
			.filter(v => verticesVerticesOverlapLookup[v][v0]
				|| verticesVerticesOverlapLookup[v][v1]);
		// these are the indices in this face's faces_vertices
		// we need this to check if the two vertices are neighbors
		// const verticesEndpointsIndices = faces_vertices[face]
		// 	.map((_, i) => i)
		// 	.filter(i => verticesVerticesOverlapLookup[faces_vertices[face][i]][v0]
		// 		|| verticesVerticesOverlapLookup[faces_vertices[face][i]][v1]);
		// const verticesEndpoints = filterNeighbors(
		// 	verticesEndpointsIndices,
		// 	faces_vertices[face].length,
		// ).map(i => faces_vertices[face][i]);
		const verticesMiddle = faces_vertices[face]
			.filter(v => edgesVerticesOverlapLookup[edge][v]);
		return Array.from(new Set([...verticesEndpoints, ...verticesMiddle]));
	};

	const getEdgesOverlap = (edge, face) => {
		const [v0, v1] = edges_vertices[edge];
		const edgesEndpoints = faces_edges[face]
			.filter(e => edgesVerticesOverlapLookup[e][v0]
				|| edgesVerticesOverlapLookup[e][v1]);
		const edgesMiddle = faces_edges[face]
			.filter(e => edgesEdgesOverlapLookup[edge][e]);
		return Array.from(new Set([...edgesEndpoints, ...edgesMiddle]));
	};

	const getPointsOverlap = (edge, face) => edges_vertices[edge]
		.filter(v => verticesFacesOverlapLookup[v][face]);

	// for every face, gather all intersected edges and vertices and filter
	//   by the formula i've written many times, either: edges + vertces = 2
	//   where vertices are not adjacent
	return faces_vertices
		.map((_, face) => edges_vertices
			.map((__, edge) => ({
				v: getVerticesOverlap(edge, face),
				e: getEdgesOverlap(edge, face),
				p: getPointsOverlap(edge, face),
			})));
};

export const getFacesEdgesOverlap = ({
	vertices_coords, vertices_edges, edges_vertices, faces_vertices, faces_edges,
}, epsilon = EPSILON) => {
	const facesEdgesOverlap = getFacesEdgesOverlapAllData({
		vertices_coords, vertices_edges, edges_vertices, faces_vertices, faces_edges,
	}, epsilon);

	facesEdgesOverlap
		.forEach((array, i) => array
			.forEach(({ v, e, p }, j) => {
				if (v.length + e.length + p.length !== 2) {
					delete facesEdgesOverlap[i][j];
				}
			}));

	return facesEdgesOverlap;
};

/**
 * @description
 * @param {FOLD} graph a FOLD object
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][]} for every edge, a list of faces which overlap the edge
 */
// export const getEdgesFacesOverlapAbandon = ({
// 	vertices_coords, vertices_edges, edges_vertices, faces_vertices, faces_edges,
// }, epsilon = EPSILON) => {
// 	//
// 	const edgesLine = edges_vertices
// 		.map((_, e) => edgeToLine({ vertices_coords, edges_vertices }, e));
// 	const facesPolygon = faces_vertices
// 		.map(vertices => vertices
// 			.map(v => vertices_coords[v]));

// 	// gather similar vertices
// 	// gather similar edges
// 	// gather similar faces
// 	const similarVertices = getVerticesClusters({ vertices_coords }, epsilon);
// 	const similarEdges = getSimilarEdges({
// 		vertices_coords, vertices_edges, edges_vertices,
// 	}, epsilon);
// 	// todo
// 	const similarFaces = faces_vertices.map((_, f) => [f]);

// 	const verticesVerticesOverlap = clustersToReflexiveArrays(similarVertices);

// 	console.log("similarVertices", similarVertices);

// 	console.log("verticesVerticesOverlap", verticesVerticesOverlap);

// 	const verticesVerticesOverlapLookup = verticesVerticesOverlap.map(indices => {
// 		const lookup = [];
// 		indices.forEach(i => { lookup[i] = true; });
// 		return lookup;
// 	});

// 	console.log("verticesVerticesOverlapLookup", verticesVerticesOverlapLookup);

// 	// for every edge, intersect it against all other vertices
// 	//   - exclude vertices which are a part of this edge
// 	//   - exclude edge endpoints
// 	const edgesVerticesOverlapMiddle = edgesLine
// 		.map((line, e) => vertices_coords
// 			.map((coord, v) => (edges_vertices[e].includes(v)
// 				? false
// 				: overlapLinePoint(line, coord, excludeS, epsilon))));

// 	const edgesVerticesOverlapEndpoints = edges_vertices.map(vertices => {
// 		const result = [];
// 		vertices.forEach(vertex => {
// 			verticesVerticesOverlapLookup[vertex].forEach((_, v) => { result[v] = true; });
// 		});
// 		return result;
// 	});

// 	console.log("edgesVerticesOverlapMiddle", edgesVerticesOverlapMiddle
// 		.map(arr => arr
// 			.map((overlap, i) => (overlap ? i : undefined))
// 			.filter(a => a !== undefined))
// 	);

// 	console.log("edgesVerticesOverlapEndpoints", edgesVerticesOverlapEndpoints
// 		.map(arr => arr
// 			.map((overlap, i) => (overlap ? i : undefined))
// 			.filter(a => a !== undefined))
// 	);

// 	// for every edge, intersect it against all other edges
// 	//   - exclude edges which contain an overlapped vertex from earlier
// 	const edgesEdgesOverlap = edgesLine
// 		.map((line1, e1) => edgesLine
// 			.map((line2, e2) => (e1 === e2
// 				? false
// 				: intersectLineLine(line1, line2, excludeS, excludeS, epsilon).point !== undefined
// 			)));

// 	console.log("edgesEdgesOverlap", edgesEdgesOverlap
// 		.map(arr => arr
// 			.map((overlap, i) => (overlap ? i : undefined))
// 			.filter(a => a !== undefined))
// 	);

// 	const verticesFacesOverlap = vertices_coords
// 		.map((coords, v) => facesPolygon
// 			.map((poly, f) => (faces_vertices[f].includes(v)
// 				? false
// 				: overlapConvexPolygonPoint(poly, coords, exclude, epsilon).overlap
// 			)));

// 	console.log("verticesFacesOverlap", verticesFacesOverlap
// 		.map(arr => arr
// 			.map((overlap, i) => (overlap ? i : undefined))
// 			.filter(a => a !== undefined))
// 	);

// 	// for every face, gather all intersected edges and vertices and filter
// 	//   by the formula i've written many times, either: edges + vertces = 2
// 	//   where vertices are not adjacent
// 	const edgesFacesOverlap = edges_vertices
// 		.map((verts, e) => faces_vertices
// 			.map((__, f) => {
// 				const edgeOverlaps = faces_edges[f].map(edge => edgesEdgesOverlap[e][edge]);
// 				const vertexOverlaps = faces_vertices[f].map(v => edgesVerticesOverlapMiddle[e][v]);
// 				const pointsInside = verts.map(v => verticesFacesOverlap[v][f]);
// 				const edgeCount = edgeOverlaps.filter(a => a).length;
// 				const vertexCount = vertexOverlaps.filter(a => a).length;
// 				const pointCount = pointsInside.filter(a => a).length;
// 				// if (edgeCount === 0 && vertexCount === 2 && pointCount === 0) {
// 				// 	const indices = vertexOverlaps
// 				// 		.map((o, i) => (o ? i : undefined))
// 				// 		.filter(a => a !== undefined);
// 				// 	console.log("special case", e, f, indices);
// 				// 	if ((indices[0] === 0 && indices[1] === vertexOverlaps.length - 1)
// 				// 	|| (indices[1] === 0 && indices[0] === vertexOverlaps.length - 1)
// 				// 	|| indices[0] - indices[1] === -1 || indices[0] - indices[1] === 1) {
// 				// 		return false;
// 				// 	}
// 				// 	return true;
// 				// }
// 				// console.log("edge face", e, f, "sum", edgeCount + vertexCount + pointCount, "parts", edgeCount, vertexCount, pointCount);
// 				return edgeCount + vertexCount + pointCount === 2;
// 			})
// 			.map((overlap, f) => (overlap ? f : undefined))
// 			.filter(a => a !== undefined));

// 	return edgesFacesOverlap;
// };
