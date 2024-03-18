/**
 * Rabbit Ear (c) Kraft
 */
import {
	makeVerticesVertices,
} from "../make/verticesVertices.js";
import {
	makeVerticesEdges,
} from "../make/verticesEdges.js";
import {
	makeVerticesFaces,
} from "../make/verticesFaces.js";
import {
	makeEdgesFacesUnsorted,
} from "../make/edgesFaces.js";
import {
	makeFacesFaces,
} from "../make/facesFaces.js";
import {
	splitCircularArray,
	splitArrayWithLeaf,
	getAdjacencySpliceIndex,
	makeVerticesToEdgeLookup,
	makeVerticesToFacesLookup,
	makeEdgesToFacesLookup,
	makeFacesFacesFromVertices,
} from "./general.js";
import {
	addVertex,
} from "../add/vertex.js";
import {
	addEdge,
} from "../add/edge.js";
import remove from "../remove.js";

/**
 * @description ensure that the two vertices are not next to each other
 * in the current face's faces_vertices vertices list.
 */
const edgeExistsInFace = ({ faces_vertices }, face, vertices) => (
	faces_vertices[face]
		.map((v, i, arr) => [v, arr[(i + 1) % arr.length]])
		.map(([v0, v1]) => (v0 === vertices[0] && v1 === vertices[1])
			|| (v0 === vertices[1] && v1 === vertices[0]))
		.reduce((a, b) => a || b, false));

/**
 *
 */
const faceVerticesAreUnique = ({ faces_vertices }, face) => (
	Array.from(new Set(faces_vertices[face])).length
		=== faces_vertices[face].length
);

/**
 * @description This is one of two subroutines which creates faces. This
 * method will create two new faces's faces_vertices and append them to the
 * graph. Momentarily, these will coexist with the face they are meant to
 * replace, but the old face will be deleted at the end of the main method.
 * @param {FOLD} graph a FOLD object
 * @param {number} face the index of the face to be split into two faces
 * @param {number[]} vertices two vertices, members of this face's vertices,
 * which will become a new edge and split the face into two faces.
 */
const updateFacesVerticesSplit = ({ faces_vertices }, face, vertices) => (
	splitCircularArray(
		faces_vertices[face],
		vertices.map(vertex => faces_vertices[face].indexOf(vertex)),
	).map((face_vertices) => faces_vertices.push(face_vertices)));

/**
* @description
* @param {FOLD} graph a FOLD object
* @param {number} face the index of the face to be split into two faces
* @param {number[]} vertices two vertices, members of this face's vertices,
* which will become a new edge and split the face into two faces.
 */
const updateFacesVerticesLeaf = (
	{ faces_vertices },
	face,
	vertices,
	verticesIndexOfFace,
) => {
	// previously, we have established that one of the vertices exists in the
	// face and the other does not. the not-existing vertex is the leaf vertex.

	// this is the indexOf in this face's faces_vertices of the existing vertex
	const vertexFace = verticesIndexOfFace
		.filter(i => i !== -1)
		.shift();

	// this is the leaf vertex
	const vertexLeaf = vertices
		.filter((_, i) => verticesIndexOfFace[i] === -1)
		.shift();

	// this method will splice in the leaf vertex and duplicate the vertex
	// at the splice index to be on either side of the leaf vertex, like:
	// _ _ _ 5 8 5 _ _, where 5 got spliced into the spot where 8 was.
	faces_vertices[face] = splitArrayWithLeaf(
		faces_vertices[face],
		vertexFace,
		vertexLeaf,
	);
};

/**
 * @description In the case where we are building two new faces in place of
 * an old face, construct new faces_edges for the new faces by consulting
 * the newly created faces_vertices for each face. Do this by gathering all
 * edges involved (from the old face's faces_edges, and the new edge), create
 * a vertex-pair to edge lookup, then convert faces_vertices to faces_edges.
 * @param {FOLD} graph a FOLD object
 * @param {number} face the index of the face being replaced
 * @param {number[]} faces a list of faces which will replace the old face
 * @param {number[]} edges the new edge index
 */
