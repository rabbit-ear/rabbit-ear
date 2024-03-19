import { expect, test } from "vitest";
import fs from "fs";
import ear from "../rabbit-ear.js";

// test("cutFaceToVertex", () => {
// 	const FOLD = fs.readFileSync(
// 		"./tests/files/fold/surrounded-square.fold",
// 		"utf-8",
// 	);
// 	const graph = JSON.parse(FOLD);
// 	const result = ear.graph.cutFaceToVertex(graph, 0, vertexFace, vertexLeaf);
// });

// test("cutFaceToPoint", () => {
// 	const FOLD = fs.readFileSync(
// 		"./tests/files/fold/surrounded-square.fold",
// 		"utf-8",
// 	);
// 	const graph = JSON.parse(FOLD);
// 	const result = ear.graph.cutFaceToPoint(graph, 0, vertex, point);
// });

test("splitFaceWithEdge no change", () => {
	const FOLD = fs.readFileSync(
		"./tests/files/fold/surrounded-square.fold",
		"utf-8",
	);
	const graph = JSON.parse(FOLD);
	const clone = structuredClone(graph);
	const result = ear.graph.splitFaceWithEdge(graph, 0, [4, 5]);
	expect(graph).toMatchObject(clone);
	expect(result).toMatchObject({});
});

test("splitFaceWithEdge", () => {
	const FOLD = fs.readFileSync(
		"./tests/files/fold/surrounded-square.fold",
		"utf-8",
	);
	const graph = JSON.parse(FOLD);
	const result = ear.graph.splitFaceWithEdge(graph, 0, [4, 6]);

	expect(result).toMatchObject({
		edge: 12,
		faces: { map: [[4, 5], 0, 1, 2, 3], new: [4, 5], remove: 0 },
	});

	expect(graph.vertices_vertices).toMatchObject([
		[1, 4, 3], [2, 5, 0], [3, 6, 1], [0, 7, 2], [5, 6, 7, 0], [6, 4, 1], [7, 4, 5, 2], [4, 6, 3]
	]);
	expect(graph.vertices_edges).toMatchObject([
		[0, 8, 3], [1, 9, 0], [2, 10, 1], [3, 11, 2],
		[4, 12, 7, 8], [5, 4, 9], [6, 12, 5, 10], [7, 6, 11],
	]);
	expect(graph.vertices_faces).toMatchObject([
		[0, 3, undefined], [1, 0, undefined], [2, 1, undefined], [3, 2, undefined],
		[5, 4, 3, 0], [5, 0, 1], [4, 5, 1, 2], [4, 2, 3],
	]);
	expect(graph.edges_vertices).toMatchObject([
		[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6],
		[6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7], [4, 6],
	]);
	expect(graph.edges_assignment).toMatchObject([
		"B", "B", "B", "B", "F", "F", "F", "F", "J", "J", "J", "J", "U"
	]);
	expect(graph.edges_foldAngle).toMatchObject([
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	]);
	expect(graph.edges_faces).toMatchObject([
		[0], [1], [2], [3], [5, 0], [5, 1], [4, 2], [4, 3], [3, 0], [0, 1], [1, 2], [2, 3], [4, 5],
	]);
	expect(graph.faces_vertices).toMatchObject([
		[0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7], [6, 7, 4], [4, 5, 6],
	]);
	expect(graph.faces_edges).toMatchObject([
		[0, 9, 4, 8], [1, 10, 5, 9], [2, 11, 6, 10], [3, 8, 7, 11], [6, 7, 12], [4, 5, 12],
	]);
	expect(graph.faces_faces).toMatchObject([
		[undefined, 1, 5, 3],
		[undefined, 2, 5, 0],
		[undefined, 3, 4, 1],
		[undefined, 0, 4, 2],
		[2, 3, 5],
		[0, 1, 4],
	]);
});

// test("splitFace", () => {
// 	const FOLD = fs.readFileSync(
// 		"./tests/files/fold/surrounded-square.fold",
// 		"utf-8",
// 	);
// 	const graph = JSON.parse(FOLD);
// 	const result = ear.graph.splitFace(graph, 0, vertices);
// });
