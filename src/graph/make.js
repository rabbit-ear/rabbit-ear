/**
 * Rabbit Ear (c) Kraft
 */
import {
	TWO_PI,
} from "../math/constant.js";
import {
	flip,
	subtract2,
	add,
	cross2,
	normalize,
	subtract,
	dot,
	magnitude,
} from "../math/vector.js";
import {
	counterClockwiseSectors2,
} from "../math/radial.js";
import {
	boundingBox,
	makePolygonNonCollinear,
	centroid,
} from "../math/polygon.js";
import implied from "./countImplied.js";
import {
	walkPlanarFaces,
	filterWalkedBoundaryFace,
} from "./walk.js";
import {
	sortVerticesCounterClockwise,
} from "./vertices/sort.js";
import {
	makeFacesNormal,
} from "./normals.js";
import Messages from "../environment/messages.js";

/**
 * This is one big file (sorry, circular dependencies otherwise) which contains
 * methods to create all the geometry arrays in the FOLD spec,
 * like "vertices_vertices", "faces_edges"..
 *
 * They are all named in camelCase (not snake, like the FOLD spec names they make),
 * following the format: "make" + the FOLD array name + any clarifying comments
 * such as "2D" or "from___" describing where the data is pulled from.
 *
 * all of the parameters required for each method follow a similar format:
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
 * @description Make `vertices_edges` from `edges_vertices`, unsorted, which should
 * be used sparingly. Prefer makeVerticesEdges().
 * @param {FOLD} graph a FOLD object, containing edges_vertices
 * @returns {number[][]} array of array of numbers, where each row corresponds to a
 * vertex index and the values in the inner array are edge indices.
 * @linkcode Origami ./src/graph/make.js 56
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
 * @description Make `vertices_edges` sorted, so that the edges are sorted
 * radially around the vertex, corresponding with the order in `vertices_vertices`.
 * @param {FOLD} graph a FOLD object, containing edges_vertices, vertices_vertices
 * @returns {number[][]} array of array of numbers, where each row corresponds to a
 * vertex index and the values in the inner array are edge indices.
 * @linkcode Origami ./src/graph/make.js 78
 */
export const makeVerticesEdges = ({ edges_vertices, vertices_vertices }) => {
	const edge_map = makeVerticesToEdgeBidirectional({ edges_vertices });
	return vertices_vertices
		.map((verts, i) => verts
			.map(v => edge_map[`${i} ${v}`]));
};

/**
 * @description Make `vertices_vertices` sorted radially counter-clockwise.
 * @param {FOLD} graph a FOLD object, containing vertices_coords, vertices_edges, edges_vertices
 * @returns {number[][]} array of array of numbers, where each row corresponds to a
 * vertex index and the values in the inner array are vertex indices.
 * @linkcode Origami ./src/graph/make.js 91
 */