const updateFacesEdges = (
	{ edges_vertices, faces_vertices, faces_edges },
	face,
	faces,
	edge,
) => {
	if (!faces_edges) { return; }

	// all edges involved in this rewrite, duplicates are okay here.
	const allEdges = [...faces_edges[face], edge];

	// create a reverse lookup, pairs of vertices to an edge.
	const verticesToEdge = makeVerticesToEdgeLookup({ edges_vertices }, allEdges);

	// simply rebuild the faces_edges in question using the vertices-edge lookup
	const newFacesEdges = faces
		.map(f => faces_vertices[f]
			.map((fv, i, arr) => [fv, arr[(i + 1) % arr.length]])
			.map(pair => pair.join(" "))
			.map(key => verticesToEdge[key]));

	if (newFacesEdges.flat().some(e => e === undefined)) {
		throw new Error(`splitFace() faces_edges ${face}`);
	}

	faces.forEach((f, i) => { faces_edges[f] = newFacesEdges[i]; });
};

/**
 * @description Update vertices_vertices for two vertices, following
 * a new edge having just been made to connect the pair of vertices.
 * These vertices are both members of the same face, whose faces_vertices
 * was just updated.
 *     (4)     ___---O.  (3)                (3)     ___---O.  (2)
 *         O---         \.                      O---         \.
 *        /   .            O  (2)              /   .  (6) O    O  (1)
 *       /       .        /                   /       .   |   /
 *  (0) O____      .   /                 (4) O____      . | /
 *           ----____O  (1)                       ----____O  (5)(0)
 * @param {FOLD} graph a FOLD object
 * @param {number} face the index of the face containing these two vertices
 * @param {number[]} vertices the two vertices newly connected by an edge
*/
const updateVerticesVertices = (
	{ vertices_vertices, faces_vertices },
	face, // todo: is this okay, for leaf, this contents is actually the updated contents
	vertices,
) => {
	if (!vertices_vertices) { return; }

	const verticesSpliceIndex = vertices
		.map(v => getAdjacencySpliceIndex(faces_vertices[face], vertices_vertices[v], v));

	verticesSpliceIndex.forEach((index, i) => {
		const otherVertex = vertices[(i + 1) % vertices.length];
		if (index !== -1) {
			vertices_vertices[vertices[i]].splice(index, 0, otherVertex);
		} else {
			vertices_vertices[vertices[i]].push(otherVertex);
		}
	});
};

/**
 * @description We are building a new edge between these two vertices.
 * Update vertices_edges, having just updated vertices_vertices.
 * @param {FOLD} graph a FOLD object
 * @param {number[]} vertices two vertex indices
 * @param {number} edge an edge index
 */
const updateVerticesEdges = (
	{ vertices_edges, vertices_vertices },
	vertices,
	edge,
) => {
	if (!vertices_edges) { return; }

	// vertices_vertices does not exist, create an unsorted solution.
	if (!vertices_vertices) {
		vertices.forEach((v) => vertices_edges[v].push(edge));
		return;
	}

	// for each of the two vertices, check its vertices_vertices for the
	// index of the opposite vertex. this is the edge. return its position
	// in the vertices_vertices to be used to insert into vertices_edges.
	const spliceIndices = vertices
		.map((v, i, arr) => vertices_vertices[v].indexOf(arr[(i + 1) % arr.length]));

	if (spliceIndices.some(i => i === -1)) {
		throw new Error(`splitFace() vertices_edges ${vertices.join(", ")}`);
	}

	// vvIndex is an index inside vertices_edges (or vertices_vertices)
	// splice the new edge so that it gets inserted before the
	// edge at the current index
	spliceIndices.forEach((index, i) => {
		vertices_edges[vertices[i]].splice(index, 0, edge);
	});
};

/**
 * @description For each vertex, vertices_vertices, find the index of the
 * other vertex, get the -1 and +1 index, these vertices, get the face
 * associated with these vertices, in this order, this is how the faces
 * should be ordered.
 */
const sortVertexFaces = (
	{ vertices_vertices },
	vertices,
	vertexFaceMap,
) => vertices.forEach((vertex, i, arr) => {
	// we are only sorting two faces, if this contains any other number
	// we should leave before we do any damage.
	if (vertexFaceMap[vertex].length !== 2) { return; }

	// get the index of the other vertex in this vertex's vertices_vertices
	const otherVertex = arr[(i + 1) % arr.length];
	const index = vertices_vertices[vertex].indexOf(otherVertex);
	if (index === -1) { return; }

	// get the two vertices that are previous and next from the opposite vertex
	const prevIndex = (index + vertices_vertices[vertex].length - 1)
		% vertices_vertices[vertex].length;
	const nextIndex = (index + 1) % vertices_vertices[vertex].length;
	const prev = vertices_vertices[vertex][prevIndex];
	const next = vertices_vertices[vertex][nextIndex];
	if (!vertexFaceMap[prev] || !vertexFaceMap[next]) { return; }

	// using the vertex-face lookup, get the previous and next face in that order
	const prevFace = vertexFaceMap[prev][0];
	const nextFace = vertexFaceMap[next][0];
	if (prevFace === undefined || nextFace === undefined) { return; }
	vertexFaceMap[vertex] = [prevFace, nextFace];
});

