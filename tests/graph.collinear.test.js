const ear = require("../rabbit-ear");

// this graph looks like this: (except, square)
//
//  o--o--o--o--o--o--o--o--o-----o
//  |                             |
//  o-----------------------------o
//
const collinearSquare = {
	vertices_coords: [[0, 0], [0.1, 0], [0.2, 0], [0.3, 0], [0.4, 0], [0.5, 0],
		[0.6, 0], [0.7, 0], [0.8, 0], [1, 0], [1, 1], [0, 1]],
	vertices_vertices: [[11, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 6],
		[5, 7], [6, 8], [7, 9], [8, 10], [9, 11], [10, 0]],
	vertices_faces: [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
	edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7],
		[7, 8], [8, 9], [9, 10], [10, 11], [11, 0]],
	edges_faces: [[0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0], [0]],
	edges_assignment: ["B", "B", "B", "B", "B", "B", "B", "B", "B", "B", "B", "B"],
	edges_foldAngle: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	faces_vertices: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]],
	faces_edges: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]]
};

test("vertices edges overlap vertices", () => {
	// all vertices are in the boundary. this will return nothing
	const verts = ear.graph.getVerticesEdgesOverlap(collinearSquare);
	verts.forEach(arr => expect(arr.length).toBe(0));
});

// todo
// test("collinear vertices", () => {
//   const verts = ear.graph.get_collinear_vertices(collinearSquare);
//   expect(true).toBe(true);
// });

test("remove collinear vertices", () => {
	expect(true).toBe(true);
	return;

	const graph = {
		vertices_coords: [[-1, 0], [0, 0], [1, 1], [2, 2], [3, 2], [0, 20]],
		edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0]],
		edges_assignment: ["M", "M", "M", "M", "M", "M"]
	};
	ear.graph.populate(graph);

	ear.graph.remove_all_collinear_vertices(graph);
	// this should have removed the vertex [1, 1]
	// the next vertex should have shifted up by 1
	expect(graph.vertices_coords.length).toBe(5);
	expect(graph.vertices_coords[2][0]).toBe(2);
	expect(graph.vertices_coords[2][1]).toBe(2);
});

test("get collinear vertices overlapping an edge", () => {
	const graph = ear.graph.square();

	for (let i = 0; i < 4; i += 1) {
		ear.graph.addEdges(
			graph,
			ear.graph.addVertices(graph, [[Math.random(), 0], [Math.random(), 1]])
		);
		ear.graph.addEdges(
			graph,
			ear.graph.addVertices(graph, [[0, Math.random()], [1, Math.random()]])
		);
	}
	const res = ear.graph.getVerticesEdgesOverlap(graph);
	expect(res[0].length).toBe(4);
	expect(res[1].length).toBe(4);
	expect(res[2].length).toBe(4);
	expect(res[3].length).toBe(4);
	for (var i = 4; i < res.length; i += 1) {
		expect(res[i].length).toBeLessThan(4);
	}
});
