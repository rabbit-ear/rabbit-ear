import fs from "fs";
import { expect, test } from "vitest";
import ear from "../src/index.js";

test("depricated", () => {});

/*
test("", () => {
	const res = ear.graph.getEdgesSegmentIntersection(ear.cp.fish(), [0.7, 0.9], [1, 1]);
	expect(res.filter(() => true).length).toBe(5);
	res.forEach(p => expect(p[0]).toBe(1));
	res.forEach(p => expect(p[1]).toBe(1));
});

test("", () => {
	const res = ear.graph.getEdgesSegmentIntersection(ear.cp.fish(), [0.45, 0.45], [0.55, 0.55]);
	expect(res.filter(() => true).length).toBe(2);
});

test("", () => {
	const res = ear.graph.getEdgesSegmentIntersection(ear.cp.fish(), [0.2, 0.1], [0.1, 0.2]);
	expect(res.filter(() => true).length).toBe(1);
});
*/

// test("getEdgesCollinearToLine", () => {
// 	const FOLD = fs.readFileSync("./tests/files/fold/crane-step.fold", "utf-8");
// 	const graph = JSON.parse(FOLD);
// 	const result0 = ear.graph.getEdgesCollinearToLine(
// 		graph,
// 		{ vector: [1, 1], origin: [0, 0] },
// 	);
// 	const result1 = ear.graph.getEdgesCollinearToLine(
// 		graph,
// 		{ vector: [1, -1], origin: [0, 1] },
// 	);
// 	expect(result0.length).toBe(0);
// 	expect(result1.length).toBe(4);
// });
