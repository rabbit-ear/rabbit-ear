import fs from "fs";
import { expect, test } from "vitest";
import ear from "../src/index.js";

test("depricated", () => {});

// test("getVerticesCollinearToLine", () => {
// 	const FOLD = fs.readFileSync("./tests/files/fold/crane-step.fold", "utf-8");
// 	const graph = JSON.parse(FOLD);
// 	const result0 = ear.graph.getVerticesCollinearToLine(
// 		graph,
// 		{ vector: [1, 1], origin: [0, 0] },
// 	);
// 	const result1 = ear.graph.getVerticesCollinearToLine(
// 		graph,
// 		{ vector: [1, -1], origin: [0, 1] },
// 	);
// 	expect(result0.length).toBe(3);
// 	expect(result1.length).toBe(5);
// });

// test("getVerticesCollinearToLine. same line different origin", () => {
// 	const FOLD = fs.readFileSync("./tests/files/fold/crane-step.fold", "utf-8");
// 	const graph = JSON.parse(FOLD);
// 	const result0 = ear.graph.getVerticesCollinearToLine(
// 		graph,
// 		{ vector: [1, 1], origin: [0, 0] },
// 	);
// 	const result1 = ear.graph.getVerticesCollinearToLine(
// 		graph,
// 		{ vector: [1, 1], origin: [0, 0] },
// 	);
// 	const result2 = ear.graph.getVerticesCollinearToLine(
// 		graph,
// 		{ vector: [1, 1], origin: [0, 0] },
// 	);
// 	expect(result0.length).toBe(result1.length);
// 	expect(result1.length).toBe(result2.length);
// });
