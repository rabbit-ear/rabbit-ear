import { expect, test } from "vitest";
import ear from "../src/index.js";

test("valley fold", () => {
	const origami = ear.graph.square();
	ear.graph.flatFold(origami, { vector: [1, 0.1], origin: [0.5, 0.5] });
	expect(ear.graph.countVertices(origami)).toBe(6);
	expect(ear.graph.countEdges(origami)).toBe(7);
	expect(ear.graph.countFaces(origami)).toBe(2);
});

test("valley fold", () => {
	const origami = ear.graph.square();
	ear.graph.flatFold(origami, { vector: [1, 0.1], origin: [0.5, 0.5] });
	ear.graph.flatFold(origami, { vector: [0.1, 1], origin: [0.5, 0.5] });
	expect(ear.graph.countVertices(origami)).toBe(9);
	expect(ear.graph.countEdges(origami)).toBe(12);
	expect(ear.graph.countFaces(origami)).toBe(4);
});
