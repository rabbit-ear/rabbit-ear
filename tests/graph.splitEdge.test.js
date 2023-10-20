import { expect, test } from "vitest";
import ear from "../rabbit-ear.js";

test("split edge similar endpoint", () => {
	// kite graph has 6 boundary edges, indices 0-5
	// then 3 edges, "V", "V", "F", edges 6, 7, 8.
	const graph = ear.graph.kite();
	// split an edge but provide the edge's endpoint
	// this should not split the edge but just return the existing vertex
	const res = ear.graph.splitEdge(graph, 6, [1, 0.41421356237309515]);
	// the point we provided is the same as vertex 2
	// and edge 6 is an edge which includes vertex 2.
	expect(res.vertex).toBe(2);
});