export const makeVerticesVertices2D = ({ vertices_coords, vertices_edges, edges_vertices }) => {
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
 * @description Make `vertices_vertices` sorted radially counter-clockwise.
 * @param {FOLD} graph a FOLD object, containing vertices_coords, vertices_edges, edges_vertices
 * @returns {number[][]} array of array of numbers, where each row corresponds to a
 * vertex index and the values in the inner array are vertex indices.
 * @linkcode Origami ./src/graph/make.js 115
 */
export const makeVerticesVerticesFromFaces = ({
	vertices_coords, vertices_faces, faces_vertices,
}) => {
	if (!vertices_faces) {
		vertices_faces = makeVerticesFacesUnsorted({ vertices_coords, faces_vertices });
	}
	// every iterate through every vertices_faces's faces_vertices
	const vertices_faces_vertices = vertices_faces
		.map(faces => faces.map(f => faces_vertices[f]));
	// for every vertex, find its index in its faces_vertices array.
	const vertices_faces_indexOf = vertices_faces_vertices
		.map((faces, vertex) => faces.map(verts => verts.indexOf(vertex)));
	// get the three vertices (before, this vertex, after) in this vertex's
	// faces_vertices array maintaining the counter clockwise order.
	const vertices_faces_threeIndices = vertices_faces_vertices
		.map((faces, vertex) => faces.map((verts, j) => [
			(vertices_faces_indexOf[vertex][j] + verts.length - 1) % verts.length,
			vertices_faces_indexOf[vertex][j],
			(vertices_faces_indexOf[vertex][j] + 1) % verts.length,
		]));
	// convert these three indices in face_vertices arrays into absolute
	// indices to vertices, so that we have three consecutive vertex indices.
	// for example, vertex #7's entry might be an array containing:
	// [141, 7, 34]
	// [34, 7, 120]
	// [120, 7, 141]
	const vertices_faces_threeVerts = vertices_faces_threeIndices
		.map((faces, vertex) => faces
			.map((indices, j) => indices
				.map(index => vertices_faces_vertices[vertex][j][index])));
	// convert the three neighbor vertices into two pairs, maintaining order,
	// which include the vertex in the middle, these represent the pairs of
	// vertices which make up the edge of the face, for all faces, in counter-
	// clockwise order around this vertex.
	const vertices_verticesLookup = vertices_faces_threeVerts.map(faces => {
		// facesVerts matches the order in this vertex's faces_vertices array.
		// it contains vertex pair keys ([141, 7, 34] becomes ["141 7", "7 34"])
		// which represent this face's adjacent vertices to our vertex
		// coming to and from this vertex.
		const facesVerts = faces
			.map(verts => [[0, 1], [1, 2]]
				.map(p => p.map(x => verts[x]).join(" ")));
		const from = {};
		const to = {};
		facesVerts.forEach((keys, i) => {
			from[keys[0]] = i;
			to[keys[1]] = i;
		});
		return { facesVerts, to, from };
	});
	// using the data from above, walk around the vertex by starting with an
	// edge, an edge represented as a pair of vertices, and alternate:
	// 1. using the vertex-pair's adjacent face to get the other pair in
	//    the same face, and,
	// 2. swapping the vertices in the string ("141 7" becomes "7 141") to
	//    find jump to another face, this being the adjacent face in the walk.
	// care needs to be taken because this vertex may be adjacent to holes.
	// a solution is possible if there are up to two holes, but a vertex
	// with more than two holes is technically unsolvable.
	return vertices_verticesLookup.map(lookup => {
		// locate any holes if they exist, holes are when the inverse of
		// a "to" key does not exist in the "from" lookup, or visa versa.
		const toKeys = Object.keys(lookup.to);
		const toKeysInverse = toKeys
			.map(key => key.split(" ").reverse().join(" "));
		// hole keys are made from "from" indices, so each one can be
		// the start of a counter clockwise walk path
		const holeKeys = toKeys
			.filter((_, i) => !(toKeysInverse[i] in lookup.from));
		// console.log("holeKeys", holeKeys);
		if (holeKeys.length > 2) {
			console.warn("vertices_vertices found an unsolvable vertex");
			return [];
		}
		// the start keys will be either each hole key, or just pick a key
		// if no holes exist
		const startKeys = holeKeys.length
			? holeKeys
			: [toKeys[0]];
		// vertex_vertices is each vertex's vertices_vertices
		const vertex_vertices = [];
		// in the case of no holes, "visited" will indicate we finished.
		const visited = {};
		for (let s = 0; s < startKeys.length; s += 1) {
			const startKey = startKeys[s];
			const walk = [startKey];
			visited[startKey] = true;
			let isDone = false;
			do {
				const prev = walk[walk.length - 1];
				const faceIndex = lookup.to[prev];
				// this indicates the end of a walk which ended at a hole
				if (!(faceIndex in lookup.facesVerts)) { break; }
				let nextKey;
				if (lookup.facesVerts[faceIndex][0] === prev) {
					nextKey = lookup.facesVerts[faceIndex][1];
				}
				if (lookup.facesVerts[faceIndex][1] === prev) {
					nextKey = lookup.facesVerts[faceIndex][0];
				}
				if (nextKey === undefined) { return "not found"; }
				const nextKeyFlipped = nextKey.split(" ").reverse().join(" ");
				walk.push(nextKey);
				// this indicates the end of a walk which completed a cycle
				isDone = (nextKeyFlipped in visited);
				if (!isDone) { walk.push(nextKeyFlipped); }
				// update the visited dictionary
				visited[nextKey] = true;
				visited[nextKeyFlipped] = true;
			} while (!isDone);
			// walk now contains keys like "4 0", "1 4", "4 1", "2 4", "4 2",
			// mod 2 so that every edge is represented only once, which
			// still works with odd numbers since we start at a hole, and get the
			// one vertex which isn't our vertex. now we have our vertices_vertices
			const vertexKeys = walk
				.filter((_, i) => i % 2 === 0)
				.map(key => key.split(" ")[1])
				.map(str => parseInt(str, 10));
			vertex_vertices.push(...vertexKeys);
		}
		return vertex_vertices;
	});
};

/**
 * @description Make `vertices_vertices` sorted radially counter-clockwise.
 * @param {FOLD} graph a FOLD object, containing vertices_coords, vertices_edges, edges_vertices
 * @returns {number[][]} array of array of numbers, where each row corresponds to a
 * vertex index and the values in the inner array are vertex indices.
 * @linkcode Origami ./src/graph/make.js 245
 */
export const makeVerticesVertices = (graph) => {
	if (!graph.vertices_coords || !graph.vertices_coords.length) { return []; }
	const dimensions = graph.vertices_coords.filter(() => true).shift().length;
	switch (dimensions) {
	case 3:
		return makeVerticesVerticesFromFaces(graph);
	default:
		return makeVerticesVertices2D(graph);
	}
};

/**
 *
 */
export const makeVerticesVerticesUnsorted = ({ vertices_edges, edges_vertices }) => {
	if (!vertices_edges) {
		vertices_edges = makeVerticesEdgesUnsorted({ edges_vertices });
	}
	// use adjacent edges to find adjacent vertices
	return vertices_edges
		.map((edges, v) => edges
			// the adjacent edge's edges_vertices also contains this vertex,
			// filter it out and we're left with the adjacent vertices
			.flatMap(edge => edges_vertices[edge].filter(i => i !== v)));
};

/**
 * @description Make `vertices_faces` **not sorted** counter-clockwise,
 * which should be used sparingly. Prefer makeVerticesFaces().
 * @param {FOLD} graph a FOLD object, containing vertices_coords, faces_vertices
 * @returns {number[][]} array of array of numbers, where each row corresponds to a
 * vertex index and the values in the inner array are face indices.
 * @linkcode Origami ./src/graph/make.js 276
 */
export const makeVerticesFacesUnsorted = ({ vertices_coords, vertices_edges, faces_vertices }) => {
	const vertArray = vertices_coords || vertices_edges;
	if (!faces_vertices) { return (vertArray || []).map(() => []); }
	// instead of initializing the array ahead of time (we would need to know
	// the length of something like vertices_coords or vertices_edges)
	const vertices_faces = vertArray !== undefined
		? vertArray.map(() => [])
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
 * @description Make `vertices_faces` sorted counter-clockwise.
 * @param {FOLD} graph a FOLD object, containing vertices_coords, vertices_vertices, faces_vertices
 * @returns {number[][]} array of array of numbers, where each row corresponds to a
 * vertex index and the values in the inner array are face indices.
 * @linkcode Origami ./src/graph/make.js 301
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
			// .filter(key => face_map[key] !== undefined) // removed. read below.
			.map(key => face_map[key]));
};

