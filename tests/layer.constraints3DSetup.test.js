import fs from "fs";
import { expect, test } from "vitest";
import ear from "../rabbit-ear.js";

test("constraints3DSetup, all 3D special cases", () => {
	const foldfile = fs.readFileSync("./tests/files/fold/layer3d-cases.fold", "utf-8");
	const fold = JSON.parse(foldfile);
	const frames = ear.graph.getFileFramesAsArray(fold);
	const foldedForms = frames.map(frame => ({
		...frame,
		vertices_coords: ear.graph.makeVerticesCoordsFolded(frame),
	}));
	foldedForms.forEach(folded => ear.graph.populate(folded));

	const results = foldedForms.map(graph => ear.layer.constraints3DSetup(graph));

	// one flat tortilla-tortilla on top of a bent tortilla-tortilla
	// this solves faces 0-4
	expect(results[0]).toMatchObject({
		faces_winding: [true, true, true, true, false],
		facesFacesOverlap: [[4], [], [], [], [0]],
		bentTortillaTortillas: [],
		facePairs: ["0 4"],
		orders: { "0 4": 1 },
	});

	// a T-junction where the top T faces are coplanar
	// this solves faces 1-4
	expect(results[1]).toMatchObject({
		faces_winding: [true, true, true, false, false, true],
		facesFacesOverlap: [[], [4], [3], [2], [1], []],
		bentTortillaTortillas: [],
		facePairs: ["1 4", "2 3"],
		orders: { "1 4": 2 },
	});

	// an Y-junction where the top two faces are not coplanar
	// this solves faces 1-4
	expect(results[2]).toMatchObject({
		faces_winding: [true, true, true, false, false, true],
		facesFacesOverlap: [[], [4], [3], [2], [1], []],
		bentTortillaTortillas: [],
		facePairs: ["1 4", "2 3"],
		orders: { "1 4": 2 },
	});

	// a bent-tortilla-tortilla (next to a flat tortilla-tortilla)
	// no orders are solved, but bentTortillaTortillas condition is generated.
	expect(results[3]).toMatchObject({
		faces_winding: [true, true, true, false, false, false],
		facesFacesOverlap: [[5], [4], [3], [2], [1], [0]],
		bentTortillaTortillas: [[0, 1, 5, 4]],
		facePairs: ["0 5", "1 4", "2 3"],
		orders: {},
	});

	// contains two: an bent-tortilla-tortilla and a T-junction.
	expect(results[4]).toMatchObject({
		faces_winding: [
			true, true, true, true, true, true, true, false, false, false, true,
		],
		facesFacesOverlap: [
			[], [9], [8], [7], [], [], [], [3], [2], [1], [],
		],
		bentTortillaTortillas: [],
		facePairs: ["1 9", "2 8", "3 7"],
		orders: { "1 9": 1 },
	});

	// contains two: a bent-flat-tortilla and an Y-junction
	expect(results[5]).toMatchObject({
		faces_winding: [
			true, true, true, true, true, false, true, false, false, false, false, true
		],
		facesFacesOverlap: [
			[], [10], [9], [8], [5, 6, 7], [4, 6, 7], [4, 5, 7], [4, 5, 6], [3], [2], [1], []
		],
		bentTortillaTortillas: [[2, 3, 9, 8]],
		facePairs: ["1 10", "2 9", "3 8", "4 5", "4 6", "4 7", "5 6", "5 7", "6 7"],
		orders: { "1 10": 1 },
	});
});

// test("makeSolverConstraints 3D", () => {
// 	const foldfile = fs.readFileSync("./tests/files/fold/coplanar-angles-3d.fold", "utf-8");
// 	const fold = JSON.parse(foldfile);
// 	const folded = {
// 		...fold,
// 		vertices_coords: ear.graph.makeVerticesCoordsFolded(fold),
// 	};
// 	ear.graph.populate(folded);

// 	const {
// 		clusters_graph,
// 		faces_winding,
// 		faces_polygon,
// 		facesFacesOverlap,
// 		bentTortillaTortillas,
// 		facePairs,
// 		orders,
// 	} = ear.layer.constraints3DSetup(folded);

