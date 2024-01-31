import { expect, test } from "vitest";
import ear from "../rabbit-ear.js";

test("populated graph, order of remove", () => {
	const graph1 = ear.graph.fish();
	const graph2 = ear.graph.fish();
	const graph3 = ear.graph.fish();
	const graph4 = ear.graph.fish();
	const graph5 = ear.graph.fish();
	const graph6 = ear.graph.fish();
	const remove = {
		vertices: [0],
		edges: [0, 4, 7, 16, 20],
		faces: [0, 1, 2, 3],
	};
	ear.graph.remove(graph1, "vertices", remove.vertices);
	ear.graph.remove(graph1, "edges", remove.edges);
	ear.graph.remove(graph1, "faces", remove.faces);

	ear.graph.remove(graph2, "vertices", remove.vertices);
	ear.graph.remove(graph2, "faces", remove.faces);
	ear.graph.remove(graph2, "edges", remove.edges);

	ear.graph.remove(graph3, "edges", remove.edges);
	ear.graph.remove(graph3, "vertices", remove.vertices);
	ear.graph.remove(graph3, "faces", remove.faces);

	ear.graph.remove(graph4, "edges", remove.edges);
	ear.graph.remove(graph4, "faces", remove.faces);
	ear.graph.remove(graph4, "vertices", remove.vertices);

	ear.graph.remove(graph5, "faces", remove.faces);
	ear.graph.remove(graph5, "vertices", remove.vertices);
	ear.graph.remove(graph5, "edges", remove.edges);

	ear.graph.remove(graph6, "faces", remove.faces);
	ear.graph.remove(graph6, "edges", remove.edges);
	ear.graph.remove(graph6, "vertices", remove.vertices);

	expect(JSON.stringify(graph1)).toBe(JSON.stringify(graph2));
	expect(JSON.stringify(graph2)).toBe(JSON.stringify(graph3));
	expect(JSON.stringify(graph3)).toBe(JSON.stringify(graph4));
	expect(JSON.stringify(graph4)).toBe(JSON.stringify(graph5));
	expect(JSON.stringify(graph5)).toBe(JSON.stringify(graph6));
});

test("populated graph, order of remove, no zero indexed elements", () => {
	const graph1 = ear.graph.fish();
	const graph2 = ear.graph.fish();
	const graph3 = ear.graph.fish();
	const graph4 = ear.graph.fish();
	const graph5 = ear.graph.fish();
	const graph6 = ear.graph.fish();
	const remove = {
		vertices: [2],
		edges: [1, 8, 9, 11, 13],
		faces: [6, 7, 8, 9],
	};

	ear.graph.remove(graph1, "vertices", remove.vertices);
	ear.graph.remove(graph1, "edges", remove.edges);
	ear.graph.remove(graph1, "faces", remove.faces);

	ear.graph.remove(graph2, "vertices", remove.vertices);
	ear.graph.remove(graph2, "faces", remove.faces);
	ear.graph.remove(graph2, "edges", remove.edges);

	ear.graph.remove(graph3, "edges", remove.edges);
	ear.graph.remove(graph3, "vertices", remove.vertices);
	ear.graph.remove(graph3, "faces", remove.faces);

	ear.graph.remove(graph4, "edges", remove.edges);
	ear.graph.remove(graph4, "faces", remove.faces);
	ear.graph.remove(graph4, "vertices", remove.vertices);

	ear.graph.remove(graph5, "faces", remove.faces);
	ear.graph.remove(graph5, "vertices", remove.vertices);
	ear.graph.remove(graph5, "edges", remove.edges);

	ear.graph.remove(graph6, "faces", remove.faces);
	ear.graph.remove(graph6, "edges", remove.edges);
	ear.graph.remove(graph6, "vertices", remove.vertices);

	expect(JSON.stringify(graph1)).toBe(JSON.stringify(graph2));
	expect(JSON.stringify(graph2)).toBe(JSON.stringify(graph3));
	expect(JSON.stringify(graph3)).toBe(JSON.stringify(graph4));
	expect(JSON.stringify(graph4)).toBe(JSON.stringify(graph5));
	expect(JSON.stringify(graph5)).toBe(JSON.stringify(graph6));
});