// the old version of this method contained a filter to remove "undefined".
// because in the case of a boundary vertex of a closed polygon shape, there
// is no face that winds backwards around the piece and encloses infinity.
// unfortunately, this disconnects the index match with vertices_vertices.
//

/**
 * *not a geometry array*
 *
 * for fast backwards lookup of a edge by its vertices. this dictionary:
 * keys are each edge's vertices as a string separated by a space: "9 3"
 * value is the index of the edge.
 * example: "9 3" and "3 9" are both entries with a value of the edge's index.
 */

/**
 * @description Make an object which answers the question: "which edge connects
 * these two vertices?". This is accomplished by building an object with keys
 * containing vertex pairs (space separated string), and the value is the edge index.
 * This is bidirectional, so "7 15" and "15 7" are both keys that point to the same edge.
 * @param {FOLD} graph a FOLD object, containing edges_vertices
 * @returns {object} space-separated vertex pair keys, edge indices values
 * @linkcode Origami ./src/graph/make.js 336
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
 * @description Make an object which answers the question: "which edge connects
 * these two vertices?". This is accomplished by building an object with keys
 * containing vertex pairs (space separated string), and the value is the edge index.
 * This is not bidirectional, so "7 15" can exist while "15 7" does not. This is useful
 * for example for looking up the edge's vector, which is direction specific.
 * @param {FOLD} graph a FOLD object, containing edges_vertices
 * @returns {object} space-separated vertex pair keys, edge indices values
 * @linkcode Origami ./src/graph/make.js 356
 */
export const makeVerticesToEdge = ({ edges_vertices }) => {
	const map = {};
	edges_vertices
		.map(ev => ev.join(" "))
		.forEach((key, i) => { map[key] = i; });
	return map;
};

