import { expect, test } from "vitest";
import ear from "../rabbit-ear.js";

test("overlapping components, two identical edges", () => {
	const graph = ear.graph.populate({
		vertices_coords: [[0, 0], [1, 0], [1, 0], [0, 0]],
		edges_vertices: [[0, 1], [2, 3]],
		faces_vertices: [],
	});
	const {
		verticesVertices,
		verticesEdges,
		edgesEdges,
		facesVertices,
	} = ear.graph.getOverlappingComponents(graph);
	expect(ear.general.lookupArrayToArrayArray(verticesVertices)).toMatchObject([
		[3], [2], [1], [0]
	]);
	expect(ear.general.lookupArrayToArrayArray(verticesEdges)).toMatchObject([
		[], [], [], []
	]);
	expect(ear.general.lookupArrayToArrayArray(edgesEdges)).toMatchObject([
		[], [],
	]);
	expect(ear.general.lookupArrayToArrayArray(facesVertices)).toMatchObject([]);
});

test("overlapping components, two crossing edges", () => {
	const graph = ear.graph.populate({
		vertices_coords: [[0, 0], [1, 0], [0.5, 1], [0.5, -1]],
		edges_vertices: [[0, 1], [2, 3]],
		faces_vertices: [],
	});
	const {
		verticesVertices,
		verticesEdges,
		edgesEdges,
		facesVertices,
	} = ear.graph.getOverlappingComponents(graph);
	expect(ear.general.lookupArrayToArrayArray(verticesVertices)).toMatchObject([
		[], [], [], [],
	]);
	expect(ear.general.lookupArrayToArrayArray(verticesEdges)).toMatchObject([
		[], [], [], [],
	]);
	expect(ear.general.lookupArrayToArrayArray(edgesEdges)).toMatchObject([
		[1], [0],
	]);
	expect(ear.general.lookupArrayToArrayArray(facesVertices)).toMatchObject([]);
});

test("overlapping components, two collinear overlapping edges", () => {
	const graph = ear.graph.populate({
		vertices_coords: [[0, 0], [2, 0], [1, 0], [3, 0]],
		edges_vertices: [[0, 1], [2, 3]],
		faces_vertices: [],
	});
	const {
		verticesVertices,
		verticesEdges,
		edgesEdges,
		facesVertices,
	} = ear.graph.getOverlappingComponents(graph);
	expect(ear.general.lookupArrayToArrayArray(verticesVertices)).toMatchObject([
		[], [], [], [],
	]);
	expect(ear.general.lookupArrayToArrayArray(verticesEdges)).toMatchObject([
		[], [1], [0], [],
	]);
	expect(ear.general.lookupArrayToArrayArray(edgesEdges)).toMatchObject([
		[], [],
	]);
	expect(ear.general.lookupArrayToArrayArray(facesVertices)).toMatchObject([]);
});

test("overlapping components, two adjacent faces one point overlap", () => {
	const graph = ear.graph.populate({
		vertices_coords: [[0, 0], [0.5, 0.5], [0, 1], [0, 1]],
		edges_vertices: [[0, 3], [3, 1], [1, 2], [2, 0], [0, 1]],
		edges_assignment: Array.from("BBBBV"),
		faces_vertices: [[0, 2, 1], [0, 1, 3]],
	});
	const components = ear.graph.getOverlappingComponents(graph);

	// console.log(components);
	// vertex 2 and 3 are mutually overlapping
	expect(components).toMatchObject({
		verticesVertices: [[], [], [,,, true], [,, true]],
		verticesEdges: [[], [], [], []],
		edgesEdges: [[], [], [], [], []],
		facesVertices: [[], []],
	});
});

test("overlapping components, two adjacent faces no overlap points, two crossing edges", () => {
	const graph = ear.graph.populate({
		vertices_coords: [[0, 0], [0.5, 0.5], [0, 1], [-0.1, 0.9]],
		edges_vertices: [[0, 3], [3, 1], [1, 2], [2, 0], [0, 1]],
		edges_assignment: Array.from("BBBBV"),
		faces_vertices: [[0, 2, 1], [0, 1, 3]],
	});
	const components = ear.graph.getOverlappingComponents(graph);

	// edge 1 and 3 are mutually overlapping
	expect(components).toMatchObject({
		verticesVertices: [[], [], [], []],
		verticesEdges: [[], [], [], []],
		edgesEdges: [[], [,,, true], [], [, true], []],
		facesVertices: [[], []],
	});
});

