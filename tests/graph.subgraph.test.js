const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");

test("subgraphWithFaces", () => {
	const graph = ear.cp.fish();
	const subgraph = ear.graph.subgraphWithFaces(graph, [6]);
	expect(subgraph.vertices_coords.filter(a => a).length).toBe(3);
	expect(subgraph.edges_vertices.filter(a => a).length).toBe(3);
	expect(subgraph.faces_vertices.filter(a => a).length).toBe(1);
});

test("subgraph of subgraph", () => {
	const graph = ear.cp.fish();
	const subgraph = ear.graph.subgraphWithFaces(graph, [3, 4, 5, 6, 7]);
	const subsubgraph = ear.graph.subgraphWithFaces(subgraph, [6]);
	expect(JSON.stringify(ear.graph.subgraphWithFaces(graph, [6])))
		.toBe(JSON.stringify(subsubgraph));
});
