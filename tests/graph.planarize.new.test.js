import fs from "fs";
import { expect, test } from "vitest";
import ear from "../src/index.js";

// test("planarize, graph with random edges", () => {
// 	const COUNT = 100;
// 	const graph = {
// 		vertices_coords: Array.from(Array(COUNT * 2))
// 			.map(() => [Math.random(), Math.random()]),
// 		edges_vertices: Array.from(Array(COUNT))
// 			.map((_, i) => [i * 2, i * 2 + 1]),
// 		edges_assignment: Array.from(Array(COUNT))
// 			.map(() => ["V", "M", "F", "U"][Math.floor(Math.random() * 4)]),
// 	};
// 	fs.writeFileSync(
// 		`./tests/tmp/non-planar-${COUNT}-random-lines.fold`,
// 		JSON.stringify(graph),
// 	);
// });

test("planarize, non-planar bird base", () => {
	const FOLD = fs.readFileSync("./tests/files/fold/non-planar-bird-base.fold", "utf-8");
	const cp = JSON.parse(FOLD);
	const result = ear.graph.planarizeNew(cp);
	// console.log(result);
	fs.writeFileSync(
		"./tests/tmp/planarize-new-non-planar-bird-base.fold",
		JSON.stringify(result),
	);
});

test("planarize, non-planar square fish base", () => {
	const FOLD = fs.readFileSync("./tests/files/fold/non-planar-square-fish.fold", "utf-8");
	const cp = JSON.parse(FOLD);
	const result = ear.graph.planarizeNew(cp);
	fs.writeFileSync(
		"./tests/tmp/planarize-new-non-planar-square-fish.fold",
		JSON.stringify(result),
	);
});

test("planarize, non-planar 50 random lines", () => {
	const FOLD = fs.readFileSync("./tests/files/fold/non-planar-50-random-lines.fold", "utf-8");
	const graph = JSON.parse(FOLD);
	const result = ear.graph.planarizeNew(graph);
	fs.writeFileSync(
		"./tests/tmp/planarize-new-non-planar-50-random-lines.fold",
		JSON.stringify(result),
	);
});

test("planarize, non-planar 100 random lines", () => {
	const FOLD = fs.readFileSync("./tests/files/fold/non-planar-100-random-lines.fold", "utf-8");
	const graph = JSON.parse(FOLD);
	const result = ear.graph.planarizeNew(graph);
	fs.writeFileSync(
		"./tests/tmp/planarize-new-non-planar-100-random-lines.fold",
		JSON.stringify(result),
	);
});

test("planarize, kraft bird base", () => {
	const FOLD = fs.readFileSync("./tests/files/fold/kraft-bird-base.fold", "utf-8");
	const graph = JSON.parse(FOLD);
	const result = ear.graph.planarizeNew(graph);
	fs.writeFileSync(
		"./tests/tmp/planarize-kraft-bird-base.fold",
		JSON.stringify(result),
	);
});

// test("planarize, non-planar bird base", () => {
// 	const FOLD = fs.readFileSync("./tests/files/fold/non-planar-bird-base.fold", "utf-8");
// 	const cp = JSON.parse(FOLD);
// 	const { graph, info } = ear.graph.planarizeCollinearEdges(cp);
// 	const result = ear.graph.intersectAllEdges(graph);
// 	console.log(result);
// });

// test("planarize, non-planar square fish base", () => {
// 	const FOLD = fs.readFileSync("./tests/files/fold/non-planar-square-fish.fold", "utf-8");
// 	const cp = JSON.parse(FOLD);
// 	const { graph, info } = ear.graph.planarizeCollinearEdges(cp);
// 	const result = ear.graph.intersectAllEdges(graph);
// });