// 	expect(facesFacesOverlap).toMatchObject([
// 		[], [3, 4, 5], [], [1, 4, 5], [1, 3, 5], [1, 3, 4],
// 	]);
// 	expect(bentTortillaTortillas).toMatchObject([]);
// 	expect(facePairs).toMatchObject(["1 3", "1 4", "1 5", "3 4", "3 5", "4 5"]);
// 	expect(orders).toMatchObject({});
// });

const constraints3DExpandedInterior = ({
	vertices_coords, edges_vertices, edges_faces, edges_assignment, edges_foldAngle,
	faces_vertices, faces_edges, faces_faces,
}) => {
	const epsilon = 1e-6;
	const {
		faces_cluster,
		faces_winding,
		faces_polygon,
		faces_center,
		clusters_faces,
		clusters_graph,
		clusters_transform,
		facesFacesOverlap,
		facePairs,
	} = ear.layer.constraints3DFaceClusters({
		vertices_coords,
		edges_vertices,
		edges_faces,
		edges_assignment,
		edges_foldAngle,
		faces_vertices,
		faces_edges,
		faces_faces,
	}, epsilon);

	const {
		pairs_data,
		edges_clusters,
	} = ear.layer.constraints3DEdgeClusters({
		vertices_coords,
		edges_vertices,
		edges_faces,
		edges_foldAngle,
	}, {
		faces_center,
		faces_cluster,
		clusters_transform,
	}, epsilon);

	const {
		YJunctions,
		TJunctions,
		bentFlatTortillas,
		bentTortillaTortillaEdges,
	} = ear.layer.constraints3DSolverCases({ edges_faces, pairs_data });

	return {
		faces_winding,
		faces_polygon,
		facePairs,
		facesFacesOverlap,
		clusters_faces,
		pairs_data,
		edges_clusters,
		YJunctions,
		TJunctions,
		bentFlatTortillas,
		bentTortillaTortillaEdges,
	};
};

test("makeSolverConstraints 3D", () => {
	const foldfile = fs.readFileSync("./tests/files/fold/coplanar-angles-3d.fold", "utf-8");
	const fold = JSON.parse(foldfile);
	const folded = {
		...fold,
		vertices_coords: ear.graph.makeVerticesCoordsFolded(fold),
	};
	ear.graph.populate(folded);

	const {
		facePairs,
		facesFacesOverlap,
		pairs_data,
		edges_clusters,
	} = constraints3DExpandedInterior(folded);

	expect(facePairs).toMatchObject(["1 3", "1 4", "1 5", "3 4", "3 5", "4 5"]);
	expect(facesFacesOverlap).toMatchObject([
		[], [3, 4, 5], [], [1, 4, 5], [1, 3, 5], [1, 3, 4],
	]);

	expect(pairs_data).toMatchObject([]);
	expect(edges_clusters).toMatchObject([
		,,,,,, [2, 1], [0, 1], [0, 2],,,,,,,
	]);

	// console.log("pairs_data", pairs_data);
	// console.log("edges_clusters", edges_clusters);
});

test("all 3d cases", () => {
	const foldfile = fs.readFileSync("./tests/files/fold/layer3d-cases.fold", "utf-8");
	const fold = JSON.parse(foldfile);
	const frames = ear.graph.getFileFramesAsArray(fold);
	const foldedForms = frames.map(frame => ({
		...frame,
		vertices_coords: ear.graph.makeVerticesCoordsFolded(frame),
	}));
	foldedForms.forEach(folded => ear.graph.populate(folded));

	const results = foldedForms.map(graph => constraints3DExpandedInterior(graph));

	// console.log(results[0]);

	expect(results[0]).toMatchObject({
		faces_winding: [true, true, true, true, false],
		facesFacesOverlap: [[4], [], [], [], [0]],
		facePairs: ["0 4"],
		edges_clusters: [,,,,,,,,,,,, [0, 1], [1, 2], [2, 0],,],
		clusters_faces: [[0, 1, 4], [2], [3]],
	});
});
