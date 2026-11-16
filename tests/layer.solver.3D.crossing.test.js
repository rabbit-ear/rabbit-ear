import { expect, test } from "vitest";
import ear from "../src/index.js";

// this tests what happens when a bunch of faces all join along
// a collinear edge but no two faces are coplanar.
// like an open book's pages fanning out around an idealized spine.

/**
 * @description build a folded FOLD graph with one panel for every pair of
 * clock positions, [a, b] means one face points at "a o'clock", the other
 * at "b o'clock" (0 is 12 o'clock), the central edge between them.
 * @param {[number, number][]} pairs
 * @returns {FOLD}
 */
const makeClockPanels = (pairs) => {
	const vertices_coords = [];
	const edges_vertices = [];
	const faces_vertices = [];
	const direction = (hour) => {
		const angle = (hour * Math.PI) / 6;
		return [Math.cos(angle), Math.sin(angle)];
	};
	pairs.forEach(([hourA, hourB]) => {
		const [ax, ay] = direction(hourA);
		const [bx, by] = direction(hourB);
		const v = vertices_coords.length;
		vertices_coords.push(
			[0, 0, 0], // v + 0, on the line
			[0, 0, 1], // v + 1, on the line
			[ax, ay, 0], // v + 2
			[ax, ay, 1], // v + 3
			[bx, by, 0], // v + 4
			[bx, by, 1], // v + 5
		);
		edges_vertices.push(
			[v + 0, v + 1], // central edge, on the line
			[v + 0, v + 2],
			[v + 2, v + 3],
			[v + 3, v + 1],
			[v + 1, v + 5],
			[v + 5, v + 4],
			[v + 4, v + 0],
		);
		// the two faces traverse the central edge in opposite directions
		faces_vertices.push([v + 0, v + 2, v + 3, v + 1], [v + 0, v + 1, v + 5, v + 4]);
	});
	const graph = { vertices_coords, edges_vertices, faces_vertices };
	ear.graph.populate(graph);
	graph.edges_foldAngle = ear.graph.makeEdgesFoldAngleFromFaces(graph);
	graph.edges_assignment = graph.edges_foldAngle.map((angle, e) => {
		if (graph.edges_faces[e].length < 2) {
			return "B";
		}
		if (angle === 0) {
			return "F";
		}
		return angle > 0 ? "V" : "M";
	});
	return graph;
};

// panel p's central edge is edge p * 7
const centralEdge = (panel) => panel * 7;

/**
 * @description every pair of central edges, as edgePairs (all collinear,
 * all overlapping along the full length of the line)
 */
const allEdgePairs = (panelCount) => {
	const pairs = [];
	for (let i = 0; i < panelCount; i += 1) {
		for (let j = i + 1; j < panelCount; j += 1) {
			pairs.push([centralEdge(i), centralEdge(j)]);
		}
	}
	return pairs;
};

test("clock panels, the generated graph is what we expect", () => {
	const graph = makeClockPanels([
		[0, 11],
		[1, 10],
	]);
	expect(graph.faces_vertices.length).toBe(4);
	expect(graph.edges_vertices.length).toBe(14);
	// the library finds every central edge collinear with every other
	const edges_vertices = graph.edges_vertices.slice();
	graph.edges_faces.forEach((faces, e) => {
		if (faces.length !== 2) {
			delete edges_vertices[e];
		}
	});
	const edgePairs = ear.graph.connectedComponentsPairs(
		ear.graph.getEdgesEdgesCollinearOverlap({
			vertices_coords: graph.vertices_coords,
			edges_vertices,
		}),
	);
	expect(edgePairs).toEqual(allEdgePairs(2));
	// 0 and 11 o'clock are 30 degrees apart, a 150 degree fold. same for 1 and 10
	// (going the short way around through 12 o'clock is 90 degrees, a 90 fold)
	expect(Math.abs(graph.edges_foldAngle[centralEdge(0)])).toBeCloseTo(150);
	expect(Math.abs(graph.edges_foldAngle[centralEdge(1)])).toBeCloseTo(90);
});

test("clock panels, 6 nested pairs ((((((  )))))) are valid", () => {
	const pairs = [
		[0, 11],
		[1, 10],
		[2, 9],
		[3, 8],
		[4, 7],
		[5, 6],
	];
	const graph = makeClockPanels(pairs);
	expect(ear.layer.getCrossingEdgePairs(graph, allEdgePairs(6))).toEqual([]);
	expect(() => ear.layer.makeSolverConstraints3D(graph)).not.toThrow();
	expect(() => ear.layer.layer3D(graph)).not.toThrow();
});

test("clock panels, 6 pairs side by side ()()()()()() are valid", () => {
	const pairs = [
		[0, 1],
		[2, 3],
		[4, 5],
		[6, 7],
		[8, 9],
		[10, 11],
	];
	const graph = makeClockPanels(pairs);
	expect(ear.layer.getCrossingEdgePairs(graph, allEdgePairs(6))).toEqual([]);
	expect(() => ear.layer.layer3D(graph)).not.toThrow();
});

test("clock panels, nested and side by side (()(()))(()) are valid", () => {
	const pairs = [
		[0, 7],
		[1, 2],
		[3, 6],
		[4, 5],
		[8, 11],
		[9, 10],
	];
	const graph = makeClockPanels(pairs);
	expect(ear.layer.getCrossingEdgePairs(graph, allEdgePairs(6))).toEqual([]);
	expect(() => ear.layer.layer3D(graph)).not.toThrow();
});

test("clock panels, 6 straight sheets through the line, every pair crosses", () => {
	// [k, k + 6] is a flat sheet passing straight through the line,
	// every sheet crosses every other sheet: 15 crossing pairs.
	const pairs = [0, 1, 2, 3, 4, 5].map((k) => [k, k + 6]);
	const graph = makeClockPanels(pairs);
	expect(ear.layer.getCrossingEdgePairs(graph, allEdgePairs(6))).toEqual(allEdgePairs(6));
	expect(() => ear.layer.makeSolverConstraints3D(graph)).toThrow();
	expect(() => ear.layer.layer3D(graph)).toThrow();
});

test("clock panels, one crossing among nested pairs is found exactly", () => {
	// (( [ )) ] () : panel 0 spans 0..5, panel 1 spans 1..4 (nested inside 0),
	// panel 2 spans 3..8 and interleaves with both. panel 3 spans 9..10 and is
	// clear of everything.
	const pairs = [
		[0, 5],
		[1, 4],
		[3, 8],
		[9, 10],
	];
	const graph = makeClockPanels(pairs);
	expect(ear.layer.getCrossingEdgePairs(graph, allEdgePairs(4))).toEqual([
		[centralEdge(0), centralEdge(2)],
		[centralEdge(1), centralEdge(2)],
	]);
	expect(() => ear.layer.layer3D(graph)).toThrow();
});

test("clock panels, the order panels are listed in does not matter", () => {
	// the nested example, with the panels shuffled and each pair reversed
	const pairs = [
		[7, 4],
		[11, 0],
		[6, 5],
		[9, 2],
		[10, 1],
		[8, 3],
	];
	const graph = makeClockPanels(pairs);
	expect(ear.layer.getCrossingEdgePairs(graph, allEdgePairs(6))).toEqual([]);
	expect(() => ear.layer.layer3D(graph)).not.toThrow();
});
