import { expect, test } from "vitest";
import ear from "../rabbit-ear.js";

test("intersectLineVertices through vertices", () => {
	const graph = ear.graph.square();
	const line = { vector: [0.5, 0.5], origin: [0.1, 0.1] };
	const result = ear.graph.intersectLineVertices(graph, line);

	expect(result.length).toBe(4);
	expect(result[0]).toBe(-0.2);
	expect(result[2]).toBe(1.8);
});

test("intersectLineVerticesEdges through vertices", () => {
	const graph = ear.graph.square();
	const line = { vector: [0.5, 0.5], origin: [0.1, 0.1] };
	const result = ear.graph.intersectLineVerticesEdges(graph, line);

	expect(result.vertices.length).toBe(4);
	expect(result.vertices[0]).toBeCloseTo(-0.2);
	expect(result.vertices[2]).toBeCloseTo(1.8);

	expect(result.edges.length).toBe(4);
	expect(result.edges[0]).toBe(undefined);
	expect(result.edges[1]).toBe(undefined);
	expect(result.edges[2]).toBe(undefined);
	expect(result.edges[3]).toBe(undefined);
});

test("intersectLine through vertices", () => {
	const graph = ear.graph.square();
	const line = { vector: [0.5, 0.5], origin: [0.1, 0.1] };
	const result = ear.graph.intersectLine(graph, line);

	expect(result.vertices.length).toBe(4);
	expect(result.vertices[0]).toBe(-0.2);
	expect(result.vertices[2]).toBe(1.8);

	expect(result.edges.length).toBe(4);
	expect(result.edges[0]).toBe(undefined);
	expect(result.edges[1]).toBe(undefined);
	expect(result.edges[2]).toBe(undefined);
	expect(result.edges[3]).toBe(undefined);

	expect(result.faces.length).toBe(1);
	expect(result.faces[0].length).toBe(2);
	expect(result.faces[0][0].a).toBeCloseTo(-0.2);
	expect(result.faces[0][0].b).toBe(undefined);
	expect(result.faces[0][0].vertex).toBe(0);
	expect(result.faces[0][0].edge).toBe(undefined);

	expect(result.faces[0][1].a).toBeCloseTo(1.8);
	expect(result.faces[0][1].b).toBe(undefined);
	expect(result.faces[0][1].vertex).toBe(2);
	expect(result.faces[0][1].edge).toBe(undefined);
});

test("intersectLineVertices through vertex and edge", () => {
	const graph = ear.graph.square();
	const line = { vector: [0.5, 1], origin: [0.1, 0.2] };
	const result = ear.graph.intersectLineVertices(graph, line);

	expect(result.length).toBe(4);

	expect(result[0]).toBe(-0.2);
	expect(result[1]).toBe(undefined);
	expect(result[2]).toBe(undefined);
	expect(result[3]).toBe(undefined);
});

test("intersectLineVerticesEdges through vertex and edge", () => {
	const graph = ear.graph.square();
	const line = { vector: [0.5, 1], origin: [0.1, 0.2] };
	const result = ear.graph.intersectLineVerticesEdges(graph, line);

	expect(result.vertices.length).toBe(4);
	expect(result.edges.length).toBe(4);

	expect(result.edges[0]).toBe(undefined);
	expect(result.edges[1]).toBe(undefined);
	expect(result.edges[2]).not.toBe(undefined);
	expect(result.edges[3]).toBe(undefined);

	expect(result.edges[2].a).toBeCloseTo(0.8);
	expect(result.edges[2].b).toBeCloseTo(0.5);
	expect(result.edges[2].vertex).toBe(undefined);
});

test("intersectLine through vertex and edge", () => {
	const graph = ear.graph.square();
	const line = { vector: [0.5, 1], origin: [0.1, 0.2] };
	const result = ear.graph.intersectLine(graph, line);

	expect(result.vertices.length).toBe(4);
	expect(result.edges.length).toBe(4);
	expect(result.faces.length).toBe(1);

	expect(result.faces[0].length).toBe(2);

	expect(result.faces[0][0].a).toBeCloseTo(-0.2);
	expect(result.faces[0][0].b).toBe(undefined);
	expect(result.faces[0][0].vertex).toBe(0);
	expect(result.faces[0][0].edge).toBe(undefined);

	expect(result.faces[0][1].a).toBeCloseTo(0.8);
	expect(result.faces[0][1].b).toBe(0.5);
	expect(result.faces[0][1].point[0]).toBe(0.5);
	expect(result.faces[0][1].point[1]).toBe(1);
	expect(result.faces[0][1].vertex).toBe(undefined);
	expect(result.faces[0][1].edge).toBe(2);
});
