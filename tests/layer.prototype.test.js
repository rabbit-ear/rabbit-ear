import fs from "fs";
import { expect, test } from "vitest";
import ear from "../rabbit-ear.js";

// ear.layer.faceOrdersToMatrix()
// ear.layer.facesLayerToEdgesAssignments()
// ear.layer.flipFacesLayer()
// ear.layer.makeEpsilon()
// ear.layer.constraintToFacePairs()
// ear.layer.constraintToFacePairsStrings()

test("empty", () => {
	const solution = ear.layer({});
	expect(JSON.stringify(solution.compile())).toBe(JSON.stringify({}));
	expect(JSON.stringify(solution.linearize())).toBe(JSON.stringify([]));
	expect(JSON.stringify(solution.faceOrders())).toBe(JSON.stringify([]));
	expect(JSON.stringify(solution.facesLayer())).toBe(JSON.stringify([]));
	expect(JSON.stringify(solution.directedPairs())).toBe(JSON.stringify([]));
});

test("fish base. no branches", () => {
	const solution = ear.layer(ear.graph.fish().flatFolded());
	expect(JSON.stringify(solution.compile()))
		.toBe(JSON.stringify(solution.compile(1)));
	expect(JSON.stringify(solution.compile(1)))
		.toBe(JSON.stringify(solution.compile(2)));
});

test("fish base, linearize", () => {
	const solution = ear.layer(ear.graph.fish().flatFolded());
	expect(JSON.stringify(solution.linearize()))
		.toBe(JSON.stringify([1, 0, 2, 3, 4, 5, 9, 6, 8, 7, 11, 10]));
});

test("fish base, faces layer", () => {
	const solution = ear.layer(ear.graph.fish().flatFolded());
	const facesLayer = ear.graph.invertFlatMap(solution.linearize().reverse());
	expect(JSON.stringify(solution.facesLayer())).toBe(JSON.stringify(facesLayer));
	expect(JSON.stringify(solution.facesLayer()))
		.toBe(JSON.stringify([10, 11, 9, 8, 7, 6, 4, 2, 3, 5, 0, 1]));
});

test("crane-step, 2 sets of branches", () => {
	const testfile = fs.readFileSync("./tests/files/fold/crane-step.fold", "utf-8");
	const graph = ear.graph(JSON.parse(testfile)).flatFolded();
	const solution = ear.layer(graph);
	expect(solution.branches.length).toBe(2);
	expect(solution.branches[0].length).toBe(5);
	expect(solution.branches[1].length).toBe(5);
});
