import { expect, test } from "vitest";
import ear from "../rabbit-ear.js";

test("valley fold", () => {
	const origami = ear.origami();
	origami.flatFold({ vector: [1, 0.1], origin: [0.5, 0.5] });
	expect(ear.graph.count.vertices(origami)).toBe(6);
	expect(ear.graph.count.edges(origami)).toBe(7);
	expect(ear.graph.count.faces(origami)).toBe(2);
	// console.log("valley folded origami", origami);
});

test("valley fold", () => {
	const origami = ear.origami();
	origami.flatFold({ vector: [1, 0.1], origin: [0.5, 0.5] });
	origami.flatFold({ vector: [0.1, 1], origin: [0.5, 0.5] });
	expect(ear.graph.count.vertices(origami)).toBe(9);
	expect(ear.graph.count.edges(origami)).toBe(12);
	expect(ear.graph.count.faces(origami)).toBe(4);
	// console.log("valley folded origami", origami);
});
