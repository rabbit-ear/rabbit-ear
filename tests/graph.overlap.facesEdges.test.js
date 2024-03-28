import { expect, test } from "vitest";
import fs from "fs";
import ear from "../rabbit-ear.js";

test("edges-faces, triangle cut by edge", () => {
	const graph = ear.graph.populate({
		vertices_coords: [[0, 0], [0.5, 0.5], [0, 1], [-1, 0.5]],
		edges_vertices: [[0, 1], [1, 2], [2, 0], [1, 3]],
		edges_assignment: Array.from("BBBB"),
		faces_vertices: [[0, 1, 2]],
	});
	const facesEdges = ear.graph.getFacesEdgesOverlapAllData(graph);
	expect(facesEdges).toMatchObject([
		[
			{ v: [], e: [], p: [] }, // edge 0, already a part of face 0
			{ v: [], e: [], p: [] }, // edge 1, already a part of face 0
			{ v: [], e: [], p: [] }, // edge 2, already a part of face 0
			{ v: [1], e: [2], p: [] }, // edge 3, overlaps vert 1 and crosses edge 2
		],
	]);
	expect(ear.graph.getFacesEdgesOverlap(graph)).toMatchObject([[3]]);
});

test("edges-faces, square cut by edge through vertex", () => {
	// square cut by edge between two of its vertices
	const graph1 = ear.graph.populate({
		vertices_coords: [[0, 0], [1, 0], [1, 1], [0, 1]],
		edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2]],
		edges_assignment: Array.from("BBBBB"),
		faces_vertices: [[0, 1, 2, 3]],
	});
	// square cut by edge between one of its vertices, through another vertex
	const graph2 = ear.graph.populate({
		vertices_coords: [[0, 0], [1, 0], [1, 1], [0, 1], [2, 2]],
		edges_vertices: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 4]],
		edges_assignment: Array.from("BBBBB"),
		faces_vertices: [[0, 1, 2, 3]],
	});

	expect(ear.graph.getFacesEdgesOverlapAllData(graph1)).toMatchObject([
		[
			{ v: [], e: [], p: [] },
			{ v: [], e: [], p: [] },
			{ v: [], e: [], p: [] },
			{ v: [], e: [], p: [] },
			{ v: [0, 2], e: [], p: [] },
		],
	]);

	expect(ear.graph.getFacesEdgesOverlapAllData(graph2)).toMatchObject([
		[
			{ v: [], e: [], p: [] },
			{ v: [], e: [], p: [] },
			{ v: [], e: [], p: [] },
			{ v: [], e: [], p: [] },
			{ v: [0, 2], e: [], p: [] },
		],
	]);

	expect(ear.graph.getFacesEdgesOverlap(graph1)).toMatchObject([[4]]);
	expect(ear.graph.getFacesEdgesOverlap(graph2)).toMatchObject([[4]]);
});

test("edges-faces all data, two adjacent faces one point overlap", () => {
	const graph = ear.graph.populate({
		vertices_coords: [[0, 0], [0.5, 0.5], [0, 1], [0, 1]],
		edges_vertices: [[0, 3], [3, 1], [1, 2], [2, 0], [0, 1]],
		edges_assignment: Array.from("BBBBV"),
		faces_vertices: [[0, 2, 1], [0, 1, 3]],
	});

	expect(ear.graph.getFacesEdgesOverlap(graph)).toMatchObject([[], []]);

	expect(ear.graph.getFacesEdgesOverlapAllData(graph)).toMatchObject([
		[
			{ v: [], e: [], p: [] },
			{ v: [], e: [], p: [] },
			{ v: [], e: [], p: [] },
			{ v: [], e: [], p: [] },
			{ v: [], e: [], p: [] },
		], [
			{ v: [], e: [], p: [] },
			{ v: [], e: [], p: [] },
			{ v: [], e: [], p: [] },
			{ v: [], e: [], p: [] },
			{ v: [], e: [], p: [] },
		],
	]);
});

test("edges-faces all data, two adjacent faces no overlap points, two crossing edges", () => {
	const graph = ear.graph.populate({
		vertices_coords: [[0, 0], [0.5, 0.5], [0, 1], [-0.1, 0.9]],
		edges_vertices: [[0, 3], [3, 1], [1, 2], [2, 0], [0, 1]],
		edges_assignment: Array.from("BBBBV"),
		faces_vertices: [[0, 2, 1], [0, 1, 3]],
	});

	expect(ear.graph.getFacesEdgesOverlap(graph)).toMatchObject([[1], [3]]);

	expect(ear.graph.getFacesEdgesOverlapAllData(graph)).toMatchObject([
		[
			{ v: [0], e: [], p: [] },
			{ v: [1], e: [3], p: [] },
			{ v: [], e: [], p: [] },
			{ v: [], e: [], p: [] },
			{ v: [], e: [], p: [] },
		], [
			{ v: [], e: [], p: [] },
			{ v: [], e: [], p: [] },
			{ v: [1], e: [], p: [] },
			{ v: [0], e: [1], p: [] },
			{ v: [], e: [], p: [] },
		],
	]);
});

