/**
 * Rabbit Ear (c) Kraft
 */
import math from "../math";
import implied from "./countImplied";
import {
	planarVertexWalk,
	filterWalkedBoundaryFace,
} from "./walk";
import { sortVerticesCounterClockwise } from "./sort";
/**
 * all of the graph methods follow a similar format.
 * the first argument is a FOLD graph. and the graph remains unmodified.
 * the method returns the data array.
 *
 * if you want to modify the input graph, assign the property after making it
 *  var graph = {...};
 *  graph.faces_faces = makeFacesFaces(graph);
 */
/**
 *
 *    VERTICES
 *
 */
/**
 * @param {object} FOLD object, with entry "edges_vertices"
 * @returns {number[][]} array of array of numbers. each index is a vertex with
 *   the content an array of numbers, edge indices this vertex is adjacent.
 */
export const makeVerticesEdgesUnsorted = ({ edges_vertices }) => {
	const vertices_edges = [];
	// iterate over edges_vertices and swap the index for each of the contents
	// each edge (index 0: [3, 4]) will be converted into (index 3: [0], index 4: [0])
	// repeat. append to each array.
	edges_vertices.forEach((ev, i) => ev
		.forEach((v) => {
			if (vertices_edges[v] === undefined) {
				vertices_edges[v] = [];
			}
			vertices_edges[v].push(i);
		}));
	return vertices_edges;
};
/**
 * @param {object} FOLD object, with entry "edges_vertices"
 * @returns {number[][]} array of array of numbers. each index is a vertex with
 *   the content an array of numbers, edge indices this vertex is adjacent.
 *
 * this one corresponds to vertices_vertices!
 */
export const makeVerticesEdges = ({ edges_vertices, vertices_vertices }) => {
	const edge_map = makeVerticesToEdgeBidirectional({ edges_vertices });
	return vertices_vertices
		.map((verts, i) => verts
			.map(v => edge_map[`${i} ${v}`]));
};
/**
 * discover adjacent vertices by way of their edge relationships.
 *
 * required FOLD arrays:
 * - vertices_coords
 * - edges_vertices
 *
 * helpful FOLD arrays: (will be made anyway)
 * - vertices_edges
 *
 * editor note: i almost rewrote this by caching edges_vector, making it
 * resemble the make_faces_vertices but the elegance of this simpler solution
 * feels like it outweighed the added complexity. it's worth revisiting tho.
 *
 * note: it is possible to rewrite this method to use faces_vertices to
 * discover adjacent vertices, currently this is 
 */
export const makeVerticesVertices = ({ vertices_coords, vertices_edges, edges_vertices }) => {
	if (!vertices_edges) {
		vertices_edges = makeVerticesEdgesUnsorted({ edges_vertices });
	}
	// use adjacent edges to find adjacent vertices
	const vertices_vertices = vertices_edges
		.map((edges, v) => edges
			// the adjacent edge's edges_vertices also contains this vertex,
			// filter it out and we're left with the adjacent vertices
			.map(edge => edges_vertices[edge]
				.filter(i => i !== v))
			.reduce((a, b) => a.concat(b), []));
	return vertices_coords === undefined
		? vertices_vertices
		: vertices_vertices
			.map((verts, i) => sortVerticesCounterClockwise({ vertices_coords }, verts, i));
};
/**
 * this DOES NOT arrange faces in counter-clockwise order, as the spec suggests
 * use makeVerticesFaces for that, which requires vertices_vertices.
 */
