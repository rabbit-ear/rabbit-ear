const fs = require("fs");
const { test, expect } = require("@jest/globals");
const ear = require("../rabbit-ear.js");

test("fold a 3D model", () => {
	const file = "bird-base-3d.fold";
	// const file = "panels.fold";
	const FOLD = JSON.parse(fs.readFileSync(`./tests/files/fold/${file}`));
	const cp = ear.graph.getFramesByClassName(FOLD, "creasePattern")[0];
	const vertices_coords = ear.graph.makeVerticesCoordsFolded(cp);
	const folded = {
		...cp,
		vertices_coords,
	};
	// console.log("folded", folded);

	expect(true).toBe(true);
});

test("fold in 3d", () => {
	const file = "bird-base-3d.fold";
	// const file = "panels.fold";

	const FOLD = JSON.parse(fs.readFileSync(`./tests/files/fold/${file}`));
	const cp = ear.graph.getFramesByClassName(FOLD, "creasePattern")[0];

	// make edge-adjacent faces for every face
	// cp.faces_faces = ear.graph.makeFacesFaces(cp);
	// pick a starting face, breadth-first walk to every face
	// each of these results will relate a face to:
	// 1. each parent face in the walk
	// 2. which edge it crossed to move from the parent to this face
	// const walk = ear.graph.make_face_walk_tree(cp);
	// console.log(walk);

	// everything commented out above is done inside these next few methods

	// give each face a global transform matrix based on it and its connected face's matrices
	const faces_matrix = ear.graph.makeFacesMatrix(cp);
	// console.log("faces_matrix", faces_matrix);

	// most vertices are a part of a few different faces, it doesn't matter
	// which face, just assign each vertex to one of its face's matrices, and
	// apply that transform.
	const vertices_faces = ear.graph.makeVerticesFaces(cp);
	const new_vertices_coords = cp.vertices_coords
		.map((coords, i) => ear.math.multiplyMatrix3Vector3(
			faces_matrix[vertices_faces[i][0]],
			ear.math.resize(3, coords),
		));

	// modify the original graph, replace the vertices_coords with the new set.
	cp.vertices_coords = new_vertices_coords;

	// fs.writeFileSync(`./tests/files/folded-${file}`, JSON.stringify(cp));
	expect(true).toBe(true);
});

test("fold a disjoint graph", () => {
	const file = "disjoint-triangles-3d.fold";
	const FOLD = JSON.parse(fs.readFileSync(`./tests/files/fold/${file}`));
	const cp = ear.graph.getFramesByClassName(FOLD, "creasePattern")[0];
	const vertices_coords = ear.graph.makeVerticesCoordsFolded(cp);
	const expected = [
		[0, 0, 0],
		[1, 0, 1],
		[1, 1, 0],
		[1, 0, 0],
		[0.5, 0, 0],
		[0.5, 0.5, 0],
		[0.5, 0, 0.5],
		[-0.5, 0, 0],
		[-1.5, 1, 0],
		[-1.5, 0, 1],
		[-1.5, 0, 0],
		[-1, 0, 0],
		[-1, 0, 0.5],
		[-1, 0.5, 0],
		[1.5, 0, 0],
		[2.5, 0, 1],
		[2.5, 1, 0],
		[2.5, 0, 0],
		[3, 0, 0],
		[4, 0, 1],
		[4, 1, 0],
		[4, 0, 0],
		[4.5, 0, 0],
		[5, 0, 0.5],
		[5, 0.5, 0],
		[5, 0, 0],
	];
	vertices_coords
		.forEach((coords, i) => coords
			.forEach((n, j) => expect(n).toBeCloseTo(expected[i][j])));
});
