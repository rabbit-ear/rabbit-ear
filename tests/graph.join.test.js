import { expect, test } from "vitest";
import ear from "../rabbit-ear.js";

const graph = ear.graph({
	vertices_coords: [[0, 0], [0.5, 0], [1, 0], [1, 1], [0.5, 1], [0, 1]],
	edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [1, 4]],
	edges_assignment: ["B", "B", "B", "B", "B", "B", "F"],
	faces_vertices: [[0, 1, 4, 5], [3, 4, 1, 2]],
});

test("join graphs", () => {
	const cp1 = ear.cp.fish();
	const cp2 = ear.cp.fish().translate([0.5, 0]);
	ear.graph.join(cp1, cp2);
});

test("join graphs 2", () => {
	const cp1 = graph.clone();
	const cp2 = graph.clone().rotate(Math.PI / 2, [0, 1, 0], [0.5, 0, 0]);
	ear.graph.join(cp1, cp2);
	expect(cp1.vertices_coords.length).toBe(10);
	expect(cp1.edges_vertices.length).toBe(13);
	expect(cp1.faces_vertices.length).toBe(4);
});