/**
 * @description Make an object which answers the question: "which face contains these
 * 3 consecutive vertices? (3 vertices in sequential order, from two adjacent edges)"
 * The keys are space-separated trios of vertex indices, 3 vertices which
 * are found when walking a face. These 3 vertices uniquely point to one and only one
 * face, and the counter-clockwise walk direction is respected, this is not
 * bidirectional, and does not contain the opposite order of the same 3 vertices.
 * @param {FOLD} graph a FOLD object, containing faces_vertices
 * @returns {object} space-separated vertex trio keys, face indices values
 * @linkcode Origami ./src/graph/make.js 374
 */
export const makeVerticesToFace = ({ faces_vertices }) => {
	const map = {};
	faces_vertices
		.forEach((face, f) => face
			.map((_, i) => [0, 1, 2]
				.map(j => (i + j) % face.length)
				.map(n => face[n])
				.join(" "))
			.forEach(key => { map[key] = f; }));
	return map;
};

/**
 * @description For every vertex, make an array of vectors that point towards each
 * of the incident vertices. This is accomplised by taking the vertices_vertices
 * array and converting it into vectors, indices will be aligned with vertices_vertices.
 * @param {FOLD} graph a FOLD object, containing vertices_coords, vertices_vertices, edges_vertices
 * @returns {number[][][]} array of array of array of numbers, where each row corresponds
 * to a vertex index, inner arrays correspond to vertices_vertices, and inside is a 2D vector
 * @todo this can someday be rewritten without edges_vertices
 * @linkcode Origami ./src/graph/make.js 395
 */
export const makeVerticesVerticesVector = ({
	vertices_coords, vertices_vertices, vertices_edges, vertices_faces,
	edges_vertices, edges_vector, faces_vertices,
}) => {
	if (!edges_vector) {
		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	}
	if (!vertices_vertices) {
		vertices_vertices = makeVerticesVertices({
			vertices_coords, vertices_edges, vertices_faces, edges_vertices, faces_vertices,
		});
	}
	const edge_map = makeVerticesToEdge({ edges_vertices });
	return vertices_vertices
		.map((_, a) => vertices_vertices[a]
			.map((b) => {
				const edge_a = edge_map[`${a} ${b}`];
				const edge_b = edge_map[`${b} ${a}`];
				if (edge_a !== undefined) { return edges_vector[edge_a]; }
				if (edge_b !== undefined) { return flip(edges_vector[edge_b]); }
			}));
};

/**
 * @description Between pairs of counter-clockwise adjacent edges around a vertex
 * is the sector measured in radians. This builds an array of of sector angles,
 * index matched to vertices_vertices.
 * @param {FOLD} graph a FOLD object, containing vertices_coords, vertices_vertices, edges_vertices
 * @returns {number[][]} array of array of numbers, where each row corresponds
 * to a vertex index, inner arrays contains angles in radians
 * @linkcode Origami ./src/graph/make.js 420
 */
export const makeVerticesSectors = ({
	vertices_coords, vertices_vertices, edges_vertices, edges_vector,
}) => makeVerticesVerticesVector({
	vertices_coords, vertices_vertices, edges_vertices, edges_vector,
})
	.map(vectors => (vectors.length === 1 // leaf node
		? [TWO_PI] // interior_angles gives 0 for leaf nodes. we want 2pi
		: counterClockwiseSectors2(vectors)));

/**
 *
 *    EDGES
 *
 */

/**
 * @description Make `edges_edges` containing all vertex-adjacent edges.
 * This will be radially sorted if you call makeVerticesEdges before calling this.
 * @param {FOLD} graph a FOLD object, with entries edges_vertices, vertices_edges
 * @returns {number[][]} each entry relates to an edge, each array contains indices
 * of other edges.
 * @linkcode Origami ./src/graph/make.js 441
 */
export const makeEdgesEdges = ({ edges_vertices, vertices_edges }) =>
	edges_vertices.map((verts, i) => {
		const side0 = vertices_edges[verts[0]].filter(e => e !== i);
		const side1 = vertices_edges[verts[1]].filter(e => e !== i);
		return side0.concat(side1);
	});

/**
 * @description Make `edges_faces` where each edge is paired with its incident faces.
 * This is unsorted, prefer makeEdgesFaces()
 * @param {FOLD} graph a FOLD object, with entries edges_vertices, faces_edges
 * @returns {number[][]} each entry relates to an edge, each array contains indices
 * of adjacent faces.
 * @linkcode Origami ./src/graph/make.js 455
 */
