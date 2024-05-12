import { expect, test } from "vitest";
import fs from "fs";
import ear from "../src/index.js";

test("edges-edges", () => {
	const foldfile = fs.readFileSync("./tests/files/fold/crane.fold", "utf-8");
	const fold = JSON.parse(foldfile);
	const folded = ear.graph.getFramesByClassName(fold, "foldedForm")[0];
	ear.graph.populate(folded);
	expect(ear.graph.getEdgesEdgesCollinearOverlap(folded).flat().length).toBe(554);
});
