/**
 * Rabbit Ear (c) Kraft
 */
import {
	sortVerticesCounterClockwise,
} from "../vertices/sort.js";
import {
	makeEdgesFacesUnsorted,
} from "../make.js";
import {
	splitCircularArray,
	splitArrayWithLeaf,
	makeVerticesToEdgeLookup,
	makeVerticesToFacesLookup,
} from "./general.js";
import remove from "../remove.js";

/**
 * @description A new edge will be added to this graph that connects
 * two vertices of a face. The face itself will not be split yet, this
 * is just a preliminary step.
 * @param {FOLD} graph a FOLD object
 * @param {number[]} vertices the edges_vertices entry
 * @param {number[]} faces the edges_faces entry
 * @param {string} assignment the edges_assignment entry
 * @param {number} vertices the edges_foldAngle entry
 * @returns {number} the index of the new edge
 */
const makeNewEdge = (
	graph,
	vertices,
	faces,
	assignment = "U",
	foldAngle = 0,
) => {
	const edge = graph.edges_vertices.length;

	// construct data for our new edge (vertices, assignent, foldAngle...)
	// and the entry for edges_faces will be [x, x] where x is the index of
	// the old face, twice, and will be replaced later in this function.
	const edgeAttributes = {
		edges_vertices: vertices,
		edges_assignment: assignment,
		edges_foldAngle: foldAngle,
		edges_faces: faces,
	};

	// ignoring any keys that aren't a part of our graph, add the new edge
	Object.keys(edgeAttributes)
		.filter(key => graph[key])
		.forEach((key) => { graph[key][edge] = edgeAttributes[key]; });
	return edge;
};

/**
 * @description 
 */
const makeNewFacesVertices = ({ faces_vertices }, face, vertices) => {
	// search the existing face's faces_vertices for each of the vertices
	const verticesAndIndices = vertices
		.map(vertex => ({ vertex, index: faces_vertices[face].indexOf(vertex) }));

	// we need to branch according to how many of the two vertices are
	// already present inside this face's faces_vertices. In the case of:
	// 2: We can split the face into two faces.
	// 1: We build one face with a leaf node that walks twice over the new edge.
	// 0: Face does not change
	const matchingVerticesAndIndices = verticesAndIndices
		.filter(el => el.index !== -1);
	const nonMatchingVerticesAndIndices = verticesAndIndices
		.filter(el => el.index === -1);

	switch (matchingVerticesAndIndices.length) {
	case 1: return [splitArrayWithLeaf(
		faces_vertices[face],
		matchingVerticesAndIndices.map(el => el.index).shift(),
		nonMatchingVerticesAndIndices.map(el => el.vertex).shift(),
	)];
	// this method nicely handles the splitting of our face into two
	case 2: return splitCircularArray(
		faces_vertices[face],
		matchingVerticesAndIndices.map(el => el.index),
	);
	default: return [];
	}
};

/**
 *
 */
const updateFacesEdges = ({
	edges_vertices, faces_vertices, faces_edges,
}, faces) => {
	if (!faces_edges) { return; }

	// create a reverse lookup, pairs of vertices to an edge.
	const verticesToEdge = faces
		.map(face => makeVerticesToEdgeLookup(
			{ edges_vertices },
			faces_edges[face],
		)).reduce((a, b) => ({ ...a, ...b }), {});

	// simply rebuild the faces_edges in question using the vertices-edge lookup
	const newFacesEdges = faces
		.map(face => faces_vertices[face]
			.map((fv, i, arr) => `${fv} ${arr[(i + 1) % arr.length]}`)
			.map(key => verticesToEdge[key]));

	newFacesEdges
		.forEach((face_edges, i) => { faces_edges[faces[i]] = face_edges; });
};

/**
 * @description An new edge was just created between these two vertices,
 * update the vertices' vertices_vertices array by adding into each
 * array a reference to the other vertex.
 * @param {FOLD} graph a FOLD object in creasePattern form.
 * @param {number[]} vertices the pair of vertices now connected by a new edge
 * @returns {undefined}
 */
