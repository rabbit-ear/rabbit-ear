import { expect, test } from "vitest";
import fs from "fs";
import ear from "../rabbit-ear.js";

// test("write file", () => {
// 	const foldfile = fs.readFileSync("./tests/files/fold/kabuto.fold", "utf-8");
// 	// const foldfile = fs.readFileSync("./tests/files/fold/panels-4x2.fold", "utf-8");
// 	const fold = JSON.parse(foldfile);
// 	const folded = ear.graph.getFramesByClassName(fold, "foldedForm")[0];
// 	const solution = ear.layer(folded);
// 	fs.writeFileSync(
// 		`./tests/tmp/layer-solution.json`,
// 		JSON.stringify(solution, null, 2),
// 	);
// });

test("layer panels 4x2", () => {
	const foldfile = fs.readFileSync("./tests/files/fold/panels-4x2.fold", "utf-8");
	const fold = JSON.parse(foldfile);
	const folded = ear.graph.getFramesByClassName(fold, "foldedForm")[0];
	const {
		root,
		branches,
	} = ear.layer(folded);

	expect(root).toMatchObject({
		"0 1": 2,
		"4 5": 2,
		"1 2": 1,
		"5 6": 1,
		"2 3": 1,
		"6 7": 1,
		"1 3": 1,
		"5 7": 1,
	});

	// only one branch
	// the one branch has two solutions
	expect(branches).toMatchObject([[
		{ "0 3": 1, "4 6": 1, "4 7": 1, "0 2": 1 },
		{ "0 3": 2, "4 6": 2, "4 7": 2, "0 2": 2 },
	]]);
});

test("layer panels 5", () => {
	const foldfile = fs.readFileSync("./tests/files/fold/panels-5.fold", "utf-8");
	const fold = JSON.parse(foldfile);
	const folded = ear.graph.getFramesByClassName(fold, "foldedForm")[0];
	const {
		root,
		branches,
	} = ear.layer(folded);

	expect(root).toMatchObject({
		"0 4": 2,
		"3 4": 1,
		"2 3": 1,
		"1 2": 1,
		"2 4": 1,
		"1 4": 1,
		"0 1": 2,
		"0 3": 2,
		"1 3": 1,
		"0 2": 2,
	});
	expect(branches).toMatchObject([]);
});

test("layer four flaps", () => {
	const foldfile = fs.readFileSync("./tests/files/fold/layer-4-flaps.fold", "utf-8");
	const fold = JSON.parse(foldfile);
	const folded = ear.graph.getFramesByClassName(fold, "foldedForm")[0];
	const {
		root,
		branches,
	} = ear.layer(folded);

	expect(root).toMatchObject({
		"0 1": 2,
		"1 2": 1,
		"1 3": 1,
		"1 4": 1,
	});

	// four branches, each branch has 2 solutions
	expect(branches.length).toBe(4);
	expect(branches).toMatchObject([
		[{"0 3": 1}, {"0 3": 2}],
		[{"0 4": 1}, {"0 4": 2}],
		[{"2 3": 1}, {"2 3": 2}],
		[{"2 4": 1}, {"2 4": 2}],
	]);
});

test("layer Kabuto", () => {
	const foldfile = fs.readFileSync("./tests/files/fold/kabuto.fold", "utf-8");
	const fold = JSON.parse(foldfile);
	const folded = ear.graph.getFramesByClassName(fold, "foldedForm")[0];
	const {
		root,
		branches,
	} = ear.layer(folded);

	const solutionJSON = fs.readFileSync(
		"./tests/files/json/kabuto-layer-solver.json",
		"utf-8"
	);
	const solution = JSON.parse(solutionJSON);
	expect(root).toMatchObject(solution.root);
	expect(branches).toMatchObject(solution.branches);
});
