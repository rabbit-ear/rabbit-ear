// import {
// 	epsilonEqual,
// 	epsilonEqualVectors,
// } from "../../math/general/function.js";
// import {
// 	makeEdgesCoords,
// 	makeEdgesBoundingBox,
// } from "../make.js";
// import { booleanMatrixToIndexedArray } from "../../general/arrays.js";
// /**
//  * @description Similar edges are defined by their coordinates, it doesn't matter
//  * the order, so long as the two endpoints match
//  */
// export const makeEdgesEdgesSimilar = ({
// 	vertices_coords, edges_vertices, edges_coords,
// }, epsilon = EPSILON) => {
// 	// ///////////////////////////////////////
// 	// idk why this isn't working. it's leaving out some indices. something with
// 	// the group building - indices.slice(), something there.
// 	if (!edges_coords) {
// 		edges_coords = makeEdgesCoords({ vertices_coords, edges_vertices });
// 	}
// 	const edges_boundingBox = makeEdgesBoundingBox({
// 		vertices_coords, edges_vertices, edges_coords,
// 	});
// 	// todo improve. n^2
// 	const matrix = Array.from(Array(edges_coords.length)).map(() => []);
// 	const dimensions = edges_boundingBox.length ? edges_boundingBox[0].min.length : 0;
// 	for (let i = 0; i < edges_coords.length - 1; i += 1) {
// 		for (let j = i + 1; j < edges_coords.length; j += 1) {
// 			let similar = true;
// 			for (let d = 0; d < dimensions; d += 1) {
// 				if (!epsilonEqual(
// 					edges_boundingBox[i].min[d],
// 					edges_boundingBox[j].min[d],
// 					epsilon,
// 				) || !epsilonEqual(
// 					edges_boundingBox[i].max[d],
// 					edges_boundingBox[j].max[d],
// 					epsilon,
// 				)) {
// 					similar = false;
// 				}
// 			}
// 			matrix[i][j] = similar;
// 			matrix[j][i] = similar;
// 		}
// 	}
// 	for (let i = 0; i < edges_coords.length - 1; i += 1) {
// 		for (let j = i + 1; j < edges_coords.length; j += 1) {
// 			if (!matrix[i][j]) { continue; }
// 			const test0 = epsilonEqualVectors(edges_coords[i][0], edges_coords[j][0], epsilon)
// 				&& epsilonEqualVectors(edges_coords[i][1], edges_coords[j][1], epsilon);
// 			const test1 = epsilonEqualVectors(edges_coords[i][0], edges_coords[j][1], epsilon)
// 				&& epsilonEqualVectors(edges_coords[i][1], edges_coords[j][0], epsilon);
// 			const similar = test0 || test1;
// 			matrix[i][j] = similar;
// 			matrix[j][i] = similar;
// 		}
// 	}
// 	return booleanMatrixToIndexedArray(matrix);
// };
