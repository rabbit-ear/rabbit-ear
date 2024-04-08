import { expect, test } from "vitest";
import ear from "../src/index.js";

test("topologicalSort, Empty graph", () => {
	const directedEdges = [];
	const result = ear.graph.topologicalSort(directedEdges);
	expect(result).toMatchObject([]);
});

test("topologicalSort, Single node graph", () => {
	const directedEdges = [[0, 0]];
	const result = ear.graph.topologicalSort(directedEdges);
	expect(result).toMatchObject([0]);
});

test("topologicalSort, Linear graph", () => {
	const directedEdges = [[0, 1], [1, 2], [2, 3]];
	const result = ear.graph.topologicalSort(directedEdges);
	expect(result).toMatchObject([0, 1, 2, 3]);
});

test("topologicalSort, Graph with cycles", () => {
	const directedEdges = [[0, 1], [1, 2], [2, 0]];
	const result = ear.graph.topologicalSort(directedEdges);
	// Since the graph contains a cycle, the result should be undefined
	expect(result).toMatchObject([1, 2, 0]);
});

test("topologicalSort, Graph with disconnected components", () => {
	const directedEdges = [[0, 1], [1, 2], [3, 4], [4, 5]];
	const result = ear.graph.topologicalSort(directedEdges);
	expect(result).toMatchObject([0, 1, 2, 3, 4, 5]);
});

test("topologicalSort, Graph with multiple possible orders", () => {
	const directedEdges = [
		[0, 1], [0, 2], [1, 3], [2, 3]
	];
	const result = ear.graph.topologicalSort(directedEdges);
	expect(result).toMatchObject([0, 1, 2, 3]);
});

test("topologicalSort, Large acyclic graph", () => {
	const directedEdges = [];
	for (let i = 0; i < 1000; i++) {
		directedEdges.push([i, i + 1]);
	}
	const result = ear.graph.topologicalSort(directedEdges);
	expect(result).toHaveLength(1001);
	expect(result[0]).toBe(0);
	expect(result[1000]).toBe(1000);
});

test("topologicalSort, Graph with self-referencing nodes", () => {
	const directedEdges = [
		[0, 1], [1, 2], [2, 2], [2, 3]
	];
	const result = ear.graph.topologicalSort(directedEdges);
	expect(result).toMatchObject([0, 1, 2, 3]);
});

test("topologicalSort, Graph with duplicate edges", () => {
	const directedEdges = [
		[0, 1], [1, 2], [2, 3], [0, 1], [2, 3]
	];
	const result = ear.graph.topologicalSort(directedEdges);
	expect(result).toMatchObject([0, 1, 2, 3]);
});

test("topologicalSort, Graph with multiple disconnected components", () => {
	const directedEdges = [
		[0, 1], [1, 2], [2, 0], [3, 4], [4, 5], [5, 3]
	];
	const result = ear.graph.topologicalSort(directedEdges);
	expect(result).toMatchObject([1, 2, 0, 4, 5, 3]);
});

test("topologicalSort, Graph with loops", () => {
	const directedEdges = [
		[0, 1], [1, 2], [2, 3], [3, 1]
	];
	const result = ear.graph.topologicalSort(directedEdges);
	expect(result).toMatchObject([0, 2, 3, 1]);
});

test("topologicalSort, Graph with negative vertex indices", () => {
	const directedEdges = [
		[-1, 0], [0, 1], [1, 2], [2, 3]
	];
	const result = ear.graph.topologicalSort(directedEdges);
	expect(result).toEqual([-1, 0, 1, 2, 3]);
});

test("topologicalSort, Graph with negative and positive vertex indices", () => {
	const directedEdges = [
		[-2, -1], [-1, 0], [0, 1], [1, 2], [2, 3]
	];
	const result = ear.graph.topologicalSort(directedEdges);
	expect(result).toEqual([-2, -1, 0, 1, 2, 3]);
});