export const makeVerticesFacesUnsorted = ({ vertices_coords, faces_vertices }) => {
	if (!faces_vertices) { return vertices_coords.map(() => []); }
	// instead of initializing the array ahead of time (we would need to know
	// the length of something like vertices_coords)
	const vertices_faces = vertices_coords !== undefined
		? vertices_coords.map(() => [])
		: Array.from(Array(implied.vertices({ faces_vertices }))).map(() => []);
	// iterate over every face, then iterate over each of the face's vertices
	faces_vertices.forEach((face, f) => {
		// in the case that one face visits the same vertex multiple times,
		// this hash acts as an intermediary, basically functioning like a set,
		// and only allow one occurence of each vertex index.
		const hash = [];
		face.forEach((vertex) => { hash[vertex] = f; });
		hash.forEach((fa, v) => vertices_faces[v].push(fa));
	});
	return vertices_faces;
};
/**
 * this does arrange faces in counter-clockwise order, as the spec suggests
 */
export const makeVerticesFaces = ({ vertices_coords, vertices_vertices, faces_vertices }) => {
	if (!faces_vertices) { return vertices_coords.map(() => []); }
	if (!vertices_vertices) {
		return makeVerticesFacesUnsorted({ vertices_coords, faces_vertices });
	}
	const face_map = makeVerticesToFace({ faces_vertices });
	return vertices_vertices
		.map((verts, v) => verts
			.map((vert, i, arr) => [arr[(i + 1) % arr.length], v, vert]
				.join(" ")))
		.map(keys => keys
			.map(key => face_map[key]));
		// .filter(a => a !== undefined) // removed. read below.
};
// the old version of this method contained a filter to remove "undefined".
// because in the case of a boundary vertex of a closed polygon shape, there
// is no face that winds backwards around the piece and encloses infinity.
// unfortunately, this disconnects the index match with vertices_vertices.
/**
 * *not a geometry array*
 *
 * for fast backwards lookup of a edge by its vertices. this dictionary:
 * keys are each edge's vertices as a string separated by a space: "9 3"
 * value is the index of the edge.
 * example: "9 3" and "3 9" are both entries with a value of the edge's index.
 */
export const makeVerticesToEdgeBidirectional = ({ edges_vertices }) => {
	const map = {};
	edges_vertices
		.map(ev => ev.join(" "))
		.forEach((key, i) => { map[key] = i; });
	edges_vertices
		.map(ev => `${ev[1]} ${ev[0]}`)
		.forEach((key, i) => { map[key] = i; });
	return map;
};
/**
 * same as above. but this method doesn't duplicate "9 3" and "3 9" it
 * only represents the edge in the direction it's stored. this is useful
 * for example for looking up the edge's vector, which is direction specific.
 */
export const makeVerticesToEdge = ({ edges_vertices }) => {
	const map = {};
	edges_vertices
		.map(ev => ev.join(" "))
		.forEach((key, i) => { map[key] = i; });
	return map;
};
export const makeVerticesToFace = ({ faces_vertices }) => {
	const map = {};
	faces_vertices
		.forEach((face, f) => face
			.map((_, i) => [0, 1, 2]
				.map(j => (i + j) % face.length)
				.map(i => face[i])
				.join(" "))
			.forEach(key => { map[key] = f; }));
	return map;
};

// this can someday be rewritten without edges_vertices
export const makeVerticesVerticesVector = ({ vertices_coords, vertices_vertices, edges_vertices, edges_vector }) => {
	if (!edges_vector) {
		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	}
	const edge_map = makeVerticesToEdge({ edges_vertices });
	return vertices_vertices
		.map((_, a) => vertices_vertices[a]
			.map((b) => {
				const edge_a = edge_map[`${a} ${b}`];
				const edge_b = edge_map[`${b} ${a}`];
				if (edge_a !== undefined) { return edges_vector[edge_a]; }
				if (edge_b !== undefined) { return math.core.flip(edges_vector[edge_b]); }
			}));
};
/**
 * between counter-clockwise adjacent edges around a vertex, there lies
 * sectors, the interior angle space between edges.
 * this builds a list of sector angles in radians, index matched
 * to vertices_vertices.
 */
