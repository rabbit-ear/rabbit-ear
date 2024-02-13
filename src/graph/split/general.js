/**
 * Rabbit Ear (c) Kraft
 */

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
export const findAdjacentFacesToEdge = ({
	vertices_faces, edges_vertices, edges_faces, faces_edges, faces_vertices,
}, edge) => {
	// easiest case, if edges_faces already exists.
	if (edges_faces && edges_faces[edge]) {
		return edges_faces[edge];
	}

	// if that doesn't exist, uncover the data by looking at our incident
	// vertices' faces, compare every index against every index, looking
	// for 2 indices that are present in both arrays. there should be 2.
	const vertices = edges_vertices[edge];
	if (vertices_faces !== undefined) {
		const faces = [];
		for (let i = 0; i < vertices_faces[vertices[0]].length; i += 1) {
			for (let j = 0; j < vertices_faces[vertices[1]].length; j += 1) {
				if (vertices_faces[vertices[0]][i] === vertices_faces[vertices[1]][j]) {
					// todo: now allowing undefined to be in vertices_faces,
					// but, do we want to exclude them from the result?
					if (vertices_faces[vertices[0]][i] === undefined) { continue; }
					faces.push(vertices_faces[vertices[0]][i]);
				}
			}
		}
		return faces;
	}
	if (faces_edges) {
		const faces = [];
		for (let i = 0; i < faces_edges.length; i += 1) {
			for (let e = 0; e < faces_edges[i].length; e += 1) {
				if (faces_edges[i][e] === edge) { faces.push(i); }
			}
		}
		return faces;
	}
	if (faces_vertices) {
		console.warn("findAdjacentFacesToEdge in faces_vertices");
	}
	return [];
};

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
