// /**
//  * Rabbit Ear (c) Kraft
//  */
// import { makeFacesFaces } from "../make.js";
// import { getFaceFaceSharedVertices } from "./general.js";
// /**
//  * @typedef FaceTreeNode
//  * @type {{ face: number, parent: number, edge_vertices: number[] }}
//  * @description A node in a tree specifically intended to map edge-
//  * connected faces.
//  * @property {number} face - the index of this face
//  * @property {number} parent - this face's parent node's face index
//  * @property {number[]} edge_vertices: the vertices that make up the
//  * edge connecting this face to the parent face.
//  */

// // const getFaceFaceSharedVertices = (graph, face0, face1) => graph
// //   .faces_vertices[face0]
// //   .filter(v => graph.faces_vertices[face1].indexOf(v) !== -1)

// // each element will have
// // except for the first level. the root level has no reference to the
// // parent face, or the edge_vertices shared between them
// // root_face will become the root node
// /**
//  * @description Make a minimum spanning tree of a graph of edge-adjacent faces.
//  * @param {FOLD} graph a FOLD object
//  * @param {number} [root_face=0] the face index to be the root node
//  * @returns {FaceTreeNode[][]} a tree arranged as an array containing
//  * arrays of FaceTreeNode. Each inner array contains all nodes at that
//  * depth (0, 1, 2...).
//  * @linkcode Origami ./src/graph/faceSpanningTree.js 59
//  */
// export const makeFaceSpanningTree = ({ faces_vertices, faces_faces }, root_face = 0) => {
	
// 	if (!faces_faces) {
// 		faces_faces = makeFacesFaces({ faces_vertices });
// 	}
// 	if (faces_faces.length === 0) { return []; }

// 	const tree = [[{ face: root_face }]];
// 	const visited_faces = {};
// 	visited_faces[root_face] = true;
// 	do {
// 		// iterate the previous level's faces and gather their adjacent faces
// 		const next_level_with_duplicates = tree[tree.length - 1]
// 			.map(current => faces_faces[current.face]
// 				.map(face => ({ face, parent: current.face })))
// 			.reduce((a, b) => a.concat(b), []);
// 		// at this point its likely many faces are duplicated either because:
// 		// 1. they were already visited in previous levels
// 		// 2. the same face was adjacent to a few different faces from this step
// 		const dup_indices = {};
// 		next_level_with_duplicates.forEach((el, i) => {
// 			if (visited_faces[el.face]) { dup_indices[i] = true; }
// 			visited_faces[el.face] = true;
// 		});
// 		// unqiue set of next level faces
// 		const next_level = next_level_with_duplicates
// 			.filter((_, i) => !dup_indices[i]);
// 		// set next_level's edge_vertices
// 		// we cannot depend on faces being convex and only sharing 2 vertices in common.
// 		// if there are more than 2 edges, let's hope they are collinear.
// 		// either way, grab the first 2 vertices if there are more.
// 		next_level
// 			.map(el => getFaceFaceSharedVertices(
// 				faces_vertices[el.face],
// 				faces_vertices[el.parent],
// 			)).forEach((ev, i) => {
// 				const edge_vertices = ev.slice(0, 2);
// 				// const edgeKey = edge_vertices.join(" ");
// 				next_level[i].edge_vertices = edge_vertices;
// 				// next_level[i].edge = edge_map[edgeKey];
// 			});
// 		// append this next_level to the master tree
// 		tree[tree.length] = next_level;
// 	} while (tree[tree.length - 1].length > 0);
// 	if (tree.length > 0 && tree[tree.length - 1].length === 0) {
// 		tree.pop();
// 	}
// 	return tree;
// };
// export const makeFaceSpanningTree = ({ faces_vertices, faces_faces }, root_face = 0) => {
// 	if (!faces_faces) {
// 		faces_faces = makeFacesFaces({ faces_vertices });
// 	}
// 	if (faces_faces.length === 0) { return []; }

// 	const tree = [[{ face: root_face }]];
// 	const visited_faces = {};
// 	visited_faces[root_face] = true;
// 	do {
// 		// iterate the previous level's faces and gather their adjacent faces
// 		const next_level_with_duplicates = tree[tree.length - 1]
// 			.map(current => faces_faces[current.face]
// 				.map(face => ({ face, parent: current.face })))
// 			.reduce((a, b) => a.concat(b), []);
// 		// at this point its likely many faces are duplicated either because:
// 		// 1. they were already visited in previous levels
// 		// 2. the same face was adjacent to a few different faces from this step
// 		const dup_indices = {};
// 		next_level_with_duplicates.forEach((el, i) => {
// 			if (visited_faces[el.face]) { dup_indices[i] = true; }
// 			visited_faces[el.face] = true;
// 		});
// 		// unqiue set of next level faces
// 		const next_level = next_level_with_duplicates
// 			.filter((_, i) => !dup_indices[i]);
// 		// set next_level's edge_vertices
// 		// we cannot depend on faces being convex and only sharing 2 vertices in common.
// 		// if there are more than 2 edges, let's hope they are collinear.
// 		// either way, grab the first 2 vertices if there are more.
// 		next_level
// 			.map(el => getFaceFaceSharedVertices(
// 				faces_vertices[el.face],
// 				faces_vertices[el.parent],
// 			)).forEach((ev, i) => {
// 				const edge_vertices = ev.slice(0, 2);
// 				// const edgeKey = edge_vertices.join(" ");
// 				next_level[i].edge_vertices = edge_vertices;
// 				// next_level[i].edge = edge_map[edgeKey];
// 			});
// 		// append this next_level to the master tree
// 		tree[tree.length] = next_level;
// 	} while (tree[tree.length - 1].length > 0);
// 	if (tree.length > 0 && tree[tree.length - 1].length === 0) {
// 		tree.pop();
// 	}
// 	return tree;
// };
