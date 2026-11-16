import fs from "fs";
import { expect, test } from "vitest";
import ear from "../src/index.js";

const FRAMES = [
	{
		file: "layers-3d-edge-edge",
		frame: 0,
		contains: "1 bent-flat-tortilla",
		invalid: undefined,
		edgePairs: [[11, 14]],
		crossingEdgePairs: [],
		faceOverlaps: [[0, 4]],
		tJunctions: [],
		yJunctions: [],
		bentFlatTortillas: [[11, 14]],
		edgeEdgeOrders: [[0, 4, 1]],
		tacoTortillas: [],
		tortillaTortillas: [],
		edgeFace: [],
		edgeFaceOrders: [],
		foldOrders: [],
		tacoTortillas2D: [],
		tortillaTortillas2D: [],
	},
	{
		file: "layers-3d-edge-edge",
		frame: 1,
		contains: "1 T-junction, 1 2D tortilla-tortilla, 1 180 fold",
		invalid: undefined,
		edgePairs: [[13, 17], [14, 16]],
		crossingEdgePairs: [],
		faceOverlaps: [[1, 4], [2, 3]],
		tJunctions: [[13, 17]],
		yJunctions: [],
		bentFlatTortillas: [],
		edgeEdgeOrders: [[1, 4, 1]],
		tacoTortillas: [],
		tortillaTortillas: [],
		edgeFace: [],
		edgeFaceOrders: [],
		foldOrders: [[2, 3, 1]],
		tacoTortillas2D: [],
		tortillaTortillas2D: [[[1, 4], [2, 3], 1]],
	},
	{
		file: "layers-3d-edge-edge",
		frame: 2,
		contains: "1 Y-junction, 1 2D tortilla-tortilla, 1 180 fold",
		invalid: undefined,
		edgePairs: [[13, 17], [14, 16]],
		crossingEdgePairs: [],
		faceOverlaps: [[1, 4], [2, 3]],
		tJunctions: [],
		yJunctions: [[13, 17]],
		bentFlatTortillas: [],
		edgeEdgeOrders: [[1, 4, 1]],
		tacoTortillas: [],
		tortillaTortillas: [],
		edgeFace: [],
		edgeFaceOrders: [],
		foldOrders: [[2, 3, 1]],
		tacoTortillas2D: [],
		tortillaTortillas2D: [[[1, 4], [2, 3], 1]],
	},
	{
		file: "layers-3d-edge-edge",
		frame: 3,
		contains: "1 bent-tortillas, 1 2D tortilla-tortilla, 1 180 fold",
		invalid: undefined,
		edgePairs: [[13, 17], [14, 16]],
		crossingEdgePairs: [],
		faceOverlaps: [[0, 5], [1, 4], [2, 3]],
		tJunctions: [],
		yJunctions: [],
		bentFlatTortillas: [],
		edgeEdgeOrders: [],
		tacoTortillas: [],
		tortillaTortillas: [[[13, 17], [0, 5], [1, 4], 1]],
		edgeFace: [],
		edgeFaceOrders: [],
		foldOrders: [[2, 3, 1]],
		tacoTortillas2D: [],
		tortillaTortillas2D: [[[1, 4], [2, 3], 1]],
	},
	{
		file: "layers-3d-edge-edge",
		frame: 4,
		contains: "1 bent-tortilla-flat-taco, 1 2D tortilla-tortilla, 2 180 fold",
		invalid: undefined,
		edgePairs: [[13, 17], [14, 16]],
		crossingEdgePairs: [],
		faceOverlaps: [[0, 1], [0, 4], [1, 4], [2, 3]],
		tJunctions: [],
		yJunctions: [],
		bentFlatTortillas: [],
		edgeEdgeOrders: [],
		tacoTortillas: [[[13, 17], [0, 1], 4]],
		tortillaTortillas: [],
		edgeFace: [],
		edgeFaceOrders: [],
		foldOrders: [[0, 1, -1], [2, 3, 1]],
		tacoTortillas2D: [],
		tortillaTortillas2D: [[[1, 4], [2, 3], 1]],
	},
	{
		file: "layers-3d-edge-edge",
		frame: 5,
		contains: "1 T-junction, 1 bent-flat-tortilla, 2 2D tortilla-tortilla",
		invalid: undefined,
		edgePairs: [[23, 32], [24, 31], [25, 30], [26, 29]],
		crossingEdgePairs: [],
		faceOverlaps: [[1, 9], [2, 8], [3, 7]],
		tJunctions: [[23, 32]],
		yJunctions: [],
		bentFlatTortillas: [[26, 29]],
		edgeEdgeOrders: [[1, 9, -1], [3, 7, -1]],
		tacoTortillas: [],
		tortillaTortillas: [],
		edgeFace: [],
		edgeFaceOrders: [],
		foldOrders: [],
		tacoTortillas2D: [],
		tortillaTortillas2D: [[[1, 9], [2, 8], 1], [[2, 8], [3, 7], 1]],
	},
	{
		file: "layers-3d-edge-edge",
		frame: 6,
		contains: "1 Y-junction, 1 bent-tortillas, 2 2D taco-tortilla, 2 2D tortilla-tortilla, 3 180 fold, 1 taco-taco (2D, not checked)",
		invalid: undefined,
		edgePairs: [[25, 35], [26, 34], [27, 33], [28, 30], [28, 32], [29, 31], [30, 32]],
		crossingEdgePairs: [],
		faceOverlaps: [[1, 10], [2, 9], [3, 8], [4, 5], [4, 6], [4, 7], [5, 6], [5, 7], [6, 7]],
		tJunctions: [],
		yJunctions: [[25, 35]],
		bentFlatTortillas: [],
		edgeEdgeOrders: [[1, 10, -1]],
		tacoTortillas: [],
		tortillaTortillas: [[[27, 33], [2, 9], [3, 8], 1]],
		edgeFace: [],
		edgeFaceOrders: [],
		foldOrders: [[4, 5, 1], [5, 6, -1], [6, 7, -1]],
		tacoTortillas2D: [[[5, 6], 4], [[5, 6], 7]],
		tortillaTortillas2D: [[[1, 10], [2, 9], 1], [[3, 8], [4, 7], 1]],
	},
	{
		file: "layers-3d-edge-edge",
		frame: 7,
		contains: "2 bent-flat-tortilla",
		invalid: "conflicting",
		// two 3D edge pairs require opposite orders between faces 1 and 5
		edgePairs: [[15, 20], [16, 19]],
		crossingEdgePairs: [],
		faceOverlaps: [[1, 5]],
		tJunctions: [],
		yJunctions: [],
		bentFlatTortillas: [[15, 20], [16, 19]],
		edgeEdgeOrders: [[1, 5, -1], [1, 5, 1]],
		tacoTortillas: [],
		tortillaTortillas: [],
		edgeFace: [],
		edgeFaceOrders: [],
		foldOrders: [],
		tacoTortillas2D: [],
		tortillaTortillas2D: [],
	},
	{
		file: "layers-3d-edge-edge",
		frame: 8,
		contains: "two flat sheets crossing at a line",
		invalid: "crossing",
		// two straight sheets (faces 0-1, faces 3-4) pass through each other at a shared line, no faces are stacked
		edgePairs: [[11, 14]],
		crossingEdgePairs: [[11, 14]],
		faceOverlaps: [],
		tJunctions: [],
		yJunctions: [],
		bentFlatTortillas: [],
		edgeEdgeOrders: [],
		tacoTortillas: [],
		tortillaTortillas: [],
		edgeFace: [],
		edgeFaceOrders: [],
		foldOrders: [],
		tacoTortillas2D: [],
		tortillaTortillas2D: [],
	},
	{
		file: "layers-3d-edge-edge",
		frame: 9,
		contains: "1 T-junction, 1 2D tortilla-tortilla, 1 180 fold",
		invalid: "contradiction",
		// the 180 fold fixes faces 2-3, the tortilla-tortilla carries it to faces 1-4, contradicting the T-junction
		edgePairs: [[13, 17], [14, 16]],
		crossingEdgePairs: [],
		faceOverlaps: [[1, 4], [2, 3]],
		tJunctions: [[13, 17]],
		yJunctions: [],
		bentFlatTortillas: [],
		edgeEdgeOrders: [[1, 4, -1]],
		tacoTortillas: [],
		tortillaTortillas: [],
		edgeFace: [],
		edgeFaceOrders: [],
		foldOrders: [[2, 3, 1]],
		tacoTortillas2D: [],
		tortillaTortillas2D: [[[1, 4], [2, 3], 1]],
	},
	{
		file: "layers-3d-edge-edge",
		frame: 10,
		contains: "1 Y-junction, 1 2D tortilla-tortilla, 1 180 fold",
		invalid: "contradiction",
		// the 180 fold fixes faces 2-3, the tortilla-tortilla carries it to faces 1-4, contradicting the Y-junction
		edgePairs: [[13, 17], [14, 16]],
		crossingEdgePairs: [],
		faceOverlaps: [[1, 4], [2, 3]],
		tJunctions: [],
		yJunctions: [[13, 17]],
		bentFlatTortillas: [],
		edgeEdgeOrders: [[1, 4, -1]],
		tacoTortillas: [],
		tortillaTortillas: [],
		edgeFace: [],
		edgeFaceOrders: [],
		foldOrders: [[2, 3, 1]],
		tacoTortillas2D: [],
		tortillaTortillas2D: [[[1, 4], [2, 3], 1]],
	},
	{
		file: "layers-3d-edge-face",
		frame: 0,
		contains: "1 3D edge crossing a face, 3 180 fold, 1 taco-taco (2D, not checked)",
		invalid: undefined,
		edgePairs: [[4, 9]],
		crossingEdgePairs: [],
		faceOverlaps: [[1, 3], [1, 4], [1, 5], [3, 4], [3, 5], [4, 5]],
		tJunctions: [],
		yJunctions: [],
		bentFlatTortillas: [],
		edgeEdgeOrders: [],
		tacoTortillas: [],
		tortillaTortillas: [],
		edgeFace: [[6, 1, 3, 2]],
		edgeFaceOrders: [[1, 3, 1]],
		foldOrders: [[1, 5, -1], [3, 4, 1], [4, 5, 1]],
		tacoTortillas2D: [],
		tortillaTortillas2D: [],
	},
	{
		file: "layers-3d-edge-face",
		frame: 1,
		contains: "1 3D edge crossing a face, 3 180 fold, 1 taco-taco (2D, not checked)",
		invalid: undefined,
		edgePairs: [[4, 9]],
		crossingEdgePairs: [],
		faceOverlaps: [[1, 3], [1, 4], [1, 5], [3, 4], [3, 5], [4, 5]],
		tJunctions: [],
		yJunctions: [],
		bentFlatTortillas: [],
		edgeEdgeOrders: [],
		tacoTortillas: [],
		tortillaTortillas: [],
		edgeFace: [[6, 1, 3, 2]],
		edgeFaceOrders: [[1, 3, 1]],
		foldOrders: [[1, 5, -1], [3, 4, 1], [4, 5, 1]],
		tacoTortillas2D: [],
		tortillaTortillas2D: [],
	},
	{
		file: "layers-3d-edge-face",
		frame: 2,
		contains: "1 bent-flat-tortilla, 3 180 fold, 1 taco-taco (2D, not checked)",
		invalid: undefined,
		edgePairs: [[4, 9], [6, 10]],
		crossingEdgePairs: [],
		faceOverlaps: [[2, 4], [2, 5], [2, 6], [4, 5], [4, 6], [5, 6]],
		tJunctions: [],
		yJunctions: [],
		bentFlatTortillas: [[6, 10]],
		edgeEdgeOrders: [[2, 4, 1]],
		tacoTortillas: [],
		tortillaTortillas: [],
		edgeFace: [],
		edgeFaceOrders: [],
		foldOrders: [[2, 6, -1], [4, 5, 1], [5, 6, 1]],
		tacoTortillas2D: [],
		tortillaTortillas2D: [],
	},
	{
		file: "layers-3d-edge-face",
		frame: 3,
		contains: "1 3D edge crossing a face",
		invalid: undefined,
		edgePairs: [],
		crossingEdgePairs: [],
		faceOverlaps: [[0, 3]],
		tJunctions: [],
		yJunctions: [],
		bentFlatTortillas: [],
		edgeEdgeOrders: [],
		tacoTortillas: [],
		tortillaTortillas: [],
		edgeFace: [[11, 0, 3, 2]],
		edgeFaceOrders: [[0, 3, 1]],
		foldOrders: [],
		tacoTortillas2D: [],
		tortillaTortillas2D: [],
	},
	{
		file: "layers-3d-edge-face",
		frame: 4,
		contains: "1 3D edge crossing a face",
		invalid: undefined,
		edgePairs: [],
		crossingEdgePairs: [],
		faceOverlaps: [[0, 3]],
		tJunctions: [],
		yJunctions: [],
		bentFlatTortillas: [],
		edgeEdgeOrders: [],
		tacoTortillas: [],
		tortillaTortillas: [],
		edgeFace: [[11, 0, 3, 2]],
		edgeFaceOrders: [[0, 3, 1]],
		foldOrders: [],
		tacoTortillas2D: [],
		tortillaTortillas2D: [],
	},
	{
		file: "layers-3d-edge-face",
		frame: 5,
		contains: "1 3D edge crossing a face",
		invalid: undefined,
		edgePairs: [],
		crossingEdgePairs: [],
		faceOverlaps: [[0, 3]],
		tJunctions: [],
		yJunctions: [],
		bentFlatTortillas: [],
		edgeEdgeOrders: [],
		tacoTortillas: [],
		tortillaTortillas: [],
		edgeFace: [[11, 0, 3, 2]],
		edgeFaceOrders: [[0, 3, 1]],
		foldOrders: [],
		tacoTortillas2D: [],
		tortillaTortillas2D: [],
	},
	{
		file: "disjoint-triangles-3d",
		frame: 0,
		contains: "1 T-junction, 2 bent-tortillas, 1 3D edge crossing a face, 2 2D tortilla-tortilla",
		invalid: undefined,
		edgePairs: [[2, 12], [3, 13], [8, 19], [9, 18], [24, 29]],
		crossingEdgePairs: [],
		faceOverlaps: [[0, 5], [1, 4], [2, 7], [3, 6], [8, 11], [9, 12]],
		tJunctions: [[24, 29]],
		yJunctions: [],
		bentFlatTortillas: [],
		edgeEdgeOrders: [[8, 11, -1]],
		tacoTortillas: [],
		tortillaTortillas: [[[2, 12], [0, 5], [2, 7], 1], [[3, 13], [1, 4], [3, 6], 1]],
		edgeFace: [[34, 9, 12, 13]],
		edgeFaceOrders: [[9, 12, -1]],
		foldOrders: [],
		tacoTortillas2D: [],
		tortillaTortillas2D: [[[0, 5], [1, 4], 1], [[2, 7], [3, 6], 1]],
	},
	{
		file: "disjoint-triangles-3d",
		frame: 1,
		contains: "no overlapping faces, nothing to solve",
		invalid: undefined,
		edgePairs: [],
		crossingEdgePairs: [],
		faceOverlaps: [],
		tJunctions: [],
		yJunctions: [],
		bentFlatTortillas: [],
		edgeEdgeOrders: [],
		tacoTortillas: [],
		tortillaTortillas: [],
		edgeFace: [],
		edgeFaceOrders: [],
		foldOrders: [],
		tacoTortillas2D: [],
		tortillaTortillas2D: [],
	},
];

