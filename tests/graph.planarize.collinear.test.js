import fs from "fs";
import { expect, test } from "vitest";
import ear from "../src/index.js";

test("planarize, non-planar square fish", () => {
	const FOLD = fs.readFileSync("./tests/files/fold/non-planar-square-fish.fold", "utf-8");
	const cp = JSON.parse(FOLD);
	const { graph, info } = ear.graph.planarizeCollinearEdges(cp);
	// console.log(graph);
	// console.log(info.vertices);
	// console.log(info.edges);
	fs.writeFileSync(
		"./tests/tmp/planarize-non-planar-square-fish.fold",
		JSON.stringify(graph),
	);
});

test("planarize, non-planar bird base", () => {
	const FOLD = fs.readFileSync("./tests/files/fold/non-planar-bird-base.fold", "utf-8");
	const cp = JSON.parse(FOLD);
	const { graph, info } = ear.graph.planarizeCollinearEdges(cp);
	// console.log(graph);
	// console.log(info.vertices);
	// console.log(info.edges);
	fs.writeFileSync(
		"./tests/tmp/planarize-non-planar-bird-base.fold",
		JSON.stringify(graph),
	);
});

// test("planarize, crane", () => {
// 	const FOLD = fs.readFileSync("./tests/files/fold/crane.fold", "utf-8");
// 	const fold = JSON.parse(FOLD);
// 	const graph = ear.graph.getFramesByClassName(fold, "creasePattern")[0];
// 	const result = ear.graph.planarizeCollinearEdges(graph);
// });