export const makeEdgesFacesUnsorted = ({ edges_vertices, faces_vertices, faces_edges }) => {
	// faces_vertices is only needed to build this array, if it doesn't exist.
	if (!faces_edges) {
		faces_edges = makeFacesEdgesFromVertices({ edges_vertices, faces_vertices });
	}
	// instead of initializing the array ahead of time (we would need to know
	// the length of something like edges_vertices)
	const edges_faces = edges_vertices !== undefined
		? edges_vertices.map(() => [])
		: Array.from(Array(implied.edges({ faces_edges }))).map(() => []);
	faces_edges.forEach((face, f) => {
		const hash = [];
		// in the case that one face visits the same edge multiple times,
		// this hash acts as a set allowing one occurence of each edge index.
		face.forEach((edge) => { hash[edge] = f; });
		hash.forEach((fa, e) => edges_faces[e].push(fa));
	});
	return edges_faces;
};

/**
 * @description Make `edges_faces` where each edge is paired with its incident faces.
 * This is sorted according to the FOLD spec, sorting faces on either side of an edge.
 * @param {FOLD} graph a FOLD object, with entries vertices_coords,
 * edges_vertices, faces_vertices, faces_edges
 * @returns {number[][]} each entry relates to an edge, each array contains indices
 * of adjacent faces.
 * @linkcode Origami ./src/graph/make.js 480
 */
export const makeEdgesFaces = ({
	vertices_coords, edges_vertices, edges_vector, faces_vertices, faces_edges, faces_center,
}) => {
	if (!edges_vertices || (!faces_vertices && !faces_edges)) {
		// alert, we just made UNSORTED edges faces
		return makeEdgesFacesUnsorted({ faces_edges });
	}
	if (!faces_vertices) {
		faces_vertices = makeFacesVerticesFromEdges({ edges_vertices, faces_edges });
	}
	if (!faces_edges) {
		faces_edges = makeFacesEdgesFromVertices({ edges_vertices, faces_vertices });
	}
	if (!edges_vector) {
		edges_vector = makeEdgesVector({ vertices_coords, edges_vertices });
	}
	const edges_origin = edges_vertices.map(pair => vertices_coords[pair[0]]);
	if (!faces_center) {
		faces_center = makeFacesConvexCenter({ vertices_coords, faces_vertices });
	}
	const edges_faces = edges_vertices.map(() => []);
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
			.map(center => subtract2(center, edges_origin[e]))
			.map(vector => cross2(vector, edges_vector[e]));
		faces.sort((a, b) => faces_cross[a] - faces_cross[b]);
	});
	return edges_faces;
};

const assignment_angles = { M: -180, m: -180, V: 180, v: 180 };

/**
 * @description Convert edges fold angle into assignment for every edge. This simple
 * method will only result in "M" "V" and "F", depending on crease angle.
 * "makeEdgesAssignment()" will also assign "B"
 * @param {FOLD} graph a FOLD object, with edges_foldAngle
 * @returns {string[]} array of fold assignments
 * @linkcode Origami ./src/graph/make.js 531
 */
export const makeEdgesAssignmentSimple = ({ edges_foldAngle }) => edges_foldAngle
	.map(a => {
		if (a === 0) { return "F"; }
		return a < 0 ? "M" : "V";
	});

/**
 * @description Convert edges fold angle into assignment for every edge. This method
 * will assign "M" "V" "F" and "B" for edges with only one incident face.
 * @param {FOLD} graph a FOLD object, with edges_foldAngle
 * @returns {string[]} array of fold assignments
 * @linkcode Origami ./src/graph/make.js 543
 */
export const makeEdgesAssignment = ({
	edges_vertices, edges_foldAngle, edges_faces, faces_vertices, faces_edges,
}) => {
	if (edges_vertices && !edges_faces) {
		if (!faces_edges && faces_vertices) {
			faces_edges = makeFacesEdgesFromVertices({ edges_vertices, faces_vertices });
		}
		if (faces_edges) {
			edges_faces = makeEdgesFacesUnsorted({ edges_vertices, faces_edges });
		}
	}
	if (edges_foldAngle) {
		// if edges_faces exists, assign boundaries. otherwise skip it.
		return edges_faces
			? edges_foldAngle.map((a, i) => {
				if (edges_faces[i].length < 2) { return "B"; }
				if (a === 0) { return "F"; }
				return a < 0 ? "M" : "V";
			})
			: makeEdgesAssignmentSimple({ edges_foldAngle });
	}
	// no data to use, everything gets "unassigned"
	return edges_vertices.map(() => "U");
};

/**
 * @description Convert edges assignment into fold angle in degrees for every edge.
 * @param {FOLD} graph a FOLD object, with edges_assignment
 * @returns {number[]} array of fold angles in degrees
 * @linkcode Origami ./src/graph/make.js 564
 */
