import fs from "fs";
import { expect, test } from "vitest";
import ear from "../src/index.js";

test("planarize, flapping bird with line through", () => {
	const FOLD = fs.readFileSync("./tests/files/fold/randlett-flapping-bird.fold", "utf-8");
	const cp = JSON.parse(FOLD);
	cp.vertices_coords.push([0.1, 1], [1, 0.1]);
	cp.edges_vertices.push([
		cp.vertices_coords.length - 2,
		cp.vertices_coords.length - 1,
	]);
	cp.edges_assignment.push("F");
	const { result, changes } = ear.graph.planarizeVEF(cp);
	fs.writeFileSync(
		"./tests/tmp/planarize-flapping-bird.fold",
		JSON.stringify(result),
	);
	fs.writeFileSync(
		"./tests/tmp/planarize-flapping-bird.json",
		JSON.stringify(changes),
	);
});

test("planarize, non-planar bird base", () => {
	const FOLD = fs.readFileSync("./tests/files/fold/non-planar-bird-base.fold", "utf-8");
	const cp = JSON.parse(FOLD);
	const { result, changes } = ear.graph.planarizeVEF(cp);
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
	const { result, changes } = ear.graph.planarizeVEF(cp);
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
	const FOLD = fs.readFileSync("./tests/files/fold/non-planar-50-chaotic.fold", "utf-8");
	const graph = JSON.parse(FOLD);
	const { result } = ear.graph.planarizeVEF(graph);
	fs.writeFileSync(
		"./tests/tmp/planarize-new-non-planar-50-random-chaotic.fold",
		JSON.stringify(result),
	);
});

test("planarize, non-planar 100 random lines", () => {
	const FOLD = fs.readFileSync("./tests/files/fold/non-planar-100-chaotic.fold", "utf-8");
	const graph = JSON.parse(FOLD);
	const { result } = ear.graph.planarizeVEF(graph, 1e-4);
	fs.writeFileSync(
		"./tests/tmp/planarize-new-non-planar-100-random-chaotic.fold",
		JSON.stringify(result),
	);
});

test("planarize, kraft bird base", () => {
	const FOLD = fs.readFileSync("./tests/files/fold/kraft-bird-base.fold", "utf-8");
	const graph = JSON.parse(FOLD);
	const { result, changes } = ear.graph.planarizeVEF(graph);
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
	const { result, changes } = ear.graph.planarizeVEF(graph);
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

test("planarize, foldedForm, windmill", () => {
	const FOLD = fs.readFileSync("./tests/files/fold/windmill.fold", "utf-8");
	const fold = JSON.parse(FOLD);
	const folded = ear.graph.getFramesByClassName(fold, "foldedForm")[0];
	const { result, changes } = ear.graph.planarizeVEF(folded);

	expect(changes.vertices.map).toMatchObject([
		[4], [7], [5], [6], [7], [0], [1], [8], [2], [3], [7], [7],
	]);

	// 8 edges with just one mapping. checks out.
	expect(changes.edges.map).toMatchObject([
		[9, 10], [15, 16], [13, 14], [9, 10],
		[6], [23],
		[2, 3], [4, 5],
		[17], [18], [0], [8], [7],
		[19, 20], [21, 22], [15, 16], [11, 12], [11, 12], [13, 14],
		[1],
	]);

	// console.log(changes.faces.map);

	// expect(changes.faces.map).toMatchObject([
	// 	[2, 9], [0, 2], [9, 11], [3, 11], [0, 6], [6, 7], undefined, [5, 7], [3, 5],
	// ])

	fs.writeFileSync("./tests/tmp/planarize-windmill.fold", JSON.stringify(result));
	fs.writeFileSync("./tests/tmp/planarize-windmill.json", JSON.stringify(changes));
});
