test("empty", () => expect(true).toBe(true));

/*
const ear = require("rabbit-ear");

test("addVertices_splitEdges", () => {
	const graph = {
		vertices_coords: [[0, 0], [1, 0]],
		edges_vertices: [[0, 1]],
		edges_foldAngle: [90],
		edges_assignment: ["V"],
	};
	ear.graph.addVertices_splitEdges(graph, [ [0.5, 0] ]);
	expect(graph.edges_vertices.length).toBe(2);
	expect(graph.edges_assignment.length).toBe(2);
	expect(graph.edges_foldAngle.length).toBe(2);
	expect(graph.edges_vertices[0]).toEqual(expect.arrayContaining([0, 2]));
	expect(graph.edges_vertices[1]).toEqual(expect.arrayContaining([1, 2]));
	expect(graph.edges_assignment).toEqual(expect.arrayContaining(["V", "V"]));
	expect(graph.vertices_coords.length).toBe(3);
	expect(graph.vertices_coords[2]).toEqual(expect.arrayContaining([0.5, 0]));
});

test("addVertices_splitEdges", () => {
	const graph = {
		vertices_coords: [[0, 0], [1, 0]],
		edges_vertices: [[0, 1]],
		edges_foldAngle: [90],
		edges_assignment: ["V"],
	};
	const result = ear.graph.addVertices_splitEdges(graph, [
		[3, 3],
		[1, 0],
		[0.5, 0],
	]);
	expect(graph.edges_vertices.length).toBe(2);
	expect(graph.edges_assignment.length).toBe(2);
	expect(graph.edges_foldAngle.length).toBe(2);
	expect(graph.edges_vertices[0]).toEqual(expect.arrayContaining([0, 3]));
	expect(graph.edges_vertices[1]).toEqual(expect.arrayContaining([1, 3]));
	expect(graph.edges_assignment).toEqual(expect.arrayContaining(["V", "V"]));
	expect(graph.vertices_coords.length).toBe(4);
	expect(graph.vertices_coords[2]).toEqual(expect.arrayContaining([3, 3]));
	expect(graph.vertices_coords[3]).toEqual(expect.arrayContaining([0.5, 0]));
	expect(result).toEqual(expect.arrayContaining([2, 1, 3]));
});

*/