export const makeEdgesFoldAngle = ({ edges_assignment }) => edges_assignment
	.map(a => assignment_angles[a] || 0);

// angle between two 3D vectors
// α = arccos[(xa * xb + ya * yb + za * zb) / (√(xa2 + ya2 + za2) * √(xb2 + yb2 + zb2))]
// angle between two 2D vectors
// α = arccos[(xa * xb + ya * yb) / (√(xa2 + ya2) * √(xb2 + yb2))]

/**
 * @description Inspecting adjacent faces, and referencing their normals, infer
 * the foldAngle for every edge. This will result in a negative number for
 * mountain creases, and positive for valley. This works well for 3D models,
 * but will fail for flat-folded models, in which case, edges_assignment
 * will be consulted to differentiate between 180 degree M or V folds.
 * @param {FOLD} graph a FOLD object
 * @returns {number[]} for every edge, an angle in degrees.
 * @linkcode Origami ./src/graph/make.js 581
 */
export const makeEdgesFoldAngleFromFaces = ({
	vertices_coords,
	edges_vertices,
	edges_faces,
	edges_assignment,
	faces_vertices,
	faces_edges,
	faces_normal,
	faces_center,
}) => {
	if (!edges_faces) {
		if (!faces_edges) {
			faces_edges = makeFacesEdgesFromVertices({ edges_vertices, faces_vertices });
		}
		edges_faces = makeEdgesFacesUnsorted({ edges_vertices, faces_edges });
	}
	if (!faces_normal) {
		faces_normal = makeFacesNormal({ vertices_coords, faces_vertices });
	}
	if (!faces_center) {
		faces_center = makeFacesConvexCenter({ vertices_coords, faces_vertices });
	}
	// get the angle between two adjacent face normals, where parallel normals have 0 angle.
	// additionally, create a vector from one face's center to the other and check the sign of
	// the dot product with one of the normals, this clarifies if the fold is mountain or valley.
	return edges_faces.map((faces, e) => {
		if (faces.length > 2) { throw new Error(Messages.manifold); }
		if (faces.length < 2) { return 0; }
		const a = faces_normal[faces[0]];
		const b = faces_normal[faces[1]];
		const a2b = normalize(subtract(
			faces_center[faces[1]],
			faces_center[faces[0]],
		));
		// for mountain creases (faces facing away from each other), set the sign to negative.
		let sign = Math.sign(dot(a, a2b));
		// if the sign is zero, the faces are coplanar, it's impossible to tell if
		// this was because of a mountain or a valley fold.
		if (sign === 0) {
			if (edges_assignment && edges_assignment[e]) {
				if (edges_assignment[e] === "F" || edges_assignment[e] === "F") { sign = 0; }
				if (edges_assignment[e] === "M" || edges_assignment[e] === "m") { sign = -1; }
				if (edges_assignment[e] === "V" || edges_assignment[e] === "v") { sign = 1; }
			} else {
				throw new Error(Messages.flatFoldAngles);
			}
		}
		return (Math.acos(dot(a, b)) * (180 / Math.PI)) * sign;
	});
};

/**
 * @description map vertices_coords onto edges_vertices so that the result
 * is an edge array where each edge contains its two points. Each point being
 * the 2D or 3D coordinate as an array of numbers.
 * @param {FOLD} graph a FOLD graph with vertices and edges
 * @returns {number[][][]} an array of array of points (which are arrays of numbers)
 * @linkcode Origami ./src/graph/make.js 639
 */
export const makeEdgesCoords = ({ vertices_coords, edges_vertices }) => (
	edges_vertices.map(ev => ev.map(v => vertices_coords[v]))
);

/**
 * @description Turn every edge into a vector, basing the direction on the order of
 * the pair of vertices in each edges_vertices entry.
 * @param {FOLD} graph a FOLD graph, with vertices_coords, edges_vertices
 * @returns {number[][]} each entry relates to an edge, each array contains a 2D vector
 * @linkcode Origami ./src/graph/make.js 648
 */
export const makeEdgesVector = ({ vertices_coords, edges_vertices }) => (
	makeEdgesCoords({
		vertices_coords, edges_vertices,
	}).map(verts => subtract(verts[1], verts[0]))
);

/**
 * @description For every edge, find the length between the edges pair of vertices.
 * @param {FOLD} graph a FOLD graph, with vertices_coords, edges_vertices
 * @returns {number[]} the distance between each edge's pair of vertices
 * @linkcode Origami ./src/graph/make.js 657
 */
export const makeEdgesLength = ({ vertices_coords, edges_vertices }) => (
	makeEdgesVector({ vertices_coords, edges_vertices }).map(magnitude)
);