const sign = (n) => (n > 0) - (n < 0);
const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

// sort arrays (of arrays) lexicographically, so lists can be compared as sets
const compare = (a, b) => {
	if (!Array.isArray(a)) {
		return a - b;
	}
	for (let i = 0; i < Math.min(a.length, b.length); i += 1) {
		const c = compare(a[i], b[i]);
		if (c !== 0) {
			return c;
		}
	}
	return a.length - b.length;
};
const sorted = (array) => array.slice().sort(compare);
const sortedPair = ([a, b]) => (a < b ? [a, b] : [b, a]);
const strings = (array) => array.map((el) => JSON.stringify(el));

/**
 * @description load the frame. frames which are not a "foldedForm"
 * are crease patterns, fold them. remove any pre-existing faceOrders.
 */
const loadFrame = ({ file, frame }) => {
	const fold = JSON.parse(fs.readFileSync(`./tests/files/fold/${file}.fold`, "utf-8"));
	const { faceOrders: _, ...graph } = ear.graph.flattenFrame(fold, frame);
	const isFolded = (graph.frame_classes || graph.file_classes || []).includes("foldedForm");
	const folded = isFolded
		? graph
		: { ...graph, vertices_coords: ear.graph.makeVerticesCoordsFolded(graph) };
	ear.graph.populate(folded);
	return folded;
};

