const ear = require("../rabbit-ear");

const rand = () => Math.random() - ear.math.EPSILON * 2 + ear.math.EPSILON;

test("span test", () => {
	const graph = ear.graph.unit_square();
	for (let i = 0; i < 4; i += 1) {
		ear.graph.addEdges(
			graph,
			ear.graph.addVertices(graph, [[rand(), 0], [rand(), 1]])
		);
		ear.graph.addEdges(
			graph,
			ear.graph.addVertices(graph, [[0, rand()], [1, rand()]])
		);
	}
	ear.graph.getEdgesEdgesSpan(graph);
	expect(true).toBe(true);
});

ear.graph.getEdgesEdgesSpan
ear.graph.getEdgesVerticesSpan