/**
 * @description Make an array of axis-aligned bounding boxes, one for each edge,
 * that encloses the edge, and will work in n-dimensions. Intended for
 * fast line-sweep algorithms.
 * @param {FOLD} graph a FOLD graph with vertices and edges.
 * @returns {object[]} an array of boxes, length matching the number of edges
 * @linkcode Origami ./src/graph/make.js 668
 */
export const makeEdgesBoundingBox = ({
	vertices_coords, edges_vertices, edges_coords,
}, epsilon = 0) => {
	if (!edges_coords) {
		edges_coords = makeEdgesCoords({ vertices_coords, edges_vertices });
	}
	return edges_coords.map(coords => boundingBox(coords, epsilon));
};

/**
 *
 *    FACES
 *
 */

/**
 * @description Rebuild all faces in a 2D planar graph by walking counter-clockwise
 * down every edge (both ways). This does not include the outside face which winds
 * around the boundary backwards enclosing the outside space.
 * @param {FOLD} graph a FOLD object
 * @returns {object[]} array of faces as objects containing "vertices",
 * "edges", and "angles"
 * @example
 * // to convert the return object into faces_vertices and faces_edges
 * var faces = makePlanarFaces(graph);
 * faces_vertices = faces.map(el => el.vertices);
 * faces_edges = faces.map(el => el.edges);
 * @linkcode Origami ./src/graph/make.js 694
 */
export const makePlanarFaces = ({
	vertices_coords, vertices_vertices, vertices_edges,
	vertices_sectors, edges_vertices, edges_vector,
}) => {
	if (!vertices_vertices) {
		vertices_vertices = makeVerticesVertices({
			vertices_coords, edges_vertices, vertices_edges,
		});
	}
	if (!vertices_sectors) {
		vertices_sectors = makeVerticesSectors({
			vertices_coords, vertices_vertices, edges_vertices, edges_vector,
		});
	}
	const vertices_edges_map = makeVerticesToEdgeBidirectional({ edges_vertices });
	// removes the one face that outlines the piece with opposite winding.
	// walkPlanarFaces stores edges as vertex pair strings, "4 9",
	// convert these into edge indices
	const res = filterWalkedBoundaryFace(walkPlanarFaces({
		vertices_vertices, vertices_sectors,
	})).map(f => ({ ...f, edges: f.edges.map(e => vertices_edges_map[e]) }));
	return {
		faces_vertices: res.map(el => el.vertices),
		faces_edges: res.map(el => el.edges),
		faces_sectors: res.map(el => el.angles),
	};
};

// export const makePlanarFacesVertices = graph => makePlanarFaces(graph)
// 	.faces_vertices;
// export const makePlanarFacesEdges = graph => makePlanarFaces(graph)
// 	.faces_edges;

// const make_vertex_pair_to_edge_map = function ({ edges_vertices }) {
// 	if (!edges_vertices) { return {}; }
// 	const map = {};
// 	edges_vertices
// 		.map(ev => ev.sort((a, b) => a - b).join(" "))
// 		.forEach((key, i) => { map[key] = i; });
// 	return map;
// };
// todo: this needs to be tested

/**
 * @description Make `faces_vertices` from `faces_edges`.
 * @param {FOLD} graph a FOLD graph, with faces_edges, edges_vertices
 * @returns {number[][]} a `faces_vertices` array
 * @linkcode Origami ./src/graph/make.js 735
 */
export const makeFacesVerticesFromEdges = ({ edges_vertices, faces_edges }) => faces_edges
	.map(edges => edges
		.map(edge => edges_vertices[edge])
		.map((pairs, i, arr) => {
			const next = arr[(i + 1) % arr.length];
			return (pairs[0] === next[0] || pairs[0] === next[1])
				? pairs[1]
				: pairs[0];
		}));

/**
 * @description Make `faces_edges` from `faces_vertices`.
 * @param {FOLD} graph a FOLD graph, with
 * edges_vertices and faces_vertices
 * @returns {number[][]} a `faces_edges` array
 * @linkcode Origami ./src/graph/make.js 751
 */
export const makeFacesEdgesFromVertices = ({ edges_vertices, faces_vertices }) => {
	const map = makeVerticesToEdgeBidirectional({ edges_vertices });
	return faces_vertices
		.map(face => face
			.map((v, i, arr) => [v, arr[(i + 1) % arr.length]].join(" ")))
		.map(face => face.map(pair => map[pair]));
};

