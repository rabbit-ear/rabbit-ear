/**
 * Rabbit Ear (c) Kraft
 */
import { resize } from "../../math/algebra/vector.js";
import { multiplyMatrix4Vector3 } from "../../math/algebra/matrix4.js";
import { subgraphWithFaces } from "../../graph/subgraph.js";
// import {
// 	edgeFoldAngleIsFlat,
// 	filterKeysWithPrefix,
// } from "../../fold/spec.js";
/**
 * @description make copies of 
 */
export const graphGroupCopies = (graph, sets_faces, sets_transform) => {
	// transform point by a matrix, return result as 2D
	const transformTo2D = (matrix, point) => {
		const p = multiplyMatrix4Vector3(matrix, point);
		return [p[0], p[1]];
	};
	// make all vertices 3D in case they are not already
	const vertices_coords_3d = graph.vertices_coords
		.map(coord => resize(3, coord));
	// make shallow copies of the graph, one for every group
	const copies = sets_faces.map(faces => subgraphWithFaces(graph, faces));
	// transform all vertices_coords by the inverse transform
	// to bring them all into the XY plane. convert to 2D
	sets_transform.forEach((matrix, i) => {
		copies[i].vertices_coords = copies[i].vertices_coords
			.map((_, v) => transformTo2D(matrix, vertices_coords_3d[v]));
	});
	return copies;
};

// /**
//  * @description what
//  */
// export const makeCopyWithFlatEdges = (graph) => {
// 	const copy = { ...graph };
// 	// flat edges indices in a hash table
// 	const lookup = {};
// 	// these are the indices of all flat edges (edges to keep)
// 	copy.edges_foldAngle
// 		.map(edgeFoldAngleIsFlat)
// 		.map((flat, i) => (flat ? i : undefined))
// 		.filter(a => a !== undefined)
// 		.forEach(e => { lookup[e] = true; });
// 	filterKeysWithPrefix(graph, "edges").forEach(key => {
// 		copy[key] = [];
// 		graph[key].forEach((el, e) => {
// 			if (lookup[e]) {
// 				copy[key][e] = JSON.parse(JSON.stringify(el));
// 			}
// 		});
// 	});
// 	return copy;
// };