const cache = new Map();
const context = (entry) => {
	const key = `${entry.file} ${entry.frame}`;
	if (cache.has(key)) {
		return cache.get(key);
	}
	const graph = loadFrame(entry);
	const normals = ear.graph.makeFacesNormal(graph);
	const clusterInfo = ear.layer.constraints3DFaceClusters(graph);
	const { faces_winding } = clusterInfo;

	// rewrite a FOLD faceOrder [a, b, s] so that a < b
	const canonical = ([a, b, s]) =>
		a < b ? [a, b, s] : [b, a, -s * sign(dot3(normals[a], normals[b]))];

	// convert solver orders ("a b": 1 or 2) into canonical FOLD faceOrders
	const toFaceOrders = (orders) =>
		sorted(ear.layer.solverOrdersToFaceOrders(orders, faces_winding).map(canonical));

	// solver tortilla-tortilla [A, B, X, Y] (the solver's "A above X" equals
	// its "B above Y", relative to each plane's normal) as [[a, b], [c, d], k]
	const toTortillaTortilla = ([A, B, X, Y]) => {
		const winding = (f) => (faces_winding[f] ? 1 : -1);
		const p = canonical([A, X, 1]);
		const q = canonical([B, Y, 1]);
		const [P, Q] = sorted([p.slice(0, 2), q.slice(0, 2)]);
		return [P, Q, winding(X) * winding(Y) * p[2] * q[2]];
	};

	// solver taco-tortilla [taco, tortilla, taco] as [[taco, taco], tortilla]
	const toTacoTortilla = ([a, t, b]) => [sortedPair([a, b]), t];

	// all pairs of collinear overlapping edges, only edges with two faces
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

	const result = {
		graph,
		normals,
		clusterInfo,
		canonical,
		toFaceOrders,
		toTortillaTortilla,
		toTacoTortilla,
		edgePairs,
	};
	cache.set(key, result);
	return result;
};

