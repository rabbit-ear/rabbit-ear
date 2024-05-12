import { expect, test } from "vitest";
import ear from "../src/index.js";

test("deprecated", () => expect(true).toBe(true));

// test("add vertices simple", () => {
// 	const graph = {
// 		vertices_coords: [[0, 0], [1, 0], [1, 1], [0, 1]],
// 		edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 0], [1, 3]],
// 		edges_foldAngle: [0, 0, 0, 0, 90],
// 		edges_assignment: ["B", "B", "B", "B", "V"],
// 		faces_vertices: [[0, 1, 3], [2, 3, 1]],
// 		faces_edges: [[0, 4, 3], [1, 4, 2]],
// 	};

// 	ear.graph.addVertices(graph, [[0.33, 0.33], [0.5, 0.5]]);

// 	expect(graph.vertices_coords[4][0]).toBe(0.33);
// 	expect(graph.vertices_coords[5][0]).toBe(0.5);
// 	expect(JSON.stringify(graph.edges_vertices))
// 		.toBe(JSON.stringify([[0, 1], [1, 2], [2, 3], [3, 0], [1, 3]]));
// 	expect(JSON.stringify(graph.faces_vertices))
// 		.toBe(JSON.stringify([[0, 1, 3], [2, 3, 1]]));
// });

// // test("add vertices duplicate vertices", () => {
// //   // this method will still add vertices, even if it's a duplicate
// //   const graph = {
// //     vertices_coords: [[0, 0], [1, 0], [1, 1], [0, 1]],
// //   };
// //   ear.graph.addVertices(graph, [[0.33, 0.33], [1, 1]]);

// //   expect(graph.vertices_coords[4][0]).toBe(0.33);
// //   expect(graph.vertices_coords[4][1]).toBe(0.33);
// //   expect(graph.vertices_coords[5][0]).toBe(1);
// //   expect(graph.vertices_coords[5][1]).toBe(1);
// // });

// test("add vertices no vertices_coords", () => {
// 	const graph = {
// 		edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 0], [1, 3]],
// 		edges_foldAngle: [0, 0, 0, 0, 90],
// 		edges_assignment: ["B", "B", "B", "B", "V"],
// 		faces_vertices: [[0, 1, 3], [2, 3, 1]],
// 		faces_edges: [[0, 4, 3], [1, 4, 2]],
// 	};
// 	ear.graph.addVertices(graph, [[0.33, 0.33], [0.5, 0.5]]);
// 	expect(graph.vertices_coords[0][0]).toBe(0.33);
// 	expect(graph.vertices_coords[1][0]).toBe(0.5);
// });

// test("add vertices no graph", () => {
// 	const graph = {};
// 	ear.graph.addVertices(graph, [[0.33, 0.33], [0.5, 0.5]]);
// 	expect(graph.vertices_coords[0][0]).toBe(0.33);
// 	expect(graph.vertices_coords[1][0]).toBe(0.5);
// });

// test("add vertices duplicate", () => {
// 	const graph = {
// 		vertices_coords: [[0, 0], [1, 0], [1, 1], [0, 1]],
// 	};
// 	const result = ear.graph.addVertices(graph, [[0.5, 0.5], [1, 1]]);
// 	expect(result[0]).toBe(4);
// 	expect(result[1]).toBe(2);
// });

// test("add vertices unique", () => {
// 	const graph = {
// 		vertices_coords: [[0, 0], [1, 0], [1, 1], [0, 1]],
// 		edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 0], [1, 3]],
// 		edges_foldAngle: [0, 0, 0, 0, 90],
// 		edges_assignment: ["B", "B", "B", "B", "V"],
// 		faces_vertices: [[0, 1, 3], [2, 3, 1]],
// 		faces_edges: [[0, 4, 3], [1, 4, 2]],
// 	};

// 	ear.graph.addVertices(graph, [[0.33, 0.33], [0.5, 0.5]]);
// });
