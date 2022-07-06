const ear = require("rabbit-ear");

test("empty", () => expect(true).toBe(true));

// const rand = () => Math.random() - ear.math.EPSILON * 2 + ear.math.EPSILON;

// test("span test", () => {
// 	const graph = ear.graph.square();
// 	for (let i = 0; i < 4; i += 1) {
// 		ear.graph.addEdges(
// 			graph,
// 			ear.graph.addVertices(graph, [[rand(), 0], [rand(), 1]])
// 		);
// 		ear.graph.addEdges(
// 			graph,
// 			ear.graph.addVertices(graph, [[0, rand()], [1, rand()]])
// 		);
// 	}
// 	ear.graph.getEdgesEdgesOverlapingSpans(graph);
// 	expect(true).toBe(true);
// });

// ear.graph.getEdgesEdgesOverlapingSpans
// ear.graph.getEdgesVerticesOverlappingSpan