const name = "$file frame $frame: $contains";

test.each(FRAMES)(`collinear overlapping edge pairs, ${name}`, (entry) => {
	expect(sorted(context(entry).edgePairs)).toEqual(entry.edgePairs);
});

test.each(FRAMES)(`edge pairs where the paper crosses itself, ${name}`, (entry) => {
	const { graph, edgePairs } = context(entry);
	expect(sorted(ear.layer.getCrossingEdgePairs(graph, edgePairs))).toEqual(
		entry.crossingEdgePairs,
	);
});

test.each(FRAMES)(`coplanar overlapping faces, ${name}`, (entry) => {
	const { clusterInfo } = context(entry);
	const pairs = clusterInfo.facesFacesOverlap.flatMap((faces, a) =>
		faces.filter((b) => a < b).map((b) => [a, b]),
	);
	expect(sorted(pairs)).toEqual(entry.faceOverlaps);
});

test.each(FRAMES)(`edge pair classification, ${name}`, (entry) => {
	const { graph, clusterInfo, edgePairs } = context(entry);
	const classes = ear.layer.getSolvable3DEdgePairs({
		edges_faces: graph.edges_faces,
		faces_plane: clusterInfo.faces_plane,
		edgePairs,
		facesFacesLookup: ear.general.arrayArrayToLookupArray(clusterInfo.facesFacesOverlap),
	});
	const pairsOf = (key) => sorted(classes[key].map((i) => edgePairs[i]));
	expect(pairsOf("tJunctions")).toEqual(entry.tJunctions);
	expect(pairsOf("yJunctions")).toEqual(entry.yJunctions);
	expect(pairsOf("bentFlatTortillas")).toEqual(entry.bentFlatTortillas);
	expect(pairsOf("bentTortillas")).toEqual(sorted(entry.tortillaTortillas.map(([e]) => e)));
	expect(pairsOf("bentTortillasFlatTaco")).toEqual(
		sorted(entry.tacoTortillas.map(([e]) => e)),
	);
});

