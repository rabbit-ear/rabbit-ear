import { expect, test } from "vitest";
import ear from "../rabbit-ear.js";

test("square", () => {
	const res1 = ear.graph.square();
	const res2 = ear.graph.square(3);
	expect(res1.vertices_coords[0][0]).toBe(0);
	expect(res1.vertices_coords[0][1]).toBe(0);
	expect(res1.vertices_coords[2][0]).toBe(1);
	expect(res1.vertices_coords[2][1]).toBe(1);
	expect(res2.vertices_coords[0][0]).toBe(0);
	expect(res2.vertices_coords[0][1]).toBe(0);
	expect(res2.vertices_coords[2][0]).toBe(3);
	expect(res2.vertices_coords[2][1]).toBe(3);
});

test("rectangle", () => {
	const res1 = ear.graph.rectangle();
	const res2 = ear.graph.rectangle(2);
	const res3 = ear.graph.rectangle(2, 1);
	expect(res1.vertices_coords[0][0]).toBe(0);
	expect(res1.vertices_coords[0][1]).toBe(0);
	expect(res2.vertices_coords[1][0]).toBe(2);
	expect(res2.vertices_coords[1][1]).toBe(0);
	expect(res3.vertices_coords[2][0]).toBe(2);
	expect(res3.vertices_coords[2][1]).toBe(1);
});

test("polygon", () => {
	expect(ear.graph.polygon().vertices_coords.length).toBe(3);
	expect(ear.graph.polygon(1).vertices_coords.length).toBe(1);
	expect(ear.graph.polygon(2).vertices_coords.length).toBe(2);
	const res1 = ear.graph.polygon(12);
	const res2 = ear.graph.polygon(1024);
	const res3 = ear.graph.polygon(12, 100);
	expect(res1.vertices_coords[0][0]).toBeCloseTo(1);
	expect(res1.vertices_coords[0][1]).toBeCloseTo(0);
	expect(res1.vertices_coords[3][0]).toBeCloseTo(0);
	expect(res1.vertices_coords[3][1]).toBeCloseTo(1);
	expect(res2.vertices_coords[0][0]).toBeCloseTo(1);
	expect(res2.vertices_coords[0][1]).toBeCloseTo(0);
	expect(res2.vertices_coords[256][0]).toBeCloseTo(0);
	expect(res2.vertices_coords[256][1]).toBeCloseTo(1);
	expect(res3.vertices_coords[0][0]).toBeCloseTo(100);
	expect(res3.vertices_coords[0][1]).toBeCloseTo(0);
});

test("kite", () => {
	expect(ear.graph.kite().edges_assignment[5]).toBe("B");
	expect(ear.graph.kite().edges_assignment.includes("M")).toBe(false);
	expect(ear.graph.kite().edges_assignment.includes("V")).toBe(true);
	expect(ear.graph.kite().edges_assignment.includes("F")).toBe(true);
});

test("fish", () => {
	expect(ear.graph.fish().vertices_coords.length).toBe(11);
	expect(ear.graph.fish().edges_assignment.includes("M")).toBe(true);
	expect(ear.graph.fish().edges_assignment.includes("V")).toBe(true);
	expect(ear.graph.fish().edges_assignment.includes("F")).toBe(true);
});

test("bird", () => {
	expect(ear.graph.bird().edges_assignment[7]).toBe("B");
	expect(ear.graph.bird().edges_assignment.includes("M")).toBe(true);
	expect(ear.graph.bird().edges_assignment.includes("V")).toBe(true);
	expect(ear.graph.bird().edges_assignment.includes("F")).toBe(true);
});