test("populated graph", () => {
	const expected = {
		vertices_coords: [
			[0, 0],
			[0.7071067811865476, 0],
			[1, 0.2928932188134524],
			[1, 1],
			[0.2928932188134524, 1],
			[0, 1],
			[0, 0.7071067811865476],
			[0.5, 0.5],
			[0.7071067811865476, 0.2928932188134524],
			[0.2928932188134524, 0.7071067811865476],
		],
		edges_vertices: [
			[0, 1], [2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0], [8, 3], [9, 5],
			[8, 1], [9, 6], [8, 2], [9, 4], [7, 0], [7, 8], [7, 3], [7, 9],
		],
		edges_assignment: [
			"B", "B", "B", "B", "B", "B", "B", "V", "V", "M", "M", "F", "F", "F", "F", "F", "F",
		],
		vertices_edges: [
			[0, 13, 6],
			[9, 0],
			[2, 11, 1],
			[3, 15, 7, 2],
			[3, 4, 12],
			[4, 5, 8],
			[10, 5, 6],
			[15, 16, 13, 14],
			[11, 7, 14, 9],
			[12, 8, 10, 16],
		],
		vertices_vertices: [
			[1, 8, 7, 9, 6],
			[8, 0],
			[3, 8],
			[4, 9, 7, 8, 2],
			[3, 5, 9],
			[4, 6, 9],
			[9, 5, 0],
			[3, 9, 0, 8],
			[2, 3, 7, 0, 1],
			[3, 4, 5, 6, 0, 7],
		],
		edges_foldAngle: [
			0, 0, 0, 0, 0, 0, 0, 180, 180, -180, -180, 0, 0, 0, 0, 0, 0,
		],
		faces_vertices: [
			[0, 1, 8], [0, 8, 7], [0, 7, 9], [0, 9, 6], [1, 8], [2, 8], [4, 5, 9], [5, 6, 9],
		],
		faces_edges: [
			[0, 9], [14, 13], [13, 16], [10, 6], [9], [1, 11], [4, 8, 12], [5, 10, 8],
		],
		vertices_faces: [
			[0, 1, 2, 3], [4, 0], [5], [], [6], [7, 6], [7, 3], [2, 1], [1, 0, 4, 5], [6, 7, 3, 2],
		],
		edges_faces: [
			[0], [5], [], [], [6], [7], [3], [], [6, 7], [0, 4], [3, 7], [5], [6], [1, 2], [1], [], [2],
		],
		faces_faces: [
			[4, 1], [0, 2], [1, 3], [2, 7], [0, 5], [4], [7], [3, 6],
		],
	};
	const graph = ear.graph.fish();
	const remove = {
		vertices: [2],
		edges: [1, 8, 9, 11, 13],
		faces: [6, 7, 8, 9],
	};
	ear.graph.remove(graph, "vertices", remove.vertices);
	ear.graph.remove(graph, "edges", remove.edges);
	ear.graph.remove(graph, "faces", remove.faces);
	Object.keys(expected).forEach(key => {
		expect(JSON.stringify(graph[key])).toBe(JSON.stringify(expected[key]));
	});
});

const testGraph = () => ({
	vertices_coords: [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7]],
	edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0]],
	edges_string: ["a", "b", "c", "d", "e", "f", "g"],
	faces_vertices: [[0, 1, 2, 3, 4, 5, 6]],
});

test("remove graph", () => {
	const graph = testGraph();
	const res = ear.graph.remove(graph, "vertices", [2, 3]);
	[0, 1, undefined, undefined, 2, 3, 4].forEach((el, i) => expect(el).toBe(res[i]));
});

test("few params", () => {
	const res1 = ear.graph.remove({ abc_def: [[1, 2, 3]] }, "abc", [0]);
	expect(res1.length).toBe(1);
	expect(res1[0]).toBe(undefined);

	const res2 = ear.graph.remove({ abc_def: [[1, 2, 3], [4, 5, 6]] }, "abc", [0]);
	expect(res2.length).toBe(2);
	expect(res2[0]).toBe(undefined);
	expect(res2[1]).toBe(0);
});
