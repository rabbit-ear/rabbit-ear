/**
 * Rabbit Ear (c) Kraft
 */
import {
	sortVerticesCounterClockwise,
} from "../vertices/sort.js";
import remove from "../remove.js";

/**
 * @description A circular array (data wraps around) requires 2 indices
 * if you intend to split it into two arrays. The pair of indices can be
 * provided in any order, they will be sorted, smaller index first.
 * @param {any[]} array an array that is meant to be thought of as circular
 * @param {number[]} indices two numbers, indices that divide the array into 2 parts
 * @returns {any[][]} the same array split into two arrays
 * @linkcode Origami ./src/general/arrays.js 49
 */
const splitCircularArray = (array, indices) => {
	indices.sort((a, b) => a - b);
	return [
		array.slice(indices[1]).concat(array.slice(0, indices[0] + 1)),
		array.slice(indices[0], indices[1] + 1),
	];
};

const makeVerticesToEdgeLookup = ({ edges_vertices }, edges) => {
	const verticesToEdge = [];
	edges.forEach(edge => {
		const verts = edges_vertices[edge];
		[verts.join(" "), verts.reverse().join(" ")].forEach(key => {
			verticesToEdge[key] = edge;
		});
	});
	return verticesToEdge;
};

/**
 * this must be done AFTER edges_vertices has been updated with the new edge.
 *
 * @param {FOLD} graph a FOLD object
 * @param {number} the face that will be replaced by these two new faces
 * @param {number[]} vertices (in the face) that split the face into two
 */
const makeFacesVerticesAndEdges = ({
	edges_vertices, faces_vertices, faces_edges,
}, face, vertices) => {
	// the indices of the two vertices inside the face_vertices array.
	// this is where we will split the face into two.
	const faceVerticesIndices = vertices
		.map(el => faces_vertices[face].indexOf(el));

	// this method nicely handles the splitting of our face into two
	const newFacesVertices = splitCircularArray(faces_vertices[face], faceVerticesIndices);

	// if faces_edges does not exist, return faces_vertices data only
	if (!faces_edges) {
		return newFacesVertices.map(arr => ({ faces_vertices: arr }));
	}

	// create a reverse lookup, pairs of vertices to an edge.
	const verticesToEdge = makeVerticesToEdgeLookup(
		{ edges_vertices },
		faces_edges[face],
	);

	// simply rebuild the faces_edges in question using the vertices-edge lookup
	const newFacesEdges = newFacesVertices
		.map(face_vertices => face_vertices
			.map((fv, i, arr) => `${fv} ${arr[(i + 1) % arr.length]}`)
			.map(key => verticesToEdge[key]));

	return newFacesVertices.map((arr, i) => ({
		faces_vertices: arr,
		faces_edges: newFacesEdges[i],
	}));
};

/**
 *
 */
const buildFaces = (graph, face, vertices) => {
	// the indices of the new face will be at the end of the current list
	const faces = [0, 1].map(i => graph.faces_vertices.length + i);

	// construct new data for faces_vertices and faces_edges
	// (not faces_faces, vertices_faces, or edges_faces, this happens later)
	makeFacesVerticesAndEdges(graph, face, vertices)
		.forEach((newface, i) => Object.keys(newface)
			.forEach((key) => { graph[key][faces[i]] = newface[key]; }));

	return faces;
};

/**
 * @description given two vertices and incident faces, create all new
 * "edges_" entries to describe a new edge that sits between the params.
 * @param {object} FOLD graph
 * @param {number[]} two incident vertices that make up this edge
 * @param {number[]} two edge-adjacent faces to this new edge
 * @param {number[]} TEMPORARILY holds 2x the index of the face that
 *  this edge currently lies inside, because the faces arrays will be
 *  rebuilt from scratch, we need the old data.
 * @returns {object} all FOLD spec "edges_" entries for this new edge.
 */
// const make_edge = (vertices, faces) => {};
// const make_edge = (vertices, face) => {};

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
const buildNewEdge = (
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

const makeVerticesToFacesLookup = ({ faces_vertices }, faces) => {
	// a lookup table with vertex keys, and array values containing faces
	// pre-populate every vertex's value with an empty array
	const verticesToFace = [];
	faces_vertices
		.flatMap(face => faces_vertices[face])
		.forEach(v => { verticesToFace[v] = []; });
	faces.forEach(face => faces_vertices[face]
		.forEach(v => verticesToFace[v].push(face)));
	return verticesToFace;
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
	{ edges_faces, faces_edges },
	oldFace,
	newFaces,
	newEdge,
) => {
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
 * @description Divide a face into two faces by creating a new edge
 * between two existing vertices inside the face. This method does not
 * modify the number of vertices, it does modify edges and faces,
 * new edges will be added to the end of the arrays, so all old edge
 * indices will still relate, but face indices will be more heavily modified
 * as some faces will be removed and indices will shift up to take their place.
 * @param {FOLD} graph a FOLD object, modified in place
 * @param {number} face index of face to split
 * @param {VecLine} line with a "vector" and an "origin" component
 * @param {number} [epsilon=1e-6] an optional epsilon
 * @returns {object|undefined} a summary of changes to the FOLD object,
 *  or undefined if no change (no intersection).
 * @linkcode Origami ./src/graph/splitFace/index.js 28
 */
export const splitFaceWithEdge = (graph, face, vertices) => {
	const assignment = "U";
	const foldAngle = 0;

	// this modifies the graph by only adding an edge between existing vertices
	const edge = buildNewEdge(
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
	// create two new faces, these are their indices.
	const faces = buildFaces(graph, face, vertices);

	// update all the "_faces" arrays, data that points to a face
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