test("overlapping components, two separate faces, identical", () => {
	const graph = ear.graph.populate({
		vertices_coords: [[0, 0], [0.5, 0.5], [0, 1], [0, 0], [0.5, 0.5], [0, 1]],
		edges_vertices: [[0, 1], [1, 2], [2, 0], [3, 4], [4, 5], [5, 3]],
		edges_assignment: Array.from("BBBBBB"),
		faces_vertices: [[0, 1, 2], [3, 4, 5]],
	});
	const components = ear.graph.getOverlappingComponents(graph);

	expect(components).toMatchObject({
		verticesVertices: [[,,, true], [,,,, true], [,,,,, true], [true], [, true], [,, true]],
		verticesEdges: [[], [], [], [], [], []],
		edgesEdges: [[], [], [], [], [], []],
		facesVertices: [[], []],
	});
});

test("overlapping components, two separate faces, one point in common", () => {
	// one upside down triangle (point at origin)
	// copy of other triangle, scaled shorter in the Y axis (point at origin)
	// the second triangle's top line cuts through the other triangle's sides
	const graph = ear.graph.populate({
		vertices_coords: [[0, 0], [1, 1], [-1, 1], [0, 0], [1, 0.5], [-1, 0.5]],
		edges_vertices: [[0, 1], [1, 2], [2, 0], [3, 4], [4, 5], [5, 3]],
		edges_assignment: Array.from("BBBBBB"),
		faces_vertices: [[0, 1, 2], [3, 4, 5]],
	});
	const components = ear.graph.getOverlappingComponents(graph);

	// vertices 0 and 3 are mutually overlapping
	// edge 4 overlaps with both edges 0 and 2
	expect(components).toMatchObject({
		verticesVertices: [[,,, true], [], [], [true], [], []],
		verticesEdges: [[], [], [], [], [], []],
		edgesEdges: [[,,,, true], [], [,,,, true], [], [true,, true], []],
		facesVertices: [[], []],
	});
});

test("overlapping components, points inside faces", () => {
	// one upside down triangle (point at origin)
	// one right side up triangle
	const graph = ear.graph.populate({
		vertices_coords: [[0, 0], [1, 1], [-1, 1], [-1, -1], [1, -1], [0, 0.5]],
		edges_vertices: [[0, 1], [1, 2], [2, 0], [3, 4], [4, 5], [5, 3]],
		edges_assignment: Array.from("BBBBBB"),
		faces_vertices: [[0, 1, 2], [3, 4, 5]],
	});
	const components = ear.graph.getOverlappingComponents(graph);

	// vertices 0 and 3 are mutually overlapping
	// edge 4 overlaps with both edges 0 and 2
	expect(components).toMatchObject({
		verticesVertices: [[], [], [], [], [], []],
		verticesEdges: [[], [], [], [], [], []],
		edgesEdges: [[,,,, true], [], [,,,,, true], [], [true], [,, true]],
		facesVertices: [[,,,,, true], [true]],
	});
});

test("overlapping components kite base", () => {
	const cp = ear.graph.kite();
	const folded = {
		...cp,
		vertices_coords: ear.graph.makeVerticesCoordsFlatFolded(cp),
	};
	ear.graph.populate(folded);

	const components = ear.graph.getOverlappingComponents(folded);

	// vertex 1 and 5 mutually overlap
	// vertex 1 and 5 both overlap edge 8
	// edge 1 overlaps face 1
	// edge 4 overlaps face 2
	expect(components).toMatchObject({
		verticesVertices: [
			[], [,,,,, true], [], [], [], [, true],
		],
		verticesEdges: [
			[], [,,,,,,,, true], [], [], [], [,,,,,,,, true],
		],
		edgesEdges: [
			[], [], [], [], [], [], [], [], [],
		],
		facesVertices: [
			[], [], [], [],
		],
	});
});


test("overlapping components bird base", () => {
	const cp = ear.graph.bird();
	const folded = {
		...cp,
		vertices_coords: ear.graph.makeVerticesCoordsFlatFolded(cp),
	};
	ear.graph.populate(folded);

	const {
		verticesVertices,
		verticesEdges,
		edgesEdges,
		facesVertices,
	} = ear.graph.getOverlappingComponents(folded);

	expect(ear.general.lookupArrayToArrayArray(verticesVertices)).toMatchObject([
		[2, 4, 6],
		[3, 5, 7, 13, 14],
		[0, 4, 6],
		[1, 5, 7, 13, 14],
		[0, 2, 6],
		[1, 3, 7, 13, 14],
		[0, 2, 4],
		[1, 3, 5, 13, 14],
		[],
		[10],
		[9],
		[12],
		[11],
		[1, 3, 5, 7, 14],
		[1, 3, 5, 7, 13],
	]);
	expect(ear.general.lookupArrayToArrayArray(verticesEdges)).toMatchObject([
		[], [24, 25], [], [24, 25], [], [24, 25], [],
		[24, 25], [], [], [], [], [], [24, 25], [24, 25]
	]);
	expect(ear.general.lookupArrayToArrayArray(edgesEdges)).toMatchObject([
		[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [],
		[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []
	]);
	expect(ear.general.lookupArrayToArrayArray(facesVertices)).toMatchObject([
		[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []
	]);
});
