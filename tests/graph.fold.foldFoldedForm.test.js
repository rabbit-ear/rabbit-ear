import { expect, test } from "vitest";
import fs from "fs";
import ear from "../src/index.js";

// test("new fold, segment, along a collinear edge", () => {
// 	const graph = ear.graph.squareFish();
// 	const vertices_coordsFolded = ear.graph.makeVerticesCoordsFlatFolded(graph);

// 	const flatEdgeCount = graph.edges_assignment
// 		.filter(a => a === "F" || a === "f")
// 		.length;

// 	const line = {
// 		vector: [-0.24264068711928527, 0.5857864376269053],
// 		origin: [0.7071067811865475, -0.2928932188134526],
// 	};
// 	const includePoints = [
// 		[0.7071067811865475, -0.2928932188134526],
// 		[0.4644660940672622, 0.2928932188134527],
// 	];
// 	const result = ear.graph.splitGraphWithLine(
// 		graph,
// 		line,
// 		ear.math.includeS,
// 		includePoints,
// 		vertices_coordsFolded,
// 		"V",
// 	);

// 	const newFlatEdgeCount = graph.edges_assignment
// 		.filter(a => a === "F" || a === "f")
// 		.length;

// 	// one flat edge has been crossed collinearly and has been converted,
// 	// also, one flat edge was crossed and has been split into two,
// 	// thus the total number of flat assignments remains the same.
// 	expect(newFlatEdgeCount).toBe(flatEdgeCount);

// 	fs.writeFileSync(
// 		"./tests/tmp/splitGraphWithLine-collinear-flat-segment.fold",
// 		JSON.stringify(graph),
// 		"utf8",
// 	);
// });

// test("new fold, sparse graph", () => {
// 	const FOLD = fs.readFileSync("tests/files/fold/crane-cp.fold", "utf-8");
// 	const graph = JSON.parse(FOLD);
// 	const vertices_coordsFolded = ear.graph.makeVerticesCoordsFlatFolded(graph);
// 	const result = ear.graph.splitGraphWithLine(
// 		graph,
// 		{ vector: [0, 1], origin: [0.75, 0.5] },
// 		ear.math.includeL,
// 		[],
// 		vertices_coordsFolded,
// 		"V",
// 	);
// 	// console.log("result", result);
// 	fs.writeFileSync(
// 		"./tests/tmp/splitGraphWithLine-crane-line.fold",
// 		JSON.stringify(graph),
// 		"utf8",
// 	);
// });

// test("new fold, sparse graph, segment", () => {
// 	const FOLD = fs.readFileSync("tests/files/fold/crane-cp.fold", "utf-8");
// 	const graph = JSON.parse(FOLD);
// 	const vertices_coordsFolded = ear.graph.makeVerticesCoordsFlatFolded(graph);
// 	const result = ear.graph.splitGraphWithLine(
// 		graph,
// 		{ vector: [0, 1], origin: [0.75, 0.45] },
// 		ear.math.includeS,
// 		[[0.75, 0.45], [0.75, 1.45]],
// 		vertices_coordsFolded,
// 		"V",
// 	);
// 	// console.log("result", result);
// 	fs.writeFileSync(
// 		"./tests/tmp/splitGraphWithLine-crane-segment.fold",
// 		JSON.stringify(graph),
// 		"utf8",
// 	);
// });

// test("new fold, populated graph", () => {
// 	const FOLD = fs.readFileSync("tests/files/fold/crane-cp.fold", "utf-8");
// 	const graph = ear.graph.populate(JSON.parse(FOLD));
// 	const vertices_coordsFolded = ear.graph.makeVerticesCoordsFlatFolded(graph);
// 	const result = ear.graph.splitGraphWithLine(
// 		graph,
// 		{ vector: [0, 1], origin: [0.75, 0.5] },
// 		ear.math.includeL,
// 		[],
// 		vertices_coordsFolded,
// 		"V",
// 	);
// 	// console.log("result", result);
// 	fs.writeFileSync(
// 		"./tests/tmp/splitGraphWithLine-populated-crane-line.fold",
// 		JSON.stringify(graph),
// 		"utf8",
// 	);
// });

test("new fold, populated graph, segment", () => {
	const FOLD = fs.readFileSync("tests/files/fold/crane-cp.fold", "utf-8");
	const graph = ear.graph.populate(JSON.parse(FOLD));
	const vertices_coordsFolded = ear.graph.makeVerticesCoordsFlatFolded(graph);
	const result = ear.graph.splitGraphWithLine(
		graph,
		{ vector: [0, 1], origin: [0.75, 0.45] },
		ear.math.includeS,
		[[0.75, 0.45], [0.75, 1.45]],
		vertices_coordsFolded,
		"V",
	);
	// console.log("result", result);
	fs.writeFileSync(
		"./tests/tmp/splitGraphWithLine-populated-crane-segment.fold",
		JSON.stringify(graph),
		"utf8",
	);
});
