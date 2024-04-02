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