export const updateVerticesVertices = ({
	vertices_coords, vertices_vertices,
}, [v0, v1]) => {
	if (!vertices_vertices) { return; }

	// vertices_coords does not exist, make an unsorted solution
	if (!vertices_coords) {
		vertices_vertices[v0].push(v1);
		vertices_vertices[v1].push(v0);
		return;
	}

	// make a sorted solution using vertices_coords
	// add the other vertex into this vertex's array (anywhere),
	// and simply resort the whole array counter-clockwise.
	vertices_vertices[v0] = sortVerticesCounterClockwise(
		{ vertices_coords },
		[...vertices_vertices[v0], v1],
		v0,
	);
	vertices_vertices[v1] = sortVerticesCounterClockwise(
		{ vertices_coords },
		[...vertices_vertices[v1], v0],
		v1,
	);
};

/**
 * vertices_vertices was just run before this method. use it.
 * vertices_edges should be up to date, except for the addition
 * of this one new edge at both ends of
 */
export const updateVerticesEdges = ({
	vertices_edges, vertices_vertices,
}, vertices, edge) => {
	if (!vertices_edges) { return; }

	// vertices_vertices does not exist, create an unsorted solution.
	if (!vertices_vertices) {
		vertices.forEach(v => vertices_edges[v].push(edge));
		return;
	}

	// for each of the two vertices, check its vertices_vertices for the
	// index of the opposite vertex. this is the edge. return its position
	// in the vertices_vertices to be used to insert into vertices_edges.
	vertices
		// get the index of the opposite vertex inside this vertices_vertices
		.map((v, i, arr) => vertices_vertices[v].indexOf(arr[(i + 1) % arr.length]))
		// vvIndex is an index inside vertices_edges (or vertices_vertices)
		.forEach((vvIndex, i) => vertices_edges[vertices[i]]
			// splice the new edge so that it gets inserted before the
			// edge at the current index
			.splice(vvIndex, 0, edge));
};

/**
 * @description search inside vertices_faces for an occurence
 * of the removed face, determine which of our two new faces
 * needs to be put in its place by checking faces_vertices
 * by way of this map we build at the beginning.
 */
export const updateVerticesFaces = (
	{ vertices_faces, faces_vertices },
	oldFace,
	newFaces,
	newVertices,
) => {
	if (!vertices_faces || !faces_vertices) { return; }

	const allVertices = faces_vertices[oldFace];
	const facesLookup = makeVerticesToFacesLookup(
		{ vertices_faces, faces_vertices },
		newFaces,
	);

	// todo:
	// if vertices are sorted, we need to build vertices_faces correctly

	// otherwise
	allVertices.forEach(v => {
		const oldFaceIndex = vertices_faces[v].indexOf(oldFace);
		if (oldFaceIndex === -1) {
			vertices_faces[v].push(...facesLookup[v]);
		} else {
			vertices_faces[v].splice(oldFaceIndex, 1, ...facesLookup[v]);
		}
	});

	// in case old face appeared more than once for some reason
	allVertices.forEach(v => {
		vertices_faces[v] = vertices_faces[v].filter(f => f !== oldFace);
	});
};

/**
 * @description called near the end of the split_convex_face method.
 * update the "edges_faces" array for every edge involved.
 * figure out where the old_face's index is in each edges_faces array,
 * figure out which of the new faces (or both) need to be added and
 * substitute the old index with the new face's index/indices.
 */
export const updateEdgesFaces = (
	{ edges_vertices, faces_vertices, edges_faces, faces_edges },
	oldFace,
	newFaces,
	newEdge,
) => {
	if (!edges_faces) { return; }

	// this is a unique situation, we require an array to be built but we are
	// missing the source data. the number of times this branch is reached will
	// be so few, it's possible to simply call the entire rebuild method.
	if (!faces_edges) {
		edges_faces.forEach((_, i) => delete edges_faces[i]);
		Object.assign(
			edges_faces,
			makeEdgesFacesUnsorted({ edges_vertices, faces_vertices, faces_edges }),
		);
		return;
	}

	const edgesNewFace = {};
	newFaces.forEach(f => faces_edges[f]
		.forEach(edge => { edgesNewFace[edge] = f; }));
	Object.keys(edgesNewFace).forEach(edge => {
		const index = edges_faces[edge].indexOf(oldFace);
		if (index === -1) { return; }
		edges_faces[edge].splice(index, 1, newFaces[edge]);
	});
	edges_faces[newEdge] = [...newFaces];
};

