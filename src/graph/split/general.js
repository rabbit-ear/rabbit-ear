/**
 * Rabbit Ear (c) Kraft
 */

/**
 * @description A circular array (data wraps around) requires 2 indices
 * if you intend to split it into two arrays. The pair of indices can be
 * provided in any order, they will be sorted, smaller index first.
 * @param {any[]} array an array that is meant to be thought of as circular
 * @param {number[]} indices two numbers, indices that divide the array into 2 parts
 * @returns {any[][]} the same array split into two arrays
 * @linkcode Origami ./src/general/arrays.js 49
 */
export const splitCircularArray = (array, indices) => {
	indices.sort((a, b) => a - b);
	return [
		array.slice(indices[1]).concat(array.slice(0, indices[0] + 1)),
		array.slice(indices[0], indices[1] + 1),
	];
};

/**
 * @description
 * @param {any[]} array an array of any type
 * @param {number} spliceIndex the index to splice into the array
 * @param {any} newElement matching type as array, the new element to splice in
 * @returns {any[]} a copy of the input array, with new elements.
 * @example splitArrayWithLeaf(array, 3, 99)
 * results in [0, 1, 2, 3, 99, 3, 4, 5, 6]
 */
export const splitArrayWithLeaf = (array, spliceIndex, newElement) => {
	const arrayCopy = [...array];
	const duplicateElement = array[spliceIndex];
	arrayCopy.splice(spliceIndex, 0, duplicateElement, newElement);
	return arrayCopy;
};

/**
 * @description A new cycle (face) of vertices has been created,
 * using this cycle, we want to update the adjacent vertices list for a
 * particular vertex, specifically we want to find the index of
 */
export const getAdjacencySpliceIndex = (cycle, adjacent, vertex) => {
	// the index of this vertex inside cycle
	const indexInCycle = cycle.indexOf(vertex);
	if (indexInCycle === -1) { return -1; }

	// the previous and next vertex in the cycle from this vertex
	const prevVertex = cycle[(indexInCycle + cycle.length - 1) % cycle.length];
	const nextVertex = cycle[(indexInCycle + 1) % cycle.length];

	// both the cycle and the adjacent vertices windings are counter-clockwise,
	// this means that when walking around the cycle the "prev" and "next"
	// vertices, when observed in the adjacency list, will be visited in reverse,
	// "prev" will appear right after "next". (feels a bit backwards).
	// so, in the adjacency, we want to splice inbetween "next", ___, "prev",
	// and for Javascript splice() this means we use the "prev" index.
	const prevIndex = adjacent.indexOf(prevVertex);
	if (prevIndex === -1) { return -1; }

	// quickly verify that "nextVertex" is the vertex previous to "prev"
	// in the adjacency array, verifying that the adjacency was built correctly
	const nextTest = adjacent[(prevIndex + adjacent.length - 1) % adjacent.length];
	return (nextTest !== nextVertex ? -1 : prevIndex);
};

/**
 * @description
 */
export const makeVerticesToEdgeLookup = ({ edges_vertices }, edges) => {
	const verticesToEdge = {};
	edges.forEach(edge => {
		const verts = [...edges_vertices[edge]];
		[verts.join(" "), verts.reverse().join(" ")].forEach(key => {
			verticesToEdge[key] = edge;
		});
	});
	return verticesToEdge;
};

/**
 * @description For every vertex involved in these face's faces_vertices,
 * create a lookup for every vertex, a list of all of its adjacent faces,
 * where only the faces from "faces" are considered.
 * @param {FOLD} graph a FOLD graph
 * @param {number[]} faces a list of face indices
 * @returns {number[][]} for every vertex (index) a list of face indices (value)
 */
export const makeVerticesToFacesLookup = ({ faces_vertices }, faces) => {
	// a lookup table with vertex keys, and array values containing faces
	// pre-populate every vertex's value with an empty array
	const verticesToFace = [];
	faces.flatMap(face => faces_vertices[face])
		.forEach(v => { verticesToFace[v] = []; });
	faces.forEach(face => faces_vertices[face]
		.forEach(v => verticesToFace[v].push(face)));
	return verticesToFace;
};

/**
 * @description
 */
export const makeEdgesToFacesLookup = ({ faces_edges }, faces) => {
	const edgesToFaces = [];
	faces.flatMap(face => faces_edges[face])
		.forEach(edge => { edgesToFaces[edge] = []; });
	faces.forEach(face => faces_edges[face]
		.forEach(edge => edgesToFaces[edge].push(face)));
	return edgesToFaces;
};

