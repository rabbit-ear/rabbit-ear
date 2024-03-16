import { expect, test } from "vitest";
import fs from "fs";
import ear from "../rabbit-ear.js";

// test("write folded vertices", () => {
// const foldfile = fs.readFileSync("./tests/files/fold/windmill-face-cycle.fold", "utf-8");
// 	const fold = JSON.parse(foldfile);
// 	const folded = ear.graph.makeVerticesCoordsFlatFolded(fold, [6]);
// 	fs.writeFileSync(
// 		`./tests/tmp/folded-vertices.json`,
// 		JSON.stringify(folded.map(p => p.map(n => ear.general.cleanNumber(n, 12))), null, 2),
// 	);
// });

test("write layer solution to file", () => {
	const foldfile = fs.readFileSync("./tests/files/fold/kabuto.fold", "utf-8");
	const fold = JSON.parse(foldfile);
	const folded = ear.graph.getFramesByClassName(fold, "foldedForm")[0];
	const solution = ear.layer(folded);
	fs.writeFileSync(
		`./tests/tmp/layer-solution.json`,
		JSON.stringify(solution, null, 2),
	);

	// delete
	// fs.writeFileSync(
	// 	`./tests/tmp/layer-structure.json`,
	// 	JSON.stringify(solution.structure(), null, 2),
	// );
});

// test("layer panels 4x2", () => {
// 	const foldfile = fs.readFileSync("./tests/files/fold/panels-4x2.fold", "utf-8");
// 	const fold = JSON.parse(foldfile);
// 	const folded = ear.graph.getFramesByClassName(fold, "foldedForm")[0];
// 	const {
// 		root,
// 		branches,
// 	} = ear.layer(folded);

// 	expect(root).toMatchObject({
// 		"0 1": 2,
// 		"4 5": 2,
// 		"1 2": 1,
// 		"5 6": 1,
// 		"2 3": 1,
// 		"6 7": 1,
// 		"1 3": 1,
// 		"5 7": 1,
// 	});

// 	// only one branch
// 	// the one branch has two solutions
// 	expect(branches).toMatchObject([[
// 		{ "0 3": 1, "4 6": 1, "4 7": 1, "0 2": 1 },
// 		{ "0 3": 2, "4 6": 2, "4 7": 2, "0 2": 2 },
// 	]]);
// });

// test("layer strip weave", () => {
// 	const foldfile = fs.readFileSync("./tests/files/fold/strip-weave.fold", "utf-8");
// 	const fold = JSON.parse(foldfile);
// 	const folded = ear.graph.getFramesByClassName(fold, "foldedForm")[0];
// 	const {
// 		root,
// 		branches,
// 	} = ear.layer(folded);

// 	// these are all adjacent faces
// 	// the first call to propagate() resulted in nothing
// 	expect(root).toMatchObject({
// 		"0 1": 2,
// 		"4 5": 1,
// 		"1 2": 1,
// 		"2 3": 2,
// 		"5 6": 2,
// 	});

// 	// three branches, only one pair in each
// 	expect(branches).toMatchObject([
// 		[{ "1 4": 1 }, { "1 4": 2 }],
// 		[{ "2 5": 1 }, { "2 5": 2 }],
// 		[{ "3 6": 1 }, { "3 6": 2 }],
// 	]);
// });

// test("layer panels 5", () => {
// 	const foldfile = fs.readFileSync("./tests/files/fold/panels-5.fold", "utf-8");
// 	const fold = JSON.parse(foldfile);
// 	const folded = ear.graph.getFramesByClassName(fold, "foldedForm")[0];
// 	const {
// 		root,
// 		branches,
// 	} = ear.layer(folded);

// 	expect(root).toMatchObject({
// 		"3 4": 1,
// 		"2 3": 1,
// 		"1 2": 1,
// 		"0 1": 2,
// 		"1 4": 1,
// 		"1 3": 1,
// 		"2 4": 1,
// 	});

// 	// only one branch
// 	// the one branch has three solutions
// 	expect(branches).toMatchObject([[
// 		{ "0 3": 1, "0 4": 1, "0 2": 1 },
// 		{ "0 3": 2, "0 2": 2, "0 4": 1 },
// 		{ "0 3": 2, "0 2": 2, "0 4": 2 },
// 	]]);
// });

