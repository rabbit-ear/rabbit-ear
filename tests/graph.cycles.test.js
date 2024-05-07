import { expect, test } from "vitest";
import fs from "fs";
import ear from "../src/index.js";

test("fixCycles, windmill", () => {
	const FOLD = fs.readFileSync("./tests/files/fold/windmill.fold", "utf-8");
	const fold = JSON.parse(FOLD);
	const folded = ear.graph.getFramesByClassName(fold, "foldedForm")[0];
	const result = ear.graph.fixCycles(folded);

	fs.writeFileSync("./tests/tmp/windmill.fold", JSON.stringify(result));
});

test("fixCycles, cycle with non convex face in the center", () => {
	const FOLD = fs.readFileSync("./tests/files/fold/layers-cycle-nonconvex.fold", "utf-8");
	const fold = JSON.parse(FOLD);
	const folded = ear.graph.getFramesByClassName(fold, "foldedForm")[0];
	const result = ear.graph.fixCycles(folded);

	fs.writeFileSync("./tests/tmp/layers-cycle-nonconvex.fold", JSON.stringify(result));
});