export const makeVerticesSectors = ({ vertices_coords, vertices_vertices, edges_vertices, edges_vector }) =>
	makeVerticesVerticesVector({ vertices_coords, vertices_vertices, edges_vertices, edges_vector })
		.map(vectors => vectors.length === 1 // leaf node
			? [math.core.TWO_PI] // interior_angles gives 0 for leaf nodes. we want 2pi
			: math.core.counterClockwiseSectors2(vectors));
/**
 *
 *    EDGES
 *
 */
// export const make_edges_vertices = ({ faces_vertices }) => { };
/**
 * @param {object} FOLD object, with entries "edges_vertices", "vertices_edges".
 * @returns {number[][]} each entry relates to an edge, each array contains indices
 *   of other edges that are vertex-adjacent.
 * @description edges_edges are vertex-adjacent edges. make sure to call
 *   makeVerticesEdgesUnsorted before calling this.
 */
export const makeEdgesEdges = ({ edges_vertices, vertices_edges }) =>
	edges_vertices.map((verts, i) => {
		const side0 = vertices_edges[verts[0]].filter(e => e !== i);
		const side1 = vertices_edges[verts[1]].filter(e => e !== i);
		return side0.concat(side1);
	});
	// if (!edges_vertices || !vertices_edges) { return undefined; }

export const makeEdgesFacesUnsorted = ({ edges_vertices, faces_edges }) => {
	// instead of initializing the array ahead of time (we would need to know
	// the length of something like edges_vertices)
	const edges_faces = edges_vertices !== undefined
		? edges_vertices.map(() => [])
		: Array.from(Array(implied.edges({ faces_edges }))).map(() => []);
	// todo: does not arrange counter-clockwise
	faces_edges.forEach((face, f) => {
		const hash = [];
		// in the case that one face visits the same edge multiple times,
		// this hash acts as a set allowing one occurence of each edge index.
		face.forEach((edge) => { hash[edge] = f; });
		hash.forEach((fa, e) => edges_faces[e].push(fa));
	});
	return edges_faces;
};

export const makeEdgesFaces = ({ vertices_coords, edges_vertices, edges_vector, faces_vertices, faces_edges, faces_center }) => {
	if (!edges_vertices) {
		return makeEdgesFacesUnsorted({ faces_edges });
	}
	if (!edges_vector) {
		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	}
	const edges_origin = edges_vertices.map(pair => vertices_coords[pair[0]]);
	if (!faces_center) {
		faces_center = makeFacesCenter({ vertices_coords, faces_vertices });
	}
	const edges_faces = edges_vertices.map(ev => []);
	faces_edges.forEach((face, f) => {
		const hash = [];
		// in the case that one face visits the same edge multiple times,
		// this hash acts as a set allowing one occurence of each edge index.
		face.forEach((edge) => { hash[edge] = f; });
		hash.forEach((fa, e) => edges_faces[e].push(fa));
	});
	// sort edges_faces in 2D based on which side of the edge's vector
	// each face lies, sorting the face on the left first. see FOLD spec.
	edges_faces.forEach((faces, e) => {
		const faces_cross = faces
			.map(f => faces_center[f])
			.map(center => math.core.subtract2(center, edges_origin[e]))
			.map(vector => math.core.cross2(vector, edges_vector[e]));
		faces.sort((a, b) => faces_cross[a] - faces_cross[b]);
	});
	return edges_faces;
};

const assignment_angles = { M: -180, m: -180, V: 180, v: 180 };

export const makeEdgesFoldAngle = ({ edges_assignment }) => edges_assignment
	.map(a => assignment_angles[a] || 0);

export const makeEdgesAssignment = ({ edges_foldAngle }) => edges_foldAngle
	.map(a => {
		// todo, consider finding the boundary
		if (a === 0) { return "F"; }
		return a < 0 ? "M" : "V";
	});
