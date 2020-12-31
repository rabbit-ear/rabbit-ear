const ear = require("../rabbit-ear.js");

test("fragment 2 lines", () => {
	const graph = {
		vertices_coords: [[1, 1], [9, 2], [2, 9], [11, 10]],
		edges_vertices: [[0, 3], [1, 2]],
		edges_assignment: ["M", "V"]
	};
	const res = ear.graph.fragment(graph);
	expect(graph.vertices_coords.length).toBe(5);
});

test("fragment two loops", () => {
	const graph = {
		vertices_coords: [[0, 0], [1, 0], [0, 1], [1, 1], [0.5, 0.5], [2, 0.5]],
		edges_vertices: [[0, 3], [1, 2], [4, 5]],
		edges_assignment: ["M", "V", "F"]
	};
	const res = ear.graph.fragment(graph);
	expect(JSON.stringify(res.edges.map)).toBe(JSON.stringify([[0,1], [2,3], [4]]));
	expect(JSON.stringify(graph.edges_assignment)).toBe(JSON.stringify(["M", "M", "V", "V", "F"]));
	expect(graph.vertices_coords.length).toBe(6);
});

test("fragment dup verts", () => {
	const graph = {
		vertices_coords: [[0, 0], [1, 0], [0, 0], [0, 1], [0, 0], [-1, 0], [0, 0], [0, -1]],
		edges_vertices: [[0, 1], [2, 3], [4, 5], [6, 7]],
		edges_assignment: ["M", "V", "F", "B"]
	};
	const res = ear.graph.fragment(graph);
	expect(JSON.stringify(res.vertices.map)).toBe(JSON.stringify([0, 1, 0, 2, 0, 3, 0, 4]));
	expect(JSON.stringify(res.edges.map)).toBe(JSON.stringify([[0], [1], [2], [3]]));
	expect(graph.vertices_coords.length).toBe(5);
});

