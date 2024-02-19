/**
 * Rabbit Ear (c) Kraft
 */
import { uniqueElements } from "../../general/array.js";

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
 * @example fn(array, 3, 99) results in [0, 1, 2, 3, 99, 3, 4, 5, 6]
 */
export const splitArrayWithLeaf = (array, spliceIndex, newElement) => {
	const arrayCopy = [...array];
	const duplicateElement = array[spliceIndex];
	arrayCopy.splice(spliceIndex, 0, duplicateElement, newElement);
	return arrayCopy;
};

/**
 * @description 
 */
export const makeVerticesToEdgeLookup = ({ edges_vertices }, edges) => {
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
 * @description 
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
			.map((vertices, f) => (uniqueElements(vertices
				.filter(v => verticesHash[v])).length === 2 ? f : undefined))
			.filter(a => a !== undefined);
	}
	if (faces_edges) {
		// todo
	}

	return [];
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
// export const findAdjacentFacesToEdge = ({
// 	vertices_faces, edges_vertices, edges_faces, faces_edges, faces_vertices,
// }, edge) => {
// 	// easiest case, if edges_faces already exists.
// 	if (edges_faces && edges_faces[edge]) {
// 		return edges_faces[edge];
// 	}

// 	// if that doesn't exist, uncover the data by looking at our incident
// 	// vertices' faces, compare every index against every index, looking
// 	// for 2 indices that are present in both arrays. there should be 2.
// 	const vertices = edges_vertices[edge];
// 	if (vertices_faces !== undefined) {
// 		const faces = [];
// 		for (let i = 0; i < vertices_faces[vertices[0]].length; i += 1) {
// 			for (let j = 0; j < vertices_faces[vertices[1]].length; j += 1) {
// 				if (vertices_faces[vertices[0]][i] === vertices_faces[vertices[1]][j]) {
// 					// todo: now allowing undefined to be in vertices_faces,
// 					// but, do we want to exclude them from the result?
// 					if (vertices_faces[vertices[0]][i] === undefined) { continue; }
// 					faces.push(vertices_faces[vertices[0]][i]);
// 				}
// 			}
// 		}
// 		return faces;
// 	}
// 	if (faces_edges) {
// 		const faces = [];
// 		for (let i = 0; i < faces_edges.length; i += 1) {
// 			for (let e = 0; e < faces_edges[i].length; e += 1) {
// 				if (faces_edges[i][e] === edge) { faces.push(i); }
// 			}
// 		}
// 		return faces;
// 	}
// 	if (faces_vertices) {
// 		console.warn("findAdjacentFacesToEdge in faces_vertices");
// 	}
// 	return [];
// };

/**
 * @description Given a face, uncover the adjacent faces.
 * @param {FOLD} graph a FOLD object
 * @param {number} face index of the face in the graph
 * @returns {number[]} array the face's adjacent faces
 * @linkcode Origami ./src/graph/find.js 60
 */
// export const findAdjacentFacesToFace = ({
// 	vertices_faces, edges_faces, faces_edges, faces_vertices, faces_faces,
// }, face) => {
// 	if (faces_faces && faces_faces[face]) {
// 		return faces_faces[face];
// 	}
// 	console.warn("todo: findAdjacentFacesToFace");
// };
