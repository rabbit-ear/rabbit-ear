/**
 * @description given two faces, get the vertices which are
 * shared between the two faces.
 * @param {number[]} face_a_vertices the faces_vertices entry for face A
 * @param {number[]} face_b_vertices the faces_vertices entry for face B
 * @returns {number[]} indices of vertices that are shared between
 * faces, maintaining the vertices in the same order as the
 * winding order of face A.
 * @linkcode Origami ./src/graph/faceSpanningTree.js 16
 */
// todo: this was throwing errors in the case of weird nonconvex faces with
// single edges poking in. the "already_added" was added to fix this.
// tbd if this fix covers all cases of weird polygons in a planar graph.
export const getFaceFaceSharedVertices = (face_a_vertices, face_b_vertices) => {
	// build a quick lookup table: T/F is a vertex in face B
	const hash = {};
	face_b_vertices.forEach((v) => { hash[v] = true; });
	// make a copy of face A containing T/F, if the vertex is shared in face B
	const match = face_a_vertices.map(v => !!hash[v]);
	// filter and keep only the shared vertices.
	const shared_vertices = [];
	const notShared = match.indexOf(false); // -1 if no match, code below still works
	// before we filter the array we just need to cover the special case that
	// the shared edge starts near the end of the array and wraps around
	const already_added = {};
	for (let i = notShared + 1; i < match.length; i += 1) {
		if (match[i] && !already_added[face_a_vertices[i]]) {
			shared_vertices.push(face_a_vertices[i]);
			already_added[face_a_vertices[i]] = true;
		}
	}
	for (let i = 0; i < notShared; i += 1) {
		if (match[i] && !already_added[face_a_vertices[i]]) {
			shared_vertices.push(face_a_vertices[i]);
			already_added[face_a_vertices[i]] = true;
		}
	}
	return shared_vertices;
};
