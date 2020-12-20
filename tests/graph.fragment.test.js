const ear = require("../rabbit-ear.js");

// test("fragment 2 lines", () => {
// 	const graph = {
// 		vertices_coords: [[1, 1], [9, 2], [2, 9], [11, 10]],
// 		edges_vertices: [[0, 3], [1, 2]],
// 		edges_assignment: ["M", "V"]
// 	};
// 	const res = ear.graph.fragment(graph);
// 	console.log(res);
// 	console.log(graph);
// });

test("fragment two loops", () => {
	const graph = {
		vertices_coords: [[0, 0], [1, 0], [0, 1], [1, 1], [0.5, 0.5], [2, 0.5]],
		edges_vertices: [[0, 3], [1, 2], [4, 5]],
		edges_assignment: ["M", "V", "F"]
	};
	const res = ear.graph.fragment(graph);
	expect(JSON.stringify(res)).toBe(JSON.stringify([[0,1], [2,3], [4]]));
	expect(JSON.stringify(graph.edges_assignment)).toBe(JSON.stringify(["M", "M", "V", "V", "F"]));
	expect(graph.vertices_coords.length).toBe(6);
});

