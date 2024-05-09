import { expect, test } from "vitest";
import fs from "fs";
import ear from "../src/index.js";

test("fixCycles, windmill", () => {
	const FOLD = fs.readFileSync("./tests/files/fold/windmill.fold", "utf-8");
	const fold = JSON.parse(FOLD);
	const folded = ear.graph.getFramesByClassName(fold, "foldedForm")[0];
	const result = ear.graph.fixCycles(folded);

	fs.writeFileSync("./tests/tmp/fixCycles-windmill.fold", JSON.stringify(result));
});

test("fixCycles, cycle with non convex face in the center", () => {
	const FOLD = fs.readFileSync("./tests/files/fold/layers-cycle-nonconvex.fold", "utf-8");
	const fold = JSON.parse(FOLD);
	const folded = ear.graph.getFramesByClassName(fold, "foldedForm")[0];
	const result = ear.graph.fixCycles(folded);

	fs.writeFileSync("./tests/tmp/fixCycles-nonconvex.fold", JSON.stringify(result));
});

test("fixCycles, no cycles, crane", () => {
	const FOLD = fs.readFileSync("./tests/files/fold/crane.fold", "utf-8");
	const fold = JSON.parse(FOLD);
	const folded = ear.graph.getFramesByClassName(fold, "foldedForm")[0];
	const result = ear.graph.fixCycles(folded);

	fs.writeFileSync("./tests/tmp/fixCycles-crane.fold", JSON.stringify(result));
});

test("fixCycles, no cycles, kraft-bird", () => {
	const FOLD = fs.readFileSync("./tests/files/fold/kraft-bird-base.fold", "utf-8");
	const fold = JSON.parse(FOLD);
	const folded = {
		...fold,
		vertices_coords: ear.graph.makeVerticesCoordsFlatFolded(fold),
	};
	const result = ear.graph.fixCycles(folded);

	fs.writeFileSync("./tests/tmp/fixCycles-kraft-bird-base.fold", JSON.stringify(result));
});
