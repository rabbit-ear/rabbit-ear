const fs = require("fs");
const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");

test("preliminary fold layers 2D", () => {
	const FOLD = fs.readFileSync("./tests/files/fold/preliminary-offset-cp.fold", "utf-8");
	const graph = JSON.parse(FOLD);
	const vertices_coords = ear.graph.makeVerticesCoordsFlatFolded(graph);
	const folded = { ...graph, vertices_coords };
	const solution = ear.layer(folded);
	const faceOrders = solution.faceOrders();
	// going bottom up, two paths on either side
	// 0 to 2 to 4 to 5
	// 0 to 1 to 3 to 5
	const faceOrdersStrings = faceOrders.map(order => JSON.stringify(order));
	// 0 and 5, both facing each other
	expect(faceOrdersStrings.includes(JSON.stringify([0, 5, 1]))
		|| faceOrdersStrings.includes(JSON.stringify([5, 0, 1]))).toBe(true);
	// 0 and 1, both facing each other
	expect(faceOrdersStrings.includes(JSON.stringify([0, 1, 1]))
		|| faceOrdersStrings.includes(JSON.stringify([1, 0, 1]))).toBe(true);
	// 0 and 3, both facing same direction, 3 on top
	expect(faceOrdersStrings.includes(JSON.stringify([0, 3, -1]))
		|| faceOrdersStrings.includes(JSON.stringify([3, 0, 1]))).toBe(true);
	// 1 and 3, both facing away from each other
	expect(faceOrdersStrings.includes(JSON.stringify([1, 3, -1]))
		|| faceOrdersStrings.includes(JSON.stringify([3, 1, -1]))).toBe(true);
	// 1 and 5, both facing same direction, 1 on top
	expect(faceOrdersStrings.includes(JSON.stringify([1, 5, 1]))
		|| faceOrdersStrings.includes(JSON.stringify([5, 1, -1]))).toBe(true);
	// 3 and 5, both facing each other
	expect(faceOrdersStrings.includes(JSON.stringify([3, 5, 1]))
		|| faceOrdersStrings.includes(JSON.stringify([5, 3, 1]))).toBe(true);
	// 0 and 2, both facing each other
	expect(faceOrdersStrings.includes(JSON.stringify([0, 2, 1]))
		|| faceOrdersStrings.includes(JSON.stringify([2, 0, 1]))).toBe(true);
	// 0 and 4, both facing same direction, 3 on top
	expect(faceOrdersStrings.includes(JSON.stringify([0, 4, -1]))
		|| faceOrdersStrings.includes(JSON.stringify([4, 0, 1]))).toBe(true);
	// 2 and 4, both facing away from each other
	expect(faceOrdersStrings.includes(JSON.stringify([2, 4, -1]))
		|| faceOrdersStrings.includes(JSON.stringify([4, 2, -1]))).toBe(true);
	// 2 and 5, both facing same direction, 1 on top
	expect(faceOrdersStrings.includes(JSON.stringify([2, 5, 1]))
		|| faceOrdersStrings.includes(JSON.stringify([5, 2, -1]))).toBe(true);
	// 4 and 5, both facing each other
	expect(faceOrdersStrings.includes(JSON.stringify([4, 5, 1]))
		|| faceOrdersStrings.includes(JSON.stringify([5, 4, 1]))).toBe(true);
});

test("preliminary fold layers 3D", () => {
	const FOLD = fs.readFileSync("./tests/files/fold/preliminary-offset-cp.fold", "utf-8");
	const graph = JSON.parse(FOLD);
	const vertices_coords = ear.graph.makeVerticesCoordsFlatFolded(graph);
	const folded = { ...graph, vertices_coords };
	const solution = ear.layer.layer3d(folded);
	const faceOrders = solution.faceOrders();
	// going bottom up, two paths on either side
	// 0 to 2 to 4 to 5
	// 0 to 1 to 3 to 5
	const faceOrdersStrings = faceOrders.map(order => JSON.stringify(order));
	// 0 and 5, both facing each other
	expect(faceOrdersStrings.includes(JSON.stringify([0, 5, 1]))
		|| faceOrdersStrings.includes(JSON.stringify([5, 0, 1]))).toBe(true);
	// 0 and 1, both facing each other
	expect(faceOrdersStrings.includes(JSON.stringify([0, 1, 1]))
		|| faceOrdersStrings.includes(JSON.stringify([1, 0, 1]))).toBe(true);
	// 0 and 3, both facing same direction, 3 on top
	expect(faceOrdersStrings.includes(JSON.stringify([0, 3, -1]))
		|| faceOrdersStrings.includes(JSON.stringify([3, 0, 1]))).toBe(true);
	// 1 and 3, both facing away from each other
	expect(faceOrdersStrings.includes(JSON.stringify([1, 3, -1]))
		|| faceOrdersStrings.includes(JSON.stringify([3, 1, -1]))).toBe(true);
	// 1 and 5, both facing same direction, 1 on top
	expect(faceOrdersStrings.includes(JSON.stringify([1, 5, 1]))
		|| faceOrdersStrings.includes(JSON.stringify([5, 1, -1]))).toBe(true);
	// 3 and 5, both facing each other
	expect(faceOrdersStrings.includes(JSON.stringify([3, 5, 1]))
		|| faceOrdersStrings.includes(JSON.stringify([5, 3, 1]))).toBe(true);
	// 0 and 2, both facing each other
	expect(faceOrdersStrings.includes(JSON.stringify([0, 2, 1]))
		|| faceOrdersStrings.includes(JSON.stringify([2, 0, 1]))).toBe(true);
	// 0 and 4, both facing same direction, 3 on top
	expect(faceOrdersStrings.includes(JSON.stringify([0, 4, -1]))
		|| faceOrdersStrings.includes(JSON.stringify([4, 0, 1]))).toBe(true);
	// 2 and 4, both facing away from each other
	expect(faceOrdersStrings.includes(JSON.stringify([2, 4, -1]))
		|| faceOrdersStrings.includes(JSON.stringify([4, 2, -1]))).toBe(true);
	// 2 and 5, both facing same direction, 1 on top
	expect(faceOrdersStrings.includes(JSON.stringify([2, 5, 1]))
		|| faceOrdersStrings.includes(JSON.stringify([5, 2, -1]))).toBe(true);
	// 4 and 5, both facing each other
	expect(faceOrdersStrings.includes(JSON.stringify([4, 5, 1]))
		|| faceOrdersStrings.includes(JSON.stringify([5, 4, 1]))).toBe(true);
});

test("preliminary fold layers, linearization", () => {
	const FOLD = fs.readFileSync("./tests/files/fold/preliminary-offset-cp.fold", "utf-8");
	const graph = JSON.parse(FOLD);
	const vertices_coords = ear.graph.makeVerticesCoordsFlatFolded(graph);
	const folded = { ...graph, vertices_coords };
	const solution = ear.layer(folded);
	const faceOrders = solution.faceOrders();
	// going bottom up, two paths on either side
	// 0 to 2 to 4 to 5
	// 0 to 1 to 3 to 5
	const linearize = ear.graph.linearize2DFaces({ ...folded, faceOrders });
	// console.log("linearize", linearize);
	// console.log("layers", ear.graph.invertMap(solution.facesLayer()));
});