test.each(FRAMES)(`3D edges crossing the interior of a face, ${name}`, (entry) => {
	const { graph, clusterInfo, toFaceOrders } = context(entry);
	const overlaps = ear.layer.getOverlapFacesWith3DEdge(graph, clusterInfo);
	expect(
		sorted(overlaps.map(({ edge, tortilla, coplanar, angled }) => [edge, tortilla, coplanar, angled])),
	).toEqual(entry.edgeFace);
	const orders = ear.layer.solveOverlapFacesWith3DEdge(
		graph,
		overlaps,
		clusterInfo.faces_winding,
	);
	expect(toFaceOrders(orders)).toEqual(entry.edgeFaceOrders);
});

test.each(FRAMES)(`constraints3DEdges, ${name}`, (entry) => {
	const { graph, clusterInfo, toFaceOrders, toTacoTortilla, toTortillaTortilla } =
		context(entry);
	if (entry.invalid === "conflicting" || entry.invalid === "crossing") {
		expect(() => ear.layer.constraints3DEdges(graph, clusterInfo)).toThrow();
		return;
	}
	const { orders, taco_tortilla, tortilla_tortilla } = ear.layer.constraints3DEdges(
		graph,
		clusterInfo,
	);
	expect(toFaceOrders(orders)).toEqual(entry.edgeEdgeOrders);
	expect(sorted(taco_tortilla.map(toTacoTortilla))).toEqual(
		sorted(entry.tacoTortillas.map(([, taco, tortilla]) => [taco, tortilla])),
	);
	expect(sorted(tortilla_tortilla.map(toTortillaTortilla))).toEqual(
		sorted(entry.tortillaTortillas.map(([, P, Q, k]) => [P, Q, k])),
	);
});

