import { expect, test } from "vitest";
import fs from "fs";
import ear from "../src/index.js";

test("makeSolverConstraints3D, subgraph components", () => {
	const foldfile = fs.readFileSync(
		"./tests/files/fold/layers-3d-edge-face.fold",
		"utf-8",
	);
	const fold = JSON.parse(foldfile);
	const frames = ear.graph.getFileFramesAsArray(fold);
	const foldedForms = frames.map(frame => ({
		...frame,
		vertices_coords: ear.graph.makeVerticesCoordsFolded(frame),
	}));
	foldedForms.forEach(folded => ear.graph.populate(folded));

	const results = foldedForms
		.map(folded => ear.layer.constraints3DFaceClusters(folded));

	expect(results[3].clusters_graph).toMatchObject([{
		// vertices 0, 1, 5, 9 and 3, 4, 6, 7
		// vertices_coords: [[0, 0], [2, 0],, [1, 0], [0, 0], [0, 1], [0, 1], [1, 1],, [2, 1]],
		// edges 0, 4, 8, 9 and 3, 5, 11, 12
		edges_vertices: [[0, 1],,, [3, 4], [5, 0], [6, 7],,, [9, 5], [9, 1],, [7, 3], [4, 6]],
		edges_faces: [[0],,, [3], [0], [3],,, [0], [0],, [3], [3]],
		edges_assignment: ["B",,, "B", "B", "B",,, "B", "V",, "M", "B"],
		edges_foldAngle: [0,,, 0, 0, 0,,, 0, 120,, -60, 0],
		// faces 0, 3
		faces_vertices: [[0, 1, 9, 5],,, [3, 4, 6, 7]],
		faces_edges: [[0, 9, 8, 4],,, [3, 12, 5, 11]],
		faces_faces: [[],,, []],
		// faces_center: [[1, 0.5],,, [0.5, 0.5]],
	}, {
		// vertices_coords: [, [-1, 0], [0, 0],,,,,, [0, 1], [-1, 1]],
		// edges 1, 7, 9, 10
		edges_vertices: [, [1, 2],,,,,, [8, 9],, [9, 1], [8, 2]],
		edges_faces: [, [1],,,,,, [1],, [1], [1]],
		edges_assignment: [, "B",,,,,, "B",, "V", "V"],
		edges_foldAngle: [, 0,,,,,, 0,, 120, 120],
		// faces 1
		faces_vertices: [, [1, 2, 8, 9]],
		faces_edges: [, [1, 10, 7, 9]],
		faces_faces: [, []],
		// faces_center: [, [-0.5, 0.5]],
	}, {
		// vertices_coords: [,,  [-1.5, 0], [-0.5, 0],,,, [-0.5, 1] [-1.5, 1]],
		// edges 2, 6, 10, 11
		edges_vertices: [,, [2, 3],,,, [7, 8],,,, [8, 2], [7, 3]],
		edges_faces: [,, [2],,,, [2],,,, [2], [2]],
		edges_assignment: [,, "B",,,, "B",,,, "V", "M"],
		edges_foldAngle: [,, 0,,,, 0,,,, 120, -60],
		// faces 2
		faces_vertices: [,, [2, 3, 7, 8]],
		faces_edges: [,, [2, 11, 6, 10]],
		faces_faces: [,, []],
		// faces_center: [,, [-1, 0.5]],
	}]);
});