export const makeFacesFacesFromVertices = ({ faces_vertices }, faces) => {
	const faces_faces = [];
	faces.forEach(f => { faces_faces[f] = []; });
	const edgeMap = {};
	faces
		.forEach(f => faces_vertices[f]
			.map((v0, i, arr) => [v0, arr[(i + 1) % arr.length]])
			.map(([v0, v1]) => (v1 < v0 ? [v1, v0] : [v0, v1]))
			.map(pair => pair.join(" "))
			.forEach(key => {
				if (!edgeMap[key]) { edgeMap[key] = {}; }
				edgeMap[key][f] = true;
			}));
	Object.values(edgeMap)
		.map(obj => Object.keys(obj))
		.filter(arr => arr.length > 1)
		.forEach(pair => {
			faces_faces[pair[0]].push(parseInt(pair[1], 10));
			faces_faces[pair[1]].push(parseInt(pair[0], 10));
		});
	return faces_faces;
};

/**
 * @description Given an edge, get its adjacent faces. This is typically
 * done by simply checking the edges_faces array, but if this array does not
 * exist, this method will still hunt to find the faces by other means.
 * @param {FOLD} graph a FOLD object
 * @param {number} edge index of the edge in the graph
 * {number[]} indices of the two vertices making up the edge
 * @returns {number[]} array of 0, 1, or 2 numbers, the edge's adjacent faces
 * @linkcode Origami ./src/graph/find.js 10
 */
export const findAdjacentFacesToEdge = (
	{ edges_vertices, edges_faces, faces_edges, faces_vertices },
	edge,
) => {
	// easiest case: edges_faces exists.
	if (edges_faces) { return edges_faces[edge]; }

	// we have to choose a component and iterate through every index
	// and build a reverse lookup. because faces_vertices tends to exist
	// far more often than faces_edges, let's just check faces_vertices.

	// quick lookup as we iterate through faces, is a vertex from this edge?
	const verticesHash = {};
	edges_vertices[edge].forEach(v => { verticesHash[v] = true; });

	// for each face, filter it's vertices to only include those inside this edge
	// and make sure the list only contains unique numbers, as it's possible for
	// a face to visit a vertex twice, make sure vertices are unique and check if
	// the number of matching vertices in this face is 2.
	if (faces_vertices) {
		return faces_vertices
			.map((vertices, f) => (Array.from(new Set(vertices
				.filter(v => verticesHash[v]))).length === 2 ? f : undefined))
			.filter(a => a !== undefined);
	}
	if (faces_edges) {
		// todo
	}

	return [];
};

/**
 * @description This is a helper method to accompany the intersection
 * methods. Having already computed vertices/edges/faces intersections
 * (via. intersectLineAndPoints), pass the result in here, and this method
 * will filter out any collinear edges from the faces, edges are not stored
 * but vertices are, so it will filter out pairs of vertices which
 * form a collinear edge.
 * @param {FOLD} graph a FOLD object
 * @param {object} the result of intersectLineAndPoints, modified in place
 */
export const filterCollinearFacesData = ({ edges_vertices }, { vertices, faces }) => {
	// For the upcoming filtering, we need a list of collinear edges, but in
	// the form of vertices, so, pairs of vertices which form a collinear edge.
	const collinearVertices = [];
	edges_vertices
		.map(verts => (vertices[verts[0]] !== undefined
			&& vertices[verts[1]] !== undefined))
		.map((collinear, edge) => (collinear ? edge : undefined))
		.filter(a => a !== undefined)
		.map(edge => edges_vertices[edge])
		.forEach(verts => collinearVertices.push(verts));

	const facesVertices = faces.map(face => face.vertices.map(({ vertex }) => vertex));
	const facesVerticesHash = [];
	facesVertices.forEach((_, f) => { facesVerticesHash[f] = {}; });
	facesVertices
		.forEach((verts, f) => verts
			.forEach(v => { facesVerticesHash[f][v] = true; }));

	faces.forEach((face, f) => {
		const removeVertices = {};
		collinearVertices
			.filter(pair => facesVerticesHash[f][pair[0]] && facesVerticesHash[f][pair[1]])
			.forEach(pair => {
				removeVertices[pair[0]] = true;
				removeVertices[pair[1]] = true;
			});
		faces[f].vertices = face.vertices.filter(el => !removeVertices[el.vertex]);
	});
};
