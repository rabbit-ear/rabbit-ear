import { expect, test } from "vitest";
import fs from "fs";
import ear from "../src/index.js";

// test("write folded vertices", () => {
// 	const foldfile = fs.readFileSync("./tests/files/fold/square-twist.fold", "utf-8");
// 	const graph = JSON.parse(foldfile);
// 	// const graph = ear.graph.flattenFrame(fold, 1);
// 	const folded = ear.graph.makeVerticesCoordsFolded(graph, [6]);
// 	// const folded = ear.graph.makeVerticesCoordsFlatFolded(fold);
// 	const foldedVertices = folded.map(p => p.map(n => ear.general.cleanNumber(n, 12)));
// 	fs.writeFileSync(
// 		`./tests/tmp/folded-vertices.json`,
// 		JSON.stringify(foldedVertices, null, 2),
// 	);
// });

test("overlappingParallelEdgePairs", () => {});

test("constraintToFacePairs", () => {});

test("constraintToFacePairsStrings", () => {});

test("solverSolutionToFaceOrders", () => {});
