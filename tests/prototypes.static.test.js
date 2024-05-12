import { expect, test } from "vitest";
import ear from "../src/index.js";

// test("regular polygon bases", () => {
// 	const names = [
// 	"triangle", "square", "pentagon", "hexagon", "heptagon",
// 	"octagon", "nonagon", "decagon", "hendecagon", "dodecagon",
// ];
// 	names.forEach((name, i) => {
// 		let g = ear.graph[name]();
// 		expect(g.vertices_coords.length).toBe(i + 3);
// 		expect(g.edges_vertices.length).toBe(i + 3);
// 		expect(g.faces_vertices.length).toBe(1);
// 	});
// });

// test("other shapes", () => {
// 	const circle = ear.graph.circle();
// 	expect(circle.vertices_coords.length).toBe(90);
// 	const circle64 = ear.graph.circle(64);
// 	expect(circle64.vertices_coords.length).toBe(64);
// });

test("bases", () => {
	const kite = ear.graph.kite();
	expect(kite.vertices_coords.length).toBe(6);
	expect(kite.edges_vertices.length).toBe(9);

	// const bird = ear.graph.bird();
});