// test("layer windmill faces with a cycle", () => {
// 	const foldfile = fs.readFileSync("./tests/files/fold/windmill-face-cycle.fold", "utf-8");
// 	const fold = JSON.parse(foldfile);
// 	const folded = ear.graph.getFramesByClassName(fold, "foldedForm")[0];
// 	const {
// 		root,
// 		branches,
// 	} = ear.layer(folded);

// 	expect(root).toMatchObject({
// 		"0 1": 1, "7 8": 1, "4 6": 1, "0 6": 1, "5 7": 1, "0 2": 2, "1 4": 1,
// 		"4 5": 1, "2 3": 2, "3 6": 1, "6 7": 2, "3 8": 2, "0 4": 1, "3 7": 2,
// 		"1 6": 1, "4 7": 1, "2 6": 1, "0 3": 2, "5 6": 1, "6 8": 2,
// 	});

// 	expect(branches).toMatchObject([]);
// });

// test("layer panels zig-zag", () => {
// 	const foldfile = fs.readFileSync("./tests/files/fold/panels-zig-zag.fold", "utf-8");
// 	const fold = JSON.parse(foldfile);
// 	const folded = ear.graph.getFramesByClassName(fold, "foldedForm")[0];
// 	const {
// 		root,
// 		branches,
// 	} = ear.layer(folded);

// 	expect(root).toMatchObject({
// 		"0 4": 2,
// 		"3 4": 1,
// 		"2 3": 1,
// 		"1 2": 1,
// 		"2 4": 1,
// 		"1 4": 1,
// 		"0 1": 2,
// 		"0 3": 2,
// 		"1 3": 1,
// 		"0 2": 2,
// 	});
// 	expect(branches).toMatchObject([]);
// });

// test("layer four flaps", () => {
// 	const foldfile = fs.readFileSync("./tests/files/fold/layer-4-flaps.fold", "utf-8");
// 	const fold = JSON.parse(foldfile);
// 	const folded = ear.graph.getFramesByClassName(fold, "foldedForm")[0];
// 	const {
// 		root,
// 		branches,
// 	} = ear.layer(folded);

// 	expect(root).toMatchObject({
// 		"0 1": 2,
// 		"1 2": 1,
// 		"1 3": 1,
// 		"1 4": 1,
// 	});

// 	// four branches, each branch has 2 solutions
// 	expect(branches.length).toBe(4);
// 	expect(branches).toMatchObject([
// 		[{ "0 3": 1 }, { "0 3": 2 }],
// 		[{ "0 4": 1 }, { "0 4": 2 }],
// 		[{ "2 3": 1 }, { "2 3": 2 }],
// 		[{ "2 4": 1 }, { "2 4": 2 }],
// 	]);
// });

// test("layer crane", () => {
// 	const foldfile = fs.readFileSync("./tests/files/fold/crane.fold", "utf-8");
// 	const fold = JSON.parse(foldfile);
// 	const folded = ear.graph.getFramesByClassName(fold, "foldedForm")[0];
// 	const {
// 		root,
// 		branches,
// 	} = ear.layer(folded);

// 	const solutionJSON = fs.readFileSync(
// 		"./tests/files/json/crane-layer-solver.json",
// 		"utf-8"
// 	);
// 	const solution = JSON.parse(solutionJSON);
// 	expect(root).toMatchObject(solution.root);
// 	expect(branches).toMatchObject(solution.branches);
// });

// test("layer Kabuto", () => {
// 	const foldfile = fs.readFileSync("./tests/files/fold/kabuto.fold", "utf-8");
// 	const fold = JSON.parse(foldfile);
// 	const folded = ear.graph.getFramesByClassName(fold, "foldedForm")[0];
// 	const {
// 		root,
// 		branches,
// 	} = ear.layer(folded);

// 	const solutionJSON = fs.readFileSync(
// 		"./tests/files/json/kabuto-layer-solver.json",
// 		"utf-8"
// 	);
// 	const solution = JSON.parse(solutionJSON);
// 	expect(root).toMatchObject(solution.root);
// 	expect(branches).toMatchObject(solution.branches);
// });
