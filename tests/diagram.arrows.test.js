import { expect, test } from "vitest";
import ear from "../rabbit-ear.js";

test("segmentToArrow", () => {
	const polygon = [[0, 0], [5, 0], [5, 5], [0, 5]];
	const segment = [[0.5, 0.5], [1, 2]];
	const arrow = ear.diagram.segmentToArrow(segment, polygon);
	expect(arrow.segment[0][0]).toBeCloseTo(0.5);
	expect(arrow.segment[0][1]).toBeCloseTo(0.5);
	expect(arrow.segment[1][0]).toBeCloseTo(1);
	expect(arrow.segment[1][1]).toBeCloseTo(2);
	expect(arrow.head.width).toBeCloseTo(0.5);
	expect(arrow.head.height).toBeCloseTo(0.75);
	expect(arrow.bend).toBeCloseTo(0.3);
	expect(typeof arrow.padding).toBe("number");
	// padding: 0.0790569415042095
});

// test("segmentToArrow with options", () => {
// 	const polygon = [[0, 0], [5, 0], [5, 5], [0, 5]];
// 	const segment = [[0.5, 0.5], [1, 2]];
// 	const arrow = ear.diagram.segmentToArrow(segment, polygon);
// 	expect(arrow.segment[0][0]).toBeCloseTo(0.5);
// 	expect(arrow.segment[0][1]).toBeCloseTo(0.5);
// 	expect(arrow.segment[1][0]).toBeCloseTo(1);
// 	expect(arrow.segment[1][1]).toBeCloseTo(2);
// 	expect(arrow.head.width).toBeCloseTo(0.5);
// 	expect(arrow.head.height).toBeCloseTo(0.75);
// 	expect(arrow.bend).toBeCloseTo(0.3);
// 	expect(typeof arrow.padding).toBe("number");
// });

test("axiom arrows", () => {
	const graph = ear.graph.square();

	const arrows1 = ear.diagram.axiom1Arrows(graph, [0.75, 0.75], [0.15, 0.85]);
	const arrows2 = ear.diagram.axiom2Arrows(graph, [0.75, 0.75], [0.15, 0.85]);
	const arrows3 = ear.diagram.axiom3Arrows(
		graph,
		{ vector: [0.0, -0.5], origin: [0.25, 0.75] },
		{ vector: [0.5, 0.0], origin: [0.5, 0.75] },
	);
	const arrows4 = ear.diagram.axiom4Arrows(
		graph,
		{ vector: [-0.10, 0.11], origin: [0.62, 0.37] },
		[0.83, 0.51],
	);
	const arrows5 = ear.diagram.axiom5Arrows(
		graph,
		{ vector: [-0.37, -0.13], origin: [0.49, 0.71] },
		[0.75, 0.75],
		[0.15, 0.85],
	);
	const arrows6 = ear.diagram.axiom6Arrows(
		graph,
		{ vector: [0.04, -0.52], origin: [0.43, 0.81] },
		{ vector: [0.05, -0.28], origin: [0.10, 0.52] },
		[0.75, 0.75],
		[0.15, 0.85],
	);
	const arrows7 = ear.diagram.axiom7Arrows(
		graph,
		{ vector: [-0.20, -0.25], origin: [0.62, 0.93] },
		{ vector: [-0.42, 0.61], origin: [0.52, 0.25] },
		[0.25, 0.85],
	);

	const results = [
		...arrows1,
		...arrows2,
		// ...arrows3,
		...arrows4,
		...arrows5,
		...arrows6,
		...arrows7,
	];

	// all arrows should have these in common
	results.forEach(arrow => expect(arrow.head.width).toBeCloseTo(0.1));
	results.forEach(arrow => expect(arrow.head.height).toBeCloseTo(0.15));
	results.forEach(arrow => expect(Math.abs(arrow.bend)).toBeCloseTo(0.3));

	// ensure the segment is in the correct place (correct depth)
	results.forEach(arrow => expect(typeof arrow.segment[0][0]).toBe("number"));

	expect(arrows1.length).toBe(1);
	expect(arrows2.length).toBe(1);
	expect(arrows3.length).toBe(2);
	expect(arrows4.length).toBe(1);
	expect(arrows5.length).toBe(2);
	expect(arrows6.length).toBe(6);
	expect(arrows7.length).toBe(2);

	expect(arrows1[0].segment[0][0]).toBeCloseTo(0.5347222222222222);
	expect(arrows1[0].segment[0][1]).toBeCloseTo(1);
	expect(arrows1[0].segment[1][0]).toBeCloseTo(0.4652777777777778);
	expect(arrows1[0].segment[1][1]).toBeCloseTo(0.5833333333333335);

	// console.log("arrows6", arrows6);
	// console.log("arrows6[0] segment", arrows6[0].segment[0], arrows6[0].segment[1]);
	// console.log("0", arrows6.map(a => a.segment[0]));
	// console.log("1", arrows6.map(a => a.segment[1]));
});

// test("segmentToArrow with options", () => {
// 	const line = { vector: [0.4, 0.8], origin: [0.5, 0.5] }
// 	ear.diagram.segmentToArrow(segment, polygon, options = {});
// 	// ear.diagram.one_crease_arrow(ear.graph.square(), line);
// 	expect(true).toBe(true);
// });

// test("axiom 1 arrow coords", () => {
// 	// ear.diagram.axiom_arrows[1](
// 	ear.diagram.axiom_arrows(1,
// 		{points: [[0, 0], [1, 1]]},
// 		{vertices_coords: [[0,0], [0,1], [1,0], [1,1]]}
// 	);
// });
