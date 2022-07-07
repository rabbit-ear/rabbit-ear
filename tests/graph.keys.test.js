const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear");

test("edge angle assinments", () => {
	const assignments = ["B", "b", "M", "m", "V", "v", "F", "f", "U", "u"];
	const angles = [0, 0, -180, -180, 180, 180, 0, 0, 0, 0];
	const calculated = assignments.map(a => ear.graph.edgeAssignmentToFoldAngle(a));
	expect(ear.math.fnEpsilonEqualVectors(calculated, angles)).toBe(true);
});

test("prefix key search test", () => {
	const graph = {
		vertices: null,
		vertices_: null,
		vertices_coords: null,
		vertices_vertices: null,
		vertices_vertices_vertices: null,
		vertices_vertices_vertices_coords: null,
		_vertices: null,
		_vertices_: null,
		_vertices_coords: null,
		_vertices_vertices: null,
		Vertices: null,
		Vertices_: null,
		_Vertices: null,
		_Vertices_: null,
	};

	const expected = [
		"vertices_",
		"vertices_coords",
		"vertices_vertices",
		"vertices_vertices_vertices",
		"vertices_vertices_vertices_coords",
	];
	const calculated = ear.graph.getGraphKeysWithPrefix(graph, "vertices");

	expect(expected).toEqual(
		expect.arrayContaining(calculated),
	);
});

test("suffix key search test", () => {
	const graph = {
		vertices: null,
		vertices_: null,
		vertices_coords: null,
		vertices_vertices: null,
		vertices_vertices_vertices: null,
		vertices_vertices_vertices_coords: null,
		_vertices: null,
		_vertices_: null,
		_vertices_coords: null,
		_vertices_vertices: null,
		Vertices: null,
		Vertices_: null,
		_Vertices: null,
		_Vertices_: null,
	};

	const expected = [
		"vertices_vertices",
		"vertices_vertices_vertices",
		"_vertices",
		"_vertices_vertices",
	];

	const calculated = ear.graph.getGraphKeysWithSuffix(graph, "vertices");

	expect(expected).toEqual(
		expect.arrayContaining(calculated),
	);
});

test("prefix key with extensions search test", () => {
	const graph = {
		"vertices_re:": null,
		"vertices_re:coords": null,
		"vertices_re:vertices": null,
		"vertices_re:vertices_vertices": null,
		"vertices_vertices_re:vertices": null,
		"vertices_vertices_vertices_re:coords": null,
		"_vertices_re:": null,
		"_vertices_re:coords": null,
		"_vertices_re:vertices": null,
		"Vertices_re:": null,
		"_Vertices_re:": null,
		"re:vertices": null,
		"re:vertices_": null,
		"re:vertices_coords": null,
		"re:vertices_vertices": null,
		"re:vertices_vertices_vertices": null,
		"re:vertices_vertices_vertices_coords": null,
		"re:_vertices": null,
		"re:_vertices_": null,
		"re:_vertices_coords": null,
		"re:_vertices_vertices": null,
		"_re:vertices": null,
		"_re:vertices_": null,
		"_re:vertices_coords": null,
		"_re:vertices_vertices": null,
		"re:Vertices": null,
		"re:Vertices_": null,
		"re:_Vertices": null,
		"re:_Vertices_": null,
		"_re:Vertices": null,
		"_re:Vertices_": null,
	};

	const expected = [
		"vertices_re:",
		"vertices_re:coords",
		"vertices_re:vertices",
		"vertices_re:vertices_vertices",
		"vertices_vertices_re:vertices",
		"vertices_vertices_vertices_re:coords",
	];

	const calculated = ear.graph.getGraphKeysWithPrefix(graph, "vertices");

	expect(expected).toEqual(
		expect.arrayContaining(calculated),
	);
});

test("transpose geometry arrays", () => {
	const graph = {
		file_spec: 1.1,
		file_creator: "",
		file_author: "",
		file_classes: ["singleModel"],
		frame_title: "",
		frame_attributes: ["2D"],
		frame_classes: ["creasePattern"],
		vertices_coords: [[0, 0], [0.5, 0], [1, 0], [1, 1], [0.5, 1], [0, 1]],
		vertices_vertices: [[1, 5], [2, 4, 0], [3, 1], [4, 2], [5, 1, 3], [0, 4]],
		vertices_faces: [[0], [0, 1], [1], [1], [1, 0], [0]],
		edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [1, 4]],
		edges_faces: [[0], [1], [1], [1], [0], [0], [0, 1]],
		edges_assignment: ["B", "B", "B", "B", "B", "B", "V"],
		edges_foldAngle: [0, 0, 0, 0, 0, 0, 180],
		edges_length: [0.5, 0.5, 1, 0.5, 0.5, 1, 1],
		faces_vertices: [[1, 4, 5, 0], [4, 1, 2, 3]],
		faces_edges: [[6, 4, 5, 0], [6, 1, 2, 3]],
	};
	const transposedVertices = ear.graph.transposeGraphArrays(graph, "vertices");

	const expectedVertex1 = {
		vertices_coords: [0.5, 0],
		vertices_faces: [0, 1],
		vertices_vertices: [2, 4, 0],
	};

	expect(transposedVertices.length).toEqual(6);
	expect(Object.keys(expectedVertex1)).toEqual(
		expect.arrayContaining(Object.keys(transposedVertices[0])),
	);
	expect(expectedVertex1.vertices_coords).toEqual(
		expect.arrayContaining(transposedVertices[1].vertices_coords),
	);
	expect(expectedVertex1.vertices_faces).toEqual(
		expect.arrayContaining(transposedVertices[1].vertices_faces),
	);
	expect(expectedVertex1.vertices_vertices).toEqual(
		expect.arrayContaining(transposedVertices[1].vertices_vertices),
	);
});

test("get keys with ending", () => {
	// ear.graph.get_keys_with_ending();
	expect(true).toBe(true);
});