/**
 * @description faces_faces is an array of edge-adjacent face indices for each face.
 * @param {FOLD} graph a FOLD graph, with faces_vertices
 * @returns {number[][]} each index relates to a face, each entry is an array
 * of numbers, each number is an index of an edge-adjacent face to this face.
 * @linkcode Origami ./src/graph/make.js 765
 */
export const makeFacesFaces = ({ faces_vertices }) => {
	// for every face's faces_vertices, pair a vertex with the next vertex,
	// join the pairs of vertices into a space-separated string (where v0 < v1)
	const facesVerticesEdgeVertexPairs = faces_vertices
		.map(face => face
			.map((v, i, arr) => [v, arr[(i + 1) % arr.length]])
			.map(([v0, v1]) => (v1 < v0 ? [v1, v0] : [v0, v1]))
			.map(pair => pair.join(" ")));

	// create a map that relates these space-separated vertex pair strings
	// to an array of faces which contain this edge (vertex-pair).
	const edgePairToFaces = {};
	facesVerticesEdgeVertexPairs
		.flat()
		.forEach(key => { edgePairToFaces[key] = []; });
	facesVerticesEdgeVertexPairs
		.forEach((edgeKeys, f) => edgeKeys
			.forEach(key => { edgePairToFaces[key].push(f); }));

	// for each face's edge (vertex-pair), get the array of faces that
	// are adjacent to this edge. This generates a list of faces that contains
	// duplicates and contains this face itself. these will be filtered out.
	const newFacesEdgesFaces = facesVerticesEdgeVertexPairs
		.map((edgeKeys) => edgeKeys
			.map(key => edgePairToFaces[key]));

	// each face's entry contains an array of array of faces, flatten this list
	// and remove any mention of this face itself, and remove any duplicates.
	// using a Set appears to maintain the insertion order, which is what we want.
	return newFacesEdgesFaces
		.map((edgesFaces, face) => edgesFaces.flat().filter(f => f !== face))
		.map(faces => Array.from(new Set(faces)));
};

/**
 * @description map vertices_coords onto each face's set of vertices,
 * turning each face into an array of points, with an additional step:
 * ensure that each polygon has 0 collinear vertices.
 * this can result in a polygon with fewer vertices than is contained
 * in that polygon's faces_vertices array.
 * @param {FOLD} graph a FOLD graph, with vertices_coords, faces_vertices
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {number[][][]} array of array of points, where each point is an array of numbers
 * @linkcode Origami ./src/graph/make.js 820
 */
export const makeFacesPolygon = ({ vertices_coords, faces_vertices }, epsilon) => faces_vertices
	.map(verts => verts.map(v => vertices_coords[v]))
	.map(polygon => makePolygonNonCollinear(polygon, epsilon));

/**
 * @description map vertices_coords onto each face's set of vertices,
 * turning each face into an array of points. "Quick" meaning collinear vertices are
 * not removed, which in some cases, this will be the preferred method.
 * @param {FOLD} graph a FOLD graph, with vertices_coords, faces_vertices
 * @returns {number[][][]} array of array of points, where each point is an array of numbers
 * @linkcode Origami ./src/graph/make.js 831
 */
export const makeFacesPolygonQuick = ({ vertices_coords, faces_vertices }) => faces_vertices
	.map(verts => verts.map(v => vertices_coords[v]));

/**
 * @description For every face, get the face's centroid.
 * @param {FOLD} graph a FOLD graph, with vertices_coords, faces_vertices
 * @returns {number[][]} array of points, where each point is an array of numbers
 * @linkcode Origami ./src/graph/make.js 839
 */
export const makeFacesCenter2D = ({ vertices_coords, faces_vertices }) => faces_vertices
	.map(fv => fv.map(v => vertices_coords[v]))
	.map(coords => centroid(coords));

/**
 * @description This uses point average, not centroid, faces must
 * be convex, and again it's not precise, but in many use cases
 * this is often more than sufficient.
 * @param {FOLD} graph a FOLD graph, with vertices_coords, faces_vertices
 * @returns {number[][]} array of points, where each point is an array of numbers
 * @linkcode Origami ./src/graph/make.js 850
 */
export const makeFacesConvexCenter = ({ vertices_coords, faces_vertices }) => {
	const oneVertex = vertices_coords.filter(() => true).shift();
	if (!oneVertex) { return faces_vertices.map(() => []); }
	const dimensions = oneVertex.length;
	return faces_vertices.map(vertices => vertices
		.map(v => vertices_coords[v])
		.reduce((a, b) => add(a, b), Array(dimensions).fill(0))
		.map(el => el / vertices.length));
};