/**
 * @description search inside vertices_faces for an occurence
 * of the removed face, determine which of our two new faces
 * needs to be put in its place by checking faces_vertices
 * by way of this map we build at the beginning.
 * @param {FOLD} graph a FOLD object
 * @param {number} face the index of the face being replaced
 * @param {number[]} faces a list of faces which will replace the old face
 */
const updateVerticesFaces = (
	{ vertices_vertices, vertices_faces, faces_vertices },
	face,
	faces,
	vertices,
) => {
	if (!vertices_faces || !faces_vertices) { return; }

	// a lookup that pairs every vertex (involved in these faces) to all of its
	// adjacent faces, where only the subset of "faces" is considered.
	// we will use this lookup to replace the old face index with new face(s).
	const vertexReplacementFaces = makeVerticesToFacesLookup(
		{ faces_vertices },
		faces,
	);

	// if vertices_vertices exists, for those vertice which contain two faces,
	// we need to sort them according to the vertices_vertices order.
	if (vertices_vertices && vertices.length === 2) {
		sortVertexFaces({ vertices_vertices }, vertices, vertexReplacementFaces);
	}

	// a list of all vertices that are involved in these faces, each of these
	// will need new face(s) to replace the old face index.
	const allVertices = Array.from(new Set([
		...faces.flatMap(f => faces_vertices[f]),
		...vertices,
	]));

	// initially, get the index of our old face in the current vertices_faces.
	// if an indexOf is -1, it's not necessarily a failure, a new vertex will not
	// yet have an entry and can be built from scratch.
	const verticesOldFaceIndex = allVertices
		.map((v) => vertices_faces[v].indexOf(face));

	// otherwise
	verticesOldFaceIndex.forEach((index, i) => {
		const vertex = allVertices[i];
		// if no instance of oldFace ever existed in this vertex's vertices_faces
		// then it's likely a new vertex, and we can simply add the faces.
		if (index === -1) {
			vertices_faces[vertex].push(...vertexReplacementFaces[vertex]);
			return;
		}

		// if the old face exists, start a while loop where we replace every
		// instance of the old face with whichever face(s) is to take its place.
		// it's not impossible for the old face to appear twice, this ensure that
		// every instance of it will be removed.
		let match = index;
		while (match !== -1) {
			vertices_faces[vertex]
				.splice(match, 1, ...vertexReplacementFaces[vertex]);
			match = vertices_faces[vertex].indexOf(face);
		}
	});
};

/**
 * @description called near the end of the split_convex_face method.
 * update the "edges_faces" array for every edge involved.
 * figure out where the old_face's index is in each edges_faces array,
 * figure out which of the new faces (or both) need to be added and
 * substitute the old index with the new face's index/indices.
 * @param {FOLD} graph a FOLD object
 * @param {number} face the index of the face being replaced
 * @param {number[]} faces a list of faces which will replace the old face
 * @param {number} edge the new edge index
 */
const updateEdgesFaces = (
	{ edges_vertices, faces_vertices, edges_faces, faces_edges },
	face,
	faces,
	edge,
) => {
	if (!edges_faces) { return; }

	// it's probably rare for a graph to have edges_faces but no faces_edges.
	// This is an easy solution, just build the entire array from scratch.
	if (!faces_edges) {
		edges_faces.forEach((_, i) => delete edges_faces[i]);
		Object.assign(
			edges_faces,
			makeEdgesFacesUnsorted({ edges_vertices, faces_vertices, faces_edges }),
		);
		return;
	}

	const facesHash = {};
	[...faces, face].forEach(f => { facesHash[f] = true; });

	const edges = Array.from(new Set(faces.flatMap(f => faces_edges[f])));

	const edgesOtherFaces = [];
	edges.forEach(e => {
		edgesOtherFaces[e] = edges_faces[e].filter(f => !facesHash[f]);
	});

	const edgesTheseFaces = [];
	edges.forEach(e => { edgesTheseFaces[e] = []; });
	faces.forEach(f => faces_edges[f]
		.forEach(e => edgesTheseFaces[e].push(f)));

	edges.forEach(e => {
		edges_faces[e] = Array
			.from(new Set([...edgesTheseFaces[e], ...edgesOtherFaces[e]]));
	});

	edges_faces[edge] = [...faces];
};