/**
 * @description map vertices_coords onto edges_vertices so that the result
 * is an edge array where each edge contains its two points. Each point being
 * the 2D or 3D coordinate as an array of numbers.
 * @param {FOLD} graph a FOLD graph with vertices and edges
 * @returns {number[][][]} an array of array of points (which are arrays of numbers)
 */
export const makeEdgesCoords = ({ vertices_coords, edges_vertices }) =>
	edges_vertices
		.map(ev => ev.map(v => vertices_coords[v]));
/**
 * @param {FOLD} graph a FOLD graph, with "vertices_coords", "edges_vertices"
 * @returns {number[]} a vector beginning at vertex 0, ending at vertex 1
 */
export const makeEdgesVector = ({ vertices_coords, edges_vertices }) =>
	makeEdgesCoords({ vertices_coords, edges_vertices })
		.map(verts => math.core.subtract(verts[1], verts[0]));
/**
 * @param {FOLD} graph a FOLD graph, with "vertices_coords", "edges_vertices"
 * @returns {number[]} the Euclidean distance between each edge's vertices.
 */
export const makeEdgesLength = ({ vertices_coords, edges_vertices }) =>
	makeEdgesVector({ vertices_coords, edges_vertices })
		.map(vec => math.core.magnitude(vec));
/**
 * @description Make an array of axis-aligned bounding boxes, one for each edge,
 * that encloses the edge, and will work in n-dimensions. Intended for
 * fast line-sweep algorithms.
 * @param {FOLD} graph a FOLD graph with vertices and edges.
 * @returns {object[]} an array of boxes, length matching the number of edges
 */
export const makeEdgesBoundingBox = ({ vertices_coords, edges_vertices, edges_coords }, epsilon = 0) => {
	if (!edges_coords) {
		edges_coords = makeEdgesCoords({ vertices_coords, edges_vertices });
	}
	return edges_coords.map(coords => math.core.boundingBox(coords, epsilon))
};
/**
 *
 *    FACES
 *
 */
export const makePlanarFaces = ({ vertices_coords, vertices_vertices, vertices_edges, vertices_sectors, edges_vertices, edges_vector }) => {
	if (!vertices_vertices) {
		vertices_vertices = makeVerticesVertices({ vertices_coords, edges_vertices, vertices_edges });
	}
	if (!vertices_sectors) {
		vertices_sectors = makeVerticesSectors({ vertices_coords, vertices_vertices, edges_vertices, edges_vector });
	}
	const vertices_edges_map = makeVerticesToEdgeBidirectional({ edges_vertices });
	// removes the one face that outlines the piece with opposite winding.
	// planarVertexWalk stores edges as vertex pair strings, "4 9",
	// convert these into edge indices
	return filterWalkedBoundaryFace(
			planarVertexWalk({ vertices_vertices, vertices_sectors }))
		.map(f => ({ ...f, edges: f.edges.map(e => vertices_edges_map[e]) }));
};

// without sector detection, this could be simplified so much that it only uses vertices_vertices.
export const makePlanarFacesVertices = graph => makePlanarFaces(graph)
	.map(face => face.vertices);

export const makePlanarFacesEdges = graph => makePlanarFaces(graph)
	.map(face => face.edges);

// const make_vertex_pair_to_edge_map = function ({ edges_vertices }) {
// 	if (!edges_vertices) { return {}; }
// 	const map = {};
// 	edges_vertices
// 		.map(ev => ev.sort((a, b) => a - b).join(" "))
// 		.forEach((key, i) => { map[key] = i; });
// 	return map;
// };
// todo: this needs to be tested
export const makeFacesVerticesFromEdges = (graph) => {
	return graph.faces_edges
		.map(edges => edges
			.map(edge => graph.edges_vertices[edge])
			.map((pairs, i, arr) => {
				const next = arr[(i + 1) % arr.length];
				return (pairs[0] === next[0] || pairs[0] === next[1])
					? pairs[1]
					: pairs[0];
			}));
};
export const makeFacesEdgesFromVertices = (graph) => {
	const map = makeVerticesToEdgeBidirectional(graph);
	return graph.faces_vertices
		.map(face => face
			.map((v, i, arr) => [v, arr[(i + 1) % arr.length]].join(" ")))
		.map(face => face.map(pair => map[pair]));
};
/**
 * @param {FOLD} graph a FOLD graph, with entry "faces_vertices"
 * @returns {number[][]} each index relates to a face, each entry is an array
 * of numbers, each number is an index of an edge-adjacent face to this face.
 * @description faces_faces is a list of edge-adjacent face indices for each face.
 */