/**
 * @description one face was removed and two faces put in its place.
 * regarding the faces_faces array, updates need to be made to the two
 * new faces, as well as all the previously neighboring faces of
 * the removed face.
 */
export const updateFacesFaces = (
	{ faces_faces },
	oldFace,
	newFaces,
) => {
	if (!faces_faces) { return; }
	const facesNewFace = {};
	newFaces.forEach(i => faces_faces[i].forEach(j => { facesNewFace[j] = i; }));

	Object.keys(facesNewFace).forEach(face => {
		const index = faces_faces[face].indexOf(oldFace);
		if (index === -1) { return; }
		faces_faces[face].splice(index, 1, newFaces[face]);
	});
	newFaces.forEach((face, i, arr) => {
		const otherFace = arr[(i + 1) % arr.length];
		faces_faces[face] = [...faces_faces[oldFace], otherFace];
	});
};

/**
 * @description Split a face in a graph with two new vertices which will also
 * be made into a new edge. This method will create 0, 1, or 2 new faces,
 * 1 new edge, and 0 new vertices. The number of faces depends on how many
 * vertices are a part of the face already:
 * - two vertices: the face will be split into two faces along a new edge
 * - one vertex: a leaf edge will be made, the face will walk around but
 *   also double back along the leaf edge, visiting one vertex twice.
 * - zero vertices: no changes to the faces array will occur.
 * New edges will be added to the end of the arrays, so all old edge
 * indices will still relate. Face indices will be more heavily modified
 * as some faces will be removed and indices will shift up to take their place.
 * @param {FOLD} graph a FOLD object, modified in place
 * @param {number} face index of face to split
 * @param {number[]} vertices the vertices which will create a new edge
 * @param {string} [assignment="U"] the assignment of the new edge
 * @param {number} [foldAngle=0] the fold angle of the new edge
 * @returns {object} a summary of changes to the FOLD object
 * @linkcode
 */
export const splitFaceWithEdge = (
	graph,
	face,
	vertices,
	assignment = "U",
	foldAngle = 0,
) => {
	// this modifies the graph by only adding an edge between existing vertices
	const edge = makeNewEdge(
		graph,
		[...vertices],
		[face, face],
		assignment,
		foldAngle,
	);

	// update all changes to vertices and edges (anything other than faces).
	updateVerticesVertices(graph, vertices);
	updateVerticesEdges(graph, vertices, edge);

	// at this point everything excluding face data is complete
	// vertices_coords, vertices_edges, vertices_vertices,
	// edges_vertices, edges_assignment, edges_foldAngle.

	// the presence of our new vertices inside the face's faces_vertices array
	// determines how many faces will be created (0, 1, or 2).
	// this method will create new faces_vertices entries only.
	// the result of this method is a list of the indices of the new faces.
	const faces = makeNewFacesVertices(graph, face, vertices)
		.map(face_vertices => {
			graph.faces_vertices.push(face_vertices);
			return graph.faces_vertices.length - 1;
		});

	updateFacesEdges(graph, faces);
	updateVerticesFaces(graph, face, faces, vertices);
	updateEdgesFaces(graph, face, faces, edge);
	updateFacesFaces(graph, face, faces);

	// remove old data
	const faceMap = remove(graph, "faces", [face]);

	// the graph is now complete, however our return object needs updating.
	// shift our new face indices since these relate to the graph before remove().
	faces.forEach((_, i) => { faces[i] = faceMap[faces[i]]; });

	// we had to run "remove" with the new faces added. to return the change info,
	// we need to adjust the map to exclude these faces.
	faceMap.splice(-2);

	// replace the "undefined" in the map with the new faces
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