test("edges-faces all data, two separate faces, identical", () => {
	const graph = ear.graph.populate({
		vertices_coords: [[0, 0], [0.5, 0.5], [0, 1], [0, 0], [0.5, 0.5], [0, 1]],
		edges_vertices: [[0, 1], [1, 2], [2, 0], [3, 4], [4, 5], [5, 3]],
		edges_assignment: Array.from("BBBBBB"),
		faces_vertices: [[0, 1, 2], [3, 4, 5]],
	});

	expect(ear.graph.getFacesEdgesOverlap(graph)).toMatchObject([[], []]);

	expect(ear.graph.getFacesEdgesOverlapAllData(graph)).toMatchObject([
		[
			{ v: [], e: [], p: [] },
			{ v: [], e: [], p: [] },
			{ v: [], e: [], p: [] },
			{ v: [], e: [], p: [] },
			{ v: [], e: [], p: [] },
			{ v: [], e: [], p: [] },
		], [
			{ v: [], e: [], p: [] },
			{ v: [], e: [], p: [] },
			{ v: [], e: [], p: [] },
			{ v: [], e: [], p: [] },
			{ v: [], e: [], p: [] },
			{ v: [], e: [], p: [] },
		],
	]);
});

test("edges-faces all data, two separate faces, one point in common", () => {
	// one upside down triangle (point at origin)
	// copy of other triangle, scaled shorter in the Y axis (point at origin)
	// the second triangle's top line cuts through the other triangle's sides
	const graph = ear.graph.populate({
		vertices_coords: [[0, 0], [1, 1], [-1, 1], [0, 0], [1, 0.5], [-1, 0.5]],
		edges_vertices: [[0, 1], [1, 2], [2, 0], [3, 4], [4, 5], [5, 3]],
		edges_assignment: Array.from("BBBBBB"),
		faces_vertices: [[0, 1, 2], [3, 4, 5]],
	});

	expect(ear.graph.getFacesEdgesOverlap(graph)).toMatchObject([[4], [0, 2]]);

	expect(ear.graph.getFacesEdgesOverlapAllData(graph)).toMatchObject([
		[
			{ v: [], e: [], p: [] },
			{ v: [], e: [], p: [] },
			{ v: [], e: [], p: [] },
			{ v: [0], e: [], p: [] },
			{ v: [], e: [0, 2], p: [] },
			{ v: [0], e: [], p: [] },
		], [
			{ v: [3], e: [4], p: [] },
			{ v: [], e: [], p: [] },
			{ v: [3], e: [4], p: [] },
			{ v: [], e: [], p: [] },
			{ v: [], e: [], p: [] },
			{ v: [], e: [], p: [] },
		],
	]);
});

test("edges-faces kite base", () => {
	const cp = ear.graph.kite();
	const folded = {
		...cp,
		vertices_coords: ear.graph.makeVerticesCoordsFlatFolded(cp),
	};
	ear.graph.populate(folded);

	expect(ear.graph.getFacesEdgesOverlap(folded))
		.toMatchObject([[], [1], [4], []]);

	// edge 1 overlaps face 1
	// edge 4 overlaps face 2
	expect(ear.graph.getFacesEdgesOverlapAllData(folded)).toMatchObject([
		[
			{ v: [], e: [], p: [] },
			{ v: [], e: [], p: [] },
			{ v: [2], e: [], p: [] },
			{ v: [], e: [], p: [] },
			{ v: [1], e: [], p: [] },
			{ v: [], e: [], p: [] },
			{ v: [], e: [], p: [] },
			{ v: [0], e: [], p: [] },
			{ v: [], e: [], p: [] },
		],
		[
			{ v: [0], e: [8], p: [] }, // edge 8 contains vertex 0. will not overlap.
			{ v: [2], e: [8], p: [] }, // face 1 and edge 1 should overlap
			{ v: [], e: [], p: [] },
			{ v: [3], e: [], p: [] },
			{ v: [], e: [8], p: [] },
			{ v: [0], e: [8], p: [] },
			{ v: [], e: [], p: [] },
			{ v: [0], e: [], p: [] },
			{ v: [], e: [], p: [] },
		],
		[
			{ v: [0], e: [8], p: [] },
			{ v: [], e: [8], p: [] },
			{ v: [3], e: [], p: [] },
			{ v: [], e: [], p: [] },
			{ v: [4], e: [8], p: [] }, // face 2 and edge 4 should overlap
			{ v: [0], e: [8], p: [] },
			{ v: [0], e: [], p: [] },
			{ v: [], e: [], p: [] },
			{ v: [], e: [], p: [] },
		],
		[
			{ v: [], e: [], p: [] },
			{ v: [5], e: [], p: [] },
			{ v: [], e: [], p: [] },
			{ v: [4], e: [], p: [] },
			{ v: [], e: [], p: [] },
			{ v: [], e: [], p: [] },
			{ v: [0], e: [], p: [] },
			{ v: [], e: [], p: [] },
			{ v: [], e: [], p: [] },
		],
	]);
});

test("edges-faces, bird base", () => {
	const cp = ear.graph.bird();
	const folded = {
		...cp,
		vertices_coords: ear.graph.makeVerticesCoordsFlatFolded(cp),
	};
	ear.graph.populate(folded);

	const facesEdges = ear.graph.getFacesEdgesOverlap(folded);
	expect(facesEdges.flat().length).toBe(16);
	// fs.writeFileSync("./tests/tmp/facesEdges.json", JSON.stringify(facesEdges, null, 2));
});

test("edges-faces all data", () => {
	const foldfile = fs.readFileSync("./tests/files/fold/crane.fold", "utf-8");
	const fold = JSON.parse(foldfile);
	const folded = ear.graph.getFramesByClassName(fold, "foldedForm")[0];
	ear.graph.populate(folded);
	// console.log(ear.graph.getFacesEdgesOverlap(folded));
	expect(ear.graph.getFacesEdgesOverlap(folded).flat().length).toBe(1167);
});
