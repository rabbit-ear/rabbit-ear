import { expect, test } from "vitest";
import ear from "../rabbit-ear.js";

// ear.graph.intersectConvexFaceLine(graph, face, vector, point);

test("intersect face test, 2 vertices", () => {
	const graph = ear.graph.polygon(8);
	const res = ear.graph
		.intersectConvexFaceLine(graph, 0, { vector: [1, 0], origin: [0, 0] });
	expect(res.vertices.length).toBe(2);
	expect(res.edges.length).toBe(0);
	expect(res.vertices[0]).toBe(0);
	expect(res.vertices[1]).toBe(4);
});

test("intersect face test, 1 vertex, 1 edge", () => {
	const graph = ear.graph.polygon(9);
	const res = ear.graph
		.intersectConvexFaceLine(graph, 0, { vector: [1, 0], origin: [0, 0] });
	expect(res.vertices.length).toBe(1);
	expect(res.edges.length).toBe(1);
});

test("intersect face test, 2 edges", () => {
	const graph = ear.graph.polygon(9);
	const vector = [1, 0];
	const origin = [0, 0.01];
	const res = ear.graph.intersectConvexFaceLine(graph, 0, { vector, origin });
	expect(res.vertices.length).toBe(0);
	expect(res.edges.length).toBe(2);
	expect(res.edges[0].coords[1]).toBeCloseTo(0.01);
	expect(res.edges[1].coords[1]).toBeCloseTo(0.01);
	expect(res.edges[0].edge).toBe(0);
	expect(res.edges[1].edge).toBe(4);
	// i feel like reversing the direction of the vector should reverse the results
	const reverse = ear.graph
		.intersectConvexFaceLine(graph, 0, { vector: ear.math.flip(vector), origin }, 1e-6);
	// expect(reverse.edges[0].edge).toBe(0);
	// expect(reverse.edges[1].edge).toBe(4);
});

test("intersect face test, 2 vertices, large epsilon", () => {
	const graph = ear.graph.polygon(8);
	const origin = [0, 0.01];
	const res = ear.graph.intersectConvexFaceLine(graph, 0, { vector: [1, 0], origin }, 0.03);
	expect(res.vertices.length).toBe(2);
	expect(res.edges.length).toBe(0);
	expect(res.vertices[0]).toBe(0);
	expect(res.vertices[1]).toBe(4);
});

test("intersect face test, collinear to edge", () => {
	const graph = ear.graph.square();
	[ear.graph.intersectConvexFaceLine(graph, 0, { vector: [1, 0], origin: [0, 0] }),
		ear.graph.intersectConvexFaceLine(graph, 0, { vector: [0, 1], origin: [1, 0] }),
		ear.graph.intersectConvexFaceLine(graph, 0, { vector: [1, 0], origin: [1, 1] }),
		ear.graph.intersectConvexFaceLine(graph, 0, { vector: [0, 1], origin: [0, 1] }),
	].forEach(res => expect(res).toBe(undefined));
});

test("epsilon-close to both edge and vertex intersection", () => {
	// this one previously failed before refactoring
	// the intersection was close to both a vertex and its edge
	const line = { vector: [-1, 1.01], origin: [0.999, 0.015] };
	const res = ear.graph.intersectConvexFaceLine(
		ear.graph.square(),
		0,
		line,
		0.01,
	);
	expect(res.vertices.length).toBe(1);
	expect(res.edges.length).toBe(1);
});

test("outside the polygon", () => {
	const line = { vector: [1, 0], origin: [0, 10] };
	const res = ear.graph.intersectConvexFaceLine(
		ear.graph.square(),
		0,
		line,
	);
	expect(res).toBe(undefined);
});
