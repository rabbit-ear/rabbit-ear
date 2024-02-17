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

test("split multiple edges, edge maps, approach 1: reverse order", () => {
	const graph = {
		vertices_coords: [[0, 0], [1, 0], [1, 1], [0, 1]],
		edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2]],
	};
	const line = { vector: [0, 1], origin: [0.5, 0.75] };

	// this will intersect edges: [0, 2, 4]
	const { edges } = ear.graph
		.intersectLineVerticesEdges(graph, line);

	// very important!
	// this sorts the edges in reverse order, this ensure that when we modify
	// the graph, the edge indices that are untouched are smaller than
	// the current edge, this way we always iterate next to an untouched index.
	const splitEdgeMaps = edges
		.map((intersection, edge) => ({ intersection, edge }))
		.filter(a => a.intersection !== undefined)
		.reverse()
		.map(({ intersection: { point }, edge }) => {
			const { edges: { map } } = ear.graph.splitEdge(graph, edge, point);
			return map;
		});

	const merge = ear.graph.mergeNextmaps(...splitEdgeMaps);

	expect(edges[0]).not.toBe(undefined);
	expect(edges[1]).toBe(undefined);
	expect(edges[2]).not.toBe(undefined);
	expect(edges[3]).toBe(undefined);
	expect(edges[4]).not.toBe(undefined);

	expect(JSON.stringify(merge))
		.toBe(JSON.stringify([[6, 7], [0], [4, 5], [1], [2, 3]]));

	// the corner vertices remained 0-3
	// the new vertices, in reverse order (of edge indices)
	// the diagonal first, then the top boundary, then the bottom boundary.
	expect(JSON.stringify(graph.vertices_coords[0])).toBe(JSON.stringify([0, 0]));
	expect(JSON.stringify(graph.vertices_coords[1])).toBe(JSON.stringify([1, 0]));
	expect(JSON.stringify(graph.vertices_coords[2])).toBe(JSON.stringify([1, 1]));
	expect(JSON.stringify(graph.vertices_coords[3])).toBe(JSON.stringify([0, 1]));
	expect(JSON.stringify(graph.vertices_coords[4])).toBe(JSON.stringify([0.5, 0.5]));
	expect(JSON.stringify(graph.vertices_coords[5])).toBe(JSON.stringify([0.5, 1]));
	expect(JSON.stringify(graph.vertices_coords[6])).toBe(JSON.stringify([0.5, 0]));

	// these are the only two edges remaining untouched from the original graph
	// they bubbled up to the first two indices
	expect(JSON.stringify(graph.edges_vertices[0])).toBe(JSON.stringify([1, 2]));
	expect(JSON.stringify(graph.edges_vertices[1])).toBe(JSON.stringify([3, 0]));
});

test("split multiple edges, edge maps, approach 2: update inside loop", () => {
	const graph = {
		vertices_coords: [[0, 0], [1, 0], [1, 1], [0, 1]],
		edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2]],
	};
	const line = { vector: [0, 1], origin: [0.5, 0.75] };

	// this will intersect edges: [0, 2, 4]
	const { edges } = ear.graph
		.intersectLineVerticesEdges(graph, line);

	// this approach does not bother with any edge sorting, it can work
	// in any order. however, each time we run "splitEdge", because the graph
	// has changed since the last loop, we have to update the intended edge index
	// using the current state of the edgeMap, get the current index of the edge.
	let edgeMap = graph.edges_vertices.map((_, i) => i);
	edges
		.map((intersection, edge) => ({ intersection, edge }))
		.filter(a => a.intersection !== undefined)
		.forEach(({ intersection: { point }, edge }) => {
			const newEdge = edgeMap[edge];
			const { edges: { map } } = ear.graph.splitEdge(graph, newEdge, point);
			edgeMap = ear.graph.mergeNextmaps(edgeMap, map);
		});

	expect(edges[0]).not.toBe(undefined);
	expect(edges[1]).toBe(undefined);
	expect(edges[2]).not.toBe(undefined);
	expect(edges[3]).toBe(undefined);
	expect(edges[4]).not.toBe(undefined);

	expect(JSON.stringify(edgeMap))
		.toBe(JSON.stringify([[2, 3], [0], [4, 5], [1], [6, 7]]));

	// the corner vertices remained 0-3
	// the new vertices, in correct order (of edge indices)
	// the bottom boundary first, then the top boundary, then the diagonal
	expect(JSON.stringify(graph.vertices_coords[0])).toBe(JSON.stringify([0, 0]));
	expect(JSON.stringify(graph.vertices_coords[1])).toBe(JSON.stringify([1, 0]));
	expect(JSON.stringify(graph.vertices_coords[2])).toBe(JSON.stringify([1, 1]));
	expect(JSON.stringify(graph.vertices_coords[3])).toBe(JSON.stringify([0, 1]));
	expect(JSON.stringify(graph.vertices_coords[4])).toBe(JSON.stringify([0.5, 0]));
	expect(JSON.stringify(graph.vertices_coords[5])).toBe(JSON.stringify([0.5, 1]));
	expect(JSON.stringify(graph.vertices_coords[6])).toBe(JSON.stringify([0.5, 0.5]));

	// these are the only two edges remaining untouched from the original graph
	// they bubbled up to the first two indices
	expect(JSON.stringify(graph.edges_vertices[0])).toBe(JSON.stringify([1, 2]));
	expect(JSON.stringify(graph.edges_vertices[1])).toBe(JSON.stringify([3, 0]));
});