/**
 * @description one face was removed and one or two faces put in its place.
 * regarding the faces_faces array, updates need to be made to the two
 * new faces, as well as all the previously neighboring faces of
 * the removed face.
 * @param {FOLD} graph a FOLD object
 * @param {number[]} faces a list of faces which will replace the old face
 */
const updateFacesFaces = (
	{ edges_vertices, faces_vertices, faces_edges, faces_faces },
	oldFace,
	faces,
) => {
	if (!faces_faces) { return; }
	if (faces.length !== 2) { return; }

	// this is a list of faces which need updating to their faces_faces by
	// replacing the old face index with whichever of the faces from "faces"
	// is adjacent to this (which is what needs to be figured out next).
	const faceSplices = faces_faces[oldFace]
		.map(face => ({ face, index: faces_faces[face].indexOf(oldFace) }));

	// we can find the replacement faces using faces_vertices or faces_edges.
	// we can do this by creating a map from from edges-to-faces.
	// (using only the faces from the set of new faces "faces").
	// if we use faces_edges, we can trivially create this map.
	// if we use faces_vertices, we can use vertex-pairs as edge definitions.

	if (faces_edges) {
		// in this case, edgesToFaces will map an edge (key) to a list of faces
		// (value), and will only contain the new faces from "faces".
		// we can use this list to splice in
		const replacementEdgeFaces = makeEdgesToFacesLookup({ faces_edges }, faces);
		// console.log("replacementEdgeFaces", replacementEdgeFaces);

		// using this face's faces_edges, get the first match in this map.
		// it's possible two faces border along a few collinear edges, in which case
		// this would return a few matches.
		faceSplices.forEach(({ face }, i) => {
			const adjacentEdge = faces_edges[face]
				.find(e => replacementEdgeFaces[e] !== undefined);
			// adjacentFacesToSplice[i].newFace = faces
			// 	.find(f => faces_edges[f].includes(adjacentEdge));
			faceSplices[i].newFaces = replacementEdgeFaces[adjacentEdge];
		});
	} else {
		console.warn("branch not yet finished");
	}

	// console.log("faceSplices", faceSplices);

	// for every adjacent face, we now know which of the new faces to splice
	// in to replace the old face index.
	// if "index" is -1, there is no face to remove, simply append to the array.
	faceSplices.forEach(({ face, index, newFaces }) => (index === -1
		? faces_faces[face].push(...newFaces)
		: faces_faces[face].splice(index, 1, ...newFaces)));

	const allFaces = Array.from(new Set([...faces_faces[oldFace], ...faces]));
	const facesFacesSubset = makeFacesFacesFromVertices({ faces_vertices }, allFaces);
	faces.forEach(f => { faces_faces[f] = facesFacesSubset[f]; });

	// faces
	// 	.filter(f => !faces_faces[f])
	// 	.forEach(f => { faces_faces[f] = [...faces_faces[oldFace]]; });
	// faces
	// 	.map((face, i) => ({ face, otherFace: faces[(i + 1) % faces.length] }))
	// 	.forEach(({ face, otherFace }) => faces_faces[face].push(otherFace));

	// // for every adjacent face to one of the new or old faces
	// const facesNewFace = {};
	// faces_faces[oldFace].forEach(j => { facesNewFace[j] = oldFace; });
	// faces.forEach(i => faces_faces[i].forEach(j => { facesNewFace[j] = i; }));

	// Object.keys(facesNewFace).forEach(face => {
	// 	const index = faces_faces[face].indexOf(oldFace);
	// 	if (index === -1) { return; }
	// 	faces_faces[face].splice(index, 1, faces[face]);
	// });
	// faces.forEach((face, i, arr) => {
	// 	const otherFace = arr[(i + 1) % arr.length];
	// 	faces_faces[face] = [...faces_faces[oldFace], otherFace];
	// });
};

