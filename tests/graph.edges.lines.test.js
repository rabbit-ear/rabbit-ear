import fs from "fs";
import xmldom from "@xmldom/xmldom";
import { expect, test } from "vitest";
import ear from "../rabbit-ear.js";

ear.window = xmldom;

test("fish base", () => {
	const graph = ear.graph.fish();
	const { lines, edges_line } = ear.graph.getEdgesLine(graph);
	const n029 = 1 - Math.SQRT1_2;
	const n070 = Math.SQRT1_2;
	const expected = [
		{ vector: [1, 0], origin: [0, 0] }, // bottom
		{ vector: [0, -1], origin: [0, 1] }, // left
		{ vector: [-n070, -n029], origin: [n070, n029] },
		{ vector: [-n029, -n070], origin: [n029, n070] },
		{ vector: [-1, -1], origin: [1, 1] }, // diagonal
		{ vector: [n029, 0], origin: [n070, n029] },
		{ vector: [0, n029], origin: [n029, n070] },
		{ vector: [n029, n070], origin: [n070, n029] },
		{ vector: [n070, n029], origin: [n029, n070] },
		{ vector: [1, -1], origin: [0, 1] }, // diagonal
		{ vector: [0, -n029], origin: [n070, n029] },
		{ vector: [-n029, 0], origin: [n029, n070] },
		{ vector: [0, 1], origin: [1, 0] }, // right
		{ vector: [-1, 0], origin: [1, 1] }, // top
	];
	lines.forEach((line, i) => expect(
		ear.math.epsilonEqualVectors(line.vector, expected[i].vector),
	).toBe(true));
	lines.forEach((line, i) => expect(
		ear.math.epsilonEqualVectors(line.origin, expected[i].origin),
	).toBe(true));
});

test("maze folding", () => {
	const svg = fs.readFileSync("./tests/files/svg/maze-8x8.svg", "utf-8");
	const graph = ear.convert.svgToFold.svgEdgeGraph(svg);
	fs.writeFileSync(
		"./tests/tmp/planarizeEdgeGraph.fold",
		JSON.stringify(graph),
		"utf8",
	);
	const { lines, edges_line } = ear.graph.getEdgesLine(graph);
	const edgesValid = graph.edges_vertices
		.map(ev => ev.map(v => graph.vertices_coords[v]))
		.map((coords, i) => coords
			.map(coord => ear.math.overlapLinePoint(lines[edges_line[i]], coord)))
		.map(pair => pair[0] && pair[1])
		.map((valid, i) => (!valid ? i : undefined))
		.filter(a => a !== undefined);
	expect(edgesValid.length).toBe(0);
});

test("Mooser's train 3d edges_line", () => {
	const FOLD = fs.readFileSync("./tests/files/fold/moosers-train.fold", "utf-8");
	const graph = JSON.parse(FOLD);
	const edgesLine = ear.graph.getEdgesLine(graph);
	expect(edgesLine.lines.length).toBe(301);
	expect(true).toBe(true);
});

test("parallel same distance 3d", () => {
	const graph = {
		vertices_coords: [
			[1, 2, 3], [7, 2, 6], // random values
			[-1, 5, 5], [1, 5, 5],
			[8, 3, 5], [1, 3, 2], // random values
			[-1, -5, 5], [1, -5, 5],
			[9, 2, 7], [2, 8, 4], // random values
			[-1, -5, -5], [1, -5, -5],
			[8, 5, 9], [4, 5, 1], // random values
			[-1, 5, -5], [1, 5, -5],
		],
		edges_vertices: [
			[0, 1], [2, 3], [4, 5], [6, 7], [8, 9], [10, 11], [12, 13], [14, 15],
		],
	};
	const result = ear.graph.getEdgesLine(graph);
	const lines_edges = ear.graph.invertMap(result.edges_line);
	lines_edges.forEach(el => expect(typeof el).toBe("number"));
	expect(result.lines.length).toBe(8);
});

test("parallel same distance 3d", () => {
	const graph = {
		vertices_coords: [
			[-1, 5, 5], [1, 5, 5],
			[-1, -5, 5], [1, -5, 5],
			[-1, -5, -5], [1, -5, -5],
			[-1, 5, -5], [1, 5, -5],
		],
		edges_vertices: [[0, 1], [2, 3], [4, 5], [6, 7]],
	};
	const result = ear.graph.getEdgesLine(graph);
	const lines_edges = ear.graph.invertMap(result.edges_line);
	lines_edges.forEach(el => expect(typeof el).toBe("number"));
	expect(result.lines.length).toBe(4);
});

test("parallel same distance 3d", () => {
	const graph = {
		vertices_coords: Array.from(Array(16))
			.map((_, i) => (i / 16) * (Math.PI * 2))
			.flatMap(a => [
				[-1, Math.cos(a), Math.sin(a)], [1, Math.cos(a), Math.sin(a)],
			]),
		edges_vertices: Array.from(Array(16))
			.map((_, i) => [i * 2, i * 2 + 1]),
	};
	const result = ear.graph.getEdgesLine(graph);
	const lines_edges = ear.graph.invertMap(result.edges_line);
	lines_edges.forEach(el => expect(typeof el).toBe("number"));
	expect(result.lines.length).toBe(16);
});
