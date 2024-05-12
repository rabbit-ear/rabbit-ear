import { expect, test } from "vitest";
import ear from "../src/index.js";

test("deprecated", () => expect(true).toBe(true));

// test("methods", () => {
// 	const cp = ear.cp();
// 	cp.ray([Math.random(), Math.random()]);
// 	const two = cp.clone();
// 	expect(two.edges_vertices.length).toBe(cp.edges_vertices.length);
// 	cp.segment([Math.random(), Math.random()], [Math.random(), Math.random()]);
// 	expect(two.edges_vertices.length).not.toBe(cp.edges_vertices.length);
// });

// test("cp draw methods", () => {
// 	const cp = ear.cp();
// 	cp.line([Math.random() - 0.5, Math.random() - 0.5], [0.5, 0.5]);
// 	cp.segment([Math.random(), Math.random()], [Math.random(), Math.random()]);
// 	cp.ray([Math.random(), Math.random()]);
// 	// cp.circle(Math.random());
// 	// cp.rect(Math.random(), Math.random(), Math.random(), Math.random());
// });

// test("cp draw methods", () => {
// 	const cp = ear.cp();
// 	const l = cp.line([Math.random() - 0.5, Math.random() - 0.5], [0.5, 0.5]);
// 	expect(cp.edges_assignment[cp.edges_assignment.length - 1]).toBe("U");
// 	l.mountain();
// 	expect(cp.edges_assignment[cp.edges_assignment.length - 1]).toBe("M");
// 	l.valley();
// 	expect(cp.edges_assignment[cp.edges_assignment.length - 1]).toBe("V");
// 	l.flat();
// 	expect(cp.edges_assignment[cp.edges_assignment.length - 1]).toBe("F");
// });

// test("cp.polygon", () => {
// 	const cp = ear.cp.fish();
// 	const res = cp.polygon([[0, 0], [4, 1], [1, 4]]);
// 	res.cut();
// 	expect(cp.edges_assignment.reduce((a, b) => a + (b === "C" ? 1 : 0), 0))
// 		.toBe(6);
// });