/**
 * @description Cut a face through one of the face's existing vertices to a
 * new vertex which is intended to be newly created, but not yet associated
 * with any face. This will create a new edge between the two vertices, which
 * the faces_edges will traverse twice, and this face's faces_vertices will
 * visit the faceVertex twice, going to and returning from the new leaf vertex.
 */
export const cutFaceToVertex = (
	graph,
	face,
	vertexFace,
	vertexLeaf,
	assignment = "U",
	foldAngle = 0,
) => {
	// validate inputs
	const vertices = [vertexFace, vertexLeaf];

	// construct edge
	const edge = addEdge(graph, vertices, [face, face], assignment, foldAngle);

	// rebuild face

	// search the existing face's faces_vertices for each of the vertices
	const verticesIndexOfFace = vertices
		.map(vertex => graph.faces_vertices[face].indexOf(vertex));

	// this is a unique situation. from this point on we are associating
	// this leaf vertex with this face. make vertices_faces include this face.
	if (graph.vertices_faces) {
		graph.vertices_faces[vertexLeaf] = Array
			.from(new Set([...graph.vertices_faces[vertexLeaf], face]));
	}

	// skip vertices_faces and edges_faces, these were previously set.
	// also, skip faces_faces, adjacent face data does not change.
	updateFacesVerticesLeaf(graph, face, vertices, verticesIndexOfFace);
	updateFacesEdges(graph, face, [face], edge);
	updateVerticesVertices(graph, face, vertices);
	updateVerticesEdges(graph, vertices, edge);

	return {
		edge,
		faces: {},
	}
};

/**
* @description Cut a face through one of the face's existing vertices to a
* new point which is intended to become a new vertex and to be associated with
* this face. This will create a new edge between the two vertices, which
* the faces_edges will traverse twice, and this face's faces_vertices will
* visit the faceVertex twice, going to and returning from the new leaf vertex.
 */
export const cutFaceToPoint = (
	graph,
	face,
	vertex,
	point,
	assignment = "U",
	foldAngle = 0,
) => cutFaceToVertex(
	graph,
	face,
	vertex,
	addVertex(graph, point),
	assignment,
	foldAngle,
);

/**
 * @description
 */
export const splitFaceWithEdge = (
	graph,
	face,
	vertices,
	assignment = "U",
	foldAngle = 0,
) => {
	if (!graph.vertices_coords
		|| !graph.edges_vertices
		|| !graph.faces_vertices) { return {}; }
	if (vertices.length !== 2) { return {}; }

	// this method will work fine with non-convex polygons, but if a face
	// contains a leaf edge, where the sequence of face_vertices visits the same
	// vertex more than once, this method might fail. don't proceed.
	if (!faceVerticesAreUnique(graph, face)) { return {}; }

	// ensure that the two vertices are not next to each other in
	// the current face's faces_vertices vertices list.
	if (edgeExistsInFace(graph, face, vertices)) { return {}; }

	// edges_faces will be [x, x] where x is the index of
	// the old face, twice, and will be replaced later in this function.
	const edge = addEdge(graph, vertices, [face, face], assignment, foldAngle);

	// search the existing face's faces_vertices for each of the vertices
	const verticesIndexOfFace = vertices
		.map(vertex => graph.faces_vertices[face].indexOf(vertex));

	const faces = [0, 1].map(i => graph.faces_vertices.length + i);

	updateFacesVerticesSplit(graph, face, vertices, verticesIndexOfFace);
	updateFacesEdges(graph, face, faces, edge);

	updateVerticesVertices(graph, face, vertices);
	// if (graph.vertices_vertices) {
	// 	makeVerticesVertices(graph).forEach((vertex_vertices, v) => {
	// 		graph.vertices_vertices[v] = vertex_vertices;
	// 	});
	// }

	updateVerticesEdges(graph, vertices, edge);
	// if (graph.vertices_edges) {
	// 	makeVerticesEdges(graph).forEach((vertex_edges, v) => {
	// 		graph.vertices_edges[v] = vertex_edges;
	// 	});
	// }

	updateVerticesFaces(graph, face, faces, vertices);
	// if (graph.vertices_faces) {
	// 	makeVerticesFaces(graph).forEach((vertex_faces, v) => {
	// 		graph.vertices_faces[v] = vertex_faces;
	// 	});
	// }

	updateEdgesFaces(graph, face, faces, edge);
	// if (graph.edges_faces) {
	// 	makeEdgesFacesUnsorted(graph).forEach((edge_faces, e) => {
	// 		graph.edges_faces[e] = edge_faces;
	// 	});
	// }

	// updateFacesFaces(graph, face, faces);
	if (graph.faces_faces) {
		makeFacesFaces(graph).forEach((face_vertices, f) => {
			graph.faces_faces[f] = face_vertices;
		});
	}

	// remove old data
	const faceMap = remove(graph, "faces", [face]);

	// the graph is now complete, however our return object needs updating.
	// shift our new face indices since these relate to the graph before remove().
	faces.forEach((_, i) => { faces[i] = faceMap[faces[i]]; });

	// we had to run "remove" with the new faces added, but the face map
	// should represent the graph before any changes - to after changes.
	// the correct place for the new faces is in a value position, not index.
	// remove these two faces
	faceMap.splice(-2);

	// set the location of the old face in the map to be the new faces
	faceMap[face] = faces;

	return {
		edge,
		faces: {
			map: faceMap,
			new: faces,
			remove: face,
		},
	};
};

