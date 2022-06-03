const ear = require("../rabbit-ear");

const rand = () => Math.random() - ear.math.EPSILON * 2 + ear.math.EPSILON;

test("span test", () => {
	const graph = ear.graph.unit_square();
	for (let i = 0; i < 4; i += 1) {
		ear.graph.add_edges(
			graph,
			ear.graph.add_vertices(graph, [[rand(), 0], [rand(), 1]])
		);
		ear.graph.add_edges(
			graph,
			ear.graph.add_vertices(graph, [[0, rand()], [1, rand()]])
		);
	}
	ear.graph.get_edges_edges_span(graph);
	expect(true).toBe(true);
});

ear.graph.get_edges_edges_span
ear.graph.get_edges_vertices_span