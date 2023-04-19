const fs = require("fs");
const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");

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
		.toBe(JSON.stringify([1, 0, 2, 3, 5, 4, 7, 6, 8, 9, 10, 11]));
});

test("fish base, faces layer", () => {
	const solution = ear.layer(ear.graph.fish().flatFolded());
	const facesLayer = ear.graph.invertMap(solution.linearize().reverse());
	expect(JSON.stringify(solution.facesLayer())).toBe(JSON.stringify(facesLayer));
	expect(JSON.stringify(solution.facesLayer()))
		.toBe(JSON.stringify([10, 11, 9, 8, 6, 7, 4, 5, 3, 2, 1, 0]));
});

test("crane-step, 2 sets of branches", () => {
	const testfile = fs.readFileSync("./tests/files/fold/crane-step.fold", "utf-8");
	const graph = ear.graph(JSON.parse(testfile)).flatFolded();
	const solution = ear.layer(graph);
	expect(solution.branches.length).toBe(2);
	expect(solution.branches[0].length).toBe(5);
	expect(solution.branches[1].length).toBe(5);
});
