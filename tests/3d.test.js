const ear = require("../rabbit-ear.js");
const fs = require("fs");

test("fold in 3d", () => {
	const file = "bird-base-3d.fold";
	// const file = "panels.fold";

	const cp = JSON.parse(fs.readFileSync(`./tests/files/${file}`));

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
			ear.math.resize(3, coords)
		));

	// modify the original graph, replace the vertices_coords with the new set.
	cp.vertices_coords = new_vertices_coords;

	fs.writeFileSync(`./tests/files/folded-${file}`, JSON.stringify(cp));
});