/**
 *
 */
const splitFaceIsolatedEdge = (graph, vertices, assignment, foldAngle) => {
	// edges_faces will be [x, x] where x is the index of
	// the old face, twice, and will be replaced later in this function.
	const edge = addEdge(graph, vertices, [], assignment, foldAngle);

	// No vertices were a member of the face, it's okay that we made the edge,
	// but the edge will get no face association, and no face data will change.
	// however, we do need to make isolated-edge vertex associations.
	// exit early
	if (graph.vertices_vertices) {
		vertices.forEach((vertex, i, arr) => {
			const otherVertex = arr[(i + 1) % arr.length];
			graph.vertices_vertices[vertex].push(otherVertex);
		});
	}
	if (graph.vertices_edges) {
		vertices.forEach((vertex) => { graph.vertices_edges[vertex] = [edge]; });
	}
	if (graph.vertices_faces) {
		vertices.forEach((vertex) => { graph.vertices_faces[vertex] = []; });
	}

	return { edge, faces: {} };
};

/**
 * @description Split a face in a graph with a new edge between two vertices,
 * where one or two of these vertices is already a part of the face's
 * faces_vertices. This method will have a different result depending on the
 * number of vertices of the new edge which are a part of the face:
 * - 0: this method will create an edge, unassociated with any faces,
 *      no faces will be modified and the method will return early.
 * - 1: this method will create a face with an edge that doubles back on itself.
 * - 2: this method will create two new faces, split by an edge, as long as
 *      these two new edge vertices are not already an edge on the face's boundary
 * This method will create no new vertices, one new edge, and will replace
 * the face with either one or two new face(s).
 * New edges will be added to the end of the arrays, so all old edge
 * indices will still relate. Face indices will be more heavily modified.
 * @param {FOLD} graph a FOLD object, modified in place, must contain
 * vertices_coords, edges_vertices, and faces_vertices to work.
 * @param {number} face index of face to split
 * @param {number[]} vertices the vertices which will create a new edge
 * @param {string} [assignment="U"] the assignment of the new edge
 * @param {number} [foldAngle=0] the fold angle of the new edge
 * @returns {object} a summary of changes to the FOLD object
 * @linkcode
 */
export const splitFace = (
	graph,
	face,
	vertices,
	assignment = "U",
	foldAngle = 0,
) => {
	if (!graph.vertices_coords
		|| !graph.edges_vertices
		|| !graph.faces_vertices) { return {}; }
	if (vertices.length !== 2) { return {}; }

	// run the correct method depending on how many vertices are a part of the face
	const verticesIndexOf = vertices.map(vertex => ({
		vertex,
		index: graph.faces_vertices[face].indexOf(vertex),
	}));

	const matchCount = verticesIndexOf.filter(({ index }) => index !== -1).length;

	switch (matchCount) {
	case 2:
		return splitFaceWithEdge(graph, face, vertices, assignment, foldAngle);
	case 1:
		return cutFaceToVertex(
			graph,
			face,
			verticesIndexOf.filter(({ index }) => index !== -1).shift().vertex,
			verticesIndexOf.filter(({ index }) => index === -1).shift().vertex,
			assignment,
			foldAngle,
		);
	default:
		return splitFaceIsolatedEdge(graph, vertices, assignment, foldAngle);
	}
};
