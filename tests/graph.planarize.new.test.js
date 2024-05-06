import fs from "fs";
import { expect, test } from "vitest";
import ear from "../src/index.js";

// test("generate a graph with random edges", () => {
// 	const COUNT = 500;
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

test("planarize, flapping bird with line through", () => {
	const FOLD = fs.readFileSync("./tests/files/fold/randlett-flapping-bird.fold", "utf-8");
	const cp = JSON.parse(FOLD);
	cp.vertices_coords.push([0.1, 1], [1, 0.1]);
	cp.edges_vertices.push([
		cp.vertices_coords.length - 2,
		cp.vertices_coords.length - 1,
	]);
	cp.edges_assignment.push("F");
	const { graph, changes } = ear.graph.planarizeVEF(cp);
	fs.writeFileSync(
		"./tests/tmp/planarize-flapping-bird.fold",
		JSON.stringify(graph),
	);
	fs.writeFileSync(
		"./tests/tmp/planarize-flapping-bird.json",
		JSON.stringify(changes),
	);
});

test("planarize, non-planar bird base", () => {
	const FOLD = fs.readFileSync("./tests/files/fold/non-planar-bird-base.fold", "utf-8");
	const cp = JSON.parse(FOLD);
	const { graph: result, changes } = ear.graph.planarizeVEF(cp);
	fs.writeFileSync(
		"./tests/tmp/planarize-non-planar-bird-base.fold",
		JSON.stringify(result),
	);
	fs.writeFileSync(
		"./tests/tmp/planarize-non-planar-bird-base.json",
		JSON.stringify(changes),
	);
});

test("planarize, non-planar square fish base", () => {
	const FOLD = fs.readFileSync("./tests/files/fold/non-planar-square-fish.fold", "utf-8");
	const cp = JSON.parse(FOLD);
	const { graph: result, changes } = ear.graph.planarizeVEF(cp);
	fs.writeFileSync(
		"./tests/tmp/planarize-non-planar-square-fish.fold",
		JSON.stringify(result),
	);
	fs.writeFileSync(
		"./tests/tmp/planarize-non-planar-square-fish.json",
		JSON.stringify(changes),
	);
});

test("planarize, non-planar 50 random lines", () => {
	const FOLD = fs.readFileSync("./tests/files/fold/non-planar-50-random-lines.fold", "utf-8");
	const graph = JSON.parse(FOLD);
	const { graph: result } = ear.graph.planarizeVEF(graph);
	fs.writeFileSync(
		"./tests/tmp/planarize-new-non-planar-50-random-lines.fold",
		JSON.stringify(result),
	);
});

test("planarize, non-planar 100 random lines", () => {
	const FOLD = fs.readFileSync("./tests/files/fold/non-planar-100-random-lines.fold", "utf-8");
	const graph = JSON.parse(FOLD);
	const { graph: result } = ear.graph.planarizeVEF(graph, 1e-4);
	fs.writeFileSync(
		"./tests/tmp/planarize-new-non-planar-100-random-lines.fold",
		JSON.stringify(result),
	);
});

test("planarize, kraft bird base", () => {
	const FOLD = fs.readFileSync("./tests/files/fold/kraft-bird-base.fold", "utf-8");
	const graph = JSON.parse(FOLD);
	const { graph: result, changes } = ear.graph.planarizeVEF(graph);
	fs.writeFileSync(
		"./tests/tmp/planarize-kraft-bird-base.fold",
		JSON.stringify(result),
	);
	fs.writeFileSync(
		"./tests/tmp/planarize-kraft-bird-base.json",
		JSON.stringify(changes),
	);
});

test("planarize, crane already planar", () => {
	const FOLD = fs.readFileSync("./tests/files/fold/crane.fold", "utf-8");
	const graph = JSON.parse(FOLD);
	const { graph: result, changes } = ear.graph.planarizeVEF(graph);
	fs.writeFileSync(
		"./tests/tmp/planarize-crane.fold",
		JSON.stringify(result),
	);
	fs.writeFileSync(
		"./tests/tmp/planarize-crane.json",
		JSON.stringify(changes),
	);
});

// test("planarize, time test", () => {
// 	const FOLD = fs.readFileSync("./tests/files/fold/non-planar-500-random-lines.fold", "utf-8");
// 	const graph = JSON.parse(FOLD);
// 	console.time("new");
// 	ear.graph.planarizeVEF(graph);
// 	console.timeEnd("new");
// 	console.time("old");
// 	ear.graph.planarize(graph);
// 	console.timeEnd("old");
// });