test.each(FRAMES)(`makeSolverConstraints3D keeps everything, ${name}`, (entry) => {
	const { graph, toFaceOrders, toTacoTortilla, toTortillaTortilla } = context(entry);
	if (entry.invalid === "conflicting" || entry.invalid === "crossing") {
		expect(() => ear.layer.makeSolverConstraints3D(graph)).toThrow();
		return;
	}
	const { orders, constraints } = ear.layer.makeSolverConstraints3D(graph);
	const faceOrders = strings(toFaceOrders(orders));
	strings([...entry.edgeEdgeOrders, ...entry.edgeFaceOrders, ...entry.foldOrders]).forEach(
		(order) => expect(faceOrders).toContain(order),
	);
	const tacoTortillas = strings(constraints.taco_tortilla.map(toTacoTortilla));
	strings([
		...entry.tacoTortillas.map(([, taco, tortilla]) => [taco, tortilla]),
		...entry.tacoTortillas2D,
	]).forEach((c) => expect(tacoTortillas).toContain(c));
	const tortillaTortillas = strings(constraints.tortilla_tortilla.map(toTortillaTortilla));
	strings([
		...entry.tortillaTortillas.map(([, P, Q, k]) => [P, Q, k]),
		...entry.tortillaTortillas2D,
	]).forEach((c) => expect(tortillaTortillas).toContain(c));
});

test.each(FRAMES)(
	`layer3D, every solution satisfies everything (or no solution if invalid), ${name}`,
	(entry) => {
		const { graph, normals, canonical } = context(entry);
		if (entry.invalid) {
			expect(() => ear.layer.layer3D(graph)).toThrow();
			return;
		}
		const solution = ear.layer.layer3D(graph);
		// every branch is an independent choice, visit every combination
		const choices = (solution.branches || []).map((branch) => branch.length);
		const patterns = choices.reduce(
			(acc, n) => acc.flatMap((p) => Array.from({ length: n }, (_, i) => [...p, i])),
			[[]],
		);
		patterns.forEach((pattern) => {
			const lookup = {};
			solution
				.faceOrders(...pattern)
				.map(canonical)
				.forEach(([a, b, s]) => {
					lookup[`${a} ${b}`] = s;
				});
			// a is on side s of b, along b's normal
			const side = (a, b) =>
				a < b
					? lookup[`${a} ${b}`]
					: -lookup[`${b} ${a}`] * sign(dot3(normals[a], normals[b]));
			[...entry.edgeEdgeOrders, ...entry.edgeFaceOrders, ...entry.foldOrders].forEach(
				([a, b, s]) => expect([pattern, a, b, side(a, b)]).toEqual([pattern, a, b, s]),
			);
			// the tortilla is not between the taco faces
			[
				...entry.tacoTortillas.map(([, taco, tortilla]) => [taco, tortilla]),
				...entry.tacoTortillas2D,
			].forEach(([[t1, t2], tortilla]) =>
				expect([pattern, tortilla, side(t1, tortilla)]).toEqual([
					pattern,
					tortilla,
					side(t2, tortilla),
				]),
			);
			[
				...entry.tortillaTortillas.map(([, P, Q, k]) => [P, Q, k]),
				...entry.tortillaTortillas2D,
			].forEach(([[a, b], [c, d], k]) =>
				expect([pattern, a, b, side(a, b)]).toEqual([pattern, a, b, k * side(c, d)]),
			);
		});
	},
);
