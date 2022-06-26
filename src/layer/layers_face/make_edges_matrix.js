// /**
//  * Rabbit Ear (c) Kraft
//  */
// import {
// 	makeEdgesEdgesParallel,
// 	makeEdgesEdgesCrossing,
// } from "../../graph/edgesEdges";
// import make_groups_edges from "../../graph/make_groups_edges";
// import {
// 	booleanMatrixToIndexedArray,
// 	booleanMatrixToUniqueIndexPairs,
// } from "../../general/arrays";

// const make_edges_matrix = (graph) => {
// 	// make edges matrix
// 	const matrix_edges = Array.from(Array(graph.edges_vertices.length))
// 		.map(() => Array.from(Array(graph.edges_vertices.length)));
// 	const edges_edges_parallel = makeEdgesEdgesParallel(graph);
// 	const edges_edges_crossing = makeEdgesEdgesCrossing(graph);
// 	const groups_edges = make_groups_edges(graph, 0.001);
// 	edges_edges_parallel.forEach((row, i) => row.forEach((_, j) => {
// 		if (edges_edges_parallel[i][j] === true) {
// 			matrix_edges[i][j] = "parallel";
// 		}
// 	}));
// 	edges_edges_crossing.forEach((row, i) => row.forEach((_, j) => {
// 		if (edges_edges_crossing[i][j] === true) {
// 			matrix_edges[i][j] = "crossing";
// 		}
// 	}));
// 	groups_edges.forEach(group => {
// 		for (let i = 0; i < group.length; i++) {
// 			for (let j = 0; j < group.length; j++) {
// 				if (i === j) { continue; }
// 				matrix_edges[group[i]][group[j]] = "aligned";
// 			}
// 		}
// 	});
// 	const edges_crossing_edges = booleanMatrixToIndexedArray(edges_edges_crossing);
// 	const crossing_pairs = booleanMatrixToUniqueIndexPairs(edges_edges_crossing);
// };