export const makeFacesFaces = ({ faces_vertices }) => {
	const faces_faces = faces_vertices.map(() => []);
	const edgeMap = {};
	faces_vertices
		.map((face, f) => face
			.map((v0, i, arr) => {
				let v1 = arr[(i + 1) % face.length];
				if (v1 < v0) { [v0, v1] = [v1, v0]; }
				const key = `${v0} ${v1}`;
				if (edgeMap[key] === undefined) { edgeMap[key] = {}; }
				edgeMap[key][f] = true;
			}));
	Object.values(edgeMap)
		.map(obj => Object.keys(obj))
		.filter(arr => arr.length > 1)
		.forEach(pair => {
			faces_faces[pair[0]].push(parseInt(pair[1]));
			faces_faces[pair[1]].push(parseInt(pair[0]));
		});
	return faces_faces;
};
// export const makeFacesFaces = ({ faces_vertices }) => {
//   // if (!faces_vertices) { return undefined; }
//   const faces_faces = faces_vertices.map(() => []);
//   // create a map where each key is a string of the vertices of an edge,
//   // like "3 4"
//   // and each value is an array of faces adjacent to this edge. 
//   const edgeMap = {};
//   faces_vertices.forEach((vertices_index, idx1) => {
//     vertices_index.forEach((v1, i, vs) => {
//       let v2 = vs[(i + 1) % vertices_index.length];
//       if (v2 < v1) { [v1, v2] = [v2, v1]; }
//       const key = `${v1} ${v2}`;
//       if (key in edgeMap) {
//         const idx2 = edgeMap[key];
//         faces_faces[idx1].push(idx2);
//         faces_faces[idx2].push(idx1);
//       } else {
//         edgeMap[key] = idx1;
//       }
//     });
//   });
//   return faces_faces;
// };
/**
 * @description map vertices_coords onto each face's set of vertices,
 * turning each face into an array of points, with an additional step:
 * ensure that each polygon has 0 collinear vertices.
 * this can result in a polygon with fewer vertices than is contained
 * in that polygon's faces_vertices array.
 */
export const makeFacesPolygon = ({ vertices_coords, faces_vertices }, epsilon) =>
	faces_vertices
		.map(verts => verts.map(v => vertices_coords[v]))
		.map(polygon => math.core.makePolygonNonCollinear(polygon, epsilon));
/**
 * @description map vertices_coords onto each face's set of vertices,
 * turning each face into an array of points.
 */
export const makeFacesPolygonQuick = ({ vertices_coords, faces_vertices }) =>
	faces_vertices
		.map(verts => verts.map(v => vertices_coords[v]));
/**
 * @description for every face, get one point that is the face's centroid.
 */
export const makeFacesCenter = ({ vertices_coords, faces_vertices }) => faces_vertices
	.map(fv => fv.map(v => vertices_coords[v]))
	.map(coords => math.core.centroid(coords));
/**
 * @description This uses point average, not centroid, faces must
 * be convex, and again it's not precise, but in many use cases
 * this is often more than sufficient.
 */
export const makeFacesCenterQuick = ({ vertices_coords, faces_vertices }) =>
	faces_vertices
		.map(vertices => vertices
			.map(v => vertices_coords[v])
			.reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0])
			.map(el => el / vertices.length));
