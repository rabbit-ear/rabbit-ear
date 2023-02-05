/**
 * Rabbit Ear (c) Kraft
 */
import { makeFacesFaces } from "./make.js";

// const getFaceFaceSharedVertices = (graph, face0, face1) => graph
//   .faces_vertices[face0]
//   .filter(v => graph.faces_vertices[face1].indexOf(v) !== -1)

/**
 * @description given two faces, get the vertices which are shared between the two faces.
 * @param {number[]} face_a_vertices the faces_vertices entry for face A
 * @param {number[]} face_b_vertices the faces_vertices entry for face B
 * @returns {number[]} indices of vertices that are shared between faces maintaining
 * the vertices in the same order as the winding order of face A.
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

// each element will have
// except for the first level. the root level has no reference to the
// parent face, or the edge_vertices shared between them
// root_face will become the root node
/**
 * @description Make a minimum spanning tree of a graph that edge-adjacent faces.
 * @param {FOLD} graph a FOLD graph
 * @param {number} [root_face=0] the face index to be the root node
 * @returns {object[][]} a tree arranged as an array containin arrays of nodes. each inner
 * array contains all nodes at that depth (0, 1, 2...) each node contains:
 * "face" {number} "parent" {number} "edge_vertices" {number[]}
 * @linkcode Origami ./src/graph/faceSpanningTree.js 59
 */
export const makeFaceSpanningTree = ({ faces_vertices, faces_faces }, root_face = 0) => {
	if (!faces_faces) {
		faces_faces = makeFacesFaces({ faces_vertices });
	}
	if (faces_faces.length === 0) { return []; }

	const tree = [[{ face: root_face }]];
	const visited_faces = {};
	visited_faces[root_face] = true;
	do {
		// iterate the previous level's faces and gather their adjacent faces
		const next_level_with_duplicates = tree[tree.length - 1]
			.map(current => faces_faces[current.face]
				.map(face => ({ face, parent: current.face })))
			.reduce((a, b) => a.concat(b), []);
		// at this point its likely many faces are duplicated either because:
		// 1. they were already visited in previous levels
		// 2. the same face was adjacent to a few different faces from this step
		const dup_indices = {};
		next_level_with_duplicates.forEach((el, i) => {
			if (visited_faces[el.face]) { dup_indices[i] = true; }
			visited_faces[el.face] = true;
		});
		// unqiue set of next level faces
		const next_level = next_level_with_duplicates
			.filter((_, i) => !dup_indices[i]);
		// set next_level's edge_vertices
		// we cannot depend on faces being convex and only sharing 2 vertices in common.
		// if there are more than 2 edges, let's hope they are collinear.
		// either way, grab the first 2 vertices if there are more.
		next_level
			.map(el => getFaceFaceSharedVertices(
				faces_vertices[el.face],
				faces_vertices[el.parent],
			)).forEach((ev, i) => {
				const edge_vertices = ev.slice(0, 2);
				// const edgeKey = edge_vertices.join(" ");
				next_level[i].edge_vertices = edge_vertices;
				// next_level[i].edge = edge_map[edgeKey];
			});
		// append this next_level to the master tree
		tree[tree.length] = next_level;
	} while (tree[tree.length - 1].length > 0);
	if (tree.length > 0 && tree[tree.length - 1].length === 0) {
		tree.pop();
	}
	return tree;
};
