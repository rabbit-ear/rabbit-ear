import fs from "fs";
import { expect, test } from "vitest";
import ear from "../rabbit-ear.js";

test("animal base layers 3D", () => {
	const FOLD = fs.readFileSync("./tests/files/fold/animal-base-cp-3d.fold", "utf-8");
	const graph = JSON.parse(FOLD);
	const vertices_coords = ear.graph.makeVerticesCoordsFolded(graph);
	const folded = { ...graph, vertices_coords };
	const solution = ear.layer.layer3d(folded);
	const faceOrders = solution.faceOrders();
	const faceOrdersStrings = faceOrders.map(order => JSON.stringify(order));

	expect(faceOrders.length).toBe(10);

	// 0 and 1, adjacent, facing each other
	expect(faceOrdersStrings.includes(JSON.stringify([0, 1, 1]))
		|| faceOrdersStrings.includes(JSON.stringify([1, 0, 1]))).toBe(true);
	// 2 and 3, adjacent, facing each other
	expect(faceOrdersStrings.includes(JSON.stringify([2, 3, 1]))
		|| faceOrdersStrings.includes(JSON.stringify([3, 2, 1]))).toBe(true);
	// 4 and 5, adjacent, facing each other
	expect(faceOrdersStrings.includes(JSON.stringify([4, 5, 1]))
		|| faceOrdersStrings.includes(JSON.stringify([5, 4, 1]))).toBe(true);
	// 6 and 7, adjacent, facing each other
	expect(faceOrdersStrings.includes(JSON.stringify([6, 7, 1]))
		|| faceOrdersStrings.includes(JSON.stringify([7, 6, 1]))).toBe(true);
	// 10 and 11, adjacent, facing each other
	expect(faceOrdersStrings.includes(JSON.stringify([10, 11, 1]))
		|| faceOrdersStrings.includes(JSON.stringify([11, 10, 1]))).toBe(true);
	// 2 and 13, adjacent, facing each other
	expect(faceOrdersStrings.includes(JSON.stringify([2, 13, 1]))
		|| faceOrdersStrings.includes(JSON.stringify([13, 2, 1]))).toBe(true);
	// 8 and 13, adjacent, facing each other
	expect(faceOrdersStrings.includes(JSON.stringify([8, 13, 1]))
		|| faceOrdersStrings.includes(JSON.stringify([13, 8, 1]))).toBe(true);
	// 9 and 14, adjacent, facing each other
	expect(faceOrdersStrings.includes(JSON.stringify([9, 14, 1]))
		|| faceOrdersStrings.includes(JSON.stringify([14, 9, 1]))).toBe(true);
	// 1 and 14, adjacent, facing each other
	expect(faceOrdersStrings.includes(JSON.stringify([1, 14, 1]))
		|| faceOrdersStrings.includes(JSON.stringify([14, 1, 1]))).toBe(true);
	// 12 and 15, facing each other
	expect(faceOrdersStrings.includes(JSON.stringify([12, 15, 1]))
		|| faceOrdersStrings.includes(JSON.stringify([15, 12, 1]))).toBe(true);
});

test("animal base layers 3D faces sets", () => {
	const FOLD = fs.readFileSync("./tests/files/fold/animal-base-cp-3d.fold", "utf-8");
	const graph = JSON.parse(FOLD);
	const vertices_coords = ear.graph.makeVerticesCoordsFolded(graph);
	const folded = { ...graph, vertices_coords };
	const faceOrders = [
		[0, 1, 1], [2, 3, 1], [4, 5, 1], [6, 7, 1], [10, 11, 1],
		[2, 13, 1], [8, 13, 1], [9, 14, 1], [1, 14, 1], [12, 15, 1],
	];
	const nudge = ear.graph.nudgeFacesWithFaceOrders({ ...folded, faceOrders });

	// faces
	[0, 14, 1, 9].forEach(f => nudge[f].vector
		.forEach((n, i) => expect(n).toBeCloseTo([0, 0, 1][i])));
	[2, 3, 8, 13].forEach(f => nudge[f].vector
		.forEach((n, i) => expect(n).toBeCloseTo([0, 0, -1][i])));
	[4, 5].forEach(f => nudge[f].vector
		.forEach((n, i) => expect(n)
			.toBeCloseTo([0.9238795325112866, -0.38268343236509034, 0][i])));
	[6, 7].forEach(f => nudge[f].vector
		.forEach((n, i) => expect(n)
			.toBeCloseTo([0.9238795325112863, 0.3826834323650909, 0][i])));
	[10, 11].forEach(f => nudge[f].vector
		.forEach((n, i) => expect(n).toBeCloseTo([0, -1, 0][i])));
	[12, 15].forEach(f => nudge[f].vector
		.forEach((n, i) => expect(n).toBeCloseTo([0, 1, 0][i])));

	[0, 14, 1, 9].forEach((f, i) => expect(nudge[f].layer).toBe(i));
	[2, 3, 8, 13].forEach((f, i) => expect(nudge[f].layer).toBe(i));
	[4, 5].forEach((f, i) => expect(nudge[f].layer).toBe(i));
	[6, 7].forEach((f, i) => expect(nudge[f].layer).toBe(i));
	[10, 11].forEach((f, i) => expect(nudge[f].layer).toBe(i));
	[12, 15].forEach((f, i) => expect(nudge[f].layer).toBe(i));
});
