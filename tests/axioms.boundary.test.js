import { expect, test } from "vitest";
import ear from "../rabbit-ear.js";

test("validate, valid results", () => {
	const boundary = [[0, 0], [1, 0], [1, 1], [0, 1]];

	const args1 = [[0.75, 0.75], [0.15, 0.85]];
	const args2 = [[0.75, 0.75], [0.15, 0.85]];
	const args3 = [
		{ vector: [0.0, -0.5], origin: [0.25, 0.75] },
		{ vector: [0.5, 0.0], origin: [0.5, 0.75] },
	];
	const args4 = [
		{ vector: [-0.10, 0.11], origin: [0.62, 0.37] },
		[0.83, 0.51],
	];
	const args5 = [
		{ vector: [-0.37, -0.13], origin: [0.49, 0.71] },
		[0.5, 0.5],
		[0.15, 0.85],
	];
	const args6 = [
		{ vector: [0.1, -0.5], origin: [0.45, 0.8] },
		{ vector: [0.2, -0.25], origin: [0.35, 0.5] },
		[0.65, 0.55],
		[0.45, 0.25],
	];
	const args7 = [
		{ vector: [-0.20, -0.25], origin: [0.62, 0.93] },
		{ vector: [-0.42, 0.61], origin: [0.52, 0.25] },
		[0.25, 0.85],
	];

	const solutions1 = ear.axiom.axiomWithBoundary(1, boundary, ...args1)
		.filter(a => a);
	const solutions2 = ear.axiom.axiomWithBoundary(2, boundary, ...args2)
		.filter(a => a);
	const solutions3 = ear.axiom.axiomWithBoundary(3, boundary, ...args3)
		.filter(a => a);
	const solutions4 = ear.axiom.axiomWithBoundary(4, boundary, ...args4)
		.filter(a => a);
	const solutions5 = ear.axiom.axiomWithBoundary(5, boundary, ...args5)
		.filter(a => a);
	const solutions6 = ear.axiom.axiomWithBoundary(6, boundary, ...args6)
		.filter(a => a);
	const solutions7 = ear.axiom.axiomWithBoundary(7, boundary, ...args7)
		.filter(a => a);

	expect(solutions1.length).toBe(1);
	expect(solutions2.length).toBe(1);
	expect(solutions3.length).toBe(2);
	expect(solutions4.length).toBe(1);
	expect(solutions5.length).toBe(2);
	expect(solutions6.length).toBe(3);
	expect(solutions7.length).toBe(1);
});

test("validate, invalid results due to point (or line) outside boundary", () => {
	const boundary = [[0, 0], [1, 0], [1, 1], [0, 1]];

	const args1 = [[1.75, 0.75], [0.15, 0.85]];
	const args2 = [[0.75, 0.75], [-0.15, 0.85]];
	const args3 = [
		{ vector: [0, -1], origin: [1.25, 0] },
		{ vector: [1, 0], origin: [0.5, 0.75] },
	];
	const args4 = [
		{ vector: [-0.10, 0.11], origin: [0.62, 0.37] },
		[1.1, 0.5],
	];
	const args5 = [
		{ vector: [-0.37, -0.13], origin: [0.49, 0.71] },
		[0.75, 0.75],
		[1.1, 0.85],
	];
	const args6 = [
		{ vector: [0.1, -0.5], origin: [0.4, 0.8] },
		{ vector: [0.2, -0.25], origin: [0.1, 0.5] },
		[0.65, 0.7],
		[0.15, 0.15],
	];
	const args7 = [
		{ vector: [-0.20, -0.25], origin: [0.62, 0.93] },
		{ vector: [-0.42, 0.61], origin: [0.52, 0.25] },
		[0.25, 1.1],
	];

	const solution1 = ear.axiom.axiomWithBoundary(1, boundary, ...args1)
		.filter(a => a);
	const solution2 = ear.axiom.axiomWithBoundary(2, boundary, ...args2)
		.filter(a => a);
	const solution3 = ear.axiom.axiomWithBoundary(3, boundary, ...args3)
		.filter(a => a);
	const solution4 = ear.axiom.axiomWithBoundary(4, boundary, ...args4)
		.filter(a => a);
	const solution5 = ear.axiom.axiomWithBoundary(5, boundary, ...args5)
		.filter(a => a);
	const solution6 = ear.axiom.axiomWithBoundary(6, boundary, ...args6)
		.filter(a => a);
	const solution7 = ear.axiom.axiomWithBoundary(7, boundary, ...args7)
		.filter(a => a);

	expect(solution1.length).toBe(0);
	expect(solution2.length).toBe(0);
	expect(solution3.length).toBe(0);
	expect(solution4.length).toBe(0);
	expect(solution5.length).toBe(0);
	expect(solution6.length).toBe(1); // still need an axiom 6 that fails all.
	expect(solution7.length).toBe(0);
});